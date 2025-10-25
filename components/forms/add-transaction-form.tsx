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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionType } from '@/types'

/**
 * Form data interface for transaction creation
 */
export interface TransactionFormData {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
  tags: string
}

/**
 * Props for AddTransactionForm component
 */
export interface AddTransactionFormProps {
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
  onSubmit: (data: TransactionFormData) => void | Promise<void>

  /**
   * Initial values for the form (optional, for editing)
   */
  initialValues?: Partial<TransactionFormData>
}

/**
 * Available transaction categories
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
  'Salary',
  'Investment',
  'Other',
]

/**
 * Validates the transaction form data
 */
function validateForm(data: TransactionFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.date) {
    errors.date = 'Date is required'
  }

  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!data.category) {
    errors.category = 'Category is required'
  }

  if (!data.type) {
    errors.type = 'Transaction type is required'
  }

  return errors
}

/**
 * Add Transaction Form component
 * A dialog-based form for adding new transactions
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <AddTransactionForm
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => console.log('Transaction:', data)}
 * />
 * ```
 */
export function AddTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: AddTransactionFormProps) {
  const [formData, setFormData] = React.useState<TransactionFormData>({
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    amount: initialValues?.amount || '',
    category: initialValues?.category || '',
    type: initialValues?.type || 'expense',
    description: initialValues?.description || '',
    tags: initialValues?.tags || '',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'expense',
        description: '',
        tags: '',
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
      console.error('Error submitting transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof TransactionFormData, value: string) => {
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
      <DialogContent className="sm:max-w-[500px]" aria-describedby="transaction-form-description">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription id="transaction-form-description">
            Record a new income or expense transaction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <RadioGroup
              id="type"
              value={formData.type}
              onValueChange={(value) => handleChange('type', value as TransactionType)}
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

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'date-error' : undefined}
            />
            {errors.date && (
              <p id="date-error" className="text-sm text-destructive" role="alert">
                {errors.date}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Enter transaction details..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="tags"
              placeholder="e.g., recurring, essential, vacation"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
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
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
