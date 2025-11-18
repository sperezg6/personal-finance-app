'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =====================================================
// SANITIZATION HELPERS
// =====================================================

// Sanitize string input by trimming, limiting length, and removing potential XSS
function sanitizeString(input: string, maxLength: number = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
}

// Sanitize numeric input
function sanitizeNumber(input: number, min: number = 0, max: number = 999999999): number {
  if (isNaN(input) || !isFinite(input)) return 0
  return Math.max(min, Math.min(max, input))
}

// Validate date format (YYYY-MM-DD)
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

// =====================================================
// TRANSACTION ACTIONS
// =====================================================

export interface CreateTransactionInput {
  date: string
  description: string
  category: string
  paymentMethod?: string
  amount: number
  type: 'income' | 'expense'
  notes?: string
  accountId?: string  // Optional account association
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

  // Validate and sanitize inputs
  if (!isValidDate(input.date)) {
    return { error: 'Invalid date format' }
  }

  const sanitizedDescription = sanitizeString(input.description, 255)
  if (!sanitizedDescription) {
    return { error: 'Description is required' }
  }

  const sanitizedAmount = sanitizeNumber(input.amount, 0.01, 999999999)
  if (sanitizedAmount <= 0) {
    return { error: 'Amount must be greater than 0' }
  }

  if (!['income', 'expense'].includes(input.type)) {
    return { error: 'Invalid transaction type' }
  }

  // Find category by name
  const sanitizedCategory = sanitizeString(input.category, 100)
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', sanitizedCategory)
    .eq('user_id', user.id)
    .single()

  if (!category) {
    return { error: 'Category not found' }
  }

  // Find payment method by name if provided
  let paymentMethodId: string | null = null
  if (input.paymentMethod) {
    const sanitizedPaymentMethod = sanitizeString(input.paymentMethod, 100)
    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('name', sanitizedPaymentMethod)
      .eq('user_id', user.id)
      .single()

    if (paymentMethod) {
      paymentMethodId = paymentMethod.id
    }
  }

  const { data, error} = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      date: input.date,
      description: sanitizedDescription,
      category_id: category.id,
      payment_method_id: paymentMethodId,
      amount: sanitizedAmount,
      type: input.type,
      account_id: input.accountId || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating transaction:', error)
    return { error: 'Failed to create transaction' }
  }

  revalidatePath('/transactions')
  revalidatePath('/savings')
  revalidatePath('/home')
  return { data }
}

