import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { TransactionsClient } from "./transactions-client"
import { createClient } from "@/lib/supabase/server"
import { getTransactions, getDashboardMetrics, getSavingsAccounts } from "@/lib/db/queries"
import { RecurringTransactionsSection } from "@/components/transactions/recurring-transactions-section"

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

  // Fetch transactions, metrics, categories, payment methods and savings accounts from Supabase
  const transactions = await getTransactions(user.id, { limit: 100 })
  const metrics = await getDashboardMetrics(user.id, 28)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  const savingsAccounts = await getSavingsAccounts(user.id)

  // Fetch recurring transactions with category and payment method details
  const { data: recurringTransactionsRaw } = await supabase
    .from('recurring_transactions')
    .select(`
      *,
      category:categories(name, icon, color),
      payment_method:payment_methods(name)
    `)
    .eq('user_id', user.id)
    .order('next_due_date', { ascending: true })

  const recurringTransactions = recurringTransactionsRaw || []

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

        {/* Regular Transactions */}
        <TransactionsClient
          initialTransactions={transactions}
          metrics={metrics}
          categories={categories || []}
          paymentMethods={paymentMethods || []}
          savingsAccounts={savingsAccounts || []}
        />

        {/* Recurring Transactions Section */}
        <RecurringTransactionsSection
          recurringTransactions={recurringTransactions}
          categories={categories?.map(c => ({ name: c.name })) || []}
          paymentMethods={paymentMethods?.map(p => ({ name: p.name })) || []}
        />
      </div>
    </main>
  )
}
