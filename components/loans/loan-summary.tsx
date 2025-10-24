'use client'

import { Card, CardContent } from "@/components/ui/card"
import { CircleDollarSign, TrendingDown, Calendar, Percent } from "lucide-react"
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
    title: 'Total Debt',
    period: 'Across all loans',
    value: '$48,250',
    icon: CircleDollarSign,
    color: 'rgb(239 68 68)', // red-500
  },
  {
    title: 'Monthly Payment',
    period: 'Required minimum',
    value: '$567',
    icon: TrendingDown,
    color: 'rgb(249 115 22)', // orange-500
    badge: 'Due 15th'
  },
  {
    title: 'Interest Paid',
    period: 'This year',
    value: '$2,890',
    icon: Percent,
    color: 'rgb(139 92 246)', // violet-500
  },
  {
    title: 'Payoff Date',
    period: 'Est. completion',
    value: 'Aug 2032',
    icon: Calendar,
    color: 'rgb(59 130 246)', // blue-500
    badge: '7.2 years'
  }
]

export function LoanSummary() {
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
