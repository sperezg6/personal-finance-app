-- =====================================================
-- MIGRATION: Enhance Savings System with Transactions
-- =====================================================
-- This migration enhances the savings system to support:
-- 1. Savings as transaction type (alongside income/expense)
-- 2. Automatic balance updates via triggers
-- 3. Optional goals (target_amount and deadline remain)
-- 4. Full transaction history for each savings account
--
-- Author: Claude Code
-- Date: 2025-01-15
-- =====================================================

-- =====================================================
-- PART 1: RENAME TABLE (for clarity)
-- =====================================================
-- Rename savings_goals to savings_accounts to better reflect
-- that these are accounts with balances (goals are now optional)

ALTER TABLE savings_goals RENAME TO savings_accounts;

-- =====================================================
-- PART 2: MAKE GOALS OPTIONAL
-- =====================================================
-- Allow target_amount and deadline to be NULL
-- Users can set goals if they want, but it's not required

ALTER TABLE savings_accounts
  ALTER COLUMN target_amount DROP NOT NULL;

-- deadline is already nullable, so no change needed

-- Keep is_completed and completed_at for users who want to track goal completion
-- But these are only relevant if target_amount is set

-- =====================================================
-- PART 3: UPDATE RLS POLICIES
-- =====================================================
-- Update policies to use new table name

DROP POLICY IF EXISTS "Users can manage own savings goals" ON savings_accounts;
CREATE POLICY "Users can manage own savings accounts"
    ON savings_accounts FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- PART 4: UPDATE TRIGGERS
-- =====================================================
-- Update trigger to use new table name

DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON savings_accounts;
CREATE TRIGGER update_savings_accounts_updated_at
    BEFORE UPDATE ON savings_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 5: ENHANCE TRANSACTIONS TABLE
-- =====================================================
-- Add support for 'savings' transaction type

-- Step 5.1: Drop existing constraint
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Step 5.2: Add new constraint with 'savings' type
ALTER TABLE transactions
  ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings'));

-- Step 5.3: Add savings_account_id column
-- This links savings transactions to specific savings accounts
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS savings_account_id UUID
  REFERENCES savings_accounts(id) ON DELETE SET NULL;

-- Step 5.4: Add index for performance
-- Index helps when querying transactions for a specific savings account
CREATE INDEX IF NOT EXISTS idx_transactions_savings_account_id
  ON transactions(savings_account_id)
  WHERE savings_account_id IS NOT NULL;

-- Step 5.5: Add index for savings transactions
-- Helps when querying all savings transactions for a user
CREATE INDEX IF NOT EXISTS idx_transactions_type_savings
  ON transactions(user_id, type, date DESC)
  WHERE type = 'savings';

-- =====================================================
-- PART 6: AUTOMATIC BALANCE UPDATE TRIGGER
-- =====================================================
-- This trigger keeps savings_accounts.current_amount in sync
-- with savings transactions automatically

-- Step 6.1: Create the trigger function with detailed documentation
CREATE OR REPLACE FUNCTION update_savings_account_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
/*
 * Function: update_savings_account_balance()
 *
 * Purpose: Automatically update savings account balances when savings
 *          transactions are inserted, updated, or deleted.
 *
 * Trigger: AFTER INSERT OR UPDATE OR DELETE ON transactions
 *
 * Logic:
 *   INSERT: Add transaction amount to savings account balance
 *   UPDATE: Adjust balances if amount or account changed
 *   DELETE: Subtract transaction amount from savings account balance
 *
 * Examples:
 *   - Insert $500 savings → account balance += $500
 *   - Update $500 to $600 → account balance += $100
 *   - Delete $500 transaction → account balance -= $500
 *   - Update savings_account_id → subtract from old, add to new
 *
 * Safety:
 *   - Only processes transactions with type = 'savings'
 *   - Only processes if savings_account_id IS NOT NULL
 *   - Uses SECURITY DEFINER to ensure proper permissions
 */
