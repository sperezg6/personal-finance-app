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

/**
 * Form data interface for loan creation
 */
export interface LoanFormData {
  name: string
  principal: string
  interestRate: string
  termMonths: string
  monthlyPayment: string
  startDate: string
}

/**
 * Props for AddLoanForm component
 */
export interface AddLoanFormProps {
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
  onSubmit: (data: LoanFormData) => void | Promise<void>

  /**
   * Initial values for the form (optional, for editing)
   */
  initialValues?: Partial<LoanFormData>
}

/**
 * Validates the loan form data
 */
function validateForm(data: LoanFormData): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Loan name is required'
  }

  const principal = parseFloat(data.principal)
  if (!data.principal || principal <= 0) {
    errors.principal = 'Principal amount must be greater than 0'
  }

  const interestRate = parseFloat(data.interestRate)
  if (data.interestRate === '' || isNaN(interestRate) || interestRate < 0) {
    errors.interestRate = 'Interest rate must be 0 or greater'
  }

  const termMonths = parseInt(data.termMonths)
  if (!data.termMonths || termMonths <= 0 || !Number.isInteger(termMonths)) {
    errors.termMonths = 'Loan term must be a positive whole number of months'
  }

  const monthlyPayment = parseFloat(data.monthlyPayment)
  if (!data.monthlyPayment || monthlyPayment <= 0) {
    errors.monthlyPayment = 'Monthly payment must be greater than 0'
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required'
  }

  return errors
}

/**
 * Add Loan Form component
 * A dialog-based form for creating new loans
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <AddLoanForm
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSubmit={(data) => console.log('Loan:', data)}
 * />
 * ```
 */
export function AddLoanForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: AddLoanFormProps) {
  const [formData, setFormData] = React.useState<LoanFormData>({
    name: initialValues?.name || '',
    principal: initialValues?.principal || '',
    interestRate: initialValues?.interestRate || '',
    termMonths: initialValues?.termMonths || '',
    monthlyPayment: initialValues?.monthlyPayment || '',
    startDate: initialValues?.startDate || new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        principal: '',
        interestRate: '',
        termMonths: '',
        monthlyPayment: '',
        startDate: new Date().toISOString().split('T')[0],
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
      console.error('Error submitting loan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof LoanFormData, value: string) => {
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
      <DialogContent className="sm:max-w-[500px]" aria-describedby="loan-form-description">
        <DialogHeader>
          <DialogTitle>Add Loan</DialogTitle>
          <DialogDescription id="loan-form-description">
            Record a new loan to track your debt repayment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loan Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Loan Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Federal Student Loan, Auto Loan"
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

          {/* Principal Amount */}
          <div className="space-y-2">
            <Label htmlFor="principal">Principal Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="principal"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="25000.00"
                value={formData.principal}
                onChange={(e) => handleChange('principal', e.target.value)}
                className="pl-7"
                aria-invalid={!!errors.principal}
                aria-describedby={errors.principal ? 'principal-error' : 'principal-help'}
              />
            </div>
            {errors.principal ? (
              <p id="principal-error" className="text-sm text-destructive" role="alert">
                {errors.principal}
              </p>
            ) : (
              <p id="principal-help" className="text-xs text-muted-foreground">
                Original loan amount
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate</Label>
            <div className="relative">
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                min="0"
                placeholder="4.5"
                value={formData.interestRate}
                onChange={(e) => handleChange('interestRate', e.target.value)}
                className="pr-7"
                aria-invalid={!!errors.interestRate}
                aria-describedby={errors.interestRate ? 'interestRate-error' : 'interestRate-help'}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {errors.interestRate ? (
              <p id="interestRate-error" className="text-sm text-destructive" role="alert">
                {errors.interestRate}
              </p>
            ) : (
              <p id="interestRate-help" className="text-xs text-muted-foreground">
                Annual interest rate percentage
              </p>
            )}
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="termMonths">Loan Term (Months)</Label>
            <Input
              id="termMonths"
              type="number"
              min="1"
              step="1"
              placeholder="120"
              value={formData.termMonths}
              onChange={(e) => handleChange('termMonths', e.target.value)}
              aria-invalid={!!errors.termMonths}
              aria-describedby={errors.termMonths ? 'termMonths-error' : 'termMonths-help'}
            />
            {errors.termMonths ? (
              <p id="termMonths-error" className="text-sm text-destructive" role="alert">
                {errors.termMonths}
              </p>
            ) : (
              <p id="termMonths-help" className="text-xs text-muted-foreground">
                Total loan duration in months
              </p>
            )}
          </div>

          {/* Monthly Payment */}
          <div className="space-y-2">
            <Label htmlFor="monthlyPayment">Monthly Payment</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="monthlyPayment"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="260.50"
                value={formData.monthlyPayment}
                onChange={(e) => handleChange('monthlyPayment', e.target.value)}
                className="pl-7"
                aria-invalid={!!errors.monthlyPayment}
                aria-describedby={errors.monthlyPayment ? 'monthlyPayment-error' : 'monthlyPayment-help'}
              />
            </div>
            {errors.monthlyPayment ? (
              <p id="monthlyPayment-error" className="text-sm text-destructive" role="alert">
                {errors.monthlyPayment}
              </p>
            ) : (
              <p id="monthlyPayment-help" className="text-xs text-muted-foreground">
                Required monthly payment amount
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? 'startDate-error' : 'startDate-help'}
            />
            {errors.startDate ? (
              <p id="startDate-error" className="text-sm text-destructive" role="alert">
                {errors.startDate}
              </p>
            ) : (
              <p id="startDate-help" className="text-xs text-muted-foreground">
                When the loan started
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
              {isSubmitting ? 'Adding...' : 'Add Loan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
