'use client'

import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddButton } from "@/components/ui/add-transaction-button"
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, TrendingDown, TrendingUp, Hash, MoreVertical, Pencil, Trash2, Copy } from "lucide-react"
import { useState } from "react"
import { deleteTransaction, duplicateTransaction, updateTransaction } from "@/lib/db/actions"
import { useRouter } from "next/navigation"
import type { TransactionWithCategory } from "@/lib/supabase/database.types"
import type { DashboardMetrics } from "@/lib/db/queries"

interface TransactionsClientProps {
  initialTransactions: TransactionWithCategory[]
  metrics: DashboardMetrics
}

const categories = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Rent',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Other'
]

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PayPal'
]

export function TransactionsClient({ initialTransactions, metrics }: TransactionsClientProps) {
  const router = useRouter()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const totalIncome = metrics.totalIncome
  const totalExpenses = metrics.totalExpenses
  const netBalance = metrics.netSavings
  const transactionCount = metrics.transactionCount

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteTransaction(id)
    if (!result.error) {
      setTransactions(transactions.filter(t => t.id !== id))
      router.refresh()
    }
    setIsDeleting(null)
  }

  const handleDuplicate = async (transaction: TransactionWithCategory) => {
    const result = await duplicateTransaction(transaction.id)
    if (!result.error && result.data) {
      router.refresh()
    }
  }

  const handleUpdate = async (id: string, field: string, value: string | number) => {
    const update: Record<string, string | number> = { id }
    update[field] = value

    const result = await updateTransaction(update)
    if (!result.error) {
      router.refresh()
    }
  }

  // Format number with thousands separator
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const summaryCards = [
    {
      title: 'Total Income',
      period: 'Last 28 days',
      value: `$${formatCurrency(totalIncome)}`,
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Total Expenses',
      period: 'Last 28 days',
      value: `$${formatCurrency(totalExpenses)}`,
      icon: TrendingDown,
      color: 'rgb(239 68 68)', // red-500
    },
    {
      title: 'Net Balance',
      period: 'Last 28 days',
      value: `$${formatCurrency(netBalance)}`,
      icon: CircleDollarSign,
      color: 'rgb(99 102 241)', // indigo-500
    },
    {
      title: 'Transactions',
      period: 'Last 28 days',
      value: String(transactionCount),
      icon: Hash,
      color: 'rgb(139 92 246)', // violet-500
    }
  ]

  return (
    <>
      {/* Summary Cards */}
      <BlurFade delay={0.75} inView>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="space-y-5">
                  {/* Header with icon and title */}
                  <div className="flex items-center gap-2">
                    <Icon className="size-5" style={{ color: card.color }} />
                    <span className="text-base font-semibold">{card.title}</span>
                  </div>

                  <div className="flex items-end gap-2.5 justify-between">
                    {/* Details */}
                    <div className="flex flex-col gap-1">
                      {/* Period */}
                      <div className="text-sm text-muted-foreground whitespace-nowrap">{card.period}</div>

                      {/* Value */}
                      <div className="text-3xl font-bold text-foreground tracking-tight font-mono">{card.value}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </BlurFade>

      {/* Transactions Table */}
      <BlurFade delay={1} inView>
        <Card>
          <CardContent className="p-0">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Transactions</h2>
              <AddButton label="Add Transactions" />
            </div>
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Payment Method</TableHead>
                    <TableHead className="font-semibold text-right">Amount</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        No transactions found. Add your first transaction to get started!
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <Input
                            type="date"
                            defaultValue={transaction.date}
                            onChange={(e) => handleUpdate(transaction.id, 'date', e.target.value)}
                            className="w-[150px] h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={transaction.description}
                            onBlur={(e) => handleUpdate(transaction.id, 'description', e.target.value)}
                            className="min-w-[200px] h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={transaction.category?.name}
                            onValueChange={(value) => handleUpdate(transaction.id, 'category', value)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={transaction.payment_method || undefined}
                            onValueChange={(value) => handleUpdate(transaction.id, 'paymentMethod', value)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map(method => (
                                <SelectItem key={method} value={method}>{method}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={`font-mono ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}${formatCurrency(Number(transaction.amount))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.type === 'income' ? 'default' : 'destructive'}
                            className={transaction.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }
                          >
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="size-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="size-3 mr-1" />
                            )}
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(transaction)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(transaction.id)}
                                className="text-red-600"
                                disabled={isDeleting === transaction.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isDeleting === transaction.id ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </>
  )
}
