import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import type { TransactionWithCategory } from '@/lib/supabase/database.types'

// =====================================================
// PROFILE QUERIES
// =====================================================

export const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
})

// =====================================================
// CATEGORY QUERIES
// =====================================================

export const getCategories = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},is_system.eq.true`)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
})

export const getCategoryById = cache(async (categoryId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
})

// =====================================================
// TRANSACTION QUERIES
// =====================================================

export interface TransactionQueryOptions {
  from?: string
  to?: string
  type?: 'income' | 'expense'
  categoryId?: string
  limit?: number
  offset?: number
}

export const getTransactions = cache(async (
  userId: string,
  options?: TransactionQueryOptions
) => {
  const supabase = await createClient()

  let query = supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*),
      payment_method:payment_methods(id, name)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (options?.from) {
    query = query.gte('date', options.from)
  }

  if (options?.to) {
    query = query.lte('date', options.to)
  }

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data as TransactionWithCategory[]
})

export const getRecentTransactions = cache(async (userId: string, limit: number = 10) => {
  return getTransactions(userId, { limit })
})

// =====================================================
// DASHBOARD METRICS
// =====================================================

export interface DashboardMetrics {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  transactionCount: number
  incomeTransactionCount: number
  expenseTransactionCount: number
}

export const getDashboardMetrics = cache(async (
  userId: string,
  days: number = 28
): Promise<DashboardMetrics> => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const fromDateStr = fromDate.toISOString().split('T')[0]

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .gte('date', fromDateStr)

  if (error) {
    console.error('Error fetching dashboard metrics:', error)
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      savingsRate: 0,
      transactionCount: 0,
      incomeTransactionCount: 0,
      expenseTransactionCount: 0,
    }
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    transactionCount: transactions.length,
    incomeTransactionCount: transactions.filter(t => t.type === 'income').length,
    expenseTransactionCount: transactions.filter(t => t.type === 'expense').length,
  }
})

// =====================================================
// SPENDING BY CATEGORY
// =====================================================

export interface CategorySpendingSummary {
  categoryId: string
  categoryName: string
  icon: string | null
  color: string | null
  amount: number
  percentage: number
  transactionCount: number
}

export const getSpendingByCategory = cache(async (
  userId: string,
  days: number = 28
): Promise<CategorySpendingSummary[]> => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const fromDateStr = fromDate.toISOString().split('T')[0]

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      amount,
      category:categories(id, name, icon, color)
    `)
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('date', fromDateStr)

  if (error) {
    console.error('Error fetching spending by category:', error)
    return []
  }

  // Group by category
  const categoryMap = new Map<string, CategorySpendingSummary>()
  let totalSpending = 0

  transactions.forEach((t) => {
    // Type guard for category structure
    const category = Array.isArray(t.category) ? t.category[0] : t.category
    if (!category || !category.id) return

    const categoryId = category.id
    const amount = Number(t.amount)
    totalSpending += amount

    if (categoryMap.has(categoryId)) {
      const existing = categoryMap.get(categoryId)!
      existing.amount += amount
      existing.transactionCount += 1
    } else {
      categoryMap.set(categoryId, {
        categoryId,
        categoryName: category.name,
        icon: category.icon,
        color: category.color,
        amount,
        percentage: 0,
        transactionCount: 1,
      })
    }
  })

  // Calculate percentages and sort by amount
  const result = Array.from(categoryMap.values())
    .map(cat => ({
      ...cat,
      percentage: totalSpending > 0 ? (cat.amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return result
})

// =====================================================
// TIME SERIES DATA
// =====================================================

export interface DailySpending {
  date: string
  income: number
  expenses: number
  net: number
}

export const getDailySpendingTrend = cache(async (
  userId: string,
  days: number = 28
): Promise<DailySpending[]> => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const fromDateStr = fromDate.toISOString().split('T')[0]

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('date, amount, type')
    .eq('user_id', userId)
    .gte('date', fromDateStr)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching daily spending trend:', error)
    return []
  }

  // Group by date
  const dailyMap = new Map<string, DailySpending>()

  transactions.forEach((t: { date: string; amount: number; type: string }) => {
    const date = t.date
    const amount = Number(t.amount)

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        income: 0,
        expenses: 0,
        net: 0,
      })
    }

    const day = dailyMap.get(date)!
    if (t.type === 'income') {
      day.income += amount
    } else {
      day.expenses += amount
    }
    day.net = day.income - day.expenses
  })

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
})

