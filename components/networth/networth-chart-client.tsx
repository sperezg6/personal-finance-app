'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { NetWorthHistoryPoint } from "@/lib/db/queries"

interface NetWorthChartClientProps {
  history: NetWorthHistoryPoint[]
}

export function NetWorthChartClient({ history }: NetWorthChartClientProps) {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const chartData = history.map(point => ({
    date: formatDate(point.date),
    netWorth: point.netWorth,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="rgb(16 185 129)"
                strokeWidth={3}
                dot={{ fill: 'rgb(16 185 129)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
