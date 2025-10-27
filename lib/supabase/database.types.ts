// Database types - Generated from Supabase schema
// These types represent the structure of the database tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          currency: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          currency?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: 'income' | 'expense'
          icon: string | null
          color: string | null
          is_system: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          is_system?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          type?: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          is_system?: boolean
          created_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment'
          balance: number
          currency: string
          institution: string | null
          last_four: string | null
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment'
          balance?: number
          currency?: string
          institution?: string | null
          last_four?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment'
          balance?: number
          currency?: string
          institution?: string | null
          last_four?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          category_id: string | null
          date: string
          description: string
          amount: number
          type: 'income' | 'expense'
          payment_method: string | null
          merchant: string | null
          notes: string | null
          tags: string[] | null
          is_recurring: boolean
          recurring_frequency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          category_id?: string | null
          date?: string
          description: string
          amount: number
          type: 'income' | 'expense'
          payment_method?: string | null
          merchant?: string | null
          notes?: string | null
          tags?: string[] | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          category_id?: string | null
          date?: string
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          payment_method?: string | null
          merchant?: string | null
          notes?: string | null
          tags?: string[] | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          monthly_limit: number
          period_start: string
          period_end: string
          rollover_unused: boolean
          alert_at_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          monthly_limit: number
          period_start?: string
          period_end?: string
          rollover_unused?: boolean
          alert_at_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          monthly_limit?: number
          period_start?: string
          period_end?: string
          rollover_unused?: boolean
          alert_at_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string | null
          color: string | null
          icon: string | null
          description: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          color?: string | null
          icon?: string | null
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          color?: string | null
          icon?: string | null
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          user_id: string
          name: string
          loan_type: 'mortgage' | 'auto' | 'student' | 'personal' | 'credit_card' | 'business' | 'other'
          principal_amount: number
          current_balance: number
          interest_rate: number
          monthly_payment: number
          start_date: string
          end_date: string | null
          lender: string | null
          status: 'active' | 'paid_off' | 'deferred'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          loan_type: 'mortgage' | 'auto' | 'student' | 'personal' | 'credit_card' | 'business' | 'other'
          principal_amount: number
          current_balance: number
          interest_rate?: number
          monthly_payment?: number
          start_date: string
          end_date?: string | null
          lender?: string | null
          status?: 'active' | 'paid_off' | 'deferred'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          loan_type?: 'mortgage' | 'auto' | 'student' | 'personal' | 'credit_card' | 'business' | 'other'
          principal_amount?: number
          current_balance?: number
          interest_rate?: number
          monthly_payment?: number
          start_date?: string
          end_date?: string | null
          lender?: string | null
          status?: 'active' | 'paid_off' | 'deferred'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      budget_status: {
        Row: {
          id: string
          user_id: string
          category_id: string
          category_name: string
          icon: string | null
          color: string | null
          monthly_limit: number
          period_start: string
          period_end: string
          spent: number
          remaining: number
          percentage_used: number
        }
      }
      monthly_summary: {
        Row: {
          user_id: string
          month: string
          total_income: number
          total_expenses: number
          net_savings: number
        }
      }
      category_spending: {
        Row: {
          user_id: string
          category_id: string
          category_name: string
          icon: string | null
          color: string | null
          transaction_count: number
          total_amount: number
          month: string
        }
      }
      net_worth_summary: {
        Row: {
          user_id: string
          cash_and_accounts: number
          savings_goals_total: number
          credit_card_debt: number
          loans_total: number
          net_worth: number
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
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row']
export type Loan = Database['public']['Tables']['loans']['Row']

export type BudgetStatus = Database['public']['Views']['budget_status']['Row']
export type MonthlySummary = Database['public']['Views']['monthly_summary']['Row']
export type CategorySpending = Database['public']['Views']['category_spending']['Row']
export type NetWorthSummary = Database['public']['Views']['net_worth_summary']['Row']

// Joined types for queries with relationships
export type TransactionWithCategory = Transaction & {
  category: Category | null
}

export type TransactionWithRelations = Transaction & {
  category: Category | null
  account: Account | null
}
