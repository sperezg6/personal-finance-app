'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import {
  AddRecurringTransactionForm,
  RecurringTransactionFormData,
} from '@/components/forms/add-recurring-transaction-form'
import {
  RecurringTransactionsList,
  RecurringTransactionWithDetails,
} from './recurring-transactions-list'
import {
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  toggleRecurringTransactionActive,
  createTransactionFromRecurring,
  processRecurringTransactions,
} from '@/lib/db/actions'
import { BlurFade } from '@/components/ui/blur-fade'

export interface RecurringTransactionsSectionProps {
  /**
   * Initial list of recurring transactions
   */
  recurringTransactions: RecurringTransactionWithDetails[]

  /**
   * Available categories
   */
  categories: Array<{ name: string }>

  /**
   * Available payment methods
   */
  paymentMethods: Array<{ name: string }>
}

/**
 * Recurring Transactions Section component
 * Main component that handles all recurring transaction operations
 */
export function RecurringTransactionsSection({
  recurringTransactions,
  categories,
  paymentMethods,
}: RecurringTransactionsSectionProps) {
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingTransaction, setEditingTransaction] = React.useState<
    RecurringTransactionWithDetails | undefined
  >()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [toast, setToast] = React.useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  // Show toast for 3 seconds
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
  }

  const handleAdd = () => {
    setEditingTransaction(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (transaction: RecurringTransactionWithDetails) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: RecurringTransactionFormData) => {
    try {
      if (editingTransaction) {
        // Update existing
        const result = await updateRecurringTransaction(editingTransaction.id, {
          description: data.description,
          amount: parseFloat(data.amount),
          type: data.type,
          category: data.category,
          paymentMethod: data.paymentMethod || undefined,
          frequency: data.frequency,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          dayOfMonth: data.dayOfMonth,
          dayOfWeek: data.dayOfWeek,
          intervalCount: data.intervalCount,
          autoCreate: data.autoCreate,
        })

        if (result.error) {
          showToast(result.error, 'error')
        } else {
          showToast('Recurring transaction updated successfully')
          router.refresh()
        }
      } else {
        // Create new
        const result = await createRecurringTransaction({
          description: data.description,
          amount: parseFloat(data.amount),
          type: data.type,
          category: data.category,
          paymentMethod: data.paymentMethod || undefined,
          frequency: data.frequency,
          startDate: data.startDate,
          endDate: data.endDate || undefined,
          dayOfMonth: data.dayOfMonth,
          dayOfWeek: data.dayOfWeek,
          intervalCount: data.intervalCount,
          autoCreate: data.autoCreate,
        })

        if (result.error) {
          showToast(result.error, 'error')
        } else {
          showToast('Recurring transaction created successfully')
          router.refresh()
        }
      }
    } catch (error) {
      console.error('Error saving recurring transaction:', error)
      showToast('Failed to save recurring transaction', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring transaction?')) {
      return
    }

    try {
      const result = await deleteRecurringTransaction(id)

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast('Recurring transaction deleted successfully')
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting recurring transaction:', error)
      showToast('Failed to delete recurring transaction', 'error')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const result = await toggleRecurringTransactionActive(id, isActive)

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast(
          `Recurring transaction ${isActive ? 'activated' : 'deactivated'} successfully`
        )
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling recurring transaction:', error)
      showToast('Failed to update recurring transaction', 'error')
    }
  }

  const handleCreateNow = async (id: string) => {
    if (!confirm('Create a transaction from this recurring entry now?')) {
      return
    }

    try {
      const result = await createTransactionFromRecurring(id)

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast('Transaction created successfully')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      showToast('Failed to create transaction', 'error')
    }
  }

  const handleProcessAll = async () => {
    if (!confirm('Process all due recurring transactions?')) {
      return
    }

    setIsProcessing(true)
    try {
      const result = await processRecurringTransactions()

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        const count = result.data?.processedCount || 0
        showToast(
          count > 0
            ? `Successfully processed ${count} recurring transaction${count !== 1 ? 's' : ''}`
            : 'No due transactions to process'
        )
        router.refresh()
      }
    } catch (error) {
      console.error('Error processing recurring transactions:', error)
      showToast('Failed to process recurring transactions', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Convert editing transaction to form data
  const initialFormData = editingTransaction
    ? {
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category?.name || '',
        paymentMethod: editingTransaction.payment_method?.name || '',
        frequency: editingTransaction.frequency as RecurringTransactionFormData['frequency'],
        startDate: editingTransaction.start_date,
        endDate: editingTransaction.end_date || '',
        dayOfMonth: editingTransaction.day_of_month || undefined,
        dayOfWeek: editingTransaction.day_of_week || undefined,
        intervalCount: editingTransaction.interval_count || 1,
        autoCreate: editingTransaction.auto_create ?? true,
      }
    : undefined

  // Count due transactions
  const dueCount = recurringTransactions.filter(
    (t) => t.is_active && t.next_due_date && new Date(t.next_due_date) <= new Date()
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0.75} inView>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Recurring Transactions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage automated income and expense transactions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {dueCount > 0 && (
              <Button
                variant="outline"
                onClick={handleProcessAll}
                disabled={isProcessing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                Process Due ({dueCount})
              </Button>
            )}
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Recurring Transaction
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* List */}
      <BlurFade delay={0.85} inView>
        <RecurringTransactionsList
          transactions={recurringTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onCreateNow={handleCreateNow}
        />
      </BlurFade>

      {/* Form Dialog */}
      <AddRecurringTransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        initialData={initialFormData}
        categories={categories}
        paymentMethods={paymentMethods}
      />

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
