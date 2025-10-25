'use client'

import * as React from 'react'
import { AddActionButton, AddActionButtonVariant } from '@/components/ui/add-action-button'
import { AddTransactionForm, TransactionFormData } from './add-transaction-form'

/**
 * Props for AddTransactionDialog component
 */
export interface AddTransactionDialogProps {
  /**
   * The text label to display on the button
   * @default "Add Transaction"
   */
  label?: string

  /**
   * Visual style variant of the button
   * - 'animated': Fancy sliding animation with plus icon
   * - 'simple': Simple button with icon and text
   * @default 'animated'
   */
  variant?: AddActionButtonVariant

  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'

  /**
   * Callback when transaction is submitted
   * @param data - The transaction form data
   */
  onSubmit?: (data: TransactionFormData) => void | Promise<void>

  /**
   * Custom className for the button
   */
  className?: string
}

/**
 * Add Transaction Dialog component
 * Combines AddActionButton with AddTransactionForm for a complete add transaction experience
 *
 * @example
 * ```tsx
 * // Simple usage with default animated button
 * <AddTransactionDialog onSubmit={(data) => console.log('Transaction:', data)} />
 *
 * // Custom variant and size
 * <AddTransactionDialog
 *   variant="simple"
 *   size="lg"
 *   onSubmit={async (data) => {
 *     await saveTransaction(data)
 *   }}
 * />
 * ```
 */
export function AddTransactionDialog({
  label = 'Add Transaction',
  variant = 'animated',
  size = 'default',
  onSubmit,
  className,
}: AddTransactionDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = async (data: TransactionFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default behavior: log to console (placeholder for backend integration)
      console.log('Transaction submitted:', {
        ...data,
        tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()) : [],
      })
    }
  }

  return (
    <>
      <AddActionButton
        label={label}
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      />
      <AddTransactionForm open={open} onOpenChange={setOpen} onSubmit={handleSubmit} />
    </>
  )
}
