'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =====================================================
// TRANSACTION ACTIONS
// =====================================================

export interface CreateTransactionInput {
  date: string
  description: string
  category: string
  paymentMethod: string
  amount: number
  type: 'income' | 'expense'
  notes?: string
}

export interface UpdateTransactionInput {
  id: string
  date?: string
  description?: string
  category?: string
  paymentMethod?: string
  amount?: number
  type?: 'income' | 'expense'
  notes?: string
}

export async function createTransaction(input: CreateTransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Find category by name
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', input.category)
    .or(`user_id.eq.${user.id},is_system.eq.true`)
    .single()

  if (!category) {
    return { error: 'Category not found' }
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      date: input.date,
      description: input.description,
      category_id: category.id,
      payment_method: input.paymentMethod,
      amount: input.amount,
      type: input.type,
      notes: input.notes,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  return { data }
}

export async function updateTransaction(input: UpdateTransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: any = {}

  if (input.date) updateData.date = input.date
  if (input.description) updateData.description = input.description
  if (input.paymentMethod) updateData.payment_method = input.paymentMethod
  if (input.amount !== undefined) updateData.amount = input.amount
  if (input.type) updateData.type = input.type
  if (input.notes !== undefined) updateData.notes = input.notes

  // Find category by name if provided
  if (input.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', input.category)
      .or(`user_id.eq.${user.id},is_system.eq.true`)
      .single()

    if (category) {
      updateData.category_id = category.id
    }
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', input.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  return { data }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  revalidatePath('/')
  return { success: true }
}

export async function duplicateTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the original transaction
  const { data: original, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !original) {
    return { error: 'Transaction not found' }
  }

  // Create a duplicate with today's date
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      account_id: original.account_id,
      category_id: original.category_id,
      date: new Date().toISOString().split('T')[0],
      description: original.description,
      amount: original.amount,
      type: original.type,
      payment_method: original.payment_method,
      merchant: original.merchant,
      notes: original.notes,
      tags: original.tags,
    })
    .select()
    .single()

  if (error) {
    console.error('Error duplicating transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  return { data }
}

// =====================================================
// BUDGET ACTIONS
// =====================================================

export interface CreateBudgetInput {
  categoryId: string
  monthlyLimit: number
  periodStart?: string
  periodEnd?: string
  alertAtPercentage?: number
}

export async function createBudget(input: CreateBudgetInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const { data, error } = await supabase
    .from('budgets')
    .insert({
      user_id: user.id,
      category_id: input.categoryId,
      monthly_limit: input.monthlyLimit,
      period_start: input.periodStart || firstDayOfMonth.toISOString().split('T')[0],
      period_end: input.periodEnd || lastDayOfMonth.toISOString().split('T')[0],
      alert_at_percentage: input.alertAtPercentage || 80,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating budget:', error)
    return { error: error.message }
  }

  revalidatePath('/budget')
  return { data }
}

export async function updateBudget(id: string, monthlyLimit: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('budgets')
    .update({ monthly_limit: monthlyLimit })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating budget:', error)
    return { error: error.message }
  }

  revalidatePath('/budget')
  return { data }
}

export async function deleteBudget(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting budget:', error)
    return { error: error.message }
  }

  revalidatePath('/budget')
  return { success: true }
}

// =====================================================
// SAVINGS GOAL ACTIONS
// =====================================================

export interface CreateSavingsGoalInput {
  name: string
  targetAmount: number
  currentAmount?: number
  deadline?: string
  description?: string
  color?: string
  icon?: string
}

export async function createSavingsGoal(input: CreateSavingsGoalInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .insert({
      user_id: user.id,
      name: input.name,
      target_amount: input.targetAmount,
      current_amount: input.currentAmount || 0,
      deadline: input.deadline,
      description: input.description,
      color: input.color,
      icon: input.icon,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  return { data }
}

export async function updateSavingsGoal(id: string, currentAmount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .update({ current_amount: currentAmount })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  return { data }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  return { success: true }
}

// =====================================================
// LOAN ACTIONS
// =====================================================

export interface CreateLoanInput {
  name: string
  loanType: 'mortgage' | 'auto' | 'student' | 'personal' | 'credit_card' | 'business' | 'other'
  principalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  startDate: string
  endDate?: string
  lender?: string
  notes?: string
}

export async function createLoan(input: CreateLoanInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('loans')
    .insert({
      user_id: user.id,
      name: input.name,
      loan_type: input.loanType,
      principal_amount: input.principalAmount,
      current_balance: input.currentBalance,
      interest_rate: input.interestRate,
      monthly_payment: input.monthlyPayment,
      start_date: input.startDate,
      end_date: input.endDate,
      lender: input.lender,
      notes: input.notes,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating loan:', error)
    return { error: error.message }
  }

  revalidatePath('/loans')
  revalidatePath('/networth')
  return { data }
}

export async function updateLoan(id: string, currentBalance: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if balance is 0 or less, mark as paid off
  const status = currentBalance <= 0 ? 'paid_off' : 'active'

  const { data, error } = await supabase
    .from('loans')
    .update({
      current_balance: currentBalance,
      status: status
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating loan:', error)
    return { error: error.message }
  }

  revalidatePath('/loans')
  revalidatePath('/networth')
  return { data }
}

export async function deleteLoan(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('loans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting loan:', error)
    return { error: error.message }
  }

  revalidatePath('/loans')
  revalidatePath('/networth')
  return { success: true }
}
