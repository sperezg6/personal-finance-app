'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Time period options for budgets
 */
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly'

/**
 * Form data interface for budget creation
 */
export interface BudgetFormData {
  category: string
  amount: string
  period: BudgetPeriod
  alertThreshold: string
  icon: string
  color: string
}

/**
 * Props for AddBudgetForm component
 */
export interface AddBudgetFormProps {
  /**
   * Whether the dialog is open
   */
  open: boolean

  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (open: boolean) => void

  /**
   * Callback when form is submitted
   * @param data - The form data
   */
  onSubmit: (data: BudgetFormData) => void | Promise<void>

  /**
   * Initial values for the form (optional, for editing)
   */
  initialValues?: Partial<BudgetFormData>
}

/**
 * Available budget categories
 */
const CATEGORIES = [
  'Groceries',
  'Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Housing',
  'Utilities',
  'Subscriptions',
  'Other',
]

/**
 * Available icon options for budgets
 */
const ICONS = [
  { value: '🛒', label: 'Shopping Cart (Groceries)' },
  { value: '🍽️', label: 'Dining' },
  { value: '🚗', label: 'Car (Transportation)' },
  { value: '🎬', label: 'Entertainment' },
  { value: '🛍️', label: 'Shopping Bag' },
  { value: '💳', label: 'Credit Card (Bills)' },
  { value: '🏥', label: 'Healthcare' },
  { value: '📚', label: 'Education' },
  { value: '🏠', label: 'Housing' },
  { value: '💡', label: 'Utilities' },
  { value: '📱', label: 'Subscriptions' },
  { value: '💰', label: 'Money' },
]

/**
 * Available color options for budgets
 */
const COLORS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
]

/**
 * Validates the budget form data
 */
function validateForm(data: BudgetFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.category) {
    errors.category = 'Category is required'
  }

  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!data.period) {
    errors.period = 'Time period is required'
  }

  const threshold = parseFloat(data.alertThreshold)
  if (data.alertThreshold && (threshold < 0 || threshold > 100)) {
    errors.alertThreshold = 'Threshold must be between 0 and 100'
  }

  return errors
}

/**
 * Add Budget Form component
 * A dialog-based form for creating new budgets
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <AddBudgetForm
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => console.log('Budget:', data)}
 * />
 * ```
 */
export function AddBudgetForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: AddBudgetFormProps) {
  const [formData, setFormData] = React.useState<BudgetFormData>({
    category: initialValues?.category || '',
    amount: initialValues?.amount || '',
    period: initialValues?.period || 'monthly',
    alertThreshold: initialValues?.alertThreshold || '80',
    icon: initialValues?.icon || '💰',
    color: initialValues?.color || '#3b82f6',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
        alertThreshold: '80',
        icon: '💰',
        color: '#3b82f6',
      })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting budget:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof BudgetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="budget-form-description">
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription id="budget-form-description">
            Create a new budget to track your spending
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger
                id="category"
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? 'category-error' : undefined}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p id="category-error" className="text-sm text-destructive" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          {/* Amount Limit */}
          <div className="space-y-2">
            <Label htmlFor="amount">Budget Limit</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-7"
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="text-sm text-destructive" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Time Period */}
          <div className="space-y-2">
            <Label htmlFor="period">Time Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value) => handleChange('period', value as BudgetPeriod)}
            >
              <SelectTrigger
                id="period"
                aria-invalid={!!errors.period}
                aria-describedby={errors.period ? 'period-error' : undefined}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.period && (
              <p id="period-error" className="text-sm text-destructive" role="alert">
                {errors.period}
              </p>
            )}
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={formData.icon} onValueChange={(value) => handleChange('icon', value)}>
              <SelectTrigger id="icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{icon.value}</span>
                      <span>{icon.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Select value={formData.color} onValueChange={(value) => handleChange('color', value)}>
                <SelectTrigger id="color" className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded border border-border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span>{color.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                className="h-9 w-9 rounded border border-border flex-shrink-0"
                style={{ backgroundColor: formData.color }}
                aria-label="Selected color preview"
              />
            </div>
          </div>

          {/* Alert Threshold */}
          <div className="space-y-2">
            <Label htmlFor="alertThreshold">
              Alert Threshold <span className="text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <Input
                id="alertThreshold"
                type="number"
                min="0"
                max="100"
                placeholder="80"
                value={formData.alertThreshold}
                onChange={(e) => handleChange('alertThreshold', e.target.value)}
                className="pr-8"
                aria-invalid={!!errors.alertThreshold}
                aria-describedby={errors.alertThreshold ? 'threshold-error' : 'threshold-help'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {errors.alertThreshold ? (
              <p id="threshold-error" className="text-sm text-destructive" role="alert">
                {errors.alertThreshold}
              </p>
            ) : (
              <p id="threshold-help" className="text-xs text-muted-foreground">
                Get notified when spending reaches this percentage
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
