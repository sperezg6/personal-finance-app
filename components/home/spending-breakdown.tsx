'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface CategorySpendingSummary {
  categoryId: string
  categoryName: string
  icon: string | null
  color: string | null
  amount: number
  percentage: number
  transactionCount: number
}

interface SpendingBreakdownProps {
  categories: CategorySpendingSummary[]
}

const DEFAULT_COLORS = [
  'rgb(239 68 68)',   // red-500
  'rgb(59 130 246)',  // blue-500
  'rgb(16 185 129)',  // emerald-500
  'rgb(234 179 8)',   // yellow-500
  'rgb(139 92 246)',  // violet-500
  'rgb(249 115 22)',  // orange-500
  'rgb(99 102 241)',  // indigo-500
  'rgb(236 72 153)',  // pink-500
]

export function SpendingBreakdown({ categories }: SpendingBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare data for pie chart
  const chartData = categories.slice(0, 8).map((cat, index) => ({
    name: cat.categoryName,
    value: cat.amount,
    color: cat.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }))

  const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0)

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No spending data available for this period
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-3">
                          <p className="font-semibold">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(payload[0].value as number)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((payload[0].value as number / totalSpending) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground mb-4">
              Top Categories
            </div>
            {categories.slice(0, 6).map((cat, index) => (
              <div key={cat.categoryId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{cat.categoryName}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCurrency(cat.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cat.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
