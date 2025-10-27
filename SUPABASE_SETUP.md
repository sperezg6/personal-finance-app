# Supabase Integration Setup Guide

This guide will help you set up and use the Supabase integration for your personal finance application.

## Overview

The application now uses Supabase as its backend database, providing:
- Real-time transaction tracking
- Budget management with automatic spending calculations
- Savings goal tracking
- User authentication and data isolation
- Server-side rendering with Next.js

## Prerequisites

- A Supabase account (free tier works great!)
- Your Supabase project URL and anon key
- Node.js 18+ installed

## Setup Instructions

### 1. Environment Variables

The `.env.local` file already contains your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cqzkxhbwegmlvmkuutxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Database Schema

The database schema is already defined in `supabase-schema.sql`. If you need to set up a new Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase-schema.sql`
4. Run the script to create all tables, policies, and functions

The schema includes:
- **profiles** - Extended user information
- **categories** - Transaction categories (system + custom)
- **accounts** - Bank accounts and credit cards
- **transactions** - Core financial transactions
- **budgets** - Monthly spending limits
- **savings_goals** - Savings targets and progress

### 3. Seed Data (Optional but Recommended)

To populate your database with sample data for testing:

1. Get your user ID by running this query in Supabase SQL Editor:
   ```sql
   SELECT id, email FROM auth.users;
   ```

2. Open `supabase-seed-data.sql`

3. Replace all occurrences of `'YOUR_USER_ID'` with your actual user ID (UUID)
   - There are 3 occurrences (one in each DO block)

4. Run the entire script in the Supabase SQL Editor

5. This will create:
   - 40+ sample transactions (last 28 days)
   - 6 budget categories with limits
   - 5 savings goals with progress

### 4. Verify Setup

After running the seed data, verify everything is working:

```sql
-- Check transaction count
SELECT COUNT(*) FROM transactions WHERE user_id = 'YOUR_USER_ID';

-- Check budgets
SELECT COUNT(*) FROM budgets WHERE user_id = 'YOUR_USER_ID';

