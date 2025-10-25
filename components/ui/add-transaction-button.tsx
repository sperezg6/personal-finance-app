'use client'

import { AddTransactionDialog } from '@/components/forms/add-transaction-dialog'
import { TransactionFormData } from '@/components/forms/add-transaction-form'

export interface AddButtonProps {
  /**
   * Callback when transaction is submitted
   * @param data - The transaction form data
   */
  onSubmit?: (data: TransactionFormData) => void | Promise<void>

  /**
   * Custom label for the trigger button/dialog
   */
  label?: string

  /**
   * Custom className for the button
   */
  className?: string
}

/**
 * Specialized button for adding transactions
 * Uses the animated variant by default for visual appeal
 * Opens a dialog with a form to add a new transaction
 *
 * @example
 * <AddButton onSubmit={(data) => console.log('New transaction:', data)} />
 */
export function AddButton({ onSubmit, className, label }: AddButtonProps) {
  return (
    <AddTransactionDialog
      label={label}
      variant="animated"
      size="lg"
      onSubmit={onSubmit}
      className={className}
    />
  )
}
