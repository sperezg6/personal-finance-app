'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@ark-ui/react/progress"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Building2 } from "lucide-react"

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
    color: 'rgb(16 185 129)', // emerald-500
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    progressColor: 'bg-emerald-600 dark:bg-emerald-500',
    trackColor: 'bg-emerald-200 dark:bg-emerald-700',
  },
  'behind': {
    label: 'Behind',
    color: 'rgb(239 68 68)', // red-500
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    progressColor: 'bg-red-600 dark:bg-red-500',
    trackColor: 'bg-red-200 dark:bg-red-700',
  },
  'paid-off': {
    label: 'Paid Off',
    color: 'rgb(99 102 241)', // indigo-500
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-700 dark:text-indigo-400',
    progressColor: 'bg-indigo-600 dark:bg-indigo-500',
    trackColor: 'bg-indigo-200 dark:bg-indigo-700',
  },
}

export function LoanList() {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const calculateProgress = (current: number, original: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {loans.map((loan) => {
        const Icon = loan.icon
        const config = statusConfig[loan.status]
        const progress = calculateProgress(loan.currentBalance, loan.originalAmount)
        const paidAmount = loan.originalAmount - loan.currentBalance

        return (
          <Card key={loan.id} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      <Icon className="size-6" style={{ color: config.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{loan.name}</h3>
                      <p className="text-sm text-muted-foreground">{loan.servicer}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {loan.type === 'federal' ? 'Federal' : 'Private'}
                        </Badge>
                        <Badge
                          className={`${config.bgColor} ${config.textColor} text-xs border-0`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold">${formatCurrency(loan.currentBalance)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      of ${formatCurrency(loan.originalAmount)} original
                    </p>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Payoff Progress</span>
                    <span className="font-semibold" style={{ color: config.color }}>
                      {progress}%
                    </span>
                  </div>
                  <Progress.Root defaultValue={progress} className="w-full">
                    <Progress.Track className={`h-3 w-full ${config.trackColor} rounded-full overflow-hidden`}>
                      <Progress.Range className={`h-full ${config.progressColor} transition-all duration-500 ease-out rounded-full`} />
                    </Progress.Track>
                  </Progress.Root>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${formatCurrency(paidAmount)} paid</span>
                    <span>${formatCurrency(loan.currentBalance)} remaining</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="text-sm font-semibold mt-1">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Payment</p>
                    <p className="text-sm font-semibold mt-1">${formatCurrency(loan.monthlyPayment)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Next Payment Due</p>
                    <p className="text-sm font-semibold mt-1">{formatDate(loan.nextPaymentDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
