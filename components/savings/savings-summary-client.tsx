'use client'

import { Card, CardContent } from "@/components/ui/card"
import { CircleDollarSign, TrendingUp, Wallet, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { SavingsSummary } from "@/lib/db/queries"

interface SavingsSummaryClientProps {
  summary: SavingsSummary
}

export function SavingsSummaryClient({ summary }: SavingsSummaryClientProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const summaryCards = [
    {
      title: 'Total Savings',
      period: 'All categories',
      value: `$${formatCurrency(summary.totalSavings)}`,
      icon: CircleDollarSign,
      color: 'rgb(99 102 241)', // indigo-500
    },
    {
      title: 'Monthly Growth',
      period: 'Last 30 days',
      value: summary.monthlyGrowth >= 0
        ? `+$${formatCurrency(summary.monthlyGrowth)}`
        : `-$${formatCurrency(Math.abs(summary.monthlyGrowth))}`,
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
      badge: `${summary.monthlyGrowthPercentage >= 0 ? '+' : ''}${summary.monthlyGrowthPercentage.toFixed(1)}%`
    },
    {
      title: 'Top Category',
      period: summary.topCategoryName,
      value: `$${formatCurrency(summary.topCategoryAmount)}`,
      icon: Wallet,
      color: 'rgb(139 92 246)', // violet-500
      badge: `${summary.topCategoryPercentage.toFixed(0)}%`
    },
    {
      title: 'Savings Rate',
      period: 'Monthly average',
      value: `$${formatCurrency(summary.averageMonthlySavings)}`,
      icon: Target,
      color: 'rgb(59 130 246)', // blue-500
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="space-y-5">
              {/* Header with icon and title */}
              <div className="flex items-center gap-2">
                <Icon className="size-5" style={{ color: card.color }} />
                <span className="text-base font-semibold">{card.title}</span>
              </div>

              <div className="flex items-end gap-2.5 justify-between">
                {/* Details */}
                <div className="flex flex-col gap-1">
                  {/* Period */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">{card.period}</div>

                  {/* Value */}
                  <div className="text-3xl font-bold text-foreground tracking-tight font-mono">{card.value}</div>
                </div>

                {/* Badge if exists */}
                {card.badge && (
                  <Badge
                    variant="secondary"
                    className="text-sm font-semibold font-mono"
                    style={{ backgroundColor: `${card.color}20`, color: card.color }}
                  >
                    {card.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
