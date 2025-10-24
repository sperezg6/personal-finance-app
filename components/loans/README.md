# Student Loan Components

This directory contains all components for the student loan tracking feature.

## Components

### 1. LoanSummary (`loan-summary.tsx`)

Summary cards displaying key loan metrics at the top of the page.

**Displays:**
- Total Debt across all loans
- Monthly Payment (required minimum)
- Interest Paid (year-to-date)
- Estimated Payoff Date

**Usage:**
```tsx
import { LoanSummary } from "@/components/loans/loan-summary"

<LoanSummary />
```

**Styling:**
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Hover effects: shadow and lift animation
- Color-coded icons matching metric types

---

### 2. LoanList (`loan-list.tsx`)

Individual loan cards with detailed information and progress tracking.

**Features:**
- Linear progress bars showing payoff progress
- Status badges (On Track, Behind, Paid Off)
- Loan type badges (Federal, Private)
- Key metrics: interest rate, monthly payment, next due date
- Color-coded by status

**Usage:**
```tsx
import { LoanList } from "@/components/loans/loan-list"

<LoanList />
```

**Data Structure:**
```typescript
const loan = {
  id: '1',
  name: 'Federal Subsidized',
  servicer: 'Great Lakes',
  type: 'federal', // or 'private'
  status: 'on-track', // or 'behind' or 'paid-off'
  originalAmount: 18500,
  currentBalance: 12350,
  interestRate: 4.53,
  monthlyPayment: 185,
  nextPaymentDate: '2025-02-15',
  icon: GraduationCap,
}
```

**Customization:**
To add more loans, edit the `loans` array in the component:
```tsx
const loans: Loan[] = [
  // Add your loan data here
]
```

---

### 3. PayoffVisualization (`payoff-visualization.tsx`)

Circular progress indicators for tracking key milestones and motivation.

**Displays:**
- Total Paid (amount repaid)
- On-Time Payments (payment streak)
- Extra Payments (above minimum)
- Motivational progress message

**Usage:**
```tsx
import { PayoffVisualization } from "@/components/loans/payoff-visualization"

<PayoffVisualization />
```

**Features:**
- Animated circular progress rings
- Centered icons and percentages
- Color-coded by goal type
- Responsive layout (stacks on mobile)

---

## Color Reference

### Status Colors

| Status | Primary Color | Usage |
|--------|---------------|-------|
| On Track | `rgb(16 185 129)` (Emerald) | Payments are current |
| Behind | `rgb(239 68 68)` (Red) | Late/missed payments |
| Paid Off | `rgb(99 102 241)` (Indigo) | Loan fully repaid |

### Metric Colors

| Metric | Color | RGB Value |
|--------|-------|-----------|
| Total Debt | Red | `rgb(239 68 68)` |
| Monthly Payment | Orange | `rgb(249 115 22)` |
| Interest Paid | Violet | `rgb(139 92 246)` |
| Payoff Date | Blue | `rgb(59 130 246)` |
| Total Paid | Yellow | `rgb(234 179 8)` |

---

## Utilities & Helpers

### Format Currency
```typescript
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
```

### Calculate Progress
```typescript
const calculateProgress = (current: number, original: number) => {
  return Math.round(((original - current) / original) * 100)
}
```

### Format Date
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
```

---

## Dependencies

These components require:
- `@ark-ui/react` - Progress components
- `lucide-react` - Icons
- `@/components/ui/card` - Card components
- `@/components/ui/badge` - Badge components

---

## Replacing Sample Data

### Step 1: Create API Service
```typescript
// services/loanService.ts
export async function fetchUserLoans() {
  const response = await fetch('/api/loans')
  return response.json()
}
```

### Step 2: Update LoanList Component
```tsx
'use client'
import { useState, useEffect } from 'react'
import { fetchUserLoans } from '@/services/loanService'

export function LoanList() {
  const [loans, setLoans] = useState<Loan[]>([])

  useEffect(() => {
    fetchUserLoans().then(setLoans)
  }, [])

  // ... rest of component
}
```

### Step 3: Update Summary Calculations
```tsx
export function LoanSummary() {
  const [metrics, setMetrics] = useState<LoanSummaryMetrics>()

  useEffect(() => {
    fetchLoanSummary().then(setMetrics)
  }, [])

  // ... rest of component
}
```

---

## Customization Examples

### Adding a New Status
```typescript
// In loan-list.tsx
const statusConfig = {
  // ... existing statuses
  'deferred': {
    label: 'Deferred',
    color: 'rgb(59 130 246)', // blue-500
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    progressColor: 'bg-blue-600 dark:bg-blue-500',
    trackColor: 'bg-blue-200 dark:bg-blue-700',
  },
}
```

### Adding a New Metric Card
```typescript
// In loan-summary.tsx
const summaryCards: SummaryCard[] = [
  // ... existing cards
  {
    title: 'Average Interest Rate',
    period: 'Weighted average',
    value: '5.2%',
    icon: Percent,
    color: 'rgb(234 88 12)', // orange-600
  }
]
```

### Adding a New Goal
```typescript
// In payoff-visualization.tsx
const payoffGoals: PayoffGoal[] = [
  // ... existing goals
  {
    title: 'Refinance Savings',
    description: 'Interest saved',
    currentValue: 1250,
    goalValue: 5000,
    icon: DollarSign,
    color: 'rgb(34 197 94)', // green-500
    unit: '$',
  },
]
```

---

## Accessibility

All components follow WCAG 2.1 AA guidelines:
- Semantic HTML structure
- ARIA labels on progress components
- Keyboard navigation support
- Sufficient color contrast ratios
- Dark mode support
- Focus indicators on interactive elements

---

## Testing Checklist

- [ ] All loan cards display correctly
- [ ] Progress bars animate smoothly
- [ ] Status colors match design
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Dark mode displays properly
- [ ] Hover effects work on cards
- [ ] Numbers format correctly (currency, percentages, dates)
- [ ] Icons display correctly
- [ ] Badges show appropriate colors
- [ ] Circular progress animates on scroll

---

## Support

For questions or issues, refer to:
- Main design documentation: `/LOAN_TRACKING_DESIGN.md`
- Type definitions: `/types/loans.ts`
- Example usage: `/app/loans/page.tsx`
