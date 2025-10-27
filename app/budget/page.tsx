import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { AddButton } from "@/components/ui/add-transaction-button"
import { BarChartComponent } from '@/components/charts/bar-chart'
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getBudgetSummary, getBudgetsWithSpending } from "@/lib/db/queries"
import { BudgetCardsClient } from "@/components/budget/budget-cards-client"

export default async function BudgetPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, show empty state
  if (!user) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <BlurFade delay={0.25} inView>
                <h1 className="text-4xl font-bold">Budget Planning</h1>
              </BlurFade>
              <BlurFade delay={0.5} inView>
                <p className="text-muted-foreground">Track and manage your monthly spending limits</p>
              </BlurFade>
            </div>
          </div>
          <BlurFade delay={0.75} inView>
            <p className="text-center text-muted-foreground py-12">
              Please sign in to view your budgets
            </p>
          </BlurFade>
        </div>
      </main>
    )
  }

  // Fetch budget data from Supabase
  const summary = await getBudgetSummary(user.id)
  const budgets = await getBudgetsWithSpending(user.id)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const percentageUsed = summary.totalBudget > 0
    ? ((summary.totalSpent / summary.totalBudget) * 100).toFixed(0)
    : '0'

  const percentageRemaining = summary.totalBudget > 0
    ? ((summary.totalRemaining / summary.totalBudget) * 100).toFixed(0)
    : '0'

  const summaryStats = [
    {
      title: 'Total Budget',
      period: 'Monthly',
      value: `$${formatCurrency(summary.totalBudget)}`,
      icon: DollarSign,
      color: 'rgb(99 102 241)', // indigo-500
    },
    {
      title: 'Total Spent',
      period: 'This month',
      value: `$${formatCurrency(summary.totalSpent)}`,
      percentage: `${percentageUsed}%`,
      icon: TrendingDown,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Remaining',
      period: 'This month',
      value: `$${formatCurrency(Math.max(0, summary.totalRemaining))}`,
      percentage: `${percentageRemaining}%`,
      icon: TrendingUp,
      color: 'rgb(59 130 246)', // blue-500
    },
    {
      title: 'Over Budget',
      period: 'Categories',
      value: String(summary.overBudgetCount),
      icon: AlertTriangle,
      color: 'rgb(239 68 68)', // red-500
    }
  ]

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl font-bold">Budget Planning</h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-muted-foreground">Track and manage your monthly spending limits</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.75} inView>
            <AddButton label="Add Budget" />
          </BlurFade>
        </div>

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
                        <div className="text-3xl font-bold text-foreground tracking-tight font-mono">{stat.value}</div>
                      </div>

                      {/* Percentage badge */}
                      {stat.percentage && (
                        <div className="text-sm font-semibold text-muted-foreground font-mono">
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

        {/* Budget Summary Overview */}
        <BlurFade delay={1.25} inView>
          <BarChartComponent />
        </BlurFade>

        {/* Budget Cards with Circular Progress */}
        <BlurFade delay={1.25} inView>
          <BudgetCardsClient initialBudgets={budgets} />
        </BlurFade>
      </div>
    </main>
  )
}