// =====================================================
// BUDGET QUERIES
// =====================================================

export const getBudgetStatus = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('budget_status')
    .select('*')
    .eq('user_id', userId)
    .gte('period_end', new Date().toISOString().split('T')[0])

  if (error) {
    console.error('Error fetching budget status:', error)
    return []
  }

  return data
})

export const getCurrentMonthBudgets = cache(async (userId: string) => {
  const supabase = await createClient()
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayStr = firstDayOfMonth.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('user_id', userId)
    .gte('period_start', firstDayStr)
    .lte('period_start', today.toISOString().split('T')[0])

  if (error) {
    console.error('Error fetching current month budgets:', error)
    return []
  }

  return data
})

export interface BudgetWithSpending {
  id: string
  category: string
  categoryId: string
  monthlyLimit: number
  spent: number
  remaining: number
  percentage: number
  color: string
  icon: string
}

export const getBudgetsWithSpending = cache(async (userId: string): Promise<BudgetWithSpending[]> => {
  const supabase = await createClient()
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const firstDayStr = firstDayOfMonth.toISOString().split('T')[0]
  const lastDayStr = lastDayOfMonth.toISOString().split('T')[0]

  // Get budgets for the current month
  const { data: budgets, error: budgetsError } = await supabase
    .from('budgets')
    .select(`
      id,
      monthly_limit,
      category_id,
      category:categories(name, icon, color)
    `)
    .eq('user_id', userId)
    .gte('period_start', firstDayStr)
    .lte('period_start', today.toISOString().split('T')[0])

  if (budgetsError) {
    console.error('Error fetching budgets:', budgetsError)
    return []
  }

  // Get spending for each budget category
  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      // Type guard for category structure
      const category = Array.isArray(budget.category) ? budget.category[0] : budget.category

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('category_id', budget.category_id)
        .eq('type', 'expense')
        .gte('date', firstDayStr)
        .lte('date', lastDayStr)

      const spent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
      const monthlyLimit = Number(budget.monthly_limit)
      const remaining = monthlyLimit - spent
      const percentage = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0

      return {
        id: budget.id,
        category: category?.name || 'Unknown',
        categoryId: budget.category_id,
        monthlyLimit,
        spent,
        remaining,
        percentage,
        color: category?.color || 'rgb(156 163 175)',
        icon: category?.icon || 'dollar',
      }
    })
  )

  return budgetsWithSpending
})

export interface BudgetSummary {
  totalBudget: number
  totalSpent: number
  totalRemaining: number
  overBudgetCount: number
}

export const getBudgetSummary = cache(async (userId: string): Promise<BudgetSummary> => {
  const budgets = await getBudgetsWithSpending(userId)

  return {
    totalBudget: budgets.reduce((sum, b) => sum + b.monthlyLimit, 0),
    totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
    totalRemaining: budgets.reduce((sum, b) => sum + b.remaining, 0),
    overBudgetCount: budgets.filter(b => b.percentage >= 100).length,
  }
})

// =====================================================
// SAVINGS GOALS QUERIES (Now using accounts table)
// =====================================================

export const getSavingsAccounts = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('account_purpose', 'goal')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching savings accounts:', error)
    return []
  }

  return data
})

// Legacy alias for backwards compatibility
export const getSavingsGoals = getSavingsAccounts

export const getActiveSavingsGoals = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('account_purpose', 'goal')
    .eq('is_completed', false)
    .order('deadline', { ascending: true })

  if (error) {
    console.error('Error fetching active savings accounts:', error)
    return []
  }

  return data
})

