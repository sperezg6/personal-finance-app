'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  Car,
  GraduationCap,
  CreditCard,
  Building2,
  Briefcase,
  MoreHorizontal,
  Pencil,
  Check,
  X
} from "lucide-react"
import type { Loan } from "@/lib/supabase/database.types"
import { updateLoan } from "@/lib/db/actions"
import { useRouter } from "next/navigation"

const loanTypeIcons: Record<string, React.ElementType> = {
  'mortgage': Home,
  'auto': Car,
  'student': GraduationCap,
  'personal': CreditCard,
  'credit_card': CreditCard,
  'business': Briefcase,
  'other': Building2,
}

const loanTypeColors: Record<string, string> = {
  'mortgage': 'rgb(99 102 241)', // indigo
  'auto': 'rgb(59 130 246)', // blue
  'student': 'rgb(16 185 129)', // emerald
  'personal': 'rgb(139 92 246)', // violet
  'credit_card': 'rgb(239 68 68)', // red
  'business': 'rgb(249 115 22)', // orange
  'other': 'rgb(156 163 175)', // gray
}

interface LoansListClientProps {
  initialLoans: Loan[]
}

export function LoansListClient({ initialLoans }: LoansListClientProps) {
  const router = useRouter()
  const [loans, setLoans] = useState(initialLoans)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

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

  const handleEdit = (loan: Loan) => {
    setEditingId(loan.id)
    setEditValue(loan.current_balance.toString())
  }

  const handleSave = async (id: string) => {
    const newBalance = parseFloat(editValue)
    if (!isNaN(newBalance) && newBalance >= 0) {
      setIsSaving(true)
      const result = await updateLoan(id, newBalance)
      if (!result.error) {
        // Optimistically update the UI
        setLoans(loans.map(loan => {
          if (loan.id === id) {
            return {
              ...loan,
              current_balance: newBalance,
              status: newBalance <= 0 ? 'paid_off' : 'active'
            }
          }
          return loan
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

  if (loans.length === 0) {
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
      {loans.map((loan) => {
        const Icon = loanTypeIcons[loan.loan_type] || MoreHorizontal
        const color = loanTypeColors[loan.loan_type] || 'rgb(156 163 175)'
        const progress = calculateProgress(
          Number(loan.current_balance),
          Number(loan.principal_amount)
        )
        const isEditing = editingId === loan.id
        const isPaidOff = loan.status === 'paid_off'

        return (
          <Card key={loan.id} className="transition-all hover:shadow-md">
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
                      {loan.lender && (
                        <p className="text-sm text-muted-foreground">{loan.lender}</p>
                      )}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(loan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-semibold ml-1.5 capitalize">{loan.loan_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  {loan.end_date && (
                    <div className="text-muted-foreground">
                      Payoff: {new Date(loan.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Simple Summary Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        Managing {loans.length} active {loans.length === 1 ? 'loan' : 'loans'}
      </div>
    </div>
  )
}
