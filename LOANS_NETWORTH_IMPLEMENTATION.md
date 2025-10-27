# Loans and Net Worth Implementation

This document describes the implementation of the Loans and Net Worth features for the personal finance app.

## Overview

Two new major features have been added to the personal finance application:
1. **Loans & Debt Management** - Track and manage loans with progress visualization
2. **Net Worth Tracking** - Monitor overall financial health by calculating assets minus liabilities

## Database Changes

### 1. New Tables

#### `loans` Table
A new table to store loan information:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (TEXT) - Loan name/description
- `loan_type` (TEXT) - Type: mortgage, auto, student, personal, credit_card, business, other
- `principal_amount` (DECIMAL) - Original loan amount
- `current_balance` (DECIMAL) - Current outstanding balance
- `interest_rate` (DECIMAL) - Annual interest rate
- `monthly_payment` (DECIMAL) - Monthly payment amount
- `start_date` (DATE) - Loan start date
- `end_date` (DATE) - Expected payoff date
- `lender` (TEXT) - Lender name
- `status` (TEXT) - Status: active, paid_off, deferred
- `notes` (TEXT) - Additional notes
- RLS policies enabled for user-specific access

### 2. New Views

#### `net_worth_summary` View
Automatically calculates net worth by aggregating:
- **Assets:**
  - Cash and bank accounts (checking, savings, cash, investment)
  - Savings goals total
- **Liabilities:**
  - Credit card debt (negative credit card balances)
  - Active loans total
- **Net Worth:** Assets - Liabilities

This view joins data from `accounts`, `savings_goals`, and `loans` tables.

## Application Structure

### Backend (lib/db/)

#### queries.ts
Added new query functions:

**Loans Queries:**
- `getLoans(userId)` - Fetch all loans for a user
- `getActiveLoans(userId)` - Fetch only active loans
- `getLoansSummary(userId)` - Get aggregated loan statistics:
  - Total debt
  - Monthly payment
  - Average interest rate
  - Total paid
  - Active loans count
- `getLoanDetails(loanId)` - Get details for a specific loan

**Net Worth Queries:**
- `getNetWorth(userId)` - Get total net worth value
- `getNetWorthBreakdown(userId)` - Get detailed breakdown:
  - Assets (cash/accounts, savings goals)
  - Liabilities (credit card debt, loans)
  - Net worth total
- `getNetWorthHistory(userId, months)` - Get historical net worth data (currently simulated)

#### actions.ts
Added server actions for loan management:

**Loan Actions:**
- `createLoan(input)` - Create a new loan
- `updateLoan(id, currentBalance)` - Update loan balance (auto-marks as paid_off when balance reaches 0)
- `deleteLoan(id)` - Delete a loan

All actions include proper authentication checks and revalidate both `/loans` and `/networth` paths.

### Database Types (lib/supabase/database.types.ts)

Added TypeScript types:
- `Loan` - Type for loans table
- `NetWorthSummary` - Type for net worth view
- Proper Insert and Update types for type safety

### Frontend Pages

#### 1. Loans Page (`app/loans/page.tsx`)
Server component that:
- Fetches loans summary and active loans
- Displays 4 summary cards:
  - Total Debt
  - Monthly Payment
  - Average Interest Rate
  - Active Loans Count
- Renders `LoansListClient` component with loan data
- Includes "Add Loan" button for future functionality

#### 2. Net Worth Page (`app/networth/page.tsx`)
Server component that:
- Fetches net worth breakdown, history, savings goals, loans, and accounts
- Displays hero card with total net worth
- Shows 4 summary cards:
  - Total Assets
  - Total Liabilities
  - Monthly Change (with trend indicator)
  - Debt to Asset Ratio
- Renders chart showing net worth trend
- Displays assets and liabilities breakdowns side-by-side

### Frontend Components

#### Loans Components

**`components/loans/loans-list-client.tsx`**
Client component for displaying and managing loans:
- Lists all active loans with:
  - Loan type icon (color-coded)
  - Name and lender
  - Current balance with progress bar
  - Interest rate and monthly payment
  - Expected payoff date
  - Progress percentage (paid off)
- Inline editing of loan balance
- Auto-updates when balance changes
- Marks loans as paid off when balance reaches 0
- Empty state when no loans exist

#### Net Worth Components

**`components/networth/networth-chart-client.tsx`**
Line chart showing net worth trend over time:
- Uses Recharts library
- Displays last 6 months of data
- Formatted currency on Y-axis
- Interactive tooltips
- Emerald green line for positive trend

**`components/networth/assets-list-client.tsx`**
Displays all assets:
- Total assets summary card
- Cash & Accounts section:
  - Lists all checking, savings, cash, investment accounts
  - Shows account type and balance
  - Subtotal for cash/accounts
- Savings Goals section:
  - Lists active savings goals
  - Shows progress percentage
  - Subtotal for savings goals

**`components/networth/liabilities-list-client.tsx`**
Displays all liabilities:
- Total liabilities summary card
- Credit Card Debt section (if any)
- Loans section:
  - Lists all active loans
  - Shows loan type, interest rate, and balance
  - Subtotal for loans
- Monthly payment summary (if loans exist)

