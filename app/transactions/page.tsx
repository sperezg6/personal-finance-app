'use client'

import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddTransactionButton } from "@/components/ui/add-transaction-button"
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, TrendingDown, TrendingUp, Hash, MoreVertical, Pencil, Trash2, Copy } from "lucide-react"
import { useState } from "react"

type TransactionType = 'income' | 'expense'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  paymentMethod: string
  amount: number
  type: TransactionType
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

const initialTransactions: Transaction[] = [
  { id: '1', date: '2025-01-15', description: 'Monthly Salary', category: 'Salary', paymentMethod: 'Bank Transfer', amount: 4250.00, type: 'income' },
  { id: '2', date: '2025-01-14', description: 'Grocery Shopping', category: 'Food', paymentMethod: 'Credit Card', amount: 125.50, type: 'expense' },
  { id: '3', date: '2025-01-13', description: 'Uber Ride', category: 'Transport', paymentMethod: 'Debit Card', amount: 15.75, type: 'expense' },
  { id: '4', date: '2025-01-12', description: 'Netflix Subscription', category: 'Entertainment', paymentMethod: 'Credit Card', amount: 15.99, type: 'expense' },
  { id: '5', date: '2025-01-10', description: 'Freelance Project', category: 'Freelance', paymentMethod: 'PayPal', amount: 850.00, type: 'income' },
  { id: '6', date: '2025-01-09', description: 'Rent Payment', category: 'Rent', paymentMethod: 'Bank Transfer', amount: 1200.00, type: 'expense' },
  { id: '7', date: '2025-01-08', description: 'Coffee Shop', category: 'Food', paymentMethod: 'Cash', amount: 8.50, type: 'expense' },
  { id: '8', date: '2025-01-07', description: 'Amazon Purchase', category: 'Shopping', paymentMethod: 'Credit Card', amount: 89.99, type: 'expense' },
  { id: '9', date: '2025-01-06', description: 'Electricity Bill', category: 'Utilities', paymentMethod: 'Bank Transfer', amount: 85.00, type: 'expense' },
  { id: '10', date: '2025-01-05', description: 'Consulting Work', category: 'Freelance', paymentMethod: 'PayPal', amount: 650.00, type: 'income' },
  { id: '11', date: '2025-01-04', description: 'Gas Station', category: 'Transport', paymentMethod: 'Debit Card', amount: 45.00, type: 'expense' },
  { id: '12', date: '2025-01-03', description: 'Restaurant Dinner', category: 'Food', paymentMethod: 'Credit Card', amount: 78.25, type: 'expense' },
  { id: '13', date: '2025-01-02', description: 'Pharmacy', category: 'Healthcare', paymentMethod: 'Cash', amount: 34.50, type: 'expense' },
  { id: '14', date: '2025-01-01', description: 'Side Project Payment', category: 'Freelance', paymentMethod: 'Bank Transfer', amount: 500.00, type: 'income' },
  { id: '15', date: '2024-12-31', description: 'Gym Membership', category: 'Healthcare', paymentMethod: 'Credit Card', amount: 49.99, type: 'expense' },
  { id: '16', date: '2024-12-30', description: 'Grocery Shopping', category: 'Food', paymentMethod: 'Debit Card', amount: 142.30, type: 'expense' },
  { id: '17', date: '2024-12-29', description: 'Movie Tickets', category: 'Entertainment', paymentMethod: 'Cash', amount: 32.00, type: 'expense' },
  { id: '18', date: '2024-12-28', description: 'Internet Bill', category: 'Utilities', paymentMethod: 'Bank Transfer', amount: 59.99, type: 'expense' },
  { id: '19', date: '2024-12-27', description: 'Clothing Store', category: 'Shopping', paymentMethod: 'Credit Card', amount: 156.75, type: 'expense' },
  { id: '20', date: '2024-12-26', description: 'Bus Pass', category: 'Transport', paymentMethod: 'Cash', amount: 80.00, type: 'expense' },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses
  const transactionCount = transactions.length

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const handleDuplicate = (transaction: Transaction) => {
    const newTransaction = {
      ...transaction,
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0]
    }
    setTransactions([newTransaction, ...transactions])
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
                        <div className="text-3xl font-bold text-foreground tracking-tight">{card.value}</div>
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
                <AddTransactionButton />
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
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <Input
                            type="date"
                            defaultValue={transaction.date}
                            className="w-[150px] h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={transaction.description}
                            className="min-w-[200px] h-8 text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={transaction.category}>
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
                          <Select defaultValue={transaction.paymentMethod}>
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
                          <span className={transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
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
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </main>
  )
}
