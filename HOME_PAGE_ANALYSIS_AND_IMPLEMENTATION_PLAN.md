# Personal Finance App - Home Page Analysis & Full Implementation Plan

## Executive Summary

This document provides a comprehensive analysis of the personal finance app's current state and a complete implementation roadmap to transform it from a static prototype into a fully functional, database-driven application.

**Current State:** The app has a polished UI with hardcoded placeholder data across all pages (Home, Transactions, Budget, Savings, Loans, Net Worth). Authentication is configured but no actual financial data is being stored or retrieved from the database.

**Goal:** Connect all UI components to Supabase backend, implement complete CRUD operations, add data aggregation logic, and create a real-time financial dashboard.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Data Requirements Analysis](#2-data-requirements-analysis)
3. [Complete Supabase Database Schema](#3-complete-supabase-database-schema)
4. [Implementation Roadmap](#4-implementation-roadmap)
5. [Code Examples & Patterns](#5-code-examples--patterns)
6. [Testing Strategy](#6-testing-strategy)
7. [Questions for User](#7-questions-for-user)

---

## 1. Current State Assessment

### 1.1 What's Already Implemented

#### Authentication Layer (COMPLETE ✅)
- Supabase authentication configured with email/password and Google OAuth
- Protected routes via middleware (`/budget`, `/loans`, `/savings`, `/transactions`)
- User session management
- Login, signup, and password reset pages

#### UI Components (COMPLETE ✅)
- Beautiful, responsive UI with animations (BlurFade)
- Navigation system with TubelightNavbar
- All major pages scaffolded:
  - Home page with summary cards and charts
  - Transactions page with table and filters
  - Budget page with circular progress indicators
  - Savings page with bubble chart
  - Loans page with detailed loan cards
  - Net Worth page with assets/liabilities tracking

#### TypeScript Types (PARTIAL ✅)
- Existing types in `/types/index.ts`:
  - Transaction, TransactionFilters
  - Budget, BudgetStatus
  - Goal, Milestone
  - Asset, Liability, NetWorthSnapshot
  - CategorySpending, MerchantSpending

### 1.2 What's Currently Static/Placeholder

#### Home Page (`/app/page.tsx`)
```typescript
// Current static data:
- User name: Hardcoded "Santiago"
- Income card: Static "$6,238" with fake chart data
- Savings card: Static "6,202" with fake chart data
- Spending card: Static "18,945" with fake chart data
- Spending Tracker: Placeholder visitor/purchase data (irrelevant for finance app)
```

**Issues:**
- No connection to actual transaction data
- Charts show placeholder business metrics (visitors, clicks, signups, purchases) instead of financial data
- No personalization based on authenticated user
- No real-time calculation of totals

#### Transactions Page (`/app/transactions/page.tsx`)
```typescript
// 20 hardcoded transactions in initialTransactions array
- Client-side state only (useState)
- Changes don't persist to database
- No user-specific filtering
- Inline editing exists but doesn't save
```

#### Budget Page (`/app/budget/page.tsx`)
```typescript
// 8 hardcoded budget categories
- Client-side state only
- No connection to actual spending data
- Manual percentage calculations
- No persistence of budget changes
```

#### Savings, Loans, Net Worth Pages
- All use hardcoded data arrays
- No database integration
- No user-specific data

### 1.3 Current Data Flow

```
User Login → Supabase Auth ✅
    ↓
Protected Pages Load ✅
    ↓
Hardcoded Data Displayed ❌ (Should load from database)
    ↓
User Interactions (Add/Edit) ❌ (Should persist to database)
```

---

## 2. Data Requirements Analysis

### 2.1 Home Page Data Requirements

#### What Should Be Displayed:

1. **User Personalization**
   - User's display name (from auth.users or profiles table)
   - Custom greeting based on time of day

2. **Financial Summary Cards (Last 28 Days)**
   - **Total Income:**
     - Sum of all income transactions
     - Trend vs previous period
     - Mini sparkline chart

   - **Total Savings:**
     - Income - Expenses
     - Savings rate percentage
     - Growth trend

   - **Total Spending:**
     - Sum of all expense transactions
     - Category breakdown
     - Trend comparison

3. **Spending Tracker Chart (Should Replace Conversion Funnel)**
   - **Daily/Weekly/Monthly Spending Trend**
     - Time series data of expenses
     - Category-wise stacked area chart
     - Budget vs actual comparison

   - **Or Better: Income vs Expenses Chart**
     - Dual-line chart showing both income and expenses over time
     - Net savings area highlighted
     - Interactive time range selector

4. **Quick Insights/Alerts**
   - Budgets that are over limit
   - Upcoming bill payments
   - Savings goals progress
   - Unusual spending patterns

### 2.2 Required Metrics/KPIs

```typescript
interface DashboardMetrics {
  // Core Metrics
  totalIncome: number           // Last 28 days
  totalExpenses: number         // Last 28 days
  netSavings: number           // Income - Expenses
  savingsRate: number          // (netSavings / totalIncome) * 100

  // Trends
  incomeChange: number         // % change vs previous period
  expenseChange: number        // % change vs previous period

  // Breakdown
  expensesByCategory: CategorySpending[]
  topExpenseCategories: CategorySpending[]  // Top 5

  // Time Series
  dailySpending: Array<{date: string, amount: number, category: string}>
  monthlyTrend: Array<{month: string, income: number, expenses: number}>

  // Budget Health
  budgetsOverLimit: number
  budgetsAtRisk: number  // >80% spent

  // Goals
  activeGoals: number
  goalsProgress: number  // Average progress %
}
```

### 2.3 Interactive Elements Needed

1. **Time Range Selector**
   - Last 7 days
   - Last 28 days (default)
   - Last 3 months
   - Last year
   - Custom range

2. **Quick Actions**
   - Add Transaction button (prominent)
   - Add Budget button
   - View All Transactions link
   - Create Savings Goal link

3. **Real-time Updates**
   - Automatic refresh when data changes
   - Optimistic UI updates for better UX

---

## 3. Complete Supabase Database Schema

### 3.1 Schema Overview

```
┌─────────────┐
│ auth.users  │ (Managed by Supabase Auth)
└──────┬──────┘
       │
       ├─────────────────────────────┐
       │                             │
┌──────▼──────┐              ┌───────▼────────┐
│  profiles   │              │  accounts      │
│ (extended   │              │ (bank accounts,│
│  user info) │              │  credit cards) │
└──────┬──────┘              └───────┬────────┘
       │                             │
       ├─────────────────────────────┼─────────────┐
       │                             │             │
┌──────▼──────────┐          ┌───────▼─────┐  ┌──▼────────┐
│  transactions   │          │   budgets   │  │categories │
│                 │          │             │  │           │
└─────────────────┘          └─────────────┘  └───────────┘
       │
       ├──────────────┬─────────────┐
       │              │             │
┌──────▼──────┐  ┌───▼────┐  ┌─────▼─────────┐
│   savings   │  │ loans  │  │  net_worth    │
│   _goals    │  │        │  │  _snapshots   │
└─────────────┘  └────────┘  └───────────────┘
```

### 3.2 Complete SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Extended User Information)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. CATEGORIES TABLE (Predefined + Custom)
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    icon TEXT,
    color TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- System categories can't be deleted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, type)
);

-- RLS Policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories and system categories"
    ON categories FOR SELECT
    USING (user_id = auth.uid() OR is_system = TRUE);

CREATE POLICY "Users can insert own categories"
    ON categories FOR INSERT
    WITH CHECK (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "Users can update own categories"
    ON categories FOR UPDATE
    USING (user_id = auth.uid() AND is_system = FALSE);

CREATE POLICY "Users can delete own categories"
    ON categories FOR DELETE
    USING (user_id = auth.uid() AND is_system = FALSE);

-- Insert default system categories
INSERT INTO categories (name, type, icon, color, is_system) VALUES
    ('Salary', 'income', 'briefcase', 'rgb(16 185 129)', TRUE),
    ('Freelance', 'income', 'laptop', 'rgb(59 130 246)', TRUE),
    ('Investment', 'income', 'trending-up', 'rgb(99 102 241)', TRUE),
    ('Other Income', 'income', 'dollar-sign', 'rgb(139 92 246)', TRUE),
    ('Food & Dining', 'expense', 'utensils', 'rgb(239 68 68)', TRUE),
    ('Transport', 'expense', 'car', 'rgb(59 130 246)', TRUE),
    ('Rent', 'expense', 'home', 'rgb(234 179 8)', TRUE),
    ('Entertainment', 'expense', 'gamepad', 'rgb(139 92 246)', TRUE),
    ('Shopping', 'expense', 'shopping-bag', 'rgb(249 115 22)', TRUE),
    ('Utilities', 'expense', 'zap', 'rgb(16 185 129)', TRUE),
    ('Healthcare', 'expense', 'heart', 'rgb(99 102 241)', TRUE),
    ('Other', 'expense', 'more-horizontal', 'rgb(156 163 175)', TRUE);

-- =====================================================
-- 3. ACCOUNTS TABLE (Bank Accounts, Credit Cards, etc.)
-- =====================================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment')) NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    institution TEXT,
    last_four TEXT, -- Last 4 digits of account number
    color TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts"
    ON accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
    ON accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
    ON accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
    ON accounts FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 4. TRANSACTIONS TABLE (Core Financial Data)
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    payment_method TEXT, -- Cash, Credit Card, Debit Card, Bank Transfer, etc.
    merchant TEXT,
    notes TEXT,
    tags TEXT[], -- Array of tags for flexible categorization
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency TEXT, -- daily, weekly, monthly, yearly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- RLS Policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. BUDGETS TABLE
-- =====================================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    monthly_limit DECIMAL(12, 2) NOT NULL,
    period_start DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    period_end DATE NOT NULL DEFAULT (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    rollover_unused BOOLEAN DEFAULT FALSE,
    alert_at_percentage INTEGER DEFAULT 80, -- Alert when 80% spent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id, period_start)
);

-- RLS Policies for budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets"
    ON budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 6. SAVINGS GOALS TABLE
-- =====================================================
CREATE TABLE savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    deadline DATE,
    color TEXT,
    icon TEXT,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own savings goals"
    ON savings_goals FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- 7. SAVINGS GOAL CONTRIBUTIONS TABLE
-- =====================================================
CREATE TABLE savings_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES savings_goals(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE savings_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contributions"
    ON savings_contributions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM savings_goals
            WHERE id = goal_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own contributions"
    ON savings_contributions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM savings_goals
            WHERE id = goal_id AND user_id = auth.uid()
        )
    );

-- =====================================================
-- 8. LOANS TABLE
-- =====================================================
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    loan_type TEXT CHECK (loan_type IN ('federal', 'private', 'mortgage', 'personal', 'auto', 'other')) NOT NULL,
    servicer TEXT,
    original_amount DECIMAL(12, 2) NOT NULL,
    current_balance DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL, -- e.g., 4.53 for 4.53%
    monthly_payment DECIMAL(12, 2),
    minimum_payment DECIMAL(12, 2),
    next_payment_date DATE,
    start_date DATE,
    term_months INTEGER, -- Loan term in months
    status TEXT CHECK (status IN ('active', 'paid-off', 'deferred', 'forbearance')) DEFAULT 'active',
    icon TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own loans"
    ON loans FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- 9. LOAN PAYMENTS TABLE
-- =====================================================
CREATE TABLE loan_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    principal DECIMAL(12, 2),
    interest DECIMAL(12, 2),
    extra_payment DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE loan_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loan payments"
    ON loan_payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM loans
            WHERE id = loan_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own loan payments"
    ON loan_payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM loans
            WHERE id = loan_id AND user_id = auth.uid()
        )
    );

-- =====================================================
-- 10. NET WORTH SNAPSHOTS TABLE
-- =====================================================
CREATE TABLE net_worth_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_assets DECIMAL(12, 2) NOT NULL,
    total_liabilities DECIMAL(12, 2) NOT NULL,
    net_worth DECIMAL(12, 2) GENERATED ALWAYS AS (total_assets - total_liabilities) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, snapshot_date)
);

