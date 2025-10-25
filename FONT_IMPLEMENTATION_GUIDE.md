# Font Pairing Implementation Guide
## Quick Reference for Personal Finance App

---

## Visual Hierarchy Examples

### Example 1: Net Worth Page Header

```tsx
// Using Inter + JetBrains Mono
<div className="space-y-4">
  <h1 className="font-sans text-4xl font-bold tracking-tight">
    Net Worth Tracker
  </h1>
  <p className="font-sans text-base text-muted-foreground">
    Monitor your financial health and wealth over time
  </p>
</div>

// Net Worth Display
<div className="text-center space-y-4">
  <div className="font-sans text-lg font-medium text-muted-foreground">
    Your Net Worth
  </div>
  <div className="font-mono text-6xl font-bold tabular-nums bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
    $83,450
  </div>
  <div className="flex items-center justify-center gap-2">
    <TrendingUp className="h-5 w-5 text-emerald-600" />
    <span className="font-sans text-lg font-semibold text-emerald-600">
      +$<span className="font-mono tabular-nums">3,250</span> (4.05%) this month
    </span>
  </div>
</div>
```

### Example 2: Summary Cards

```tsx
// Financial Summary Card Component
<Card className="transition-all hover:shadow-lg hover:-translate-y-1">
  <CardContent className="space-y-5">
    {/* Header with icon and title */}
    <div className="flex items-center gap-2">
      <TrendingUp className="size-5 text-emerald-500" />
      <span className="font-sans text-base font-semibold">Total Assets</span>
    </div>

    {/* Value section */}
    <div className="flex items-end gap-2.5 justify-between">
      <div className="flex flex-col gap-1">
        <div className="font-sans text-sm text-muted-foreground">
          Current value
        </div>
        <div className="font-mono text-3xl font-bold tracking-tight tabular-nums">
          $125,750.00
        </div>
      </div>

      {/* Optional percentage badge */}
      <div className="font-mono text-sm font-semibold text-emerald-600 tabular-nums">
        +4.05%
      </div>
    </div>
  </CardContent>
</Card>
```

### Example 3: Transaction Table

