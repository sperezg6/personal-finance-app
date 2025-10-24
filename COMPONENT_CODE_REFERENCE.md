# Component Code Reference

This document provides the exact implementation code for the progress components used in the student loan tracking page.

---

## Linear Progress Bar Implementation

**Component**: `@ark-ui/react` Progress
**Location**: Individual loan cards in `/components/loans/loan-list.tsx`
**Purpose**: Shows payoff progress for each loan

### Basic Implementation (As Requested)
```tsx
import { Progress } from "@ark-ui/react/progress";

<Progress.Root defaultValue={65} className="w-full max-w-sm mx-auto">
  <Progress.Track className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <Progress.Range className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out rounded-full" />
  </Progress.Track>
</Progress.Root>
```

### Enhanced Implementation (What Was Built)
```tsx
<Progress.Root defaultValue={progress} className="w-full">
  <Progress.Track className={`h-3 w-full ${config.trackColor} rounded-full overflow-hidden`}>
    <Progress.Range className={`h-full ${config.progressColor} transition-all duration-500 ease-out rounded-full`} />
  </Progress.Track>
</Progress.Root>
```

**Enhancements Made**:
1. Dynamic progress value based on loan data
2. Status-based color coding (emerald/red/indigo)
3. 3px height for better visibility
4. 500ms transition for smoother animations
5. Full-width responsive design

**Example with Context**:
```tsx
const progress = calculateProgress(loan.currentBalance, loan.originalAmount)
const config = statusConfig[loan.status]

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
```

---

## Circular Progress Implementation

**Component**: `@ark-ui/react` Progress.Circle
**Location**: Payoff visualization in `/components/loans/payoff-visualization.tsx`
**Purpose**: Shows milestone achievement progress

### Basic Implementation (As Requested)
```tsx
<Progress.Root defaultValue={75} className="flex flex-col items-center space-y-2">
  <Progress.Circle className="w-16 h-16 [--size:64px] [--thickness:4px]">
    <Progress.CircleTrack className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="4" fill="none" />
    <Progress.CircleRange className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-300 ease-out" strokeWidth="4" fill="none" strokeLinecap="round" />
  </Progress.Circle>
</Progress.Root>
```

### Enhanced Implementation (What Was Built)
```tsx
<Progress.Root defaultValue={progress} className="flex flex-col items-center space-y-3">
  <Progress.Circle className="w-32 h-32 [--size:128px] [--thickness:8px] relative">
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

    {/* Icon and Percentage in Center */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div
        className="p-2 rounded-full mb-1"
        style={{ backgroundColor: `${goal.color}20` }}
      >
        <Icon className="size-5" style={{ color: goal.color }} />
      </div>
      <span className="text-2xl font-bold" style={{ color: goal.color }}>
        {progress}%
      </span>
    </div>
  </Progress.Circle>
</Progress.Root>
```

**Enhancements Made**:
1. Larger size (128px vs 64px) for better visibility
2. Thicker stroke (8px vs 4px) for emphasis
3. Dynamic color based on goal type
4. Centered icon and percentage display
5. 500ms smooth animation
6. Absolute positioned content overlay

**Example with Full Context**:
```tsx
const progress = calculateProgress(goal.currentValue, goal.goalValue)
const Icon = goal.icon

<div className="flex flex-col items-center text-center space-y-4">
  {/* Circular Progress */}
  <Progress.Root defaultValue={progress} className="flex flex-col items-center space-y-3">
    <Progress.Circle className="w-32 h-32 [--size:128px] [--thickness:8px] relative">
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

      {/* Icon and Percentage in Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="p-2 rounded-full mb-1"
          style={{ backgroundColor: `${goal.color}20` }}
        >
          <Icon className="size-5" style={{ color: goal.color }} />
        </div>
        <span className="text-2xl font-bold" style={{ color: goal.color }}>
          {progress}%
        </span>
      </div>
    </Progress.Circle>
  </Progress.Root>

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
```

---

## Color Variations

### Linear Progress Colors

**On Track Status** (Emerald - Success)
```tsx
const config = {
  progressColor: 'bg-emerald-600 dark:bg-emerald-500',
  trackColor: 'bg-emerald-200 dark:bg-emerald-700',
}
```

**Behind Status** (Red - Alert)
```tsx
const config = {
  progressColor: 'bg-red-600 dark:bg-red-500',
  trackColor: 'bg-red-200 dark:bg-red-700',
}
```

**Paid Off Status** (Indigo - Achievement)
```tsx
const config = {
  progressColor: 'bg-indigo-600 dark:bg-indigo-500',
  trackColor: 'bg-indigo-200 dark:bg-indigo-700',
}
```

### Circular Progress Colors

**Total Paid** (Yellow - Achievement)
```tsx
<Progress.CircleRange
  style={{ stroke: 'rgb(234 179 8)' }}
  strokeWidth="8"
  fill="none"
  strokeLinecap="round"
/>
```

**On-Time Payments** (Emerald - Consistency)
```tsx
<Progress.CircleRange
  style={{ stroke: 'rgb(16 185 129)' }}
  strokeWidth="8"
  fill="none"
  strokeLinecap="round"
/>
```

**Extra Payments** (Violet - Bonus)
```tsx
<Progress.CircleRange
  style={{ stroke: 'rgb(139 92 246)' }}
  strokeWidth="8"
  fill="none"
  strokeLinecap="round"
/>
```

---

## Helper Functions

