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
import type { SavingsAccount } from '@/lib/supabase/database.types'

/**
 * Form data interface for savings transaction creation
 */
export interface SavingsTransactionFormData {
  savingsAccountId: string
  amount: string
  date: string
  description: string
  notes: string
}

/**
 * Props for AddSavingsTransactionForm component
 */
export interface AddSavingsTransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SavingsTransactionFormData) => void | Promise<void>
  savingsAccounts: SavingsAccount[]
}

/**
 * Validates the savings transaction form data
 */
function validateForm(data: SavingsTransactionFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.savingsAccountId) {
    errors.savingsAccountId = 'Please select a savings account'
  }

  if (!data.amount || data.amount === '0') {
    errors.amount = 'Amount is required'
  }

  const amount = parseFloat(data.amount)
  if (isNaN(amount) || amount === 0) {
    errors.amount = 'Please enter a valid amount (can be positive for deposits or negative for withdrawals)'
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required'
  }

  if (!data.date) {
    errors.date = 'Date is required'
  }

  return errors
}

/**
 * Add Savings Transaction Form component
 * A dialog-based form for adding deposits or withdrawals to savings accounts
 */
export function AddSavingsTransactionForm({
  open,
  onOpenChange,
  onSubmit,
  savingsAccounts,
}: AddSavingsTransactionFormProps) {
  const [formData, setFormData] = React.useState<SavingsTransactionFormData>({
    savingsAccountId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        savingsAccountId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        notes: '',
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
      console.error('Error submitting savings transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof SavingsTransactionFormData, value: string) => {
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

  const selectedAccount = savingsAccounts.find(acc => acc.id === formData.savingsAccountId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="savings-transaction-form-description">
        <DialogHeader>
          <DialogTitle>Add Savings Transaction</DialogTitle>
          <DialogDescription id="savings-transaction-form-description">
            Add a deposit or withdrawal to your savings account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Savings Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="savingsAccountId">Savings Account</Label>
            <Select
              value={formData.savingsAccountId}
              onValueChange={(value) => handleChange('savingsAccountId', value)}
            >
              <SelectTrigger
                id="savingsAccountId"
                aria-invalid={!!errors.savingsAccountId}
                aria-describedby={errors.savingsAccountId ? 'savingsAccountId-error' : undefined}
              >
                <SelectValue placeholder="Select a savings account" />
              </SelectTrigger>
              <SelectContent>
                {savingsAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className="flex items-center gap-2">
                      <span>{account.icon || '💰'}</span>
                      <span>{account.name}</span>
                      <span className="text-muted-foreground text-xs">
                        (${Number(account.balance || 0).toLocaleString()})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.savingsAccountId && (
              <p id="savingsAccountId-error" className="text-sm text-destructive" role="alert">
                {errors.savingsAccountId}
              </p>
            )}
            {selectedAccount && (
              <p className="text-xs text-muted-foreground">
                Current balance: ${Number(selectedAccount.balance || 0).toLocaleString()}
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
                aria-describedby={errors.amount ? 'amount-error' : 'amount-help'}
              />
            </div>
            {errors.amount ? (
              <p id="amount-error" className="text-sm text-destructive" role="alert">
                {errors.amount}
              </p>
            ) : (
              <p id="amount-help" className="text-xs text-muted-foreground">
                Enter positive for deposit, negative for withdrawal (e.g., -50 to withdraw $50)
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Monthly contribution, Emergency car repair"
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

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
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
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