export interface SavingsSummary {
  totalSavings: number
  monthlyGrowth: number
  monthlyGrowthPercentage: number
  topCategoryName: string
  topCategoryAmount: number
  topCategoryPercentage: number
  averageMonthlySavings: number
}

export const getSavingsSummary = cache(async (userId: string): Promise<SavingsSummary> => {
  const supabase = await createClient()

  // Get all goal accounts (savings goals)
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('account_purpose', 'goal')

  const totalSavings = accounts?.reduce((sum, g) => sum + Number(g.balance), 0) || 0

  // Get last month's total to calculate growth
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  // Calculate monthly growth from transactions (net income - expenses for last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', userId)
    .gte('date', thirtyDaysAgoStr)

  const recentIncome = recentTransactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const recentExpenses = recentTransactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const monthlyGrowth = recentIncome - recentExpenses
  const monthlyGrowthPercentage = totalSavings > 0 ? (monthlyGrowth / totalSavings) * 100 : 0

  // Find top category
  const sortedAccounts = [...(accounts || [])].sort((a, b) => Number(b.balance) - Number(a.balance))
  const topAccount = sortedAccounts[0]

  return {
    totalSavings,
    monthlyGrowth,
    monthlyGrowthPercentage,
    topCategoryName: topAccount?.name || 'Emergency Fund',
    topCategoryAmount: topAccount ? Number(topAccount.balance) : 0,
    topCategoryPercentage: totalSavings > 0 && topAccount ? (Number(topAccount.balance) / totalSavings) * 100 : 0,
    averageMonthlySavings: monthlyGrowth,
  }
})

// =====================================================
// HOME PAGE DASHBOARD DATA
// =====================================================

export interface HomePageData {
  income: number
  savings: number
  spending: number
  incomeData: Array<{ value: number }>
  savingsData: Array<{ value: number }>
  spendingData: Array<{ value: number }>
}

export const getHomePageData = cache(async (
  userId: string,
  days: number = 28
): Promise<HomePageData> => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const fromDateStr = fromDate.toISOString().split('T')[0]

  // Fetch all transactions for the period
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('date, amount, type')
    .eq('user_id', userId)
    .gte('date', fromDateStr)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching home page data:', error)
    return {
      income: 0,
      savings: 0,
      spending: 0,
      incomeData: [],
      savingsData: [],
      spendingData: [],
    }
  }

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Net savings is income - expenses
  const netSavings = totalIncome - totalExpenses

  // Generate daily data for charts
  // Create a map of all dates in the range
  const dateMap = new Map<string, { income: number; expenses: number; savings: number }>()

  // Initialize all dates in the range
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const dateStr = date.toISOString().split('T')[0]
    dateMap.set(dateStr, { income: 0, expenses: 0, savings: 0 })
  }

  // Fill in actual transaction data
  let cumulativeIncome = 0
  let cumulativeExpenses = 0
  let cumulativeSavings = 0

  transactions.forEach((t) => {
    const date = t.date
    const amount = Number(t.amount)

    if (dateMap.has(date)) {
      const day = dateMap.get(date)!
      if (t.type === 'income') {
        day.income += amount
      } else if (t.type === 'expense') {
        day.expenses += amount
      }
      // Calculate savings as income - expenses for this day
      day.savings = day.income - day.expenses
    }
  })

  // Convert to cumulative values for area charts and create arrays
  const incomeData: Array<{ value: number }> = []
  const savingsData: Array<{ value: number }> = []
  const spendingData: Array<{ value: number }> = []

  Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([, day]) => {
      cumulativeIncome += day.income
      cumulativeExpenses += day.expenses
      cumulativeSavings += day.savings

      incomeData.push({ value: cumulativeIncome })
      spendingData.push({ value: cumulativeExpenses })
      savingsData.push({ value: cumulativeSavings })
    })

  return {
    income: totalIncome,
    savings: netSavings,
    spending: totalExpenses,
    incomeData,
    savingsData,
    spendingData,
  }
})

// =====================================================
// FINANCIAL CHART TIME SERIES DATA
// =====================================================

