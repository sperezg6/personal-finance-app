"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BudgetData {
  category: string
  budget: number
  spent: number
  color?: string
}

interface BarChartComponentProps {
  data?: BudgetData[]
}

// Simplified color palette - only 2 colors
const BUDGET_COLOR = "rgb(99 102 241)" // indigo-500 - represents planned budget
const SPENT_COLOR = "rgb(16 185 129)"  // emerald-500 - represents actual spending

const chartConfig = {
  budget: {
    label: "Budget",
    color: BUDGET_COLOR,
  },
  spent: {
    label: "Spent",
    color: SPENT_COLOR,
  },
} satisfies ChartConfig

// Format currency with comma separators
const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Custom label component to display values at the top of bars
interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { x, y, width, value } = props
  if (!value || value === 0 || x === undefined || y === undefined || width === undefined) return null

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="hsl(var(--muted-foreground))"
      textAnchor="middle"
      fontSize={11}
      fontWeight={500}
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
    >
      ${formatCurrency(value)}
    </text>
  )
}

export function BarChartComponent({ data = [] }: BarChartComponentProps) {
  // If no data, show empty state
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Spending Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
          No budget data available. Create budgets to see the comparison chart.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Budget vs Spending Overview</CardTitle>
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: BUDGET_COLOR }} />
            <span className="text-muted-foreground">Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: SPENT_COLOR }} />
            <span className="text-muted-foreground">Spent</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            barGap={8}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tickFormatter={(value) => value}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${formatCurrency(value)}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const formattedValue = `$${formatCurrency(Number(value))}`
                    return [formattedValue, ' ', name === 'budget' ? 'Budget' : 'Spent']
                  }}
                />
              }
            />
            {/* Budget bars - always indigo */}
            <Bar
              dataKey="budget"
              fill={BUDGET_COLOR}
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
            {/* Spent bars - always emerald */}
            <Bar
              dataKey="spent"
              fill={SPENT_COLOR}
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<CustomLabel />} position="top" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
