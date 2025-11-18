# How to Apply the Savings Migration

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Copy the Migration SQL

The migration file is located at:
```
/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2/supabase/migrations/enhance_savings_with_transactions.sql
```

Open this file and **copy all the contents** (435 lines).

### Step 3: Run the Migration

1. In Supabase SQL Editor, click **"New Query"**
2. Paste the entire SQL migration
3. Click **"Run"** (or press Cmd+Enter)

### Step 4: Verify Migration Success

After running the migration, you should see:
```
✅ Migration completed successfully!
Run: SELECT * FROM verify_savings_migration(); to verify.
```

### Step 5: Run Verification

In a new query window, run:
```sql
SELECT * FROM verify_savings_migration();
```

**Expected Result** (all checks should PASS):
```
check_name              | status    | details
-----------------------|-----------|----------------------------------------
Table Rename           | ✅ PASS   | savings_goals renamed to savings_accounts
Transaction Type       | ✅ PASS   | Transactions support type = savings
Savings Account ID     | ✅ PASS   | transactions.savings_account_id column added
Balance Sync Trigger   | ✅ PASS   | Automatic balance update trigger created
Goal Complete Trigger  | ✅ PASS   | Automatic goal completion trigger created
Net Worth View         | ✅ PASS   | net_worth_summary view uses savings_accounts
```

If any check shows ❌ FAIL, let me know which one and I'll help debug.

---

## ✅ What Changed

After running this migration:

### Database Changes
- ✅ `savings_goals` table renamed to `savings_accounts`
- ✅ `target_amount` is now optional (can be NULL)
- ✅ `transactions` table now supports type='savings'
- ✅ `transactions` table has new column `savings_account_id`
- ✅ Two new triggers created (balance sync + goal completion)
- ✅ `net_worth_summary` view updated

### Your Data
- ✅ **All existing savings goals are preserved**
- ✅ All balances remain unchanged
- ✅ All other tables untouched (transactions, budgets, loans, etc.)

---

## 🧪 Quick Test

After migration, you can test the new system:

### Test 1: Create a Savings Account
```sql
INSERT INTO savings_accounts (user_id, name, current_amount, color, icon)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Savings',
  0,
  'rgb(16 185 129)',
  'piggy-bank'
);
```

### Test 2: Add a Savings Transaction
```sql
INSERT INTO transactions (
  user_id,
  type,
  amount,
  savings_account_id,
  description,
  date
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'savings',
  500,
  (SELECT id FROM savings_accounts WHERE name = 'Test Savings'),
  'Test deposit',
  CURRENT_DATE
);
```

### Test 3: Verify Balance Updated Automatically
```sql
SELECT name, current_amount
FROM savings_accounts
WHERE name = 'Test Savings';
```

**Expected:** `current_amount` should be 500 (automatically updated by trigger!)

---

## 🔄 Rollback (If Needed)

If something goes wrong and you need to rollback:

```sql
-- 1. Rename table back
ALTER TABLE savings_accounts RENAME TO savings_goals;

-- 2. Remove savings transaction type
ALTER TABLE transactions DROP CONSTRAINT transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense'));

-- 3. Remove savings_account_id column
ALTER TABLE transactions DROP COLUMN savings_account_id;

-- 4. Drop triggers
DROP TRIGGER IF EXISTS sync_savings_account_balance ON transactions;
DROP TRIGGER IF EXISTS auto_complete_savings_goal ON savings_accounts;

-- 5. Recreate old view
-- (Copy from original schema)
```

---

## ❓ Troubleshooting

### Error: "relation 'savings_goals' does not exist"
**Cause:** Table might already be renamed
**Solution:** Check if `savings_accounts` table exists

### Error: "constraint already exists"
**Cause:** Migration was partially run before
**Solution:** Drop the constraint first, then re-run

### Error: "column already exists"
**Cause:** Column was added in previous attempt
**Solution:** Skip that ALTER TABLE statement

---

## 📞 Need Help?

If you encounter any issues:
1. Copy the error message
2. Check which line number failed
3. Let me know and I'll help debug

---

## ✨ Next Steps

After successful migration:
1. ✅ **Close this window** - migration done!
2. ✅ **I'll update the TypeScript types**
3. ✅ **I'll update queries and actions**
4. ✅ **I'll update UI components**
5. ✅ **Test the new savings system**

Ready to proceed? 🚀
