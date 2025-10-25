'use client'

import { AddBudgetDialog } from '@/components/forms/add-budget-dialog'
import { BudgetFormData } from '@/components/forms/add-budget-form'

export interface AddBudgetButtonProps {
  /**
   * Callback when budget is submitted
   * @param data - The budget form data
   */
  onSubmit?: (data: BudgetFormData) => void | Promise<void>

  /**
   * Custom className for the button
   */
  className?: string
}

/**
 * Specialized button for adding budget categories
 * Uses the simple variant for a clean, straightforward appearance
 * Opens a dialog with a form to add a new budget
 *
 * @example
 * <AddBudgetButton onSubmit={(data) => console.log('New budget:', data)} />
 */
export function AddBudgetButton({ onSubmit, className }: AddBudgetButtonProps) {
  return (
    <AddBudgetDialog
      label="Add Budget"
      variant="simple"
      onSubmit={onSubmit}
      className={className}
    />
  )
}
