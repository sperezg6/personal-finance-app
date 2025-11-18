'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@ark-ui/react/progress"
import { Trophy, Target, Zap } from "lucide-react"

interface PayoffGoal {
  title: string
  description: string
  currentValue: number
  goalValue: number
  icon: React.ElementType
  color: string
  unit: string
}

const payoffGoals: PayoffGoal[] = [
  {
    title: 'Total Paid',
    description: 'Amount repaid',
    currentValue: 20250,
    goalValue: 64500,
    icon: Trophy,
    color: 'rgb(234 179 8)', // yellow-500
    unit: '$',
  },
  {
    title: 'On-Time Payments',
    description: 'Payment streak',
    currentValue: 42,
    goalValue: 86,
    icon: Target,
    color: 'rgb(16 185 129)', // emerald-500
    unit: '',
  },
  {
    title: 'Extra Payments',
    description: 'Above minimum',
    currentValue: 3850,
    goalValue: 10000,
    icon: Zap,
    color: 'rgb(139 92 246)', // violet-500
    unit: '$',
  },
]

export function PayoffVisualization() {
  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100)
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `${unit}${value.toLocaleString()}`
    }
    return `${value}${unit}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payoff Progress Tracker</CardTitle>
        <CardDescription>
          Track your journey to becoming debt-free with these key milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {payoffGoals.map((goal, index) => {
            const IconComponent = goal.icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>
            const progress = calculateProgress(goal.currentValue, goal.goalValue)

            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                {/* Circular Progress */}
                <div className="relative">
                  <Progress.Root defaultValue={progress} className="flex flex-col items-center space-y-3">
                    <Progress.Circle className="w-32 h-32 [--size:128px] [--thickness:8px]">
                      <Progress.CircleTrack
                        className="stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="8"
                        fill="none"
                      />
                      <Progress.CircleRange
                        className="transition-all duration-500 ease-out"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        style={{ stroke: goal.color }}
                      />
                    </Progress.Circle>
                  </Progress.Root>

                  {/* Icon and Percentage in Center - positioned over the circle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div
                      className="p-2 rounded-full mb-1"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <IconComponent className="size-5" style={{ color: goal.color }} />
                    </div>
                    <span className="text-2xl font-bold" style={{ color: goal.color }}>
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                  <div className="flex items-center justify-center gap-1 text-sm font-medium">
                    <span style={{ color: goal.color }}>
                      {formatValue(goal.currentValue, goal.unit)}
                    </span>
                    <span className="text-muted-foreground">
                      / {formatValue(goal.goalValue, goal.unit)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Motivational Message */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-center text-sm font-medium text-blue-900 dark:text-blue-100">
            You have paid off <span className="font-bold">31.4%</span> of your total student loan debt.
            Keep up the great work! At this rate, you will be debt-free in <span className="font-bold">7.2 years</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