-- Index for performance
CREATE INDEX idx_networth_user_date ON net_worth_snapshots(user_id, snapshot_date DESC);

-- RLS Policies
ALTER TABLE net_worth_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own net worth snapshots"
    ON net_worth_snapshots FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- 11. ASSETS TABLE
-- =====================================================
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('cash', 'savings', 'investment', 'retirement', 'real_estate', 'vehicle', 'other')) NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_liquid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assets"
    ON assets FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- 12. LIABILITIES TABLE
-- =====================================================
CREATE TABLE liabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('credit_card', 'loan', 'mortgage', 'student_loan', 'other')) NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2),
    minimum_payment DECIMAL(12, 2),
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own liabilities"
    ON liabilities FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- USEFUL VIEWS FOR ANALYTICS
-- =====================================================

-- View: Budget Status with Actual Spending
CREATE OR REPLACE VIEW budget_status AS
SELECT
    b.id,
    b.user_id,
    b.category_id,
    c.name as category_name,
    c.icon,
    c.color,
    b.monthly_limit,
    b.period_start,
    b.period_end,
    COALESCE(SUM(t.amount), 0) as spent,
    b.monthly_limit - COALESCE(SUM(t.amount), 0) as remaining,
    CASE
        WHEN b.monthly_limit > 0 THEN (COALESCE(SUM(t.amount), 0) / b.monthly_limit * 100)
        ELSE 0
    END as percentage_used
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN transactions t ON
    t.category_id = b.category_id
    AND t.user_id = b.user_id
    AND t.type = 'expense'
    AND t.date BETWEEN b.period_start AND b.period_end
