export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_transactions: {
        Row: {
          account_id: string
          amount: number
          balance_after: number
          created_at: string | null
          description: string | null
          id: string
          related_account_id: string | null
          related_account_transaction_id: string | null
          transaction_date: string
          transaction_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          balance_after: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_account_id?: string | null
          related_account_transaction_id?: string | null
          transaction_date: string
          transaction_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_account_id?: string | null
          related_account_transaction_id?: string | null
          transaction_date?: string
          transaction_id?: string | null
          type?: string
          user_id?: string
        }
      }
      accounts: {
        Row: {
          account_purpose: string | null
          balance: number | null
          color: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          deadline: string | null
          description: string | null
          icon: string | null
          id: string
          institution: string | null
          is_active: boolean | null
          is_completed: boolean | null
          last_four: string | null
          name: string
          target_amount: number | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_purpose?: string | null
          balance?: number | null
          color?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          institution?: string | null
          is_active?: boolean | null
          is_completed?: boolean | null
          last_four?: string | null
          name: string
          target_amount?: number | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_purpose?: string | null
          balance?: number | null
          color?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          institution?: string | null
          is_active?: boolean | null
          is_completed?: boolean | null
          last_four?: string | null
          name?: string
          target_amount?: number | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      budget_periods: {
        Row: {
          allocated_amount: number
          budget_id: string
          category_id: string
          created_at: string | null
          id: string
          is_current: boolean | null
          period_end: string
          period_start: string
          remaining_amount: number | null
          rollover_amount: number | null
          spent_amount: number | null
          updated_at: string | null
          user_id: string
          utilization_percentage: number | null
        }
        Insert: {
          allocated_amount: number
          budget_id: string
          category_id: string
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          period_end: string
          period_start: string
          remaining_amount?: number | null
          rollover_amount?: number | null
          spent_amount?: number | null
          updated_at?: string | null
          user_id: string
          utilization_percentage?: number | null
        }
        Update: {
          allocated_amount?: number
          budget_id?: string
          category_id?: string
          created_at?: string | null
          id?: string
          is_current?: boolean | null
          period_end?: string
          period_start?: string
          remaining_amount?: number | null
          rollover_amount?: number | null
          spent_amount?: number | null
          updated_at?: string | null
          user_id?: string
          utilization_percentage?: number | null
        }
      }
      budgets: {
        Row: {
          alert_at_percentage: number | null
          category_id: string
          created_at: string | null
          id: string
          monthly_limit: number
          period_end: string
          period_start: string
          rollover_unused: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_at_percentage?: number | null
          category_id: string
          created_at?: string | null
          id?: string
          monthly_limit: number
          period_end?: string
          period_start?: string
          rollover_unused?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_at_percentage?: number | null
          category_id?: string
          created_at?: string | null
          id?: string
          monthly_limit?: number
          period_end?: string
          period_start?: string
          rollover_unused?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          parent_category_id: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          parent_category_id?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          parent_category_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      loan_payments: {
        Row: {
          amount_due: number
          created_at: string | null
          due_date: string
          id: string
          interest_amount: number | null
          loan_id: string
          notes: string | null
          paid_amount: number | null
          paid_date: string | null
          payment_number: number
          principal_amount: number | null
          remaining_balance: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          created_at?: string | null
          due_date: string
          id?: string
          interest_amount?: number | null
          loan_id: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_number: number
          principal_amount?: number | null
          remaining_balance?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          created_at?: string | null
          due_date?: string
          id?: string
          interest_amount?: number | null
          loan_id?: string
          notes?: string | null
          paid_amount?: number | null
          paid_date?: string | null
          payment_number?: number
          principal_amount?: number | null
          remaining_balance?: number | null
          status?: string
          updated_at?: string | null
        }
      }
      loans: {
        Row: {
          created_at: string
          current_balance: number
          id: string
          interest_rate: number
          monthly_payment: number
          name: string
          payments_made: number | null
          principal: number
          start_date: string
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance: number
          id?: string
          interest_rate: number
          monthly_payment: number
          name: string
          payments_made?: number | null
          principal: number
          start_date: string
          term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          id?: string
          interest_rate?: number
          monthly_payment?: number
          name?: string
          payments_made?: number | null
          principal?: number
          start_date?: string
          term_months?: number
          updated_at?: string
          user_id?: string
        }
      }
      payment_methods: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          has_active_subscription: boolean | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          has_active_subscription?: boolean | null
          id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          has_active_subscription?: boolean | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
      }
      recurring_transactions: {
        Row: {
          amount: number
          auto_create: boolean | null
          category_id: string | null
          created_at: string | null
          day_of_month: number | null
          day_of_week: number | null
          description: string
          end_date: string | null
          frequency: string
          id: string
          interval_count: number | null
          is_active: boolean | null
          last_created_date: string | null
          next_due_date: string
          payment_method_id: string | null
          start_date: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          auto_create?: boolean | null
          category_id?: string | null
          created_at?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          description: string
          end_date?: string | null
          frequency: string
          id?: string
          interval_count?: number | null
          is_active?: boolean | null
          last_created_date?: string | null
          next_due_date: string
          payment_method_id?: string | null
          start_date: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_create?: boolean | null
          category_id?: string | null
          created_at?: string | null
          day_of_month?: number | null
          day_of_week?: number | null
          description?: string
          end_date?: string | null
          frequency?: string
          id?: string
          interval_count?: number | null
          is_active?: boolean | null
          last_created_date?: string | null
          next_due_date?: string
          payment_method_id?: string | null
          start_date?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      transaction_tags: {
        Row: {
          created_at: string | null
          tag_id: string
          transaction_id: string
        }
        Insert: {
          created_at?: string | null
          tag_id: string
          transaction_id: string
        }
        Update: {
          created_at?: string | null
          tag_id?: string
          transaction_id?: string
        }
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          payment_method_id: string | null
          type: 'income' | 'expense'
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          payment_method_id?: string | null
          type: 'income' | 'expense'
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          payment_method_id?: string | null
          type?: 'income' | 'expense'
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      net_worth_summary: {
        Row: {
          cash_and_accounts: number | null
          credit_card_debt: number | null
          loans_total: number | null
          net_worth: number | null
          savings_accounts_total: number | null
          user_id: string | null
        }
      }
      transaction_summary: {
        Row: {
          amount: number | null
          category_color: string | null
          category_icon: string | null
          category_name: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Account = Database['public']['Tables']['accounts']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Budget = Database['public']['Tables']['budgets']['Row']
export type Loan = Database['public']['Tables']['loans']['Row']
export type LoanPayment = Database['public']['Tables']['loan_payments']['Row']
export type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
export type RecurringTransaction = Database['public']['Tables']['recurring_transactions']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type BudgetPeriod = Database['public']['Tables']['budget_periods']['Row']
export type AccountTransaction = Database['public']['Tables']['account_transactions']['Row']

// Views
export type NetWorthSummary = Database['public']['Views']['net_worth_summary']['Row']
export type TransactionSummary = Database['public']['Views']['transaction_summary']['Row']

// Legacy aliases for savings goals (now part of accounts)
export type SavingsAccount = Account
export type SavingsGoal = Account

// Transaction type
export type TransactionType = 'income' | 'expense'

// Joined types for queries with relationships
export type TransactionWithCategory = Transaction & {
  category: Category | null
  payment_method?: PaymentMethod | null
  account?: Account | null
}

export type TransactionWithRelations = Transaction & {
  category: Category | null
  account: Account | null
  payment_method?: PaymentMethod | null
}