export interface FinancialChartDataPoint {
  date: string
  income: number
  spending: number
  savings: number
}

export const getFinancialChartData = cache(async (
  userId: string,
  days: number = 90
): Promise<FinancialChartDataPoint[]> => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  // Use local timezone to avoid UTC conversion issues
  const fromYear = fromDate.getFullYear()
  const fromMonth = String(fromDate.getMonth() + 1).padStart(2, '0')
  const fromDay = String(fromDate.getDate()).padStart(2, '0')
  const fromDateStr = `${fromYear}-${fromMonth}-${fromDay}`

  // Fetch all transactions for the period
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('date, amount, type')
    .eq('user_id', userId)
    .gte('date', fromDateStr)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching financial chart data:', error)
    return []
  }

  // Create a map of all dates in the range
  const dateMap = new Map<string, { income: number; spending: number; savings: number }>()

  // Initialize all dates in the range
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    // Get the date in local timezone to avoid UTC conversion issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    dateMap.set(dateStr, { income: 0, spending: 0, savings: 0 })
  }

  // Fill in actual transaction data
  transactions.forEach((t) => {
    const date = t.date
    const amount = Number(t.amount)

    if (dateMap.has(date)) {
      const day = dateMap.get(date)!
      if (t.type === 'income') {
        day.income += amount
      } else if (t.type === 'expense') {
        day.spending += amount
      }
      // Calculate savings as income - expenses
      day.savings = day.income - day.spending
    }
  })

  // Convert to array format
  return Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({
      date,
      income: data.income,
      spending: data.spending,
      savings: data.savings,
    }))
})

// =====================================================
// LOANS QUERIES
// =====================================================

export const getLoans = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching loans:', error)
    return []
  }

  return data
})

export const getActiveLoans = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active loans:', error)
    return []
  }

  return data
})

export interface LoanWithNextPayment {
  loan: {
    id: string
    name: string
    principal: number
    current_balance: number
    interest_rate: number
    monthly_payment: number
    term_months: number
    start_date: string
    payments_made: number | null
    created_at: string
    updated_at: string
    user_id: string
  }
  nextPayment: {
    payment_number: number
    due_date: string
    amount_due: number
    principal_amount: number
    interest_amount: number
  } | null
  paymentsCompleted: number
  totalPayments: number
  progressPercentage: number
}

export const getLoansWithPayments = cache(async (userId: string): Promise<LoanWithNextPayment[]> => {
  const supabase = await createClient()

  const { data: loans, error: loansError } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (loansError) {
    console.error('Error fetching loans:', loansError)
    return []
  }

  // For each loan, get the next pending payment
  const loansWithPayments = await Promise.all(
    loans.map(async (loan) => {
      // Get next pending payment
      const { data: nextPayment } = await supabase
        .from('loan_payments')
        .select('*')
        .eq('loan_id', loan.id)
        .eq('status', 'pending')
        .order('due_date', { ascending: true })
        .limit(1)
        .single()

      // Get total payments count
      const { count: totalPayments } = await supabase
        .from('loan_payments')
        .select('*', { count: 'exact', head: true })
        .eq('loan_id', loan.id)

      // Calculate progress
      const paymentsCompleted = loan.payments_made || 0
      const total = totalPayments || loan.term_months || 0
      const progressPercentage = total > 0 ? (paymentsCompleted / total) * 100 : 0

      return {
        loan,
        nextPayment: nextPayment || null,
        paymentsCompleted,
        totalPayments: total,
        progressPercentage: Math.round(progressPercentage)
      }
    })
  )

  return loansWithPayments
})

export interface LoansSummary {
  totalDebt: number
  monthlyPayment: number
  averageInterestRate: number
  totalPaid: number
  activeLoansCount: number
}

