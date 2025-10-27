import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { TransactionsClient } from "./transactions-client"
import { createClient } from "@/lib/supabase/server"
import { getTransactions, getDashboardMetrics } from "@/lib/db/queries"

export default async function TransactionsPage() {
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
              <h1 className="text-4xl font-bold">Transactions</h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-muted-foreground">Track and manage your income and expenses</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.75} inView>
            <p className="text-center text-muted-foreground py-12">
              Please sign in to view your transactions
            </p>
          </BlurFade>
        </div>
      </main>
    )
  }

  // Fetch transactions and metrics from Supabase
  const transactions = await getTransactions(user.id, { limit: 100 })
  const metrics = await getDashboardMetrics(user.id, 28)

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8 pb-12">
        <div className="space-y-4">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-bold">Transactions</h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-muted-foreground">Track and manage your income and expenses</p>
          </BlurFade>
        </div>

        <TransactionsClient
          initialTransactions={transactions}
          metrics={metrics}
        />
      </div>
    </main>
  )
}
