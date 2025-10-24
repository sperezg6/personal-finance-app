'use client'

import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { NetWorthChart } from "@/components/networth/networth-chart"
import { AssetsList } from "@/components/networth/assets-list"
import { LiabilitiesList } from "@/components/networth/liabilities-list"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"

export default function NetWorthPage() {
  // Sample data
  const totalAssets = 125750
  const totalLiabilities = 42300
  const netWorth = totalAssets - totalLiabilities
  const monthlyChange = 3250
  const percentageChange = 4.05

  const summaryStats = [
    {
      title: 'Total Assets',
      period: 'Current value',
      value: `$${totalAssets.toLocaleString()}`,
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Total Liabilities',
      period: 'Current debt',
      value: `$${totalLiabilities.toLocaleString()}`,
      icon: TrendingDown,
      color: 'rgb(239 68 68)', // red-500
    },
    {
      title: 'Monthly Change',
      period: 'This month',
      value: `+$${monthlyChange.toLocaleString()}`,
      percentage: `+${percentageChange}%`,
      icon: DollarSign,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Debt to Asset Ratio',
      period: 'Current ratio',
      value: `${((totalLiabilities / totalAssets) * 100).toFixed(1)}%`,
      icon: Percent,
      color: 'rgb(99 102 241)', // indigo-500
    }
  ]

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
        {/* Page Header */}
        <div className="space-y-4">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-bold">Net Worth Tracker</h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-muted-foreground">Monitor your financial health and wealth over time</p>
          </BlurFade>
        </div>

        {/* Net Worth Hero Card */}
        <BlurFade delay={0.75} inView>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-2">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="text-muted-foreground text-lg font-medium">Your Net Worth</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  ${netWorth.toLocaleString()}
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    +${monthlyChange.toLocaleString()} ({percentageChange}%) this month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Summary Cards */}
        <BlurFade delay={1} inView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="space-y-5">
                    {/* Header with icon and title */}
                    <div className="flex items-center gap-2">
                      <Icon className="size-5" style={{ color: stat.color }} />
                      <span className="text-base font-semibold">{stat.title}</span>
                    </div>

                    <div className="flex items-end gap-2.5 justify-between">
                      {/* Details */}
                      <div className="flex flex-col gap-1">
                        {/* Period */}
                        <div className="text-sm text-muted-foreground whitespace-nowrap">{stat.period}</div>

                        {/* Value */}
                        <div className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
                      </div>

                      {/* Percentage badge */}
                      {stat.percentage && (
                        <div className="text-sm font-semibold" style={{ color: stat.color }}>
                          {stat.percentage}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </BlurFade>

        {/* Net Worth Trend Chart */}
        <BlurFade delay={1.25} inView>
          <NetWorthChart />
        </BlurFade>

        {/* Assets and Liabilities Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlurFade delay={1.5} inView>
            <AssetsList />
          </BlurFade>
          <BlurFade delay={1.75} inView>
            <LiabilitiesList />
          </BlurFade>
        </div>
      </div>
    </main>
  )
}
