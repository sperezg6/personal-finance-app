'use client'

import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { SavingsSummary } from "@/components/savings/savings-summary"
import { BubbleChart } from "@/components/savings/bubble-chart"

export default function SavingsPage() {
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
          <SavingsSummary />
        </BlurFade>

        {/* Bubble Chart */}
        <BlurFade delay={1} inView>
          <BubbleChart />
        </BlurFade>
      </div>
    </main>
  )
}