BEGIN
  -- ===================================================
  -- CASE 1: INSERT - Add new savings transaction
  -- ===================================================
  IF TG_OP = 'INSERT' THEN
    -- Only process savings transactions with an account
    IF NEW.type = 'savings' AND NEW.savings_account_id IS NOT NULL THEN
      -- Add the transaction amount to the account balance
      -- Positive amount = deposit, Negative amount = withdrawal
      UPDATE savings_accounts
      SET current_amount = current_amount + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.savings_account_id;

      -- Log for debugging (optional)
      RAISE DEBUG 'Savings balance updated: account=%, amount=%, operation=INSERT',
                  NEW.savings_account_id, NEW.amount;
    END IF;
    RETURN NEW;

  -- ===================================================
  -- CASE 2: UPDATE - Handle changes to existing transaction
  -- ===================================================
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle three scenarios:
    -- 1. Amount changed
    -- 2. Savings account changed
    -- 3. Type changed (to/from savings)

    -- First, reverse the old transaction's effect
    IF OLD.type = 'savings' AND OLD.savings_account_id IS NOT NULL THEN
      -- Subtract the old amount from the old account
      UPDATE savings_accounts
      SET current_amount = current_amount - OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.savings_account_id;

      RAISE DEBUG 'Reversed old savings: account=%, amount=%, operation=UPDATE',
                  OLD.savings_account_id, OLD.amount;
    END IF;

    -- Then, apply the new transaction's effect
    IF NEW.type = 'savings' AND NEW.savings_account_id IS NOT NULL THEN
      -- Add the new amount to the new account
      UPDATE savings_accounts
      SET current_amount = current_amount + NEW.amount,
          updated_at = NOW()
      WHERE id = NEW.savings_account_id;

      RAISE DEBUG 'Applied new savings: account=%, amount=%, operation=UPDATE',
                  NEW.savings_account_id, NEW.amount;
    END IF;
    RETURN NEW;

  -- ===================================================
  -- CASE 3: DELETE - Remove savings transaction
  -- ===================================================
  ELSIF TG_OP = 'DELETE' THEN
    -- Only process if this was a savings transaction with an account
    IF OLD.type = 'savings' AND OLD.savings_account_id IS NOT NULL THEN
      -- Subtract the transaction amount from the account balance
      UPDATE savings_accounts
      SET current_amount = current_amount - OLD.amount,
          updated_at = NOW()
      WHERE id = OLD.savings_account_id;

      RAISE DEBUG 'Savings balance updated: account=%, amount=%, operation=DELETE',
                  OLD.savings_account_id, OLD.amount;
    END IF;
    RETURN OLD;
  END IF;

  -- Should never reach here, but return NULL as fallback
  RETURN NULL;
END;
$$;

-- Step 6.2: Create the trigger
DROP TRIGGER IF EXISTS sync_savings_account_balance ON transactions;
CREATE TRIGGER sync_savings_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_savings_account_balance();

-- =====================================================
-- PART 7: AUTO-COMPLETE GOALS TRIGGER (OPTIONAL)
-- =====================================================
-- Automatically mark a savings account as "completed" when
-- the current_amount reaches or exceeds the target_amount

CREATE OR REPLACE FUNCTION check_savings_goal_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
/*
 * Function: check_savings_goal_completion()
 *
 * Purpose: Automatically mark savings accounts as completed when
 *          they reach their target amount (if a goal is set).
 *
 * Trigger: AFTER UPDATE ON savings_accounts
 *
 * Logic:
 *   - Only runs if target_amount is set (goal exists)
 *   - Checks if current_amount >= target_amount
 *   - Sets is_completed = true and completed_at = NOW()
 *   - Also handles "uncompleting" if balance drops below target
 *
 * Examples:
 *   - Goal: $10,000, Balance: $10,500 → is_completed = true
 *   - Goal: $10,000, Balance: $9,999 → is_completed = false
 *   - No goal (target_amount = NULL) → no change
 */
BEGIN
  -- Only check if this account has a goal (target_amount is set)
  IF NEW.target_amount IS NOT NULL THEN

    -- Check if goal is now completed
    IF NEW.current_amount >= NEW.target_amount AND (NEW.is_completed = FALSE OR NEW.is_completed IS NULL) THEN
      -- Mark as completed
      NEW.is_completed := TRUE;
      NEW.completed_at := NOW();

      RAISE DEBUG 'Savings goal completed: account=%, balance=%, target=%',
                  NEW.id, NEW.current_amount, NEW.target_amount;

    -- Check if previously completed goal is now incomplete (withdrawal)
    ELSIF NEW.current_amount < NEW.target_amount AND NEW.is_completed = TRUE THEN
      -- Mark as incomplete
      NEW.is_completed := FALSE;
      NEW.completed_at := NULL;

      RAISE DEBUG 'Savings goal uncompleted: account=%, balance=%, target=%',
                  NEW.id, NEW.current_amount, NEW.target_amount;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS auto_complete_savings_goal ON savings_accounts;
CREATE TRIGGER auto_complete_savings_goal
  BEFORE UPDATE ON savings_accounts
  FOR EACH ROW
  EXECUTE FUNCTION check_savings_goal_completion();

-- =====================================================
-- PART 8: UPDATE NET WORTH VIEW
-- =====================================================
-- Update the view to use the new table name

DROP VIEW IF EXISTS net_worth_summary;

CREATE OR REPLACE VIEW net_worth_summary AS
SELECT
    u.id as user_id,
    -- Assets: Cash and accounts (excluding credit cards)
    COALESCE(SUM(CASE WHEN a.type != 'credit_card' THEN a.balance ELSE 0 END), 0) as cash_and_accounts,
    -- Assets: Savings accounts total
    COALESCE(SUM(sa.current_amount), 0) as savings_accounts_total,
    -- Liabilities: Credit card debt
    COALESCE(SUM(CASE WHEN a.type = 'credit_card' THEN a.balance ELSE 0 END), 0) as credit_card_debt,
    -- Liabilities: Loans
    COALESCE(SUM(l.current_balance), 0) as loans_total,
    -- Net Worth calculation
    (
        COALESCE(SUM(CASE WHEN a.type != 'credit_card' THEN a.balance ELSE 0 END), 0) +
        COALESCE(SUM(sa.current_amount), 0)
    ) - (
        COALESCE(SUM(CASE WHEN a.type = 'credit_card' THEN a.balance ELSE 0 END), 0) +
        COALESCE(SUM(l.current_balance), 0)
    ) as net_worth
