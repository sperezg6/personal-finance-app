'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// =====================================================
// VALIDATION SCHEMAS
// =====================================================

const transactionSchema = z.object({
  date: z.string(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category_id: z.string().uuid('Invalid category'),
  payment_method: z.string().optional(),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// =====================================================
// TRANSACTION ACTIONS
// =====================================================

export async function createTransaction(data: {
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  payment_method?: string
  merchant?: string
  notes?: string
  tags?: string[]
}) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate data
    const validatedData = transactionSchema.parse(data)

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([{ ...validatedData, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      return { success: false, error: error.message }
    }

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/transactions')

    return { success: true, data: transaction }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}

export async function updateTransaction(
  transactionId: string,
  data: {
    date?: string
    description?: string
    amount?: number
    type?: 'income' | 'expense'
    category_id?: string
    payment_method?: string
    merchant?: string
    notes?: string
    tags?: string[]
  }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(data)
      .eq('id', transactionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      return { success: false, error: error.message }
    }

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/transactions')

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Unexpected error updating transaction:', error)
    return { success: false, error: 'Failed to update transaction' }
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting transaction:', error)
      return { success: false, error: error.message }
    }

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/transactions')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error deleting transaction:', error)
    return { success: false, error: 'Failed to delete transaction' }
  }
}

// =====================================================
// BULK OPERATIONS
// =====================================================

export async function createBulkTransactions(transactions: Array<{
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string
  payment_method?: string
  merchant?: string
  notes?: string
}>) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate all transactions
    const validatedTransactions = transactions.map(t => transactionSchema.parse(t))

    // Add user_id to all transactions
    const transactionsWithUser = validatedTransactions.map(t => ({
      ...t,
      user_id: user.id,
    }))

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionsWithUser)
      .select()

    if (error) {
      console.error('Error creating bulk transactions:', error)
      return { success: false, error: error.message }
    }

    // Revalidate relevant pages
    revalidatePath('/')
    revalidatePath('/transactions')

    return { success: true, data, count: data.length }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Unexpected error creating bulk transactions:', error)
    return { success: false, error: 'Failed to create transactions' }
  }
}
