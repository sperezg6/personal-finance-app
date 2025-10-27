'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Briefcase, AlertTriangle } from "lucide-react"
import type { Loan } from "@/lib/supabase/database.types"
import type { NetWorthBreakdown } from "@/lib/db/queries"

interface LiabilitiesListClientProps {
  loans: Loan[]
  breakdown: NetWorthBreakdown
}

export function LiabilitiesListClient({ loans, breakdown }: LiabilitiesListClientProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const getLoanIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return CreditCard
      default:
        return Briefcase
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-600">Liabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Liabilities Summary */}
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Liabilities</span>
              <span className="text-2xl font-bold text-red-600">${formatCurrency(breakdown.liabilities.total)}</span>
            </div>
          </div>

          {/* Credit Card Debt */}
          {breakdown.liabilities.creditCardDebt > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Card Debt
              </h4>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Credit Card Balance</p>
                      <p className="text-xs text-muted-foreground">High interest debt</p>
                    </div>
                  </div>
                  <span className="font-semibold text-red-600">
                    ${formatCurrency(breakdown.liabilities.creditCardDebt)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loans */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Loans
            </h4>
            <div className="space-y-2">
              {loans.map((loan) => {
                const Icon = getLoanIcon(loan.loan_type)
                return (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{loan.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {loan.loan_type.replace('_', ' ')} • {Number(loan.interest_rate).toFixed(2)}% APR
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-red-600">${formatCurrency(Number(loan.current_balance))}</span>
                  </div>
                )
              })}
              {loans.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No active loans</p>
              )}
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${formatCurrency(breakdown.liabilities.loans)}</span>
            </div>
          </div>

          {/* Payment Summary */}
          {loans.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-900/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-semibold">
                  ${formatCurrency(loans.reduce((sum, loan) => sum + Number(loan.monthly_payment), 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
