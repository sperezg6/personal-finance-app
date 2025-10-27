'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@ark-ui/react/progress"
import { updateBudget } from "@/lib/db/actions"
import { useRouter } from "next/navigation"
import type { BudgetWithSpending } from "@/lib/db/queries"
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

const iconMap: Record<string, React.ElementType> = {
  'utensils': Utensils,
  'car': Car,
  'gamepad': Gamepad2,
  'shopping': ShoppingBag,
  'shopping-bag': ShoppingBag,
  'zap': Zap,
  'heart': Heart,
  'home': Home,
  'dollar': DollarSign,
  'dollar-sign': DollarSign,
}

type BudgetStatus = 'healthy' | 'warning' | 'over-budget'

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

interface BudgetCardsClientProps {
  initialBudgets: BudgetWithSpending[]
}

export function BudgetCardsClient({ initialBudgets }: BudgetCardsClientProps) {
  const router = useRouter()
  const [budgets, setBudgets] = useState(initialBudgets)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = (budget: BudgetWithSpending) => {
    setEditingId(budget.id)
    setEditValue(budget.monthlyLimit.toString())
  }

  const handleSave = async (id: string) => {
    const newLimit = parseFloat(editValue)
    if (!isNaN(newLimit) && newLimit > 0) {
      setIsSaving(true)
      const result = await updateBudget(id, newLimit)
      if (!result.error) {
        // Optimistically update the UI
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
        router.refresh()
      }
      setIsSaving(false)
    }
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValue('')
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No budgets found. Create your first budget to start tracking your spending!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {budgets.map((budget) => {
        const Icon = iconMap[budget.icon] || DollarSign
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
                      disabled={isSaving}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600"
                      onClick={handleCancel}
                      disabled={isSaving}
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
                      disabled={isSaving}
                    />
                  ) : (
                    <span className="font-semibold font-mono">${budget.monthlyLimit.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold text-red-600 font-mono">${budget.spent.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground font-medium">Remaining</span>
                  <span
                    className="font-bold font-mono"
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