GROUP BY b.id, b.user_id, b.category_id, c.name, c.icon, c.color, b.monthly_limit, b.period_start, b.period_end;

-- View: Monthly Summary by User
CREATE OR REPLACE VIEW monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_savings
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date);

-- View: Category Spending Summary
CREATE OR REPLACE VIEW category_spending AS
SELECT
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.icon,
    c.color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    DATE_TRUNC('month', t.date) as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.date);
```

### 3.3 Database Setup Instructions

1. **Copy the SQL above into Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar
   - Create a new query
   - Paste the entire schema
   - Click "Run"

2. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see all 12 tables listed

3. **Test RLS Policies**
   - Create a test user
   - Try inserting/selecting data
   - Verify only that user's data is accessible

---

## 4. Implementation Roadmap

### Phase 1: Database Connection & User Profile (Week 1)

#### Tasks:
1. Create Supabase database tables (use SQL above)
2. Set up server-side data fetching utilities
3. Implement user profile creation on signup
4. Update home page to fetch authenticated user's name

#### Files to Create/Modify:
- `/lib/supabase/database.types.ts` - Auto-generated types from Supabase
- `/lib/db/queries.ts` - Database query functions
- `/lib/db/mutations.ts` - Database mutation functions

### Phase 2: Transactions Implementation (Week 2)

#### Tasks:
1. Create API routes for transactions CRUD
2. Connect transactions page to database
3. Implement real-time transaction sync
4. Add transaction form with validation

#### Files to Create/Modify:
- `/app/api/transactions/route.ts`
- `/app/api/transactions/[id]/route.ts`
- `/app/transactions/page.tsx` - Connect to real data
- `/components/transactions/add-transaction-dialog.tsx`
- `/lib/hooks/useTransactions.ts`

### Phase 3: Home Page Dashboard (Week 3)

#### Tasks:
1. Create dashboard metrics calculation functions
2. Fetch and aggregate transaction data
3. Replace placeholder charts with real data
4. Add time range filtering
5. Implement real-time updates

#### Files to Create/Modify:
- `/app/page.tsx` - Replace static data
- `/components/home/dashboard-metrics.tsx`
- `/components/home/spending-chart.tsx` - Replace funnel chart
- `/components/home/income-expense-chart.tsx`
- `/lib/hooks/useDashboardMetrics.ts`
- `/lib/analytics/calculations.ts`

### Phase 4: Budget Implementation (Week 4)

#### Tasks:
1. Create budget CRUD operations
2. Link budgets to actual spending
3. Auto-calculate spent amounts from transactions
4. Add budget alerts and notifications

#### Files to Create/Modify:
- `/app/api/budgets/route.ts`
- `/app/budget/page.tsx`
- `/components/budget/budget-cards.tsx`
- `/lib/hooks/useBudgets.ts`

### Phase 5: Savings, Loans, Net Worth (Week 5-6)

#### Tasks:
1. Implement savings goals with progress tracking
2. Create loan management system
3. Build net worth calculator
4. Add assets and liabilities tracking

### Phase 6: Polish & Optimization (Week 7)

#### Tasks:
1. Add loading states and skeletons
2. Implement error handling
3. Add data export functionality
4. Performance optimization
5. E2E testing

---

## 5. Code Examples & Patterns

### 5.1 Server-Side Data Fetching Pattern

#### `/lib/db/queries.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

