"use client"

import { Bar, BarChart, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,  } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function BarChartComponent() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[40px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis 
            dataKey="month" 
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 12 }}  
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
