'use client'

import { AddLoanButton } from "@/components/ui/add-loan-button"
import { createLoan } from "@/lib/db/actions"
import type { LoanFormData } from "@/components/forms/add-loan-form"
import { useRouter } from "next/navigation"

export function LoansPageHeader() {
  const router = useRouter()

  const handleLoanSubmit = async (formData: LoanFormData) => {
    const result = await createLoan({
      name: formData.name,
      principal: formData.principal,
      interestRate: formData.interestRate,
      termMonths: formData.termMonths,
      monthlyPayment: formData.monthlyPayment,
      startDate: formData.startDate,
    })

    if (result.data) {
      // Immediately refresh the page to show the new loan
      router.refresh()

      // Small delay to ensure the refresh completes, then reload the page
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else {
      console.error('Error creating loan:', result.error)
    }
  }

  return <AddLoanButton onSubmit={handleLoanSubmit} />
}
