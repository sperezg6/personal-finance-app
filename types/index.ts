// Shared types across the application

export type TransactionType = 'income' | 'expense'

// Transaction & Filter Types
export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  paymentMethod: string
  amount: number
  type: TransactionType
  tags?: string[]
}

export interface FilterPreset {
  id: string
  name: string
  filters: TransactionFilters
}

export interface TransactionFilters {
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  categories?: string[]
  paymentMethods?: string[]
  tags?: string[]
  type?: TransactionType
}

// Analytics Types
export interface CategorySpending {
  category: string
  amount: number
  percentage: number
  transactionCount: number
  color: string
  trend: number // percentage change from previous period
}

export interface MerchantSpending {
  merchant: string
  category: string
  amount: number
  transactionCount: number
}

export interface CategoryTrend {
  month: string
  amount: number
}

export type TimePeriod = 'this-month' | 'last-month' | 'last-3-months' | 'last-year'

// Budget Types
export interface Budget {
  id: string
  category: string
  monthlyLimit: number
  spent: number
  remaining: number
  percentage: number
  color: string
  icon: string
}

export type BudgetStatus = 'healthy' | 'warning' | 'over-budget'

// Goals Types
export type GoalType = 'savings' | 'debt-payoff' | 'emergency-fund' | 'net-worth'

export interface Milestone {
  id: string
  amount: number
  date: string
  description: string
  completed: boolean
}

export interface Goal {
  id: string
  name: string
  type: GoalType
  targetAmount: number
  currentAmount: number
  deadline: string
  createdAt: string
  color: string
  icon: string
  milestones: Milestone[]
}

// Net Worth Types
export type AssetType = 'savings' | 'investment' | 'property' | 'other'
export type LiabilityType = 'loan' | 'credit-card' | 'mortgage' | 'other'

export interface Asset {
  id: string
  name: string
  type: AssetType
  value: number
  description?: string
  icon: string
}

export interface Liability {
  id: string
  name: string
  type: LiabilityType
  value: number
  interestRate?: number
  description?: string
  icon: string
}

export interface NetWorthSnapshot {
  date: string
  totalAssets: number
  totalLiabilities: number
  netWorth: number
}
