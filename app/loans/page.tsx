import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { LoansPageHeader } from "@/components/loans/loans-page-header"
import { DollarSign, TrendingDown, Calendar, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getLoansSummary, getLoansWithPayments } from "@/lib/db/queries"
import { LoansListClient } from "@/components/loans/loans-list-client"

export default async function LoansPage() {
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
                <h1 className="text-4xl font-bold">Loans & Debt</h1>
              </BlurFade>
              <BlurFade delay={0.5} inView>
                <p className="text-muted-foreground">Track and manage your loans and debt</p>
              </BlurFade>
            </div>
          </div>
          <BlurFade delay={0.75} inView>
            <p className="text-center text-muted-foreground py-12">
              Please sign in to view your loans
            </p>
          </BlurFade>
        </div>
      </main>
    )
  }

  // Fetch loans data from Supabase
  const summary = await getLoansSummary(user.id)
  const loansWithPayments = await getLoansWithPayments(user.id)

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const summaryStats = [
    {
      title: 'Total Debt',
      period: 'Current balance',
      value: `$${formatCurrency(summary.totalDebt)}`,
      icon: DollarSign,
      color: 'rgb(239 68 68)', // red-500
    },
    {
      title: 'Monthly Payment',
      period: 'Total due',
      value: `$${formatCurrency(summary.monthlyPayment)}`,
      icon: Calendar,
      color: 'rgb(249 115 22)', // orange-500
    },
    {
      title: 'Average Rate',
      period: 'Interest rate',
      value: `${summary.averageInterestRate.toFixed(2)}%`,
      icon: TrendingDown,
      color: 'rgb(234 179 8)', // yellow-500
    },
    {
      title: 'Active Loans',
      period: 'Total count',
      value: String(summary.activeLoansCount),
      icon: CreditCard,
      color: 'rgb(99 102 241)', // indigo-500
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
              <h1 className="text-4xl font-bold">Loans & Debt</h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-muted-foreground">Track and manage your loans and debt</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.75} inView>
            <LoansPageHeader />
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
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </BlurFade>

        {/* Loans List */}
        <BlurFade delay={1.25} inView>
          <LoansListClient initialLoansWithPayments={loansWithPayments} />
        </BlurFade>
      </div>
    </main>
  )
}
