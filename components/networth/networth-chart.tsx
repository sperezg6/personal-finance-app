'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { NetWorthSnapshot } from "@/types"

const historicalData: NetWorthSnapshot[] = [
  { date: '2024-01', totalAssets: 98500, totalLiabilities: 52000, netWorth: 46500 },
  { date: '2024-02', totalAssets: 101200, totalLiabilities: 51200, netWorth: 50000 },
  { date: '2024-03', totalAssets: 103800, totalLiabilities: 50400, netWorth: 53400 },
  { date: '2024-04', totalAssets: 106500, totalLiabilities: 49600, netWorth: 56900 },
  { date: '2024-05', totalAssets: 109200, totalLiabilities: 48800, netWorth: 60400 },
  { date: '2024-06', totalAssets: 112000, totalLiabilities: 48000, netWorth: 64000 },
  { date: '2024-07', totalAssets: 114500, totalLiabilities: 47200, netWorth: 67300 },
  { date: '2024-08', totalAssets: 116800, totalLiabilities: 46400, netWorth: 70400 },
  { date: '2024-09', totalAssets: 119000, totalLiabilities: 45600, netWorth: 73400 },
  { date: '2024-10', totalAssets: 121200, totalLiabilities: 44800, netWorth: 76400 },
  { date: '2024-11', totalAssets: 123500, totalLiabilities: 44000, netWorth: 79500 },
  { date: '2024-12', totalAssets: 125750, totalLiabilities: 42300, netWorth: 83450 },
]

export function NetWorthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(16 185 129)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(16 185 129)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59 130 246)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="rgb(59 130 246)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(239 68 68)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="rgb(239 68 68)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="totalAssets"
              stroke="rgb(59 130 246)"
              strokeWidth={2}
              fill="url(#assetsGradient)"
              name="Assets"
            />
            <Area
              type="monotone"
              dataKey="totalLiabilities"
              stroke="rgb(239 68 68)"
              strokeWidth={2}
              fill="url(#liabilitiesGradient)"
              name="Liabilities"
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="rgb(16 185 129)"
              strokeWidth={3}
              fill="url(#netWorthGradient)"
              name="Net Worth"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
