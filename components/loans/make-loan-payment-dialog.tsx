'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, DollarSign, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { makeLoanPayment, type MakeLoanPaymentInput } from "@/lib/db/actions"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/supabase/database.types"
import type { LoanWithNextPayment } from "@/lib/db/queries"

interface MakeLoanPaymentDialogProps {
  loanId: string
  loanName: string
  nextPayment: LoanWithNextPayment['nextPayment']
  paymentMethods?: PaymentMethod[]
  children?: React.ReactNode
}

export function MakeLoanPaymentDialog({
  loanId,
  loanName,
  nextPayment,
  paymentMethods = [],
  children,
}: MakeLoanPaymentDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [amount, setAmount] = useState(
    nextPayment ? nextPayment.amount_due.toString() : ''
  )
  const [date, setDate] = useState<Date>(new Date())
  const [paymentMethodId, setPaymentMethodId] = useState<string>('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nextPayment) {
      setError('No pending payment found for this loan')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    setIsSubmitting(true)

    const input: MakeLoanPaymentInput = {
      loanId,
      loanPaymentId: nextPayment.id,
      amount: amountNum,
      date: format(date, 'yyyy-MM-dd'),
      paymentMethodId: paymentMethodId || undefined,
      notes: notes.trim() || undefined,
    }

    const result = await makeLoanPayment(input)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Success - close dialog and refresh
      setOpen(false)
      setIsSubmitting(false)
      router.refresh()

      // Reset form
      setAmount('')
      setDate(new Date())
      setPaymentMethodId('')
      setNotes('')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setOpen(newOpen)
      if (!newOpen) {
        setError(null)
        // Reset form when closing
        setAmount(nextPayment ? nextPayment.amount_due.toString() : '')
        setDate(new Date())
        setPaymentMethodId('')
        setNotes('')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" size="sm">
            Make Payment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make Loan Payment</DialogTitle>
          <DialogDescription>
            Record a payment for {loanName}
          </DialogDescription>
        </DialogHeader>

        {!nextPayment ? (
          <div className="py-6 text-center text-muted-foreground">
            No pending payments found for this loan.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Next Payment Info */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Due</span>
                  <span className="font-semibold">
                    {format(new Date(nextPayment.due_date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount Due</span>
                  <span className="font-semibold">
                    ${nextPayment.amount_due.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Number</span>
                  <span className="font-semibold">#{nextPayment.payment_number}</span>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Payment Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Payment Date</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    onClick={() => setShowCalendar(!showCalendar)}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                  {showCalendar && (
                    <div className="absolute z-50 mt-2 bg-popover border rounded-md shadow-md">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate) {
                            setDate(newDate)
                            setShowCalendar(false)
                          }
                        }}
                        initialFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method (Optional) */}
              {paymentMethods.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method (Optional)</Label>
                  <Select
                    value={paymentMethodId}
                    onValueChange={setPaymentMethodId}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Notes (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Processing...' : 'Make Payment'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
