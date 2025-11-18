'use client'

import * as React from 'react'
import { AddActionButton, AddActionButtonVariant } from '@/components/ui/add-action-button'
import { AddLoanForm, LoanFormData } from '@/components/forms/add-loan-form'

/**
 * Props for AddLoanButton component
 */
export interface AddLoanButtonProps {
  /**
   * The text label to display on the button
   * @default "Add Loan"
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
   * Callback when loan is submitted
   * @param data - The loan form data
   */
  onSubmit?: (data: LoanFormData) => void | Promise<void>

  /**
   * Custom className for the button
   */
  className?: string
}

/**
 * Add Loan Button component
 * Combines AddActionButton with AddLoanForm for a complete add loan experience
 *
 * @example
 * ```tsx
 * // Simple usage with default animated button
 * <AddLoanButton onSubmit={(data) => console.log('Loan:', data)} />
 *
 * // Custom variant and size
 * <AddLoanButton
 *   variant="simple"
 *   size="lg"
 *   onSubmit={async (data) => {
 *     await saveLoan(data)
 *   }}
 * />
 * ```
 */
export function AddLoanButton({
  label = 'Add Loan',
  variant = 'animated',
  size = 'default',
  onSubmit,
  className,
}: AddLoanButtonProps) {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = async (data: LoanFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default behavior: log to console (placeholder for backend integration)
      console.log('Loan submitted:', data)
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
      <AddLoanForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </>
  )
}
