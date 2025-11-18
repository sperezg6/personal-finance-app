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
import { Textarea } from '@/components/ui/textarea'

/**
 * Form data interface for savings account creation
 */
export interface SavingsAccountFormData {
  name: string
  targetAmount: string
  currentAmount: string
  deadline: string
  description: string
  icon: string
  color: string
}

/**
 * Props for AddSavingsAccountForm component
 */
export interface AddSavingsAccountFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SavingsAccountFormData) => void | Promise<void>
  initialValues?: Partial<SavingsAccountFormData>
}

/**
 * Available icon options for savings accounts
 */
const ICONS = [
  { value: '💰', label: 'Money Bag (Emergency Fund)' },
  { value: '📈', label: 'Chart (Investments/Stocks)' },
  { value: '🏠', label: 'House' },
  { value: '🚗', label: 'Car' },
  { value: '✈️', label: 'Vacation/Travel' },
  { value: '💍', label: 'Wedding' },
  { value: '📚', label: 'Education' },
  { value: '🎮', label: 'Gaming/Entertainment' },
  { value: '💻', label: 'Computer/Tech' },
  { value: '🏥', label: 'Healthcare' },
  { value: '🐕', label: 'Pet' },
  { value: '🎄', label: 'Holiday/Gifts' },
]

/**
 * Available color options for savings accounts
 */
const COLORS = [
  { value: 'rgb(16 185 129)', label: 'Green' },
  { value: 'rgb(59 130 246)', label: 'Blue' },
  { value: 'rgb(139 92 246)', label: 'Purple' },
  { value: 'rgb(236 72 153)', label: 'Pink' },
  { value: 'rgb(245 158 11)', label: 'Orange' },
  { value: 'rgb(239 68 68)', label: 'Red' },
  { value: 'rgb(6 182 212)', label: 'Cyan' },
  { value: 'rgb(132 204 22)', label: 'Lime' },
]

/**
 * Validates the savings account form data
 */
function validateForm(data: SavingsAccountFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Account name is required'
  }

  const currentAmount = parseFloat(data.currentAmount || '0')
  if (currentAmount < 0) {
    errors.currentAmount = 'Current amount cannot be negative'
  }

  // Target amount is optional
  if (data.targetAmount) {
    const targetAmount = parseFloat(data.targetAmount)
    if (targetAmount <= 0) {
      errors.targetAmount = 'Target amount must be greater than 0'
    }
  }

  return errors
}

/**
 * Add Savings Account Form component
 * A dialog-based form for creating new savings accounts
 */
export function AddSavingsAccountForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: AddSavingsAccountFormProps) {
  const [formData, setFormData] = React.useState<SavingsAccountFormData>({
    name: initialValues?.name || '',
    targetAmount: initialValues?.targetAmount || '',
    currentAmount: initialValues?.currentAmount || '0',
    deadline: initialValues?.deadline || '',
    description: initialValues?.description || '',
    icon: initialValues?.icon || '💰',
    color: initialValues?.color || 'rgb(16 185 129)',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        description: '',
        icon: '💰',
        color: 'rgb(16 185 129)',
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
      console.error('Error submitting savings account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof SavingsAccountFormData, value: string) => {
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
      <DialogContent className="sm:max-w-[500px]" aria-describedby="savings-form-description">
        <DialogHeader>
          <DialogTitle>Create Savings Account</DialogTitle>
          <DialogDescription id="savings-form-description">
            Create a new savings account to track your savings goals or general balances
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Current Amount */}
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Balance</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', e.target.value)}
                className="pl-7"
                aria-invalid={!!errors.currentAmount}
                aria-describedby={errors.currentAmount ? 'currentAmount-error' : 'currentAmount-help'}
              />
            </div>
            {errors.currentAmount ? (
              <p id="currentAmount-error" className="text-sm text-destructive" role="alert">
                {errors.currentAmount}
              </p>
            ) : (
              <p id="currentAmount-help" className="text-xs text-muted-foreground">
                Starting balance for this account
              </p>
            )}
          </div>

          {/* Target Amount (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount">
              Target Amount <span className="text-muted-foreground">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="Leave empty for no goal"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                className="pl-7"
                aria-invalid={!!errors.targetAmount}
                aria-describedby={errors.targetAmount ? 'targetAmount-error' : 'targetAmount-help'}
              />
            </div>
            {errors.targetAmount ? (
              <p id="targetAmount-error" className="text-sm text-destructive" role="alert">
                {errors.targetAmount}
              </p>
            ) : (
              <p id="targetAmount-help" className="text-xs text-muted-foreground">
                Set a goal amount or leave empty to just track balance
              </p>
            )}
          </div>

          {/* Deadline (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="deadline">
              Target Date <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              aria-describedby="deadline-help"
            />
            <p id="deadline-help" className="text-xs text-muted-foreground">
              When do you want to reach your goal?
            </p>
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

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Add notes about this savings account..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
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
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
