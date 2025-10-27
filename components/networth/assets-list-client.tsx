'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, PiggyBank, TrendingUp } from "lucide-react"
import type { Account, SavingsGoal } from "@/lib/supabase/database.types"
import type { NetWorthBreakdown } from "@/lib/db/queries"

interface AssetsListClientProps {
  accounts: Account[]
  savingsGoals: SavingsGoal[]
  breakdown: NetWorthBreakdown
}

export function AssetsListClient({ accounts, savingsGoals, breakdown }: AssetsListClientProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
      case 'savings':
        return Wallet
      case 'investment':
        return TrendingUp
      default:
        return Wallet
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-600">Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Assets Summary */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-900/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Assets</span>
              <span className="text-2xl font-bold text-emerald-600">${formatCurrency(breakdown.assets.total)}</span>
            </div>
          </div>

          {/* Cash & Accounts */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Cash & Accounts
            </h4>
            <div className="space-y-2">
              {accounts.filter(a => a.type !== 'credit_card').map((account) => {
                const Icon = getAccountIcon(account.type)
                return (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{account.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-600">${formatCurrency(Number(account.balance))}</span>
                  </div>
                )
              })}
              {accounts.filter(a => a.type !== 'credit_card').length === 0 && (
                <p className="text-sm text-muted-foreground italic">No accounts found</p>
              )}
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${formatCurrency(breakdown.assets.cashAndAccounts)}</span>
            </div>
          </div>

          {/* Savings Goals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Savings Goals
            </h4>
            <div className="space-y-2">
              {savingsGoals.filter(g => !g.is_completed).map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background">
                      <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {((Number(goal.current_amount) / Number(goal.target_amount)) * 100).toFixed(0)}% of goal
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-600">${formatCurrency(Number(goal.current_amount))}</span>
                </div>
              ))}
              {savingsGoals.filter(g => !g.is_completed).length === 0 && (
                <p className="text-sm text-muted-foreground italic">No savings goals found</p>
              )}
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${formatCurrency(breakdown.assets.savingsGoals)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