### Calculate Progress Percentage
```typescript
const calculateProgress = (current: number, original: number) => {
  return Math.round(((original - current) / original) * 100)
}

// Usage
const progress = calculateProgress(12350, 18500) // Returns 33
```

### Format Currency
```typescript
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Usage
formatCurrency(12350) // Returns "12,350.00"
```

### Format Value with Unit
```typescript
const formatValue = (value: number, unit: string) => {
  if (unit === '$') {
    return `${unit}${value.toLocaleString()}`
  }
  return `${value}${unit}`
}

// Usage
formatValue(20250, '$') // Returns "$20,250"
formatValue(42, '')     // Returns "42"
```

---

## Animation Configurations

### Linear Progress Animation
```tsx
className="transition-all duration-500 ease-out"
```
- **Duration**: 500ms
- **Easing**: ease-out (starts fast, ends slow)
- **Properties**: All (width changes for progress)

### Circular Progress Animation
```tsx
className="transition-all duration-500 ease-out"
```
- **Duration**: 500ms
- **Easing**: ease-out
- **Properties**: Stroke dasharray/offset for circular animation

### Card Hover Animation
```tsx
className="transition-all hover:shadow-lg hover:-translate-y-1"
```
- **Duration**: 300ms (default)
- **Effects**: Shadow increase + 4px lift
- **Trigger**: Mouse hover

---

## Responsive Sizing

### Linear Progress
```tsx
// Mobile
<Progress.Track className="h-3 w-full" />  // Full width, 3px height

// Tablet
// Same as mobile (scales naturally)

// Desktop
// Same as mobile (scales naturally)
```

### Circular Progress
```tsx
// All Breakpoints (Consistent)
<Progress.Circle className="w-32 h-32 [--size:128px] [--thickness:8px]" />
```

---

## Dark Mode Support

### Linear Progress
```tsx
// Light Mode
<Progress.Track className="bg-emerald-200" />
<Progress.Range className="bg-emerald-600" />

// Dark Mode
<Progress.Track className="dark:bg-emerald-700" />
<Progress.Range className="dark:bg-emerald-500" />
```

### Circular Progress
```tsx
// Light Mode
<Progress.CircleTrack className="stroke-gray-200" />

// Dark Mode
<Progress.CircleTrack className="dark:stroke-gray-700" />
```

---

## Complete Working Examples

### Example 1: Simple Linear Progress
```tsx
import { Progress } from "@ark-ui/react/progress"

export function SimpleLoanProgress() {
  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-medium mb-2">Loan Payoff Progress</p>
      <Progress.Root defaultValue={65} className="w-full">
        <Progress.Track className="h-3 w-full bg-emerald-200 dark:bg-emerald-700 rounded-full overflow-hidden">
          <Progress.Range className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500 ease-out rounded-full" />
        </Progress.Track>
      </Progress.Root>
      <p className="text-xs text-muted-foreground mt-1">65% paid off</p>
    </div>
  )
}
```

### Example 2: Circular Progress with Icon
```tsx
import { Progress } from "@ark-ui/react/progress"
import { Trophy } from "lucide-react"

export function AchievementProgress() {
  const progress = 75
  const color = 'rgb(234 179 8)' // Yellow

  return (
    <div className="flex flex-col items-center space-y-3">
      <Progress.Root defaultValue={progress}>
        <Progress.Circle className="w-32 h-32 [--size:128px] [--thickness:8px] relative">
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
            style={{ stroke: color }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
              <Trophy className="size-5" style={{ color }} />
            </div>
            <span className="text-2xl font-bold" style={{ color }}>
              {progress}%
            </span>
          </div>
        </Progress.Circle>
      </Progress.Root>
      <p className="text-sm font-semibold">Total Paid</p>
    </div>
  )
}
```

### Example 3: Multiple Status Progress Bars
```tsx
import { Progress } from "@ark-ui/react/progress"

const loans = [
  { name: 'Federal Loan', progress: 65, status: 'on-track' },
  { name: 'Private Loan', progress: 45, status: 'behind' },
]

const statusColors = {
  'on-track': {
    track: 'bg-emerald-200 dark:bg-emerald-700',
    range: 'bg-emerald-600 dark:bg-emerald-500',
  },
  'behind': {
    track: 'bg-red-200 dark:bg-red-700',
    range: 'bg-red-600 dark:bg-red-500',
  },
}

export function MultiLoanProgress() {
  return (
    <div className="space-y-4">
      {loans.map((loan, index) => {
        const colors = statusColors[loan.status]
        return (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span>{loan.name}</span>
              <span className="font-semibold">{loan.progress}%</span>
            </div>
            <Progress.Root defaultValue={loan.progress} className="w-full">
              <Progress.Track className={`h-3 w-full ${colors.track} rounded-full overflow-hidden`}>
                <Progress.Range className={`h-full ${colors.range} transition-all duration-500 ease-out rounded-full`} />
              </Progress.Track>
            </Progress.Root>
          </div>
        )
      })}
    </div>
  )
}
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install @ark-ui/react
```

### 2. Import Components
```tsx
import { Progress } from "@ark-ui/react/progress"
```

### 3. Use in Your Components
See examples above for usage patterns.

---

## Accessibility Notes

All progress components include:
- Semantic HTML structure
- ARIA attributes automatically handled by @ark-ui/react
- Keyboard navigation support (built-in)
- Screen reader announcements
- Color contrast compliant (WCAG 2.1 AA)

---

**Last Updated**: 2025-10-22
**Component Library**: @ark-ui/react v3.x
