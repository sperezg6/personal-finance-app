'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from "@/components/ui/card"
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts'
import { NetWorthSnapshot } from "@/types"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/line-charts-1"
import { Badge } from "@/components/ui/badge-2"
import { Button } from "@/components/ui/button-1"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDown, ArrowUp, Calendar, Download, Filter, MoreHorizontal, RefreshCw, Share2 } from "lucide-react"

interface NetWorthData extends NetWorthSnapshot {
  netWorthArea: number
  month: string
}

const rawData: NetWorthSnapshot[] = [
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

// Transform data to include area and formatted month
const historicalData: NetWorthData[] = rawData.map(item => ({
  ...item,
  netWorthArea: item.netWorth,
  month: item.date.slice(5) // Get just "01", "02", etc.
}))

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'var(--color-teal-500)',
  },
  totalAssets: {
    label: 'Total Assets',
    color: 'var(--color-blue-500)',
  },
  totalLiabilities: {
    label: 'Total Liabilities',
    color: 'var(--color-pink-500)',
  },
} satisfies ChartConfig

// Custom Label Component
const ChartLabel = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-3.5 border-4 rounded-full bg-background" style={{ borderColor: color }}></div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

// Custom Tooltip
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    // Filter out netWorthArea from tooltip
    const filteredPayload = payload.filter((entry) => entry.dataKey !== 'netWorthArea')

    return (
      <div className="rounded-lg border bg-popover p-3 shadow-sm shadow-black/5 min-w-[200px]">
        <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2.5">
          Month {label}
        </div>
        <div className="space-y-2">
          {filteredPayload.map((entry, index) => {
            const config = chartConfig[entry.dataKey as keyof typeof chartConfig]

            // Calculate percentage change for comparison
            let percentChange = 0
            if (index > 0 && entry.dataKey === 'netWorth') {
              const assetsEntry = filteredPayload.find(e => e.dataKey === 'totalAssets')
              const liabilitiesEntry = filteredPayload.find(e => e.dataKey === 'totalLiabilities')
              if (assetsEntry && liabilitiesEntry) {
                percentChange = ((entry.value / assetsEntry.value) * 100)
              }
            }

            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <ChartLabel label={config?.label + ':'} color={entry.color} />
                <span className="font-semibold text-popover-foreground">
                  ${(entry.value / 1000).toFixed(1)}k
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

export function NetWorthChart() {
  // Calculate trend
  const latestValue = historicalData[historicalData.length - 1].netWorth
  const previousValue = historicalData[historicalData.length - 2].netWorth
  const trend = ((latestValue - previousValue) / previousValue * 100).toFixed(1)

  // Get current month for reference line
  const currentMonth = '12'

  return (
    <Card className="w-full">
      <CardHeader className="border-0 min-h-auto pt-6 pb-6">
        <CardTitle className="text-base font-semibold">Net Worth History</CardTitle>
        <CardToolbar>
          <div className="flex items-center gap-4 text-sm">
            <ChartLabel label="Net Worth" color={chartConfig.netWorth.color} />
            <ChartLabel label="Assets" color={chartConfig.totalAssets.color} />
            <ChartLabel label="Liabilities" color={chartConfig.totalLiabilities.color} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem>
                <Download className="size-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="size-4" />
                Change Period
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="size-4" />
                Filter Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="size-4" />
                Refresh
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="size-4" />
                Share Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>

      <CardContent className="px-2.5 flex flex-col items-end">
        <ChartContainer
          config={chartConfig}
          className="h-[350px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <ComposedChart
            data={historicalData}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartConfig.netWorth.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartConfig.netWorth.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: 'text-muted-foreground' }}
              dy={5}
              tickMargin={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: 'text-muted-foreground' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['dataMin - 5000', 'dataMax + 5000']}
              tickMargin={12}
            />

            {/* Current month reference line */}
            <ReferenceLine x={currentMonth} stroke={chartConfig.netWorth.color} strokeWidth={1} />

            {/* Tooltip */}
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'var(--input)',
                strokeWidth: 1,
                strokeDasharray: 'none',
              }}
            />

            {/* Net Worth area with gradient background */}
            <Area
              type="linear"
              dataKey="netWorthArea"
              stroke="transparent"
              fill="url(#netWorthGradient)"
              strokeWidth={0}
              dot={false}
            />

            {/* Net Worth line with dots */}
            <Line
              type="linear"
              dataKey="netWorth"
              stroke={chartConfig.netWorth.color}
              strokeWidth={2}
              dot={{
                fill: 'var(--background)',
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.netWorth.color,
              }}
            />

            {/* Assets line (solid) */}
            <Line
              type="linear"
              dataKey="totalAssets"
              stroke={chartConfig.totalAssets.color}
              strokeWidth={2}
              dot={{
                fill: 'var(--background)',
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.totalAssets.color,
              }}
            />

            {/* Liabilities line (dashed) */}
            <Line
              type="linear"
              dataKey="totalLiabilities"
              stroke={chartConfig.totalLiabilities.color}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{
                fill: 'var(--background)',
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.totalLiabilities.color,
                strokeDasharray: '0',
              }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
