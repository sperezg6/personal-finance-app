'use client'

import { AddBudgetDialog } from '@/components/forms/add-budget-dialog'
import { BudgetFormData } from '@/components/forms/add-budget-form'
import { createBudget } from '@/lib/db/actions'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

  /**
   * List of available categories to choose from
   */
  categories?: string[]
}

/**
 * Specialized button for adding budget categories
 * Uses the simple variant for a clean, straightforward appearance
 * Opens a dialog with a form to add a new budget
 *
 * @example
 * <AddBudgetButton onSubmit={(data) => console.log('New budget:', data)} categories={['Food', 'Transport']} />
 */
export function AddBudgetButton({ onSubmit, className, categories }: AddBudgetButtonProps) {
  const router = useRouter()

  const handleSubmit = async (data: BudgetFormData) => {
    if (onSubmit) {
      await onSubmit(data)
      router.refresh()
      return
    }

    // Default behavior: save to database
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not authenticated')
      return
    }

    // Find category by name
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('name', data.category)
      .eq('user_id', user.id)
      .single()

    if (!category) {
      console.error('Category not found')
      return
    }

    const result = await createBudget({
      categoryId: category.id,
      monthlyLimit: parseFloat(data.amount),
      alertAtPercentage: parseFloat(data.alertThreshold) || 80,
    })

    if (!result.error) {
      router.refresh()
    } else {
      console.error('Error creating budget:', result.error)
    }
  }

  return (
    <AddBudgetDialog
      label="Add Budget"
      variant="simple"
      onSubmit={handleSubmit}
      className={className}
      categories={categories}
    />
  )
}
