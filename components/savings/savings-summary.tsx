'use client'

import { Card, CardContent } from "@/components/ui/card"
import { CircleDollarSign, TrendingUp, Wallet, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SummaryCard {
  title: string
  period: string
  value: string
  icon: React.ElementType
  color: string
  badge?: string
}

const summaryCards: SummaryCard[] = [
  {
    title: 'Total Savings',
    period: 'All categories',
    value: '$36,000',
    icon: CircleDollarSign,
    color: 'rgb(99 102 241)', // indigo-500
  },
  {
    title: 'Monthly Growth',
    period: 'January 2025',
    value: '+$1,250',
    icon: TrendingUp,
    color: 'rgb(16 185 129)', // emerald-500
    badge: '+3.5%'
  },
  {
    title: 'Top Category',
    period: 'Emergency Fund',
    value: '$12,500',
    icon: Wallet,
    color: 'rgb(139 92 246)', // violet-500
    badge: '35%'
  },
  {
    title: 'Savings Rate',
    period: 'Monthly average',
    value: '$850',
    icon: Target,
    color: 'rgb(59 130 246)', // blue-500
  }
]

export function SavingsSummary() {
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
                  <div className="text-3xl font-bold text-foreground tracking-tight">{card.value}</div>
                </div>

                {/* Badge if exists */}
                {card.badge && (
                  <Badge
                    variant="secondary"
                    className="text-sm font-semibold"
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
