'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const budgetData = [
  { category: 'Food', budget: 1200, spent: 847.50 },
  { category: 'Transport', budget: 800, spent: 656.25 },
  { category: 'Entertainment', budget: 500, spent: 524.75 },
  { category: 'Shopping', budget: 600, spent: 382.30 },
  { category: 'Utilities', budget: 400, spent: 345.99 },
  { category: 'Healthcare', budget: 300, spent: 190.50 },
  { category: 'Rent', budget: 1500, spent: 1500.00 },
  { category: 'Other', budget: 200, spent: 299.71 },
]

export function BudgetSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={budgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="category"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
            <Bar dataKey="budget" fill="rgb(99 102 241)" name="Budget" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
              {budgetData.map((entry, index) => {
                const percentage = (entry.spent / entry.budget) * 100
                const color =
                  percentage >= 100
                    ? 'rgb(239 68 68)' // red-500
                    : percentage >= 80
                    ? 'rgb(234 179 8)' // yellow-500
                    : 'rgb(16 185 129)' // emerald-500
                return <Cell key={`cell-${index}`} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
