'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CircleDollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

interface DashboardMetricsProps {
  metrics: {
    totalIncome: number
    totalExpenses: number
    netSavings: number
    savingsRate: number
  }
  dailyData?: Array<{ date: string; income: number; expenses: number; net: number }>
}

export function DashboardMetrics({ metrics, dailyData = [] }: DashboardMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare chart data for sparklines
  const incomeChartData = dailyData.map(d => ({ value: d.income }))
  const expensesChartData = dailyData.map(d => ({ value: d.expenses }))
  const savingsChartData = dailyData.map(d => ({ value: d.net }))

  const cards = [
    {
      title: 'Total Income',
      period: 'Last 28 days',
      value: formatCurrency(metrics.totalIncome),
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
      gradientId: 'incomeGradient',
      data: incomeChartData.length > 0 ? incomeChartData : [{ value: 0 }],
    },
    {
      title: 'Total Expenses',
      period: 'Last 28 days',
      value: formatCurrency(metrics.totalExpenses),
      icon: TrendingDown,
      color: 'rgb(239 68 68)', // red-500
      gradientId: 'expensesGradient',
      data: expensesChartData.length > 0 ? expensesChartData : [{ value: 0 }],
    },
    {
      title: 'Net Savings',
      period: 'Last 28 days',
      value: formatCurrency(metrics.netSavings),
      icon: PiggyBank,
      color: 'rgb(59 130 246)', // blue-500
      gradientId: 'savingsGradient',
      data: savingsChartData.length > 0 ? savingsChartData : [{ value: 0 }],
    },
    {
      title: 'Savings Rate',
      period: 'Last 28 days',
      value: `${metrics.savingsRate.toFixed(1)}%`,
      icon: CircleDollarSign,
      color: 'rgb(99 102 241)', // indigo-500
      gradientId: 'rateGradient',
      data: savingsChartData.length > 0 ? savingsChartData : [{ value: 0 }],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="space-y-5">
              <div className="flex items-center gap-2">
                <Icon className="size-5" style={{ color: card.color }} />
                <span className="text-base font-semibold">{card.title}</span>
              </div>

              <div className="flex items-end gap-2.5 justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {card.period}
                  </div>
                  <div className="text-3xl font-bold text-foreground tracking-tight">
                    {card.value}
                  </div>
                </div>

                {/* Mini sparkline chart */}
                <div className="max-w-40 h-16 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={card.data}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient id={card.gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={card.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={card.color} stopOpacity={0.05} />
                        </linearGradient>
                      </defs>

                      <Tooltip
                        cursor={{ stroke: card.color, strokeWidth: 1, strokeDasharray: '2 2' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const value = payload[0].value as number
                            return (
                              <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
                                <p className="text-sm font-semibold text-foreground">
                                  {formatCurrency(value)}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={card.color}
                        fill={`url(#${card.gradientId})`}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: card.color,
                          stroke: 'white',
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