## Navigation

The navigation bar (`components/navbar-wrapper.tsx`) already includes links to:
- Loans page (`/loans`)
- Net Worth page (`/networth`)

## Seed Data

Updated `supabase-seed-data.sql` with sample data:

### Sample Loans
- Federal Student Loan ($18,500)
- Auto Loan - Honda Civic ($15,200)
- Personal Loan ($4,500)
- Mortgage ($298,500)

### Sample Accounts
- Main Checking ($5,420)
- High-Yield Savings ($15,750)
- Emergency Fund ($12,000)
- 401k ($42,500)
- Roth IRA ($18,200)

Total Sample Assets: $93,870
Total Sample Liabilities: $336,700
Sample Net Worth: -$242,830 (mortgage-heavy portfolio)

## Features

### Loans Page Features
1. **Summary Dashboard** - Quick overview of debt situation
2. **Visual Progress** - Color-coded progress bars for each loan
3. **Inline Editing** - Update loan balances directly from the UI
4. **Auto Status Updates** - Loans automatically marked as paid off
5. **Type Icons** - Visual identification of loan types
6. **Responsive Design** - Works on all screen sizes

### Net Worth Page Features
1. **Hero Card** - Prominent display of total net worth with trend
2. **Comprehensive Breakdown** - Assets vs Liabilities
3. **Historical Trend** - Chart showing net worth over time
4. **Detailed Lists** - All accounts, savings goals, and loans itemized
5. **Debt Ratios** - Financial health indicators
6. **Monthly Change Tracking** - See progress month-over-month

## Data Flow

### Net Worth Calculation
```
Assets:
  + Cash & Accounts (checking, savings, cash, investment)
  + Savings Goals (current amounts)

Liabilities:
  + Credit Card Debt (negative credit card balances)
  + Loans (current balances)

Net Worth = Total Assets - Total Liabilities
```

### Automatic Updates
- Updating a loan balance triggers revalidation of both `/loans` and `/networth`
- Net worth view automatically recalculates based on latest data
- No manual recalculation needed

## Design Patterns

### Consistent UI Patterns
Following existing app patterns:
- Server components for data fetching
- Client components for interactivity
- BlurFade animations for smooth page loads
- Card-based layouts
- Color-coded categories (red for debt, green for assets)
- Inline editing pattern (similar to budget page)
- Summary cards with icons
- Progress visualization

### Type Safety
- Full TypeScript typing throughout
- Database types auto-generated
- Proper error handling
- Null checks for optional data

### Performance
- React cache() for query deduplication
- Server-side data fetching
- Optimistic UI updates
- Path revalidation for fresh data

## Setup Instructions

1. **Run the schema updates:**
   ```sql
   -- Execute supabase-schema.sql in Supabase SQL Editor
   -- This adds the loans table and net_worth_summary view
   ```

2. **Add seed data (optional):**
   ```sql
   -- Get your user ID
   SELECT id, email FROM auth.users;

   -- Replace 'YOUR_USER_ID' in supabase-seed-data.sql
   -- Execute the updated seed data script
   ```

3. **Verify RLS policies:**
   - All policies are automatically created by the schema
   - Users can only see their own loans
   - Net worth view respects user boundaries

4. **Test the features:**
   - Navigate to `/loans` to see loans page
   - Navigate to `/networth` to see net worth page
   - Try updating a loan balance
   - Verify net worth updates accordingly

## Future Enhancements

Potential improvements:
1. **Add Loan Form** - Complete the "Add Loan" functionality
2. **Payment History** - Track individual loan payments over time
3. **Amortization Schedules** - Show payment breakdowns
4. **Payoff Strategies** - Debt avalanche/snowball calculators
5. **Net Worth History** - Store monthly snapshots for real historical data
6. **Asset Allocation** - Pie charts for asset distribution
7. **Budget Impact** - Show how loan payments affect budgets
8. **Interest Calculations** - Track total interest paid
9. **Loan Refinancing** - Compare refinancing options
10. **Export Reports** - PDF/CSV exports for net worth statements

## Technical Notes

### Database Views
The `net_worth_summary` view provides real-time calculations without storing duplicate data. This ensures:
- Always up-to-date values
- No synchronization issues
- Efficient queries with proper indexing

### Type Definitions
All database types are maintained in `database.types.ts`:
- Keeps frontend and backend in sync
- Provides autocomplete in IDEs
- Catches type errors at compile time

### Caching Strategy
Query results are cached using React's cache() function:
- Deduplicates identical requests
- Works within a single request lifecycle
- Revalidates on data mutations

## Testing Checklist

- [ ] Loans page loads without errors
- [ ] Net worth page loads without errors
- [ ] Loan balances can be edited
- [ ] Net worth updates when loans change
- [ ] Empty states display correctly
- [ ] Charts render properly
- [ ] Responsive design works on mobile
- [ ] RLS policies protect user data
- [ ] Navigation links work correctly
- [ ] Calculations are accurate

## Conclusion

The Loans and Net Worth features provide comprehensive debt tracking and financial health monitoring. The implementation follows all existing patterns in the codebase, maintains type safety, and provides a smooth user experience with proper error handling and loading states.
