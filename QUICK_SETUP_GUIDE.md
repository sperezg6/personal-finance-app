# Quick Setup Guide - Home Page Supabase Integration

## Prerequisites
- Supabase project already set up
- Credentials in `.env.local`
- User account created in Supabase

## 5-Step Quick Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2
npm install zod
```

### Step 2: Create Database Schema (5 minutes)

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Copy contents of `supabase-schema.sql`
6. Paste and click **Run**
7. Wait for "Success" message

### Step 3: Get Your User ID (1 minute)

In Supabase SQL Editor, run:
```sql
SELECT id, email FROM auth.users;
```

Copy your UUID (looks like: `abc12345-6789-...`)

### Step 4: Add Sample Data (3 minutes)

1. Open `supabase-seed-data.sql` in editor
2. Line 12: Replace `'YOUR_USER_ID'` with your UUID from Step 3
3. Copy the entire file
4. Paste in Supabase SQL Editor
5. Click **Run**

### Step 5: Test Application (2 minutes)

```bash
npm run dev
```

Navigate to: http://localhost:3003

You should see:
- Your name in greeting
- Real financial metrics
- Spending breakdown chart
- Recent transactions

## Verification Checklist

Run this SQL query in Supabase to verify:

```sql
-- Check transactions inserted
SELECT COUNT(*) as transaction_count
FROM transactions
WHERE user_id = 'YOUR_USER_ID';
-- Should return ~35

-- Check categories exist
SELECT COUNT(*) as category_count
FROM categories
WHERE is_system = true;
-- Should return 12

-- View your data
SELECT
  t.date,
  t.description,
  t.amount,
  t.type,
  c.name as category
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = 'YOUR_USER_ID'
ORDER BY t.date DESC
LIMIT 10;
```

## Troubleshooting

### "Not authenticated" error
```bash
# Clear browser storage
# Log out and log back in
```

### No data showing
```sql
-- Verify your user_id in seed script matches
SELECT id, email FROM auth.users;
```

### Type errors in IDE
```bash
npm install
# Restart TypeScript server in VS Code
```

## What's Next?

After verifying the home page works:

1. **Add Transaction Form** - Allow users to create transactions
2. **Connect Transactions Page** - Show full transaction list
3. **Budget Integration** - Link budgets to spending
4. **Export Data** - Download reports

## Files Reference

| File | Purpose |
|------|---------|
| `supabase-schema.sql` | Database schema to run in Supabase |
| `supabase-seed-data.sql` | Sample data for testing |
| `IMPLEMENTATION_COMPLETE.md` | Full documentation |
| `HOME_PAGE_ANALYSIS_AND_IMPLEMENTATION_PLAN.md` | Original analysis |

## Key Commands

```bash
# Start dev server
npm run dev

# Install dependencies
npm install

# Check for type errors
npm run type-check

# Build for production
npm run build
```

## Expected Results

### Home Page Should Display:

**Header:**
- "Good morning/afternoon/evening, [Your Name]"
- "Here is your finance summary"

**Metrics Cards:**
- Total Income: ~$6,700
- Total Expenses: ~$2,400
- Net Savings: ~$4,300
- Savings Rate: ~64%

**Spending Breakdown:**
- Pie chart with categories
- Food & Dining: ~$750
- Rent: $1,800
- Transport: ~$260
- Shopping: ~$370
- Entertainment: ~$200
- Utilities: ~$250

**Recent Transactions:**
- Last 5 transactions
- With descriptions, amounts, dates

## Support

If something doesn't work:
1. Check browser console for errors
2. Check Supabase logs
3. Verify RLS policies are enabled
4. Ensure user_id matches in seed data

## Quick Links

- Supabase Dashboard: https://app.supabase.com
- Local App: http://localhost:3003
- Supabase Docs: https://supabase.com/docs

---

**Total Setup Time: ~15 minutes**
