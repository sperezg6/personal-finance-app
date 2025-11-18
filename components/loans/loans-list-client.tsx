'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  Pencil,
  Check,
  X,
  Calendar,
  TrendingUp,
  Trash2,
  Loader2,
  DollarSign
} from "lucide-react"
import type { LoanWithNextPayment } from "@/lib/db/queries"
import type { PaymentMethod } from "@/lib/supabase/database.types"
import { updateLoan, deleteLoan } from "@/lib/db/actions"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MakeLoanPaymentDialog } from "./make-loan-payment-dialog"

interface LoansListClientProps {
  initialLoansWithPayments: LoanWithNextPayment[]
  paymentMethods: PaymentMethod[]
}

export function LoansListClient({ initialLoansWithPayments, paymentMethods }: LoansListClientProps) {
  const router = useRouter()
  const [loansWithPayments, setLoansWithPayments] = useState(initialLoansWithPayments)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const calculateProgress = (current: number, original: number) => {
    if (original === 0) return 100
    return Math.round(((original - current) / original) * 100)
  }

  const handleEdit = (loanData: LoanWithNextPayment) => {
    setEditingId(loanData.loan.id)
    setEditValue(loanData.loan.current_balance.toString())
  }

  const handleSave = async (id: string) => {
    const newBalance = parseFloat(editValue)
    if (!isNaN(newBalance) && newBalance >= 0) {
      setIsSaving(true)
      const result = await updateLoan(id, newBalance)
      if (!result.error) {
        // Optimistically update the UI
        setLoansWithPayments(loansWithPayments.map(loanData => {
          if (loanData.loan.id === id) {
            return {
              ...loanData,
              loan: {
                ...loanData.loan,
                current_balance: newBalance
              }
            }
          }
          return loanData
        }))
        router.refresh()
      }
      setIsSaving(false)
    }
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteLoan(id)
    if (!result.error) {
      setLoansWithPayments(loansWithPayments.filter(loanData => loanData.loan.id !== id))
      router.refresh()
    }
    setIsDeleting(null)
  }

  if (loansWithPayments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No active loans found. Add your first loan to start tracking!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {loansWithPayments.map((loanData) => {
          const { loan, nextPayment, paymentsCompleted, totalPayments, progressPercentage } = loanData
          const Icon = CreditCard // Default icon since loan_type doesn't exist
          const color = 'rgb(99 102 241)' // Default color
          const progress = calculateProgress(
            Number(loan.current_balance),
            Number(loan.principal)
          )
          const isEditing = editingId === loan.id
          const isPaidOff = Number(loan.current_balance) <= 0

          return (
            <motion.div
              key={loan.id}
              layout
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{
                opacity: 0,
                height: 0,
                marginBottom: 0,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-6">
              <div className="space-y-4">
                {/* Loan Header Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2.5 rounded-lg bg-muted">
                      <Icon className="size-5" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{loan.name}</h3>
                        {isPaidOff && (
                          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                            Paid Off
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Balance - Right Aligned with Edit */}
                  <div className="text-right flex items-center gap-2">
                    <div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-9 w-32 text-right font-bold text-xl"
                          autoFocus
                          disabled={isSaving}
                        />
                      ) : (
                        <>
                          <p className="text-2xl font-bold">${formatCurrency(Number(loan.current_balance))}</p>
                          <p className="text-sm text-muted-foreground">
                            {progress}% paid off
                          </p>
                        </>
                      )}
                    </div>
                    {!isEditing ? (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(loanData)}
                          disabled={isDeleting === loan.id}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(loan.id)}
                          disabled={isDeleting === loan.id}
                        >
                          {isDeleting === loan.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-emerald-600"
                          onClick={() => handleSave(loan.id)}
                          disabled={isSaving}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: color
                    }}
                  />
                </div>

                {/* Payment Progress & Next Payment Info */}
                {totalPayments > 0 && (
                  <div className="flex items-center justify-between text-sm bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-finance-success" style={{ color }} />
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-semibold">{paymentsCompleted}/{totalPayments} payments ({progressPercentage}%)</span>
                    </div>
                    {nextPayment && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next:</span>
                        <span className="font-semibold">{new Date(nextPayment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-semibold">${formatCurrency(Number(nextPayment.amount_due))}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Make Payment Button */}
                {nextPayment && !isPaidOff && (
                  <div className="pt-2">
                    <MakeLoanPaymentDialog
                      loanId={loan.id}
                      loanName={loan.name}
                      nextPayment={nextPayment}
                      paymentMethods={paymentMethods}
                    >
                      <Button variant="default" size="sm" className="w-full sm:w-auto">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Make Payment
                      </Button>
                    </MakeLoanPaymentDialog>
                  </div>
                )}

                {/* Details Row */}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-semibold ml-1.5">{Number(loan.interest_rate).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-semibold ml-1.5">${formatCurrency(Number(loan.monthly_payment))}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Term:</span>
                      <span className="font-semibold ml-1.5">{loan.term_months} months</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Simple Summary Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        Managing {loansWithPayments.length} active {loansWithPayments.length === 1 ? 'loan' : 'loans'}
      </div>
    </div>
  )
}