export async function updateTransaction(input: UpdateTransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: Record<string, string | number | null> = {}

  if (input.date) updateData.date = input.date
  if (input.description) updateData.description = input.description
  if (input.amount !== undefined) updateData.amount = input.amount
  if (input.type) updateData.type = input.type
  if (input.notes !== undefined) updateData.notes = input.notes

  // Find category by name if provided
  if (input.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', input.category)
      .eq('user_id', user.id)
      .single()

    if (category) {
      updateData.category_id = category.id
    }
  }

  // Find payment method by name if provided
  if (input.paymentMethod) {
    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('name', input.paymentMethod)
      .eq('user_id', user.id)
      .single()

    if (paymentMethod) {
      updateData.payment_method_id = paymentMethod.id
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
  revalidatePath('/home')
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
  revalidatePath('/home')
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
// SAVINGS GOAL ACTIONS (Now using accounts table with account_purpose='goal')
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
    .from('accounts')
    .insert({
      user_id: user.id,
      name: input.name,
      type: 'savings', // Account type
      account_purpose: 'goal', // This makes it a savings goal
      target_amount: input.targetAmount,
      balance: input.currentAmount || 0,
      deadline: input.deadline,
      description: input.description,
      color: input.color,
      icon: input.icon,
      is_active: true,
      is_completed: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  revalidatePath('/home')
  return { data }
}

export async function updateSavingsGoal(id: string, currentAmount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('accounts')
    .update({ balance: currentAmount })
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('account_purpose', 'goal')
    .select()
    .single()

  if (error) {
    console.error('Error updating savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  revalidatePath('/home')
  return { data }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('account_purpose', 'goal')

  if (error) {
    console.error('Error deleting savings goal:', error)
    return { error: error.message }
  }

  revalidatePath('/savings')
  revalidatePath('/home')
  return { success: true }
}

// =====================================================
// RECURRING TRANSACTION ACTIONS
// =====================================================

export interface CreateRecurringTransactionInput {
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  paymentMethod?: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: string
  endDate?: string
  dayOfMonth?: number
  dayOfWeek?: number
  intervalCount?: number
  autoCreate?: boolean
}

export async function createRecurringTransaction(input: CreateRecurringTransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate and sanitize inputs
  const sanitizedDescription = sanitizeString(input.description, 255)
  if (!sanitizedDescription) {
    return { error: 'Description is required' }
  }

  const sanitizedAmount = sanitizeNumber(input.amount, 0.01, 999999999)
  if (sanitizedAmount <= 0) {
    return { error: 'Amount must be greater than 0' }
  }

  if (!['income', 'expense'].includes(input.type)) {
    return { error: 'Invalid transaction type' }
  }

  const validFrequencies = ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']
  if (!validFrequencies.includes(input.frequency)) {
    return { error: 'Invalid frequency' }
  }

  if (!isValidDate(input.startDate)) {
    return { error: 'Invalid start date format' }
  }

  if (input.endDate && !isValidDate(input.endDate)) {
    return { error: 'Invalid end date format' }
  }

  // Find category by name
  const sanitizedCategory = sanitizeString(input.category, 100)
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('name', sanitizedCategory)
    .eq('user_id', user.id)
    .single()

  if (!category) {
    return { error: 'Category not found' }
  }

  // Find payment method by name if provided
  let paymentMethodId: string | null = null
  if (input.paymentMethod) {
    const sanitizedPaymentMethod = sanitizeString(input.paymentMethod, 100)
    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('name', sanitizedPaymentMethod)
      .eq('user_id', user.id)
      .single()

    if (paymentMethod) {
      paymentMethodId = paymentMethod.id
    }
  }

  // Calculate next due date based on frequency and start date
  const nextDueDate = input.startDate // Initially set to start date

  const { data, error } = await supabase
    .from('recurring_transactions')
    .insert({
      user_id: user.id,
      description: sanitizedDescription,
      amount: sanitizedAmount,
      type: input.type,
      category_id: category.id,
      payment_method_id: paymentMethodId,
      frequency: input.frequency,
      start_date: input.startDate,
      end_date: input.endDate || null,
      next_due_date: nextDueDate,
      day_of_month: input.dayOfMonth || null,
      day_of_week: input.dayOfWeek || null,
      interval_count: input.intervalCount || 1,
      auto_create: input.autoCreate ?? true,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating recurring transaction:', error)
    return { error: 'Failed to create recurring transaction' }
  }

  revalidatePath('/transactions')
  return { data }
}

export async function updateRecurringTransaction(id: string, updates: Partial<CreateRecurringTransactionInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: Record<string, string | number | boolean | null> = {}

  if (updates.description) updateData.description = sanitizeString(updates.description, 255)
  if (updates.amount !== undefined) updateData.amount = sanitizeNumber(updates.amount, 0.01, 999999999)
  if (updates.type) updateData.type = updates.type
  if (updates.frequency) updateData.frequency = updates.frequency
  if (updates.startDate) updateData.start_date = updates.startDate
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate
  if (updates.dayOfMonth !== undefined) updateData.day_of_month = updates.dayOfMonth
  if (updates.dayOfWeek !== undefined) updateData.day_of_week = updates.dayOfWeek
  if (updates.intervalCount !== undefined) updateData.interval_count = updates.intervalCount
  if (updates.autoCreate !== undefined) updateData.auto_create = updates.autoCreate

  // Find category by name if provided
  if (updates.category) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', updates.category)
      .eq('user_id', user.id)
      .single()

    if (category) {
      updateData.category_id = category.id
    }
  }

  // Find payment method by name if provided
  if (updates.paymentMethod) {
    const { data: paymentMethod } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('name', updates.paymentMethod)
      .eq('user_id', user.id)
      .single()

    if (paymentMethod) {
      updateData.payment_method_id = paymentMethod.id
    }
  }

  const { data, error } = await supabase
    .from('recurring_transactions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating recurring transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  return { data }
}

export async function deleteRecurringTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('recurring_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting recurring transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  return { success: true }
}

export async function toggleRecurringTransactionActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('recurring_transactions')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling recurring transaction:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  return { data }
}

export async function createTransactionFromRecurring(recurringId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the recurring transaction
  const { data: recurring, error: fetchError } = await supabase
    .from('recurring_transactions')
    .select('*, category:categories(name), payment_method:payment_methods(name)')
    .eq('id', recurringId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !recurring) {
    return { error: 'Recurring transaction not found' }
  }

  // Create the transaction using the current date
  const today = new Date().toISOString().split('T')[0]

  const result = await createTransaction({
    date: today,
    description: recurring.description,
    category: recurring.category?.name || 'Other',
    paymentMethod: recurring.payment_method?.name,
    amount: Number(recurring.amount),
    type: recurring.type as 'income' | 'expense',
  })

  if (result.error) {
    return { error: result.error }
  }

  // Update the last_created_date
  await supabase
    .from('recurring_transactions')
    .update({ last_created_date: today })
    .eq('id', recurringId)

  revalidatePath('/transactions')
  return { data: result.data }
}

/**
 * Process all due recurring transactions
 * This calls the database function to automatically create transactions from recurring entries
 */
export async function processRecurringTransactions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Call the database function
  const { data, error } = await supabase.rpc('process_recurring_transactions')

  if (error) {
    console.error('Error processing recurring transactions:', error)
    return { error: error.message }
  }

  revalidatePath('/transactions')
  return {
    data: {
      processedCount: data?.[0]?.processed_count || 0,
      createdTransactionIds: data?.[0]?.created_transaction_ids || []
    }
  }
}

// =====================================================
// LOAN ACTIONS
// =====================================================

export interface CreateLoanInput {
  name: string
  principal: string
  interestRate: string
  termMonths: string
  monthlyPayment: string
  startDate: string
}

export async function createLoan(input: CreateLoanInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate and sanitize name
  const sanitizedName = sanitizeString(input.name, 255)
  if (!sanitizedName) {
    return { error: 'Loan name is required' }
  }

  // Validate and parse principal
  const principal = parseFloat(input.principal)
  if (isNaN(principal) || principal <= 0) {
    return { error: 'Principal amount must be greater than 0' }
  }
  const sanitizedPrincipal = sanitizeNumber(principal, 0.01, 999999999)

  // Validate and parse interest rate
  const interestRate = parseFloat(input.interestRate)
  if (isNaN(interestRate) || interestRate < 0) {
    return { error: 'Interest rate must be 0 or greater' }
  }
  const sanitizedInterestRate = sanitizeNumber(interestRate, 0, 100)

  // Validate and parse term months
  const termMonths = parseInt(input.termMonths)
  if (isNaN(termMonths) || termMonths <= 0 || !Number.isInteger(termMonths)) {
    return { error: 'Loan term must be a positive whole number of months' }
  }
  const sanitizedTermMonths = Math.floor(sanitizeNumber(termMonths, 1, 600))

  // Validate and parse monthly payment
  const monthlyPayment = parseFloat(input.monthlyPayment)
  if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
    return { error: 'Monthly payment must be greater than 0' }
  }
  const sanitizedMonthlyPayment = sanitizeNumber(monthlyPayment, 0.01, 999999999)

  // Validate start date
  if (!isValidDate(input.startDate)) {
    return { error: 'Invalid start date format' }
  }

  const { data, error } = await supabase
    .from('loans')
    .insert({
      user_id: user.id,
      name: sanitizedName,
      principal: sanitizedPrincipal,
      interest_rate: sanitizedInterestRate,
      term_months: sanitizedTermMonths,
      monthly_payment: sanitizedMonthlyPayment,
      current_balance: sanitizedPrincipal, // Initially equals principal
      start_date: input.startDate,
      payments_made: 0, // Start with 0 payments
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating loan:', error)
    return { error: 'Failed to create loan' }
  }

  revalidatePath('/loans')
  revalidatePath('/home')
  return { data }
}

export async function updateLoan(id: string, currentBalance: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('loans')
    .update({
      current_balance: currentBalance,
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
  revalidatePath('/home')
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
  revalidatePath('/home')
  return { success: true }
}

/**
 * Get next due loan payment for a loan
 */
export async function getNextDueLoanPayment(loanId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('loan_payments')
    .select('*')
    .eq('loan_id', loanId)
    .eq('status', 'pending')
    .order('due_date', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    // If no pending payments found, it's not an error
    if (error.code === 'PGRST116') {
      return { data: null }
    }
    return { error: error.message }
  }

  return { data }
}

export interface MakeLoanPaymentInput {
  loanId: string
  loanPaymentId: string
  amount: number
  date: string
  paymentMethodId?: string
  notes?: string
}

/**
 * Make a loan payment
 * This creates both a transaction (expense) and marks the loan payment as paid
 */
export async function makeLoanPayment(input: MakeLoanPaymentInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Validate and sanitize inputs
  if (!isValidDate(input.date)) {
    return { error: 'Invalid date format' }
  }

  const sanitizedAmount = sanitizeNumber(input.amount, 0.01, 999999999)
  if (sanitizedAmount <= 0) {
    return { error: 'Payment amount must be greater than 0' }
  }

  // Get the loan name for the transaction description
  const { data: loan } = await supabase
    .from('loans')
    .select('name')
    .eq('id', input.loanId)
    .eq('user_id', user.id)
    .single()

  if (!loan) {
    return { error: 'Loan not found' }
  }

  // 1. Create the expense transaction linked to the loan payment
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: 'expense',
      amount: sanitizedAmount,
      date: input.date,
      description: `Loan payment - ${loan.name}`,
      payment_method_id: input.paymentMethodId || null,
      loan_payment_id: input.loanPaymentId,
      category_id: null, // Loan payments don't need a category
    })
    .select()
    .single()

  if (transactionError) {
    console.error('Error creating transaction:', transactionError)
    return { error: 'Failed to create transaction' }
  }

  // 2. Update the loan_payment record as paid
  const { error: paymentError } = await supabase
    .from('loan_payments')
    .update({
      status: 'paid',
      paid_amount: sanitizedAmount,
      paid_date: input.date,
      notes: input.notes || null,
    })
    .eq('id', input.loanPaymentId)

  if (paymentError) {
    console.error('Error updating loan payment:', paymentError)
    // Rollback transaction if payment update fails
    await supabase.from('transactions').delete().eq('id', transaction.id)
    return { error: 'Failed to update loan payment' }
  }

  // 3. Update loan balance and payments_made
  const { data: loanData } = await supabase
    .from('loans')
    .select('current_balance, payments_made')
    .eq('id', input.loanId)
    .single()

  if (loanData) {
    const newBalance = Math.max(0, Number(loanData.current_balance) - sanitizedAmount)
    const newPaymentsMade = (loanData.payments_made || 0) + 1

    await supabase
      .from('loans')
      .update({
        current_balance: newBalance,
        payments_made: newPaymentsMade,
      })
      .eq('id', input.loanId)
  }

  revalidatePath('/loans')
  revalidatePath('/transactions')
  revalidatePath('/home')

  return { data: transaction }
}