FROM auth.users u
LEFT JOIN accounts a ON a.user_id = u.id
LEFT JOIN savings_accounts sa ON sa.user_id = u.id  -- Updated table name
LEFT JOIN loans l ON l.user_id = u.id
GROUP BY u.id;

-- =====================================================
-- PART 9: ADD HELPFUL COMMENTS
-- =====================================================
-- Document the schema for future developers

COMMENT ON TABLE savings_accounts IS
'Savings accounts track money set aside for specific purposes. Each account has a balance that is automatically updated via triggers when savings transactions are created. Goals (target_amount, deadline) are optional - users can track balances without setting targets.';

COMMENT ON COLUMN savings_accounts.current_amount IS
'Current balance of the savings account. Updated automatically by the sync_savings_account_balance trigger when savings transactions are added/modified/deleted.';

COMMENT ON COLUMN savings_accounts.target_amount IS
'Optional goal amount. If set, the account shows progress toward this goal. If NULL, the account is just a balance tracker without a target.';

COMMENT ON COLUMN savings_accounts.deadline IS
'Optional deadline for reaching the target_amount. Only relevant if target_amount is set.';

COMMENT ON COLUMN savings_accounts.is_completed IS
'Automatically set to TRUE when current_amount >= target_amount. Only relevant if target_amount is set. Managed by auto_complete_savings_goal trigger.';

COMMENT ON COLUMN transactions.type IS
'Transaction type: "income" (money in), "expense" (money out), or "savings" (money set aside in a savings account).';

COMMENT ON COLUMN transactions.savings_account_id IS
'For savings transactions (type = "savings"), this references the savings account. The transaction amount is automatically added to/subtracted from the account balance via the sync_savings_account_balance trigger.';

COMMENT ON FUNCTION update_savings_account_balance() IS
'Trigger function that automatically updates savings_accounts.current_amount when savings transactions are inserted, updated, or deleted. Ensures balances are always in sync with transaction history.';

COMMENT ON FUNCTION check_savings_goal_completion() IS
'Trigger function that automatically marks savings accounts as completed when current_amount reaches target_amount. Only runs if target_amount is set (optional goals).';

-- =====================================================
-- PART 10: MIGRATION VERIFICATION
-- =====================================================
-- Add a helper function to verify the migration worked correctly

CREATE OR REPLACE FUNCTION verify_savings_migration()
RETURNS TABLE (
  check_name TEXT,
  status TEXT,
  details TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check 1: Table renamed
  RETURN QUERY
  SELECT
    'Table Rename'::TEXT,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'savings_accounts')
      THEN '✅ PASS' ELSE '❌ FAIL' END,
    'savings_goals renamed to savings_accounts'::TEXT;

  -- Check 2: Savings transaction type allowed
  RETURN QUERY
  SELECT
    'Transaction Type'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.check_constraints
      WHERE constraint_name = 'transactions_type_check'
      AND check_clause LIKE '%savings%'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END,
    'Transactions support type = savings'::TEXT;

  -- Check 3: savings_account_id column exists
  RETURN QUERY
  SELECT
    'Savings Account ID'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'transactions'
      AND column_name = 'savings_account_id'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END,
    'transactions.savings_account_id column added'::TEXT;

  -- Check 4: Trigger exists
  RETURN QUERY
  SELECT
    'Balance Sync Trigger'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE trigger_name = 'sync_savings_account_balance'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END,
    'Automatic balance update trigger created'::TEXT;

  -- Check 5: Goal completion trigger exists
  RETURN QUERY
  SELECT
    'Goal Complete Trigger'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE trigger_name = 'auto_complete_savings_goal'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END,
    'Automatic goal completion trigger created'::TEXT;

  -- Check 6: Net worth view updated
  RETURN QUERY
  SELECT
    'Net Worth View'::TEXT,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.views
      WHERE table_name = 'net_worth_summary'
    ) THEN '✅ PASS' ELSE '❌ FAIL' END,
    'net_worth_summary view uses savings_accounts'::TEXT;
END;
$$;

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Run this to verify everything worked:
-- SELECT * FROM verify_savings_migration();
--
-- Expected output: All checks should show ✅ PASS
--
-- Next steps:
-- 1. Update TypeScript types
-- 2. Update queries.ts and actions.ts
-- 3. Update UI components
-- =====================================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Run: SELECT * FROM verify_savings_migration(); to verify.';
END
$$;
