import { TransactionType } from '@/lib/supabase/database.types'

export interface TransactionFilters {
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  type?: TransactionType
  categories?: string[]
  paymentMethods?: string[]
}

export interface FilterPreset {
  id: string
  name: string
  filters: TransactionFilters
}

// Re-export TransactionType for convenience
export type { TransactionType }
