import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { SavingsSummaryClient } from "@/components/savings/savings-summary-client"
import { BubbleChart } from "@/components/savings/bubble-chart"
import { createClient } from "@/lib/supabase/server"
import { getSavingsSummary, getSavingsGoals } from "@/lib/db/queries"

export default async function SavingsPage() {
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
              <h1 className="text-4xl font-bold">Savings</h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-muted-foreground">Track your savings goals and distribution across categories</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.75} inView>
            <p className="text-center text-muted-foreground py-12">
              Please sign in to view your savings
            </p>
          </BlurFade>
        </div>
      </main>
    )
  }

  // Fetch savings data from Supabase
  const summary = await getSavingsSummary(user.id)
  const goals = await getSavingsGoals(user.id)

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
        {/* Page Header */}
        <div className="space-y-4">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-bold">Savings</h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-muted-foreground">Track your savings goals and distribution across categories</p>
          </BlurFade>
        </div>

        {/* Summary Cards */}
        <BlurFade delay={0.75} inView>
          <SavingsSummaryClient summary={summary} />
        </BlurFade>

        {/* Bubble Chart */}
        <BlurFade delay={1} inView>
          <BubbleChart goals={goals} />
        </BlurFade>
      </div>
    </main>
  )
}
