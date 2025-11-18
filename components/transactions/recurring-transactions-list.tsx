'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  MoreVertical,
  Pencil,
  PlayCircle,
  Trash2,
} from 'lucide-react'
import { format, parseISO, isPast } from 'date-fns'

export interface RecurringTransaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id: string | null
  payment_method_id: string | null
  frequency: string
  next_due_date: string
  start_date: string
  end_date: string | null
  day_of_month: number | null
  day_of_week: number | null
  interval_count: number | null
  is_active: boolean | null
  auto_create: boolean | null
  last_created_date: string | null
  created_at: string | null
  updated_at: string | null
  user_id: string
}

export interface RecurringTransactionWithDetails extends RecurringTransaction {
  category?: { name: string; icon?: string; color?: string } | null
  payment_method?: { name: string } | null
}

export interface RecurringTransactionsListProps {
  /**
   * List of recurring transactions to display
   */
  transactions: RecurringTransactionWithDetails[]

  /**
   * Callback when edit is clicked
   */
  onEdit: (transaction: RecurringTransactionWithDetails) => void

  /**
   * Callback when delete is clicked
   */
  onDelete: (id: string) => void

  /**
   * Callback when toggle active/inactive is clicked
   */
  onToggleActive: (id: string, isActive: boolean) => void

  /**
   * Callback when "Create Now" is clicked
   */
  onCreateNow: (id: string) => void
}

/**
 * Format frequency for display
 */
function formatFrequency(
  frequency: string,
  intervalCount: number | null,
  dayOfWeek: number | null,
  dayOfMonth: number | null
): string {
  const count = intervalCount || 1
  const prefix = count > 1 ? `Every ${count} ` : 'Every '

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  switch (frequency) {
    case 'daily':
      return count > 1 ? `${prefix}days` : 'Daily'
    case 'weekly':
      const weekDay = dayOfWeek !== null ? ` on ${dayNames[dayOfWeek]}` : ''
      return `${prefix}${count > 1 ? 'weeks' : 'week'}${weekDay}`
    case 'biweekly':
      const biweekDay = dayOfWeek !== null ? ` on ${dayNames[dayOfWeek]}` : ''
      return `${prefix}2 weeks${biweekDay}`
    case 'monthly':
      const monthDay = dayOfMonth ? ` on the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}` : ''
      return `${prefix}${count > 1 ? 'months' : 'month'}${monthDay}`
    case 'quarterly':
      const quarterDay = dayOfMonth ? ` on the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}` : ''
      return `${prefix}${count > 1 ? 'quarters' : 'quarter'}${quarterDay}`
    case 'yearly':
      const yearDay = dayOfMonth ? ` on the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}` : ''
      return `${prefix}${count > 1 ? 'years' : 'year'}${yearDay}`
    default:
      return frequency
  }
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) return 'st'
  if (j === 2 && k !== 12) return 'nd'
  if (j === 3 && k !== 13) return 'rd'
  return 'th'
}

/**
 * Recurring Transactions List component
 * Displays recurring transactions with actions
 */
export function RecurringTransactionsList({
  transactions,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateNow,
}: RecurringTransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-2">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No recurring transactions</p>
            <p className="text-sm text-muted-foreground">
              Add a recurring transaction to automate your finances
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const isDue = transaction.next_due_date && isPast(parseISO(transaction.next_due_date))
        const isInactive = !transaction.is_active

        return (
          <Card
            key={transaction.id}
            className={`transition-colors ${
              isDue && transaction.is_active ? 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20' : ''
            } ${isInactive ? 'opacity-60' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left section - Icon and details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Type icon */}
                  <div
                    className={`flex-shrink-0 rounded-full p-2 ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-950'
                        : 'bg-red-100 dark:bg-red-950'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  {/* Transaction details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-base truncate">
                        {transaction.description}
                      </h3>
                      {isDue && transaction.is_active && (
                        <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-400">
                          Due
                        </Badge>
                      )}
                      {isInactive && (
                        <Badge variant="outline" className="border-gray-400 text-gray-600 dark:text-gray-400">
                          Inactive
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="font-medium">
                        {formatFrequency(
                          transaction.frequency,
                          transaction.interval_count,
                          transaction.day_of_week,
                          transaction.day_of_month
                        )}
                      </span>
                      {transaction.category && (
                        <span className="flex items-center gap-1">
                          {transaction.category.icon && <span>{transaction.category.icon}</span>}
                          {transaction.category.name}
                        </span>
                      )}
                      {transaction.payment_method && (
                        <span>{transaction.payment_method.name}</span>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Next due: {format(parseISO(transaction.next_due_date), 'MMM d, yyyy')}
                    </div>

                    {transaction.end_date && (
                      <div className="text-xs text-muted-foreground">
                        Ends: {format(parseISO(transaction.end_date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right section - Amount and actions */}
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {Number(transaction.amount).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch
                        checked={transaction.is_active ?? false}
                        onCheckedChange={(checked) => onToggleActive(transaction.id, checked)}
                        aria-label="Toggle active status"
                      />
                    </div>
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onCreateNow(transaction.id)}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Create Now
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(transaction.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
