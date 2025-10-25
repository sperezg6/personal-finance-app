'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@ark-ui/react/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Building2, Calendar, AlertCircle } from "lucide-react"

export interface Loan {
  id: string
  name: string
  servicer: string
  type: 'federal' | 'private'
  status: 'on-track' | 'behind' | 'paid-off'
  originalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  nextPaymentDate: string
  icon: React.ElementType
}

const loans: Loan[] = [
  {
    id: '1',
    name: 'Federal Subsidized',
    servicer: 'Great Lakes',
    type: 'federal',
    status: 'on-track',
    originalAmount: 18500,
    currentBalance: 12350,
    interestRate: 4.53,
    monthlyPayment: 185,
    nextPaymentDate: '2025-02-15',
    icon: GraduationCap,
  },
  {
    id: '2',
    name: 'Federal Unsubsidized',
    servicer: 'Nelnet',
    type: 'federal',
    status: 'on-track',
    originalAmount: 24000,
    currentBalance: 18900,
    interestRate: 5.05,
    monthlyPayment: 227,
    nextPaymentDate: '2025-02-15',
    icon: BookOpen,
  },
  {
    id: '3',
    name: 'Private Student Loan',
    servicer: 'SoFi',
    type: 'private',
    status: 'behind',
    originalAmount: 22000,
    currentBalance: 17000,
    interestRate: 6.75,
    monthlyPayment: 155,
    nextPaymentDate: '2025-01-28',
    icon: Building2,
  },
]

const statusConfig = {
  'on-track': {
    label: 'On Track',
    color: 'rgb(16 185 129)',
    progressColor: 'bg-emerald-500',
    trackColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  'behind': {
    label: 'Payment Due',
    color: 'rgb(239 68 68)',
    progressColor: 'bg-red-500',
    trackColor: 'bg-red-100 dark:bg-red-900/20',
  },
  'paid-off': {
    label: 'Paid Off',
    color: 'rgb(99 102 241)',
    progressColor: 'bg-indigo-500',
    trackColor: 'bg-indigo-100 dark:bg-indigo-900/20',
  },
}

export function SimplifiedLoanView() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const calculateProgress = (current: number, original: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`
    } else if (diffDays === 0) {
      return 'Due today'
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const totalDebt = loans.reduce((sum, loan) => sum + loan.currentBalance, 0)
  const totalMonthly = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
  const nextPayment = loans.reduce((nearest, loan) => {
    const loanDate = new Date(loan.nextPaymentDate)
    const nearestDate = new Date(nearest.nextPaymentDate)
    return loanDate < nearestDate ? loan : nearest
  })

  return (
    <div className="space-y-8">
      {/* Clean Header with Essential Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Loans</h1>
          <p className="text-muted-foreground">
            Track your different loan balances and payment schedule
          </p>
        </div>

        {/* Compact Summary Bar */}
        <div className="flex flex-wrap gap-8 p-6 bg-muted/30 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <p className="text-3xl font-bold">${formatCurrency(totalDebt)}</p>
          </div>
          <div className="border-l pl-8">
            <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
            <p className="text-3xl font-bold">${formatCurrency(totalMonthly)}</p>
          </div>
          <div className="border-l pl-8 flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Next Payment</p>
              <p className="text-lg font-semibold">{formatDate(nextPayment.nextPaymentDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Loan Cards */}
      <div className="space-y-4">
        {loans.map((loan) => {
          const Icon = loan.icon
          const config = statusConfig[loan.status]
          const progress = calculateProgress(loan.currentBalance, loan.originalAmount)
          const isOverdue = loan.status === 'behind'

          return (
            <Card key={loan.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Loan Header Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2.5 rounded-lg bg-muted">
                        <Icon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{loan.name}</h3>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="size-3 mr-1" />
                              {config.label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{loan.servicer}</p>
                      </div>
                    </div>

                    {/* Balance - Right Aligned */}
                    <div className="text-right">
                      <p className="text-2xl font-bold">${formatCurrency(loan.currentBalance)}</p>
                      <p className="text-sm text-muted-foreground">
                        {progress}% paid off
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar - Subtle and Integrated */}
                  <Progress.Root defaultValue={progress} className="w-full">
                    <Progress.Track className={`h-2 w-full ${config.trackColor} rounded-full overflow-hidden`}>
                      <Progress.Range className={`h-full ${config.progressColor} transition-all duration-500 ease-out rounded-full`} />
                    </Progress.Track>
                  </Progress.Root>

                  {/* Details Row - Clean Grid */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex gap-6">
                      <div>
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-semibold ml-1.5">{loan.interestRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment:</span>
                        <span className="font-semibold ml-1.5">${formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-semibold ml-1.5 capitalize">{loan.type}</span>
                      </div>
                    </div>
                    <div className={isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-muted-foreground'}>
                      Due {formatDate(loan.nextPaymentDate)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Simple Summary Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        Managing {loans.length} student loans across {new Set(loans.map(l => l.servicer)).size} servicers
      </div>
    </div>
  )
}
