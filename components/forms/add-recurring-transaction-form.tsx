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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

/**
 * Form data interface for recurring transaction creation
 */
export interface RecurringTransactionFormData {
  description: string
  amount: string
  type: 'income' | 'expense'
  category: string
  paymentMethod?: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: string
  endDate?: string
  dayOfMonth?: number
  dayOfWeek?: number
  intervalCount: number
  autoCreate: boolean
}

/**
 * Props for AddRecurringTransactionForm component
 */
export interface AddRecurringTransactionFormProps {
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
  onSubmit: (data: RecurringTransactionFormData) => void | Promise<void>

  /**
   * Initial values for the form (optional, for editing)
   */
  initialData?: Partial<RecurringTransactionFormData>

  /**
   * Available categories
   */
  categories?: Array<{ name: string }>

  /**
   * Available payment methods
   */
  paymentMethods?: Array<{ name: string }>
}

/**
 * Validates the recurring transaction form data
 */
function validateForm(data: RecurringTransactionFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.description.trim()) {
    errors.description = 'Description is required'
  }

  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!data.category) {
    errors.category = 'Category is required'
  }

  if (!data.frequency) {
    errors.frequency = 'Frequency is required'
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required'
  }

  if (data.endDate && data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
    errors.endDate = 'End date must be after start date'
  }

  // Validate day of month for monthly/quarterly/yearly frequencies
  if (['monthly', 'quarterly', 'yearly'].includes(data.frequency)) {
    if (data.dayOfMonth === undefined || data.dayOfMonth < 1 || data.dayOfMonth > 31) {
      errors.dayOfMonth = 'Day of month must be between 1 and 31'
    }
  }

  // Validate day of week for weekly/biweekly frequencies
  if (['weekly', 'biweekly'].includes(data.frequency)) {
    if (data.dayOfWeek === undefined || data.dayOfWeek < 0 || data.dayOfWeek > 6) {
      errors.dayOfWeek = 'Please select a day of the week'
    }
  }

  if (data.intervalCount < 1) {
    errors.intervalCount = 'Interval must be at least 1'
  }

  return errors
}

/**
 * Add/Edit Recurring Transaction Form component
 * A dialog-based form for adding or editing recurring transactions
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <AddRecurringTransactionForm
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => console.log('Recurring Transaction:', data)}
 *   categories={categories}
 *   paymentMethods={paymentMethods}
 * />
 * ```
 */
