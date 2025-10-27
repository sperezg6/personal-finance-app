'use client'

import { AddTransactionDialog } from "@/components/forms/add-transaction-dialog"
import { AddBudgetDialog } from "@/components/forms/add-budget-dialog"

export default function FormsDemo() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Forms Demo</h1>
          <p className="text-muted-foreground">Test the Add Transaction and Add Budget forms</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Add Transaction</h2>
            <p className="text-sm text-muted-foreground">
              Click the button below to open the Add Transaction dialog
            </p>
            <AddTransactionDialog
              onSubmit={(data) => {
                console.log('Transaction submitted:', data)
                alert(`Transaction submitted! Check console for details.\nType: ${data.type}\nAmount: $${data.amount}`)
              }}
            />
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Add Budget</h2>
            <p className="text-sm text-muted-foreground">
              Click the button below to open the Add Budget dialog
            </p>
            <AddBudgetDialog
              onSubmit={(data) => {
                console.log('Budget submitted:', data)
                alert(`Budget submitted! Check console for details.\nCategory: ${data.category}\nAmount: $${data.amount}`)
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
