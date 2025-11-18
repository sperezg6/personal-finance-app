# Savings System Redesign - Implementation Guide

## Overview

This guide documents the redesign of the savings system from **goal-based** (with targets and deadlines) to **account-based** (like bank accounts with balances).

---

## Key Changes

### Before (Goal-Based)
- Savings calculated as: `Income - Expenses`
- Table: `savings_goals` with target amounts, deadlines, completion status
- No transaction history for savings
- Goals had progress bars and "% complete"

### After (Account-Based)
- Savings are a **third transaction type** alongside income and expenses
- Table: `savings_accounts` (simplified) with just balances
- Full transaction history for all savings contributions/withdrawals
- Balances displayed like bank accounts

---

## Database Architecture

### 1. Renamed Table: `savings_accounts`

```sql
CREATE TABLE savings_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,                    -- e.g., "Emergency Fund", "Stocks", "PPR"
    current_amount DECIMAL(12, 2) DEFAULT 0,
    color TEXT,                            -- Display color
    icon TEXT,                             -- Display icon
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Removed fields:**
- ❌ `target_amount` - No more goals
- ❌ `deadline` - No more deadlines
- ❌ `is_completed` - No completion status
- ❌ `completed_at` - No completion tracking

### 2. Enhanced Transactions Table

```sql
ALTER TABLE transactions
  -- Now supports 3 types: 'income', 'expense', 'savings'
  ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings'));

  -- Links savings transactions to specific savings accounts
  ADD COLUMN savings_account_id UUID REFERENCES savings_accounts(id);
```

### 3. Automatic Balance Updates

A database trigger automatically updates `savings_accounts.current_amount` when savings transactions are created/updated/deleted:

```sql
CREATE TRIGGER sync_savings_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_savings_account_balance();
```

**How it works:**
- **Insert**: Adds transaction amount to savings account
- **Update**: Adjusts old and new account balances
- **Delete**: Subtracts transaction amount from savings account

---

## Usage Examples

### Example 1: Create a Savings Account

```typescript
// Create "Emergency Fund" savings account
const { data, error } = await supabase
  .from('savings_accounts')
  .insert({
    user_id: userId,
    name: 'Emergency Fund',
    current_amount: 0,
    color: 'rgb(16 185 129)', // emerald
    icon: 'shield',
    description: '6 months of expenses'
  })
```

### Example 2: Add Money to Savings

```typescript
// Add $500 to Emergency Fund
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'savings',
    amount: 500,
    savings_account_id: emergencyFundId,
    description: 'Monthly savings contribution',
    date: '2025-01-15'
  })

// ✅ Trigger automatically updates:
// emergency_fund.current_amount += 500
```

### Example 3: Withdraw from Savings

```typescript
// Withdraw $200 from Emergency Fund (negative amount)
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    type: 'savings',
    amount: -200,
    savings_account_id: emergencyFundId,
    description: 'Emergency car repair',
    date: '2025-01-20'
  })

// ✅ Trigger automatically updates:
// emergency_fund.current_amount -= 200
```

### Example 4: Transfer Between Savings Accounts

```typescript
// Transfer $100 from Emergency Fund to Stocks
await supabase.from('transactions').insert([
  {
    user_id: userId,
    type: 'savings',
    amount: -100,
    savings_account_id: emergencyFundId,
    description: 'Transfer to stocks'
  },
  {
    user_id: userId,
    type: 'savings',
    amount: 100,
    savings_account_id: stocksAccountId,
    description: 'Transfer from emergency fund'
  }
])
```

---

## Financial Overview Calculation

### New Money Flow

```
INCOME (money in)
  ↓
EXPENSES (money out) + SAVINGS (money set aside)
  ↓
NET CASH FLOW = Income - Expenses - Savings
```

### Dashboard Metrics

```typescript
// Total Income
const totalIncome = transactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0)

// Total Expenses
const totalExpenses = transactions
  .filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0)

// Total Savings (this month)
const totalSavings = transactions
  .filter(t => t.type === 'savings' && t.amount > 0)
  .reduce((sum, t) => sum + t.amount, 0)

// Net Cash Flow
const netCashFlow = totalIncome - totalExpenses - totalSavings

// Total Savings Balance (all time)
const totalSavingsBalance = savingsAccounts
  .reduce((sum, account) => sum + account.current_amount, 0)
```

---

## UI Components to Update

### 1. Savings Page (`/app/savings/page.tsx`)

**Before:**
- Shows progress bars
- Displays "X% of $Y goal"
- Shows deadlines and completion status

**After:**
- Shows account balances (like bank accounts)
- Simple list: "Emergency Fund: $5,000"
- No progress bars or goals

```tsx
// New design
<Card>
  <CardHeader>
    <CardTitle>Savings Accounts</CardTitle>
  </CardHeader>
  <CardContent>
    {savingsAccounts.map(account => (
      <div key={account.id} className="flex justify-between">
        <div className="flex items-center gap-2">
          <Icon name={account.icon} color={account.color} />
          <span>{account.name}</span>
        </div>
        <span className="font-bold">${formatCurrency(account.current_amount)}</span>
      </div>
    ))}
  </CardContent>
