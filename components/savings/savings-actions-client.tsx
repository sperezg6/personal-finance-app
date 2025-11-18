'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, PiggyBank } from 'lucide-react'
import { AddSavingsAccountForm, type SavingsAccountFormData } from '@/components/forms/add-savings-account-form'
import { AddSavingsTransactionForm, type SavingsTransactionFormData } from '@/components/forms/add-savings-transaction-form'
import { createSavingsGoal } from '@/lib/db/actions'
import { createTransaction } from '@/lib/db/actions'
import type { SavingsAccount } from '@/lib/supabase/database.types'
import { useRouter } from 'next/navigation'

interface SavingsActionsClientProps {
  savingsAccounts: SavingsAccount[]
}

export function SavingsActionsClient({ savingsAccounts }: SavingsActionsClientProps) {
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false)
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const router = useRouter()

  const handleCreateAccount = async (data: SavingsAccountFormData) => {
    try {
      const result = await createSavingsGoal({
        name: data.name,
        targetAmount: data.targetAmount ? parseFloat(data.targetAmount) : 0,
        currentAmount: parseFloat(data.currentAmount || '0'),
        deadline: data.deadline || undefined,
        description: data.description || undefined,
        icon: data.icon,
        color: data.color,
      })

      if (result.error) {
        console.error('Failed to create savings account:', result.error)
        alert(`Failed to create savings account: ${result.error}`)
      } else {
        console.log('Savings account created successfully:', data.name)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating savings account:', error)
      alert('Failed to create savings account')
    }
  }

  const handleCreateTransaction = async (data: SavingsTransactionFormData) => {
    try {
      const amount = parseFloat(data.amount)
      const result = await createTransaction({
        date: data.date,
        description: data.description,
        category: 'Savings', // We'll use a default category
        amount: Math.abs(amount),
        type: amount >= 0 ? 'income' : 'expense', // Deposits are income, withdrawals are expenses
        notes: data.notes || undefined,
        accountId: data.savingsAccountId, // Now uses account_id instead of savings_account_id
      })

      if (result.error) {
        console.error('Failed to add transaction:', result.error)
        alert(`Failed to add transaction: ${result.error}`)
      } else {
        const account = savingsAccounts.find(acc => acc.id === data.savingsAccountId)
        console.log(`Transaction added: ${amount >= 0 ? 'Deposited' : 'Withdrawn'} $${Math.abs(amount)} ${amount >= 0 ? 'to' : 'from'} ${account?.name}`)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Failed to add transaction')
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <Button
          onClick={() => setIsAccountFormOpen(true)}
          className="gap-2"
        >
          <PiggyBank className="h-4 w-4" />
          New Savings Account
        </Button>

        {savingsAccounts.length > 0 && (
          <Button
            onClick={() => setIsTransactionFormOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </div>

      <AddSavingsAccountForm
        open={isAccountFormOpen}
        onOpenChange={setIsAccountFormOpen}
        onSubmit={handleCreateAccount}
      />

      <AddSavingsTransactionForm
        open={isTransactionFormOpen}
        onOpenChange={setIsTransactionFormOpen}
        onSubmit={handleCreateTransaction}
        savingsAccounts={savingsAccounts}
      />
    </>
  )
}
