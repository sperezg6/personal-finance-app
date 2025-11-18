-- =====================================================
-- MIGRATION: Transform Savings Goals to Savings Accounts
-- =====================================================
-- This migration transforms the savings system from goal-based
-- to account-based (like bank accounts), and adds support for
-- savings transactions.
-- =====================================================

-- Step 1: Rename savings_goals to savings_accounts
ALTER TABLE savings_goals RENAME TO savings_accounts;

-- Step 2: Drop goal-related columns
ALTER TABLE savings_accounts
  DROP COLUMN IF EXISTS target_amount,
  DROP COLUMN IF EXISTS deadline,
  DROP COLUMN IF EXISTS is_completed,
  DROP COLUMN IF EXISTS completed_at;

-- Step 3: Update RLS policies to use new table name
DROP POLICY IF EXISTS "Users can manage own savings goals" ON savings_accounts;
CREATE POLICY "Users can manage own savings accounts"
    ON savings_accounts FOR ALL
    USING (auth.uid() = user_id);

-- Step 4: Update triggers to use new table name
DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON savings_accounts;
CREATE TRIGGER update_savings_accounts_updated_at
    BEFORE UPDATE ON savings_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Modify transactions table to support 'savings' type
-- First, drop the existing constraint
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Add new constraint with 'savings' type
ALTER TABLE transactions
  ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings'));

-- Step 6: Add savings_account_id to transactions
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS savings_account_id UUID REFERENCES savings_accounts(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_savings_account_id
  ON transactions(savings_account_id) WHERE savings_account_id IS NOT NULL;

-- Step 7: Create trigger to automatically update savings_accounts.current_amount
-- when savings transactions are added/updated/deleted

CREATE OR REPLACE FUNCTION update_savings_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Add to savings account balance
    IF NEW.type = 'savings' AND NEW.savings_account_id IS NOT NULL THEN
      UPDATE savings_accounts
      SET current_amount = current_amount + NEW.amount
      WHERE id = NEW.savings_account_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle changes to amount or savings_account_id
    IF OLD.type = 'savings' AND OLD.savings_account_id IS NOT NULL THEN
      -- Subtract old amount from old account
      UPDATE savings_accounts
      SET current_amount = current_amount - OLD.amount
      WHERE id = OLD.savings_account_id;
    END IF;

    IF NEW.type = 'savings' AND NEW.savings_account_id IS NOT NULL THEN
      -- Add new amount to new account
      UPDATE savings_accounts
      SET current_amount = current_amount + NEW.amount
      WHERE id = NEW.savings_account_id;
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    -- Subtract from savings account balance
    IF OLD.type = 'savings' AND OLD.savings_account_id IS NOT NULL THEN
      UPDATE savings_accounts
      SET current_amount = current_amount - OLD.amount
      WHERE id = OLD.savings_account_id;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS sync_savings_account_balance ON transactions;
CREATE TRIGGER sync_savings_account_balance
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_savings_account_balance();

-- Step 8: Update net_worth_summary view to use new table name
DROP VIEW IF EXISTS net_worth_summary;

CREATE OR REPLACE VIEW net_worth_summary AS
SELECT
    u.id as user_id,
    COALESCE(SUM(CASE WHEN a.type != 'credit_card' THEN a.balance ELSE 0 END), 0) as cash_and_accounts,
    COALESCE(SUM(sa.current_amount), 0) as savings_accounts_total,
    COALESCE(SUM(CASE WHEN a.type = 'credit_card' THEN a.balance ELSE 0 END), 0) as credit_card_debt,
    COALESCE(SUM(l.current_balance), 0) as loans_total,
    (
        COALESCE(SUM(CASE WHEN a.type != 'credit_card' THEN a.balance ELSE 0 END), 0) +
        COALESCE(SUM(sa.current_amount), 0)
    ) - (
        COALESCE(SUM(CASE WHEN a.type = 'credit_card' THEN a.balance ELSE 0 END), 0) +
        COALESCE(SUM(l.current_balance), 0)
    ) as net_worth
FROM auth.users u
LEFT JOIN accounts a ON a.user_id = u.id
LEFT JOIN savings_accounts sa ON sa.user_id = u.id
LEFT JOIN loans l ON l.user_id = u.id
GROUP BY u.id;

-- Step 9: Add some default savings account categories (optional)
-- Users can customize these or add their own

COMMENT ON TABLE savings_accounts IS 'Savings accounts track money set aside for specific purposes (Emergency Fund, Investments, etc.). Works like bank accounts with balances updated via savings transactions.';

COMMENT ON COLUMN transactions.savings_account_id IS 'For savings-type transactions, references the savings account being deposited to or withdrawn from.';

COMMENT ON COLUMN transactions.type IS 'Transaction type: income (money in), expense (money out), savings (money set aside).';

-- =====================================================
-- Migration complete!
-- =====================================================
-- Next steps:
-- 1. Update queries.ts to use savings_accounts instead of savings_goals
-- 2. Update actions.ts to create savings transactions
-- 3. Update UI components to show balances instead of goals
-- =====================================================