-- Check savings goals
SELECT COUNT(*) FROM savings_goals WHERE user_id = 'YOUR_USER_ID';
```

## Application Features

### Transactions Page (`/transactions`)

- **Data Source**: Fetches from `transactions` table with category relationships
- **Features**:
  - View all transactions with categories and payment methods
  - Edit transactions inline (date, description, category, amount)
  - Delete transactions
  - Duplicate transactions
  - Summary cards showing total income, expenses, net balance
  - Last 28 days metrics

### Budget Page (`/budget`)

- **Data Source**: Fetches from `budgets` table with real-time spending calculations
- **Features**:
  - Budget cards with circular progress indicators
  - Real-time spending vs budget limits
  - Color-coded status (healthy, warning, over-budget)
  - Edit budget limits inline
  - Summary stats (total budget, spent, remaining, over-budget count)

### Savings Page (`/savings`)

- **Data Source**: Fetches from `savings_goals` table
- **Features**:
  - Interactive bubble chart visualization
  - Savings summary cards
  - Progress tracking for each goal
  - Monthly growth calculations

### Home Page (`/`)

- **Data Source**: Aggregated data from transactions
- **Features**:
  - Financial overview charts
  - Income, savings, and spending trends
  - 90-day historical data visualization

## Database Architecture

### Row Level Security (RLS)

All tables have RLS policies enabled to ensure users can only access their own data:

```sql
-- Example policy
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);
```

### Query Functions (`lib/db/queries.ts`)

Server-side queries using React's `cache()` for optimal performance:

- `getTransactions()` - Get transactions with filtering options
- `getDashboardMetrics()` - Calculate income, expenses, savings
- `getBudgetsWithSpending()` - Budgets with real-time spending
- `getBudgetSummary()` - Budget overview statistics
- `getSavingsGoals()` - All savings goals
- `getSavingsSummary()` - Savings overview statistics

### Action Functions (`lib/db/actions.ts`)

Server actions for data mutations:

- `createTransaction()`, `updateTransaction()`, `deleteTransaction()`
- `duplicateTransaction()`
- `createBudget()`, `updateBudget()`, `deleteBudget()`
- `createSavingsGoal()`, `updateSavingsGoal()`, `deleteSavingsGoal()`

All actions include automatic path revalidation for instant UI updates.

## Component Structure

### Server Components
- `app/transactions/page.tsx` - Fetches data server-side
- `app/budget/page.tsx` - Fetches budgets and summary
- `app/savings/page.tsx` - Fetches savings goals and summary
- `app/page.tsx` - Home dashboard

### Client Components
- `app/transactions/transactions-client.tsx` - Interactive transaction table
- `components/budget/budget-cards-client.tsx` - Budget management cards
- `components/savings/savings-summary-client.tsx` - Savings summary display
- `components/savings/bubble-chart.tsx` - Interactive savings visualization

## Data Flow

1. **Page Load**: Server component fetches data from Supabase
2. **Initial Render**: Data passed as props to client components
3. **User Interaction**: Client components call server actions
4. **Mutation**: Server action updates database
5. **Revalidation**: `router.refresh()` triggers server component re-fetch
6. **Re-render**: UI updates with fresh data

## Authentication

The app uses Supabase Auth with email/password:

- Login page: `/login`
- Signup page: `/signup`
- Test credentials (from `.env.local`):
  - Email: spg1824@gmail.com
  - Password: Santiago*2001

All pages check for authenticated user:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

If no user is authenticated, pages show a sign-in prompt.

## Development Workflow

### Adding New Features

1. **Database**: Update schema in `supabase-schema.sql`
2. **Types**: Regenerate types (if using type generation)
3. **Queries**: Add query functions in `lib/db/queries.ts`
4. **Actions**: Add mutation functions in `lib/db/actions.ts`
5. **UI**: Create/update components to use new data

### Testing

1. Use seed data for consistent test environment
2. Test with authenticated user
3. Verify RLS policies are working (try accessing other users' data)
4. Check real-time updates after mutations

## Troubleshooting

### No data showing up
- Verify you're logged in with the correct account
- Check that seed data was inserted for your user ID
- Look for errors in browser console
- Check Supabase logs in dashboard

### Permission errors
- Ensure RLS policies are correctly set up
- Verify user is authenticated
- Check that `user_id` matches `auth.uid()`

### Slow queries
- Check table indexes (already included in schema)
- Monitor query performance in Supabase dashboard
- Use React `cache()` for server-side query deduplication

## Summary of Changes

### Files Created
- `/lib/db/actions.ts` - Server actions for mutations
- `/app/transactions/transactions-client.tsx` - Client transaction component
- `/components/budget/budget-cards-client.tsx` - Client budget component
- `/components/savings/savings-summary-client.tsx` - Client savings summary
- `/SUPABASE_SETUP.md` - This file

### Files Modified
- `/app/transactions/page.tsx` - Now fetches from Supabase
- `/app/budget/page.tsx` - Now fetches from Supabase
- `/app/savings/page.tsx` - Now fetches from Supabase
- `/components/savings/bubble-chart.tsx` - Accepts dynamic goals data
- `/lib/db/queries.ts` - Added budget and savings queries
- `/supabase-seed-data.sql` - Enhanced with budgets and savings goals

### Data Sources
- **Before**: Static/mock data in components
- **After**: Real-time data from Supabase with proper authentication

### UI/Styling
- **No changes** - All existing UI and styling preserved exactly as before
- Only the data source layer was modified

## Next Steps

1. **Test the application**: Log in and explore all pages
2. **Verify data integrity**: Check that all numbers are calculating correctly
3. **Add more features**: Consider adding:
   - Transaction filtering and search
   - Date range selectors
   - Export functionality
   - Recurring transaction templates
   - Budget alerts and notifications
4. **Optimize performance**: Monitor and optimize slow queries
5. **Deploy**: Deploy to Vercel or another hosting platform

## Support

For issues or questions:
1. Check Supabase dashboard for errors
2. Review browser console for client-side errors
3. Check server logs for API errors
4. Verify environment variables are set correctly