</Card>
```

### 2. Transaction Form

Add "Savings" option to transaction type selector:

```tsx
<Select name="type">
  <option value="income">Income</option>
  <option value="expense">Expense</option>
  <option value="savings">Savings</option> {/* NEW */}
</Select>

{/* Show savings account selector when type = 'savings' */}
{type === 'savings' && (
  <Select name="savings_account_id">
    {savingsAccounts.map(account => (
      <option key={account.id} value={account.id}>
        {account.name}
      </option>
    ))}
  </Select>
)}
```

### 3. Dashboard Metrics

Update to show savings as a separate metric:

```tsx
const metrics = [
  { title: 'Income', value: totalIncome },
  { title: 'Expenses', value: totalExpenses },
  { title: 'Savings', value: totalSavings },      // NEW
  { title: 'Net Cash Flow', value: netCashFlow }  // NEW (replaces "Net Savings")
]
```

### 4. Net Worth Page

Already updated via the `net_worth_summary` view to use `savings_accounts`.

---

## Code Changes Required

### 1. Update Type Definitions

`/lib/supabase/database.types.ts`
```typescript
// Rename
export type SavingsGoal = Database['public']['Tables']['savings_accounts']['Row']

// Update transaction type
export type TransactionType = 'income' | 'expense' | 'savings' // Added 'savings'

// Add to Transaction type
export interface Transaction {
  // ... existing fields
  type: TransactionType
  savings_account_id?: string | null  // NEW
}
```

### 2. Update Queries

`/lib/db/queries.ts`
```typescript
// Rename all references
export const getSavingsAccounts = cache(async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('savings_accounts')  // Changed from 'savings_goals'
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return data || []
})

// Update summary to use balances
export const getSavingsSummary = cache(async (userId: string) => {
  const accounts = await getSavingsAccounts(userId)

  const totalBalance = accounts.reduce((sum, acc) =>
    sum + Number(acc.current_amount), 0
  )

  // Calculate monthly growth from savings transactions
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentSavings } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'savings')
    .gte('date', thirtyDaysAgo.toISOString())

  const monthlyGrowth = recentSavings?.reduce((sum, t) =>
    sum + Number(t.amount), 0
  ) || 0

  return {
    totalBalance,
    monthlyGrowth,
    accountCount: accounts.length
  }
})
```

### 3. Update Actions

`/lib/db/actions.ts`
```typescript
// Create savings transaction
export async function createSavingsTransaction(
  userId: string,
  accountId: string,
  amount: number,
  description: string,
  date: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'savings',
      amount,
      savings_account_id: accountId,
      description,
      date
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

// Create savings account
export async function createSavingsAccount(
  userId: string,
  name: string,
  color: string,
  icon: string,
  description?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('savings_accounts')
    .insert({
      user_id: userId,
      name,
      color,
      icon,
      description,
      current_amount: 0
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}
```

---

## Migration Steps

### 1. Apply Database Migration

```bash
# Run the migration in Supabase SQL Editor
# File: supabase/migrations/transform_savings_to_accounts.sql
```

Or use Supabase CLI:
```bash
supabase migration new transform_savings_to_accounts
# Copy content from transform_savings_to_accounts.sql
supabase db push
```

### 2. Update TypeScript Types

```bash
# Regenerate types from updated schema
supabase gen types typescript --local > lib/supabase/database.types.ts
```

### 3. Update Code

Update files in this order:
1. ✅ `lib/supabase/database.types.ts` - Type definitions
2. ✅ `lib/db/queries.ts` - Query functions
3. ✅ `lib/db/actions.ts` - Action functions
4. ✅ `components/savings/*` - UI components
5. ✅ `app/savings/page.tsx` - Savings page

---

## Testing Checklist

- [ ] Can create new savings account
- [ ] Can add money to savings account (balance increases)
- [ ] Can withdraw from savings account (balance decreases)
- [ ] Savings transactions appear in transaction history
- [ ] Net worth view shows correct savings total
- [ ] Dashboard shows savings as separate metric
- [ ] Can view savings account transaction history
- [ ] Can edit/delete savings accounts
- [ ] Trigger correctly updates balances on transaction changes

---

## Benefits of New System

1. ✅ **Simpler mental model**: Savings = account with balance
2. ✅ **Full audit trail**: See every savings transaction
3. ✅ **Flexible**: No rigid goals/deadlines
4. ✅ **Accurate**: Balances always in sync via triggers
5. ✅ **Comprehensive**: Complete picture of money flow (Income → Expenses → Savings)
6. ✅ **Real-world aligned**: Matches how savings actually work

---

## Future Enhancements (Optional)

1. **Savings Goals (opt-in)**: Add optional `target_amount` field for users who want goals
2. **Interest tracking**: Track interest earned on savings accounts
3. **Automatic savings**: Recurring transactions to auto-save each month
4. **Savings categories**: Group savings accounts (Short-term vs Long-term)
5. **Savings analytics**: Charts showing savings growth over time

---

## Questions?

This design gives you maximum flexibility while keeping things simple. You can:
- Track multiple savings accounts (Emergency Fund, Stocks, PPR, Vacation, etc.)
- See full transaction history for each account
- Transfer money between savings accounts
- Withdraw from savings when needed
- View total savings balance in Net Worth

The system treats savings as a **first-class citizen** in your finances, not just a calculation!