// Cache for the duration of the request
export const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
})

export const getTransactions = cache(async (
  userId: string,
  options?: {
    from?: string
    to?: string
    type?: 'income' | 'expense'
    limit?: number
  }
) => {
  const supabase = await createClient()

  let query = supabase
    .from('transactions')
    .select(`
      *,
      category:categories(name, icon, color),
      account:accounts(name, type)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (options?.from) {
    query = query.gte('date', options.from)
  }

  if (options?.to) {
    query = query.lte('date', options.to)
  }

  if (options?.type) {
    query = query.eq('type', options.type)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
})

export const getDashboardMetrics = cache(async (
  userId: string,
  days: number = 28
) => {
  const supabase = await createClient()
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  // Get transactions
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', fromDate.toISOString().split('T')[0])

  if (error) throw error

  // Calculate metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    transactionCount: transactions.length
  }
})

export const getBudgetStatus = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('budget_status') // Using the view we created
    .select('*')
    .eq('user_id', userId)
    .gte('period_end', new Date().toISOString().split('T')[0])

  if (error) throw error
  return data
})
```

### 5.2 Client-Side Hooks Pattern

#### `/lib/hooks/useTransactions.ts`
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/types'

export function useTransactions(userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchTransactions()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [payload.new as Transaction, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev =>
              prev.map(t => t.id === payload.new.id ? payload.new as Transaction : t)
            )
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev =>
              prev.filter(t => t.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  async function fetchTransactions() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function addTransaction(transaction: Omit<Transaction, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: userId }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async function updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions
  }
}
```

### 5.3 Updated Home Page Implementation

#### `/app/page.tsx`
```typescript
import { NavBarWrapper } from "@/components/navbar-wrapper"
import { BlurFade } from "@/components/ui/blur-fade"
import { DashboardMetrics } from "@/components/home/dashboard-metrics"
import { IncomeExpenseChart } from "@/components/home/income-expense-chart"
import { CategoryBreakdown } from "@/components/home/category-breakdown"
import { QuickActions } from "@/components/home/quick-actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getDashboardMetrics, getUserProfile } from "@/lib/db/queries"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile and metrics
  const [profile, metrics] = await Promise.all([
    getUserProfile(user.id),
    getDashboardMetrics(user.id, 28)
  ])

  const displayName = profile?.display_name || profile?.full_name || user.email?.split('@')[0]

  return (
    <main className="min-h-screen">
      <NavBarWrapper />
      <div className="container mx-auto px-4 pt-24 space-y-8">
        <div className="space-y-4 pb-8">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl font-bold">Hello {displayName} 👋</h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="mt-4 text-muted-foreground">Here is your finance summary</p>
          </BlurFade>
        </div>

        <BlurFade delay={0.75} inView>
          <DashboardMetrics metrics={metrics} />
        </BlurFade>

        <BlurFade delay={1} inView>
          <IncomeExpenseChart userId={user.id} />
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BlurFade delay={1.25} inView>
            <CategoryBreakdown userId={user.id} />
          </BlurFade>

          <BlurFade delay={1.5} inView>
            <QuickActions />
          </BlurFade>
        </div>
      </div>
    </main>
  )
}
```

#### `/components/home/dashboard-metrics.tsx`
```typescript
'use client'

import { Card, CardContent } from "@/components/ui/card"
import { CircleDollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"

interface DashboardMetricsProps {
  metrics: {
    totalIncome: number
    totalExpenses: number
    netSavings: number
    savingsRate: number
  }
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const cards = [
    {
      title: 'Total Income',
      period: 'Last 28 days',
      value: formatCurrency(metrics.totalIncome),
      icon: TrendingUp,
      color: 'rgb(16 185 129)', // emerald-500
    },
    {
      title: 'Total Expenses',
      period: 'Last 28 days',
      value: formatCurrency(metrics.totalExpenses),
      icon: TrendingDown,
      color: 'rgb(239 68 68)', // red-500
    },
    {
      title: 'Net Savings',
      period: 'Last 28 days',
      value: formatCurrency(metrics.netSavings),
      icon: PiggyBank,
      color: 'rgb(59 130 246)', // blue-500
    },
    {
      title: 'Savings Rate',
      period: 'Last 28 days',
      value: `${metrics.savingsRate.toFixed(1)}%`,
      icon: CircleDollarSign,
      color: 'rgb(99 102 241)', // indigo-500
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="space-y-5">
              <div className="flex items-center gap-2">
                <Icon className="size-5" style={{ color: card.color }} />
                <span className="text-base font-semibold">{card.title}</span>
              </div>

              <div className="flex items-end gap-2.5 justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {card.period}
                  </div>
                  <div className="text-3xl font-bold text-foreground tracking-tight">
                    {card.value}
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
```

### 5.4 Server Actions Pattern (Alternative to API Routes)

#### `/app/actions/transactions.ts`
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const transactionSchema = z.object({
  date: z.string(),
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category_id: z.string().uuid(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
})

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const validatedData = transactionSchema.parse({
    date: formData.get('date'),
    description: formData.get('description'),
    amount: Number(formData.get('amount')),
    type: formData.get('type'),
    category_id: formData.get('category_id'),
    payment_method: formData.get('payment_method'),
    notes: formData.get('notes'),
  })

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...validatedData, user_id: user.id }])
    .select()
    .single()

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/transactions')

  return { success: true, data }
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/')
  revalidatePath('/transactions')

  return { success: true }
}
```

---

## 6. Testing Strategy

### 6.1 Manual Testing Checklist

**Authentication Flow:**
- [ ] New user signup creates profile automatically
- [ ] User can login with email/password
- [ ] User can login with Google OAuth
- [ ] Protected pages redirect to login when not authenticated
- [ ] Authenticated users redirected from login/signup pages

**Transactions:**
- [ ] User can view only their own transactions
- [ ] User can add new transaction
- [ ] User can edit existing transaction
- [ ] User can delete transaction
- [ ] Transactions update in real-time
- [ ] Dashboard metrics update after transaction changes

**Budgets:**
- [ ] Budget spent amount auto-calculates from transactions
- [ ] Budget percentage updates correctly
- [ ] Over-budget budgets show correct status
- [ ] Budget edits persist to database

**Data Isolation:**
- [ ] Create two test users
- [ ] Verify each user only sees their own data
- [ ] Test RLS policies are working correctly

### 6.2 Automated Testing

```typescript
// Example E2E test with Playwright
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3003/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3003')
  })

  test('should display user name', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hello')
  })

  test('should display correct metrics', async ({ page }) => {
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="total-income"]')

    const income = await page.locator('[data-testid="total-income"]').textContent()
    expect(income).toMatch(/\$[\d,]+/)
  })

  test('should add transaction and update metrics', async ({ page }) => {
    // Click add transaction
    await page.click('[data-testid="add-transaction-btn"]')

    // Fill form
    await page.fill('input[name="description"]', 'Test Income')
    await page.fill('input[name="amount"]', '1000')
    await page.selectOption('select[name="type"]', 'income')

    // Submit
    await page.click('button[type="submit"]')

    // Wait for update
    await page.waitForTimeout(1000)

    // Check metrics updated
    const newIncome = await page.locator('[data-testid="total-income"]').textContent()
    expect(newIncome).toContain('1,000')
  })
})
```

---

## 7. Questions for User

Before proceeding with implementation, please clarify:

### 7.1 Feature Priorities

**Which features are most important for the home page?**
- [ ] Transaction history and trends (income vs expenses over time)
- [ ] Budget tracking and alerts
- [ ] Savings goals progress
- [ ] Net worth tracker
- [ ] Spending by category breakdown
- [ ] Bill reminders and upcoming payments
- [ ] Financial insights and recommendations

**What time range should be the default for the home page?**
- [ ] Last 7 days
- [ ] Last 28 days (current)
- [ ] Last 3 months
- [ ] Current month
- [ ] Custom range with selector

### 7.2 Financial Accounts

**Should the app support multiple bank accounts/credit cards?**
- [ ] Yes, I want to track multiple accounts separately
- [ ] No, just aggregate all transactions together
- [ ] Maybe later, start simple first

**If yes, what account types are needed?**
- [ ] Checking accounts
- [ ] Savings accounts
- [ ] Credit cards
- [ ] Cash
- [ ] Investment accounts
- [ ] Other

### 7.3 Data Visualization Preferences

**For the home page main chart, which would you prefer?**
- [ ] Income vs Expenses dual-line chart (shows both trends)
- [ ] Spending by Category stacked area chart (shows breakdown)
- [ ] Net Worth over time (shows wealth accumulation)
- [ ] Daily spending bar chart (shows spending patterns)
- [ ] All of the above with tabs to switch

### 7.4 Budget System

**How should budgets work?**
- [ ] Monthly budgets that reset each month
- [ ] Rolling 30-day budgets
- [ ] Custom period budgets (weekly, bi-weekly, etc.)
- [ ] Annual budgets broken down by month

**Should unused budget amounts rollover?**
- [ ] Yes, rollover unused amounts to next period
- [ ] No, reset each period
- [ ] Make it configurable per budget

### 7.5 Implementation Approach

**Preferred implementation order:**
1. [ ] Start with home page dashboard (big picture first)
2. [ ] Start with transactions (foundation first)
3. [ ] Start with authentication improvements (security first)

**Data migration:**
- [ ] I want to import existing financial data from CSV/Excel
- [ ] I'll start fresh with new data
- [ ] I need to connect to my bank via Plaid or similar API

### 7.6 Technical Preferences

**State management approach:**
- [ ] Server Components with Server Actions (Next.js 15 native, recommended)
- [ ] Client Components with React Query/SWR
- [ ] Redux/Zustand for global state
- [ ] Mix of server and client as needed (flexible)

**Real-time updates:**
- [ ] Essential - need instant updates
- [ ] Nice to have - can manually refresh
- [ ] Not needed - page refresh is fine

---

## 8. Next Steps

### Immediate Actions (This Week)

1. **Review this document** and answer questions in Section 7
2. **Set up Supabase database** using the SQL schema in Section 3.2
3. **Verify database setup** by checking tables in Supabase dashboard
4. **Choose implementation priorities** based on your answers

### Week 1 Tasks (Once Priorities Confirmed)

1. Generate TypeScript types from Supabase schema:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

2. Create base query and mutation utilities
3. Update home page to show authenticated user's name
4. Set up first data connection (likely transactions)

### Long-term Roadmap

**Month 1: Core Functionality**
- ✅ Authentication (already done)
- 🔄 Transactions CRUD
- 🔄 Dashboard with real metrics
- 🔄 Budget tracking

**Month 2: Advanced Features**
- Savings goals
- Loan tracking
- Net worth calculator
- Data export

**Month 3: Polish & Scale**
- Mobile responsiveness improvements
- Performance optimization
- Advanced analytics
- Third-party integrations (optional)

---

## 9. Appendix

### 9.1 Useful Supabase CLI Commands

```bash
# Generate TypeScript types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts

# Reset database (WARNING: Deletes all data)
npx supabase db reset

# Create migration from current schema
npx supabase db diff -f migration_name

# Push local migrations to remote
npx supabase db push
```

### 9.2 Environment Variables Reference

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional for third-party integrations
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
```

### 9.3 Performance Optimization Tips

1. **Use Database Indexes** (already included in schema)
2. **Implement Pagination** for transaction lists
3. **Use React Server Components** for data fetching (reduces client bundle)
4. **Cache Expensive Calculations** using React cache()
5. **Use Supabase Views** for complex queries (already created)
6. **Implement Incremental Static Regeneration** for dashboard

### 9.4 Security Best Practices

1. **Never expose service role key** in client-side code
2. **Always use RLS policies** (already configured)
3. **Validate all inputs** on server-side
4. **Use prepared statements** (Supabase does this automatically)
5. **Limit query results** with .limit()
6. **Monitor auth events** in Supabase dashboard

---

## Summary

This personal finance app has a solid foundation with beautiful UI and complete authentication. The main work ahead is connecting the UI to the Supabase database and implementing real data flows.

**Key Strengths:**
- Professional UI design
- Modern tech stack (Next.js 15, Supabase, TypeScript)
- Authentication working correctly
- Clean component architecture

**Key Gaps:**
- No database schema (now provided)
- All data is hardcoded
- No data persistence
- No user-specific data

**Recommended Start:**
1. Set up database schema (Section 3.2)
2. Connect home page to show real user name
3. Implement transactions page with real data
4. Build out dashboard with actual metrics
5. Add remaining features (budgets, savings, loans, net worth)

**Estimated Timeline:**
- Database setup: 1-2 hours
- Basic data connection: 1-2 days
- Full home page implementation: 1 week
- All features complete: 6-8 weeks (working part-time)

The app is ready to transform from a beautiful prototype into a fully functional financial management system!
