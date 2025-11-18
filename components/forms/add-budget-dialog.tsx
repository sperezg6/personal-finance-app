'use client'

import * as React from 'react'
import { AddActionButton, AddActionButtonVariant } from '@/components/ui/add-action-button'
import { AddBudgetForm, BudgetFormData } from './add-budget-form'

/**
 * Props for AddBudgetDialog component
 */
export interface AddBudgetDialogProps {
  /**
   * The text label to display on the button
   * @default "Add Budget"
   */
  label?: string

  /**
   * Visual style variant of the button
   * - 'animated': Fancy sliding animation with plus icon
   * - 'simple': Simple button with icon and text
   * @default 'simple'
   */
  variant?: AddActionButtonVariant

  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'

  /**
   * Callback when budget is submitted
   * @param data - The budget form data
   */
  onSubmit?: (data: BudgetFormData) => void | Promise<void>

  /**
   * Custom className for the button
   */
  className?: string

  /**
   * List of available categories to choose from
   */
  categories?: string[]
}

/**
 * Add Budget Dialog component
 * Combines AddActionButton with AddBudgetForm for a complete add budget experience
 *
 * @example
 * ```tsx
 * // Simple usage with default button
 * <AddBudgetDialog onSubmit={(data) => console.log('Budget:', data)} />
 *
 * // Custom variant and size
 * <AddBudgetDialog
 *   variant="animated"
 *   size="lg"
 *   onSubmit={async (data) => {
 *     await saveBudget(data)
 *   }}
 * />
 * ```
 */
export function AddBudgetDialog({
  label = 'Add Budget',
  variant = 'simple',
  size = 'default',
  onSubmit,
  className,
  categories,
}: AddBudgetDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = async (data: BudgetFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    } else {
      // Default behavior: log to console (placeholder for backend integration)
      console.log('Budget submitted:', data)
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
      <AddBudgetForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </>
  )
}
