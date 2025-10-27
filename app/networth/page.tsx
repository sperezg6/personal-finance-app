import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { NetWorthChartClient } from "@/components/networth/networth-chart-client"
import { AssetsListClient } from "@/components/networth/assets-list-client"
import { LiabilitiesListClient } from "@/components/networth/liabilities-list-client"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getNetWorthBreakdown, getNetWorthHistory, getSavingsGoals, getActiveLoans } from "@/lib/db/queries"

export default async function NetWorthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, show empty state
  if (!user) {
    return (
      <main className="min-h-screen">
        <NavBarWrapper />
        <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
          <div className="space-y-4">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl font-bold">Net Worth Tracker</h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-muted-foreground">Monitor your financial health and wealth over time</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.75} inView>
            <p className="text-center text-muted-foreground py-12">
              Please sign in to view your net worth
            </p>
          </BlurFade>
        </div>
      </main>
    )
  }

  // Fetch data from Supabase
  const breakdown = await getNetWorthBreakdown(user.id)
  const history = await getNetWorthHistory(user.id, 6)
  const savingsGoals = await getSavingsGoals(user.id)
  const loans = await getActiveLoans(user.id)

  // Get accounts data
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const totalAssets = breakdown.assets.total
  const totalLiabilities = breakdown.liabilities.total
  const netWorth = breakdown.netWorth

  // Calculate monthly change (simplified - comparing to previous month in history)
  const currentNetWorth = history[history.length - 1]?.netWorth || netWorth
  const previousNetWorth = history[history.length - 2]?.netWorth || netWorth
  const monthlyChange = currentNetWorth - previousNetWorth
  const percentageChange = previousNetWorth > 0 ? ((monthlyChange / previousNetWorth) * 100) : 0

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0

  const summaryStats = [
    {
      title: 'Total Assets',
      period: 'Current value',
      value: `$${formatCurrency(totalAssets)}`,
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Total Liabilities',
      period: 'Current debt',
      value: `$${formatCurrency(totalLiabilities)}`,
      icon: TrendingDown,
      color: 'rgb(239 68 68)', // red-500
    },
    {
      title: 'Monthly Change',
      period: 'This month',
      value: `${monthlyChange >= 0 ? '+' : ''}$${formatCurrency(Math.abs(monthlyChange))}`,
      percentage: `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`,
      icon: DollarSign,
      color: monthlyChange >= 0 ? 'rgb(16 185 129)' : 'rgb(239 68 68)',
    },
    {
      title: 'Debt to Asset Ratio',
      period: 'Current ratio',
      value: `${debtToAssetRatio.toFixed(1)}%`,
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
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-mono">
                  ${formatCurrency(netWorth)}
                </div>
                <div className={`flex items-center justify-center gap-2 ${monthlyChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {monthlyChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span className="text-lg font-semibold font-mono">
                    {monthlyChange >= 0 ? '+' : ''}${formatCurrency(Math.abs(monthlyChange))} ({percentageChange.toFixed(1)}%) this month
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
                        <div className="text-3xl font-bold text-foreground tracking-tight font-mono">{stat.value}</div>
                      </div>

                      {/* Percentage badge */}
                      {stat.percentage && (
                        <div className="text-sm font-semibold font-mono" style={{ color: stat.color }}>
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
          <NetWorthChartClient history={history} />
        </BlurFade>

        {/* Assets and Liabilities Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlurFade delay={1.5} inView>
            <AssetsListClient
              accounts={accounts || []}
              savingsGoals={savingsGoals}
              breakdown={breakdown}
            />
          </BlurFade>
          <BlurFade delay={1.75} inView>
            <LiabilitiesListClient
              loans={loans}
              breakdown={breakdown}
            />
          </BlurFade>
        </div>
      </div>
    </main>
  )
}