export const getLoansSummary = cache(async (userId: string): Promise<LoansSummary> => {
  const supabase = await createClient()

  const { data: loans, error } = await supabase
    .from('loans')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching loans summary:', error)
    return {
      totalDebt: 0,
      monthlyPayment: 0,
      averageInterestRate: 0,
      totalPaid: 0,
      activeLoansCount: 0,
    }
  }

  const totalDebt = loans.reduce((sum, loan) => sum + Number(loan.current_balance), 0)
  const monthlyPayment = loans.reduce((sum, loan) => sum + Number(loan.monthly_payment), 0)
  const totalPrincipal = loans.reduce((sum, loan) => sum + Number(loan.principal), 0)
  const totalPaid = totalPrincipal - totalDebt

  const totalInterestWeighted = loans.reduce(
    (sum, loan) => sum + (Number(loan.interest_rate) * Number(loan.current_balance)),
    0
  )
  const averageInterestRate = totalDebt > 0 ? totalInterestWeighted / totalDebt : 0

  return {
    totalDebt,
    monthlyPayment,
    averageInterestRate,
    totalPaid,
    activeLoansCount: loans.length,
  }
})

export const getLoanDetails = cache(async (loanId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single()

  if (error) {
    console.error('Error fetching loan details:', error)
    return null
  }

  return data
})

// =====================================================
// NET WORTH QUERIES
// =====================================================

export interface NetWorthBreakdown {
  assets: {
    cashAndAccounts: number
    savingsGoals: number
    total: number
  }
  liabilities: {
    creditCardDebt: number
    loans: number
    total: number
  }
  netWorth: number
}

export const getNetWorth = cache(async (userId: string): Promise<number> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('net_worth_summary')
    .select('net_worth')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching net worth:', error)
    return 0
  }

  return Number(data.net_worth)
})

export const getNetWorthBreakdown = cache(async (userId: string): Promise<NetWorthBreakdown> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('net_worth_summary')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching net worth breakdown:', error)
    return {
      assets: {
        cashAndAccounts: 0,
        savingsGoals: 0,
        total: 0,
      },
      liabilities: {
        creditCardDebt: 0,
        loans: 0,
        total: 0,
      },
      netWorth: 0,
    }
  }

  const cashAndAccounts = Number(data.cash_and_accounts)
  const savingsAccounts = Number(data.savings_accounts_total)
  const creditCardDebt = Number(data.credit_card_debt)
  const loans = Number(data.loans_total)

  return {
    assets: {
      cashAndAccounts,
      savingsGoals: savingsAccounts, // Keep property name for backwards compatibility
      total: cashAndAccounts + savingsAccounts,
    },
    liabilities: {
      creditCardDebt,
      loans,
      total: creditCardDebt + loans,
    },
    netWorth: Number(data.net_worth),
  }
})

export interface NetWorthHistoryPoint {
  date: string
  netWorth: number
}

export const getNetWorthHistory = cache(async (
  userId: string,
  months: number = 6
): Promise<NetWorthHistoryPoint[]> => {
  // This is a simplified version - in a real app, you'd store historical snapshots
  // For now, we'll just return the current net worth
  const netWorth = await getNetWorth(userId)

  const history: NetWorthHistoryPoint[] = []
  const today = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const dateStr = date.toISOString().split('T')[0]

    // For demo purposes, add some variation
    // In a real app, you'd fetch actual historical data
    const variation = Math.random() * 0.1 - 0.05 // +/- 5% variation
    history.push({
      date: dateStr,
      netWorth: netWorth * (1 + variation * (months - i) / months),
    })
  }

  return history
})

// =====================================================
// RECURRING TRANSACTIONS QUERIES
// =====================================================

export const getRecurringTransactions = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recurring transactions:', error)
    return []
  }

  return data
})

export const getActiveRecurringTransactions = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('next_due_date', { ascending: true })

  if (error) {
    console.error('Error fetching active recurring transactions:', error)
    return []
  }

  return data
})

export const getDueRecurringTransactions = cache(async (userId: string) => {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('recurring_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('auto_create', true)
    .lte('next_due_date', today)
    .order('next_due_date', { ascending: true })

  if (error) {
    console.error('Error fetching due recurring transactions:', error)
    return []
  }

  return data
})
