'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@ark-ui/react/progress"
import { Budget, BudgetStatus } from "@/types"
import {
  Utensils,
  Car,
  Gamepad2,
  ShoppingBag,
  Zap,
  Heart,
  Home,
  DollarSign,
  Pencil,
  Check,
  X
} from "lucide-react"

const iconMap: Record<string, any> = {
  'utensils': Utensils,
  'car': Car,
  'gamepad': Gamepad2,
  'shopping': ShoppingBag,
  'zap': Zap,
  'heart': Heart,
  'home': Home,
  'dollar': DollarSign,
}

const initialBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    monthlyLimit: 1200,
    spent: 847.50,
    remaining: 352.50,
    percentage: 70.6,
    color: 'rgb(239 68 68)', // red-500
    icon: 'utensils',
  },
  {
    id: '2',
    category: 'Transport',
    monthlyLimit: 800,
    spent: 656.25,
    remaining: 143.75,
    percentage: 82.0,
    color: 'rgb(59 130 246)', // blue-500
    icon: 'car',
  },
  {
    id: '3',
    category: 'Entertainment',
    monthlyLimit: 500,
    spent: 524.75,
    remaining: -24.75,
    percentage: 105.0,
    color: 'rgb(139 92 246)', // violet-500
    icon: 'gamepad',
  },
  {
    id: '4',
    category: 'Shopping',
    monthlyLimit: 600,
    spent: 382.30,
    remaining: 217.70,
    percentage: 63.7,
    color: 'rgb(249 115 22)', // orange-500
    icon: 'shopping',
  },
  {
    id: '5',
    category: 'Utilities',
    monthlyLimit: 400,
    spent: 345.99,
    remaining: 54.01,
    percentage: 86.5,
    color: 'rgb(16 185 129)', // emerald-500
    icon: 'zap',
  },
  {
    id: '6',
    category: 'Healthcare',
    monthlyLimit: 300,
    spent: 190.50,
    remaining: 109.50,
    percentage: 63.5,
    color: 'rgb(99 102 241)', // indigo-500
    icon: 'heart',
  },
  {
    id: '7',
    category: 'Rent',
    monthlyLimit: 1500,
    spent: 1500.00,
    remaining: 0,
    percentage: 100.0,
    color: 'rgb(234 179 8)', // yellow-500
    icon: 'home',
  },
  {
    id: '8',
    category: 'Other',
    monthlyLimit: 200,
    spent: 299.71,
    remaining: -99.71,
    percentage: 149.9,
    color: 'rgb(156 163 175)', // gray-400
    icon: 'dollar',
  },
]

const getBudgetStatus = (percentage: number): BudgetStatus => {
  if (percentage >= 100) return 'over-budget'
  if (percentage >= 80) return 'warning'
  return 'healthy'
}

const getStatusColor = (status: BudgetStatus): string => {
  switch (status) {
    case 'healthy': return 'rgb(16 185 129)' // emerald-500
    case 'warning': return 'rgb(234 179 8)' // yellow-500
    case 'over-budget': return 'rgb(239 68 68)' // red-500
  }
}

export function BudgetCards() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id)
    setEditValue(budget.monthlyLimit.toString())
  }

  const handleSave = (id: string) => {
    const newLimit = parseFloat(editValue)
    if (!isNaN(newLimit) && newLimit > 0) {
      setBudgets(budgets.map(b => {
        if (b.id === id) {
          const remaining = newLimit - b.spent
          const percentage = (b.spent / newLimit) * 100
          return {
            ...b,
            monthlyLimit: newLimit,
            remaining,
            percentage
          }
        }
        return b
      }))
    }
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {budgets.map((budget) => {
        const Icon = iconMap[budget.icon]
        const status = getBudgetStatus(budget.percentage)
        const statusColor = getStatusColor(status)
        const isEditing = editingId === budget.id

        return (
          <Card key={budget.id} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="size-5" style={{ color: budget.color }} />
                  <CardTitle className="text-base">{budget.category}</CardTitle>
                </div>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(budget)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-emerald-600"
                      onClick={() => handleSave(budget.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Circular Progress */}
              <div className="flex justify-center">
                <Progress.Root value={Math.min(budget.percentage, 100)} className="relative">
                  <Progress.Circle
                    className="relative"
                    style={{
                      width: '140px',
                      height: '140px',
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <Progress.CircleTrack asChild>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={statusColor}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(budget.percentage, 100) / 100)}`}
                          style={{
                            transition: 'stroke-dashoffset 0.5s ease',
                          }}
                        />
                      </Progress.CircleTrack>
                    </svg>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold" style={{ color: statusColor }}>
                        {budget.percentage.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">used</div>
                    </div>
                  </Progress.Circle>
                </Progress.Root>
              </div>

              {/* Budget Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-7 w-24 text-right"
                      autoFocus
                    />
                  ) : (
                    <span className="font-semibold">${budget.monthlyLimit.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold text-red-600">${budget.spent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground font-medium">Remaining</span>
                  <span
                    className="font-bold"
                    style={{
                      color: budget.remaining >= 0 ? 'rgb(16 185 129)' : 'rgb(239 68 68)'
                    }}
                  >
                    ${Math.abs(budget.remaining).toFixed(2)}
                    {budget.remaining < 0 && ' over'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