```tsx
// Transaction Table with Proper Typography
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="font-sans font-semibold">Date</TableHead>
      <TableHead className="font-sans font-semibold">Description</TableHead>
      <TableHead className="font-sans font-semibold">Category</TableHead>
      <TableHead className="font-sans font-semibold text-right">Amount</TableHead>
      <TableHead className="font-sans font-semibold">Type</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-sans font-medium text-sm">
        2025-01-15
      </TableCell>
      <TableCell className="font-sans">
        Grocery Shopping
      </TableCell>
      <TableCell className="font-sans text-sm text-muted-foreground">
        Food & Dining
      </TableCell>
      <TableCell className="font-mono text-right font-semibold tabular-nums">
        <span className="text-red-600">-$125.50</span>
      </TableCell>
      <TableCell>
        <Badge className="font-sans text-xs">
          <ArrowDownRight className="size-3 mr-1" />
          expense
        </Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Example 4: Budget Progress Card

```tsx
// Budget Category Card
<Card>
  <CardContent className="p-6 space-y-4">
    {/* Category Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100">
          <ShoppingBag className="size-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-sans text-base font-semibold">Food & Dining</h3>
          <p className="font-sans text-sm text-muted-foreground">Monthly budget</p>
        </div>
      </div>
      <DropdownMenu>...</DropdownMenu>
    </div>

    {/* Amount Display */}
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-2xl font-bold tabular-nums">$487</span>
        <span className="font-sans text-sm text-muted-foreground">
          of <span className="font-mono tabular-nums">$600</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: '81.2%' }}
        />
      </div>

      {/* Remaining */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-muted-foreground">Remaining</span>
        <span className="font-mono text-sm font-semibold text-emerald-600 tabular-nums">
          $113.00
        </span>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Font Pairing Quick Reference Table

| Element | Font Family | Weight | Size | Use Case |
|---------|------------|--------|------|----------|
| Page Title (H1) | Sans | Bold (700) | 2.25rem (36px) | Main page headers |
| Section Header (H2) | Sans | Semibold (600) | 1.5rem (24px) | Section divisions |
| Card Title (H3) | Sans | Semibold (600) | 1.125rem (18px) | Card headers |
| Body Text | Sans | Regular (400) | 1rem (16px) | Descriptions, paragraphs |
| Label | Sans | Medium (500) | 0.875rem (14px) | Form labels, captions |
| Large Financial | Mono | Bold (700) | 3.75rem (60px) | Hero numbers (Net Worth) |
| Medium Financial | Mono | Bold (700) | 1.875rem (30px) | Card values |
| Small Financial | Mono | Semibold (600) | 0.875rem (14px) | Table cells, small metrics |
| Percentage | Mono | Semibold (600) | 0.875rem (14px) | Growth indicators |
| Button Text | Sans | Medium (500) | 0.875rem (14px) | Action buttons |

---

## Responsive Typography Scale

```css
/* Mobile First Typography */
:root {
  /* Base scale for mobile */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-6xl: 3rem;        /* 48px - reduced on mobile */
}

/* Tablet and up */
@media (min-width: 768px) {
  :root {
    --text-4xl: 2.5rem;    /* 40px */
    --text-6xl: 3.75rem;   /* 60px */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --text-4xl: 2.75rem;   /* 44px */
    --text-6xl: 4rem;      /* 64px */
  }
}
```

---

## CSS Utility Classes

```css
/* app/globals.css - Add these utility classes */

/* Financial number formatting */
.financial-large {
  font-family: var(--font-mono);
  font-size: 3.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.025em;
  line-height: 1;
}

.financial-medium {
  font-family: var(--font-mono);
  font-size: 1.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.financial-small {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
}

/* Currency formatting */
.currency {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.currency::before {
  content: '$';
  margin-right: 0.125em;
}

/* Percentage formatting */
.percentage {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.percentage::after {
  content: '%';
  margin-left: 0.0625em;
}

/* Positive/Negative indicators */
.amount-positive {
  color: rgb(16 185 129); /* emerald-500 */
  font-weight: 600;
}

.amount-negative {
  color: rgb(239 68 68); /* red-500 */
  font-weight: 600;
}

/* Tabular alignment helper */
.tabular {
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}

/* Heading optimization */
.heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.heading-2 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.heading-3 {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.3;
}

/* Body text optimization */
.body-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.011em;
}

.body-text-sm {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.006em;
}
```

---

## Component-Specific Implementations

### NavBar Typography

```tsx
<nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur">
  <div className="container mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <div className="font-sans text-xl font-bold tracking-tight">
      Finance<span className="text-emerald-600">App</span>
    </div>

    {/* Nav Links */}
    <div className="flex items-center gap-6">
      <a className="font-sans text-sm font-medium hover:text-primary transition-colors">
        Dashboard
      </a>
      <a className="font-sans text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Net Worth
      </a>
      <a className="font-sans text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Budget
      </a>
      <a className="font-sans text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        Transactions
      </a>
    </div>

    {/* User Menu */}
    <Button className="font-sans font-medium text-sm">
      Sign In
    </Button>
  </div>
</nav>
```

### Dashboard Summary Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {summaryStats.map((stat) => (
    <Card key={stat.title} className="hover:shadow-lg transition-all">
      <CardContent className="p-6 space-y-4">
        {/* Icon + Title Row */}
        <div className="flex items-center gap-2">
          <stat.icon className="size-5" style={{ color: stat.color }} />
          <h3 className="font-sans text-sm font-semibold">{stat.title}</h3>
        </div>

        {/* Value Display */}
        <div className="space-y-1">
          <p className="font-sans text-xs text-muted-foreground">
            {stat.period}
          </p>
          <p className="font-mono text-3xl font-bold tabular-nums tracking-tight">
            {stat.value}
          </p>
        </div>

        {/* Change Indicator */}
        {stat.change && (
          <div className="flex items-center gap-1">
            <TrendingUp className="size-4 text-emerald-600" />
            <span className="font-mono text-sm font-semibold text-emerald-600 tabular-nums">
              {stat.change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
```

### Form Input Typography

```tsx
<div className="space-y-2">
  <Label className="font-sans text-sm font-medium">
    Transaction Amount
  </Label>
  <Input
    type="text"
    placeholder="$0.00"
    className="font-mono text-base tabular-nums"
  />
  <p className="font-sans text-xs text-muted-foreground">
    Enter the transaction amount in USD
  </p>
</div>

<div className="space-y-2">
  <Label className="font-sans text-sm font-medium">
    Category
  </Label>
  <Select>
    <SelectTrigger className="font-sans">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food" className="font-sans">
        Food & Dining
      </SelectItem>
      <SelectItem value="transport" className="font-sans">
        Transportation
      </SelectItem>
    </SelectContent>
  </Select>
</div>
```

---

## Color & Typography Pairing

### Success States (Income, Positive Growth)

```tsx
<div className="space-y-2">
  <span className="font-sans text-sm font-medium text-emerald-700">
    Total Income
  </span>
  <div className="font-mono text-2xl font-bold text-emerald-600 tabular-nums">
    +$5,750.00
  </div>
  <p className="font-sans text-xs text-emerald-600">
    <span className="font-mono tabular-nums">↑ 12.5%</span> vs last month
  </p>
</div>
```

### Error States (Expenses, Negative Changes)

```tsx
<div className="space-y-2">
  <span className="font-sans text-sm font-medium text-red-700">
    Total Expenses
  </span>
  <div className="font-mono text-2xl font-bold text-red-600 tabular-nums">
    -$3,247.00
  </div>
  <p className="font-sans text-xs text-red-600">
    <span className="font-mono tabular-nums">↑ 8.3%</span> vs last month
  </p>
</div>
```

### Neutral States (General Information)

```tsx
<div className="space-y-2">
  <span className="font-sans text-sm font-medium text-muted-foreground">
    Net Balance
  </span>
  <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
    $2,503.00
  </div>
  <p className="font-sans text-xs text-muted-foreground">
    Updated <span className="font-mono">2 hours ago</span>
  </p>
</div>
```

---

## A/B Testing Template

Use this component to test different font pairings side-by-side:

```tsx
// components/FontComparisonDemo.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

type FontPairing = {
  name: string
  primary: string
  mono: string
  cssVars: {
    sans: string
    mono: string
  }
}

const fontPairings: FontPairing[] = [
  {
    name: 'Inter + JetBrains Mono',
    primary: 'Inter',
    mono: 'JetBrains Mono',
    cssVars: {
      sans: 'var(--font-inter)',
      mono: 'var(--font-jetbrains-mono)',
    }
  },
  {
    name: 'DM Sans + IBM Plex Mono',
    primary: 'DM Sans',
    mono: 'IBM Plex Mono',
    cssVars: {
      sans: 'var(--font-dm-sans)',
      mono: 'var(--font-ibm-plex-mono)',
    }
  },
  // Add other pairings...
]

export function FontComparisonDemo() {
  const [selectedPairing, setSelectedPairing] = useState(0)
  const pairing = fontPairings[selectedPairing]

  return (
    <div className="space-y-6">
      {/* Font Selector */}
      <div className="flex gap-2">
        {fontPairings.map((pair, index) => (
          <button
            key={pair.name}
            onClick={() => setSelectedPairing(index)}
            className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors
              ${index === selectedPairing
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'}`}
          >
            {pair.name}
          </button>
        ))}
      </div>

      {/* Preview Card */}
      <Card style={{
        fontFamily: pairing.cssVars.sans
      }}>
        <CardContent className="p-8 space-y-6">
          <h1 className="text-4xl font-bold">Net Worth Tracker</h1>
          <p className="text-muted-foreground">
            Monitor your financial health and wealth over time
          </p>

          <div
            className="text-6xl font-bold tabular-nums"
            style={{ fontFamily: pairing.cssVars.mono }}
          >
            $83,450.00
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ fontFamily: pairing.cssVars.mono }}
              >
                $125,750
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Liabilities</p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ fontFamily: pairing.cssVars.mono }}
              >
                $42,300
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Change</p>
              <p
                className="text-2xl font-bold tabular-nums text-emerald-600"
                style={{ fontFamily: pairing.cssVars.mono }}
              >
                +$3,250
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Performance Optimization Tips

### 1. Font Loading Strategy

```typescript
// app/layout.tsx - Optimal configuration
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",           // Prevent invisible text
  preload: true,             // Preload critical fonts
  fallback: ['system-ui', 'arial'],  // System fallback
  adjustFontFallback: true,  // Reduce layout shift
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['monospace'],
  adjustFontFallback: true,
});
```

### 2. Subset Optimization

For better performance, only load required character sets:

```typescript
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // Only include needed weights
  weight: ["400", "500", "600", "700"],
});
```

### 3. Critical CSS Inline

```html
<!-- In app/layout.tsx head section -->
<head>
  <style dangerouslySetInnerHTML={{
    __html: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
    `
  }} />
</head>
```

### 4. Font Feature Settings

```css
/* Enable OpenType features for better rendering */
body {
  font-feature-settings:
    "kern" 1,        /* Kerning */
    "liga" 1,        /* Ligatures */
    "calt" 1;        /* Contextual alternates */
}

.financial-data {
  font-feature-settings:
    "tnum" 1,        /* Tabular numbers */
    "lnum" 1,        /* Lining numbers */
    "zero" 1;        /* Slashed zero (if available) */
}
```

---

## Accessibility Checklist

- [ ] Minimum font size of 14px for body text
- [ ] Minimum font size of 12px for secondary text
- [ ] Line height of at least 1.5 for body text
- [ ] Contrast ratio of 4.5:1 for normal text
- [ ] Contrast ratio of 3:1 for large text (18px+)
- [ ] Tabular numbers for all financial data
- [ ] Consistent font weights across similar elements
- [ ] Proper heading hierarchy (H1 > H2 > H3)
- [ ] Focus indicators visible with current typography
- [ ] Text remains readable when zoomed to 200%

---

## Browser Testing Checklist

Test typography rendering across:

- [ ] Chrome/Edge (Chromium) - Windows
- [ ] Chrome - macOS
- [ ] Safari - macOS
- [ ] Safari - iOS
- [ ] Firefox - Windows
- [ ] Firefox - macOS
- [ ] Chrome - Android
- [ ] Samsung Internet

---

## Common Issues & Solutions

### Issue: Numbers Not Aligning in Tables

**Solution:** Apply `tabular-nums` class
```tsx
<TableCell className="font-mono tabular-nums text-right">
  ${amount}
</TableCell>
```

### Issue: Font Flash on Page Load

**Solution:** Use `font-display: swap` and system font fallback
```typescript
const inter = Inter({
  display: "swap",
  fallback: ['system-ui', 'arial'],
});
```

### Issue: Large Numbers Overflow on Mobile

**Solution:** Use responsive font sizes
```css
.financial-display {
  font-size: clamp(2rem, 8vw, 4rem);
}
```

### Issue: Poor Rendering on Windows

**Solution:** Enable font smoothing
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

---

## Quick Implementation Script

Run this to quickly test a new font pairing:

```bash
# 1. Install fonts (if using npm packages)
npm install @fontsource/inter @fontsource/jetbrains-mono

# 2. Update layout.tsx with new fonts
# 3. Update globals.css with new CSS variables
# 4. Add utility classes for financial data
# 5. Test on key pages: dashboard, transactions, net worth
# 6. Run Lighthouse audit
npm run build && npm run start
# Navigate to http://localhost:3000 and run Lighthouse

# 7. Check bundle size
npm run build
# Look for font files in .next/static/
```

---

This implementation guide provides practical, copy-paste ready code for implementing any of the proposed font pairings in the Personal Finance App.
