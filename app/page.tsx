import { NavBarWrapper } from "@/components/navbar-wrapper"
import AreaCharts from "@/components/area-charts"
import { ConversionFunnelChart } from "@/components/conversion-funnel-chart"
import { BlurFade } from "@/components/ui/blur-fade"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile, getHomePageData, getFinancialChartData } from "@/lib/db/queries"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile for display name
  let displayName = 'Santiago'
  if (user) {
    const profile = await getUserProfile(user.id)
    displayName = profile?.display_name || profile?.full_name || user.email?.split('@')[0] || 'Santiago'
  }

  // Get home page dashboard data
  const dashboardData = user
    ? await getHomePageData(user.id)
    : {
        income: 0,
        savings: 0,
        spending: 0,
        incomeData: [] as Array<{ value: number }>,
        savingsData: [] as Array<{ value: number }>,
        spendingData: [] as Array<{ value: number }>,
      }

  // Get financial chart data (90 days for the large chart)
  const financialChartData = user
    ? await getFinancialChartData(user.id, 90)
    : []

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8">
        <div className="space-y-4 pb-8">
          <BlurFade delay={0.75} inView>
            <h1 className="text-4xl font-bold">Hello {displayName} 👋</h1>
          </BlurFade>
          <BlurFade delay={1} inView>
            <p className="mt-4 text-muted-foreground">Here is you finance summary</p>
          </BlurFade>
        </div>
        <BlurFade delay={0.25} inView>
          <AreaCharts
            userId={user?.id}
            income={dashboardData.income}
            savings={dashboardData.savings}
            spending={dashboardData.spending}
            incomeData={dashboardData.incomeData}
            savingsData={dashboardData.savingsData}
            spendingData={dashboardData.spendingData}
          />
        </BlurFade>
        <BlurFade delay={0.5} inView>
          <ConversionFunnelChart data={financialChartData} />
        </BlurFade>
      </div>
    </main>
  )
}