export function AddRecurringTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  categories = [],
  paymentMethods = [],
}: AddRecurringTransactionFormProps) {
  const [formData, setFormData] = React.useState<RecurringTransactionFormData>({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    paymentMethod: initialData?.paymentMethod || '',
    frequency: initialData?.frequency || 'monthly',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    dayOfMonth: initialData?.dayOfMonth,
    dayOfWeek: initialData?.dayOfWeek,
    intervalCount: initialData?.intervalCount || 1,
    autoCreate: initialData?.autoCreate ?? true,
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when initial data changes (for edit mode)
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || '',
        paymentMethod: initialData.paymentMethod || '',
        frequency: initialData.frequency || 'monthly',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData.endDate || '',
        dayOfMonth: initialData.dayOfMonth,
        dayOfWeek: initialData.dayOfWeek,
        intervalCount: initialData.intervalCount || 1,
        autoCreate: initialData.autoCreate ?? true,
      })
    }
  }, [initialData])

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        paymentMethod: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        dayOfMonth: undefined,
        dayOfWeek: undefined,
        intervalCount: 1,
        autoCreate: true,
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
      console.error('Error submitting recurring transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof RecurringTransactionFormData, value: string | number | boolean | null) => {
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

  const isEdit = !!initialData?.description

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="recurring-form-description">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Recurring Transaction</DialogTitle>
          <DialogDescription id="recurring-form-description">
            {isEdit ? 'Update' : 'Set up'} a recurring income or expense transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <RadioGroup
              id="type"
              value={formData.type}
              onValueChange={(value) => handleChange('type', value as 'income' | 'expense')}
              className="flex gap-4"
              aria-label="Transaction type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="font-normal cursor-pointer">
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="font-normal cursor-pointer">
                  Income
                </Label>
              </div>
            </RadioGroup>
            {errors.type && (
              <p className="text-sm text-destructive" role="alert">
                {errors.type}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Netflix Subscription, Monthly Salary"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive" role="alert">
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
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
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
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

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Payment Method <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange('paymentMethod', value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.name} value={method.name}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleChange('frequency', value)}
            >
              <SelectTrigger
                id="frequency"
                aria-invalid={!!errors.frequency}
                aria-describedby={errors.frequency ? 'frequency-error' : undefined}
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p id="frequency-error" className="text-sm text-destructive" role="alert">
                {errors.frequency}
              </p>
            )}
          </div>

          {/* Interval Count */}
          <div className="space-y-2">
            <Label htmlFor="intervalCount">
              Repeat Every
              <span className="text-muted-foreground text-sm ml-1">
                (e.g., 2 for every 2 {formData.frequency === 'biweekly' ? 'biweeks' : formData.frequency === 'daily' ? 'days' : formData.frequency === 'weekly' ? 'weeks' : formData.frequency === 'monthly' ? 'months' : formData.frequency === 'quarterly' ? 'quarters' : 'years'})
              </span>
            </Label>
            <Input
              id="intervalCount"
              type="number"
              min="1"
              value={formData.intervalCount}
              onChange={(e) => handleChange('intervalCount', parseInt(e.target.value) || 1)}
              aria-invalid={!!errors.intervalCount}
              aria-describedby={errors.intervalCount ? 'intervalCount-error' : undefined}
            />
            {errors.intervalCount && (
              <p id="intervalCount-error" className="text-sm text-destructive" role="alert">
                {errors.intervalCount}
              </p>
            )}
          </div>

          {/* Day of Week (for weekly/biweekly) */}
          {['weekly', 'biweekly'].includes(formData.frequency) && (
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select
                value={formData.dayOfWeek?.toString()}
                onValueChange={(value) => handleChange('dayOfWeek', parseInt(value))}
              >
                <SelectTrigger
                  id="dayOfWeek"
                  aria-invalid={!!errors.dayOfWeek}
                  aria-describedby={errors.dayOfWeek ? 'dayOfWeek-error' : undefined}
                >
                  <SelectValue placeholder="Select day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
              {errors.dayOfWeek && (
                <p id="dayOfWeek-error" className="text-sm text-destructive" role="alert">
                  {errors.dayOfWeek}
                </p>
              )}
            </div>
          )}

          {/* Day of Month (for monthly/quarterly/yearly) */}
          {['monthly', 'quarterly', 'yearly'].includes(formData.frequency) && (
            <div className="space-y-2">
              <Label htmlFor="dayOfMonth">Day of Month (1-31)</Label>
              <Input
                id="dayOfMonth"
                type="number"
                min="1"
                max="31"
                placeholder="e.g., 15 for the 15th of each month"
                value={formData.dayOfMonth || ''}
                onChange={(e) => handleChange('dayOfMonth', parseInt(e.target.value) || null)}
                aria-invalid={!!errors.dayOfMonth}
                aria-describedby={errors.dayOfMonth ? 'dayOfMonth-error' : undefined}
              />
              {errors.dayOfMonth && (
                <p id="dayOfMonth-error" className="text-sm text-destructive" role="alert">
                  {errors.dayOfMonth}
                </p>
              )}
            </div>
          )}

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            />
            {errors.startDate && (
              <p id="startDate-error" className="text-sm text-destructive" role="alert">
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">
              End Date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              aria-invalid={!!errors.endDate}
              aria-describedby={errors.endDate ? 'endDate-error' : undefined}
            />
            {errors.endDate && (
              <p id="endDate-error" className="text-sm text-destructive" role="alert">
                {errors.endDate}
              </p>
            )}
          </div>

          {/* Auto Create */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoCreate"
              checked={formData.autoCreate}
              onCheckedChange={(checked) => handleChange('autoCreate', checked === true)}
            />
            <Label
              htmlFor="autoCreate"
              className="text-sm font-normal cursor-pointer"
            >
              Automatically create transactions when due
            </Label>
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
              {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update' : 'Add Recurring Transaction')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
