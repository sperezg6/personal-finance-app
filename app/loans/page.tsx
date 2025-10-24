'use client'

import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { SimplifiedLoanView } from "@/components/loans/simplified-loan-view"

export default function LoansPage() {
  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <BlurFade delay={0.25} inView>
          <SimplifiedLoanView />
        </BlurFade>
      </div>
    </main>
  )
}
