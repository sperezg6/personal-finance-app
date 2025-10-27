-- =====================================================
-- PERSONAL FINANCE APP - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This script creates the complete database schema for the personal finance app.
-- Run this in your Supabase SQL Editor.
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Extended User Information)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
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

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. CATEGORIES TABLE (Predefined + Custom)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    icon TEXT,
    color TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, type)
);

-- RLS Policies for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own categories and system categories" ON categories;
CREATE POLICY "Users can view own categories and system categories"
    ON categories FOR SELECT
    USING (user_id = auth.uid() OR user_id IS NULL OR is_system = TRUE);

DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
CREATE POLICY "Users can insert own categories"
    ON categories FOR INSERT
    WITH CHECK (user_id = auth.uid() AND is_system = FALSE);

DROP POLICY IF EXISTS "Users can update own categories" ON categories;
CREATE POLICY "Users can update own categories"
    ON categories FOR UPDATE
    USING (user_id = auth.uid() AND is_system = FALSE);

DROP POLICY IF EXISTS "Users can delete own categories" ON categories;
CREATE POLICY "Users can delete own categories"
    ON categories FOR DELETE
    USING (user_id = auth.uid() AND is_system = FALSE);

-- Insert default system categories (only if they don't exist)
INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Salary', 'income', 'briefcase', 'rgb(16 185 129)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Salary' AND type = 'income' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Freelance', 'income', 'laptop', 'rgb(59 130 246)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Freelance' AND type = 'income' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Investment', 'income', 'trending-up', 'rgb(99 102 241)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Investment' AND type = 'income' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Other Income', 'income', 'dollar-sign', 'rgb(139 92 246)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Other Income' AND type = 'income' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Food & Dining', 'expense', 'utensils', 'rgb(239 68 68)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Food & Dining' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Transport', 'expense', 'car', 'rgb(59 130 246)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Transport' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Rent', 'expense', 'home', 'rgb(234 179 8)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Rent' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Entertainment', 'expense', 'gamepad', 'rgb(139 92 246)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Shopping', 'expense', 'shopping-bag', 'rgb(249 115 22)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Shopping' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Utilities', 'expense', 'zap', 'rgb(16 185 129)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Utilities' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Healthcare', 'expense', 'heart', 'rgb(99 102 241)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Healthcare' AND type = 'expense' AND is_system = TRUE);

INSERT INTO categories (user_id, name, type, icon, color, is_system)
SELECT NULL, 'Other', 'expense', 'more-horizontal', 'rgb(156 163 175)', TRUE
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Other' AND type = 'expense' AND is_system = TRUE);

-- =====================================================
-- 3. ACCOUNTS TABLE (Bank Accounts, Credit Cards, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment')) NOT NULL,
    balance DECIMAL(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    institution TEXT,
    last_four TEXT,
    color TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own accounts" ON accounts;
CREATE POLICY "Users can view own accounts"
    ON accounts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own accounts" ON accounts;
CREATE POLICY "Users can insert own accounts"
    ON accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;
CREATE POLICY "Users can update own accounts"
    ON accounts FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own accounts" ON accounts;
CREATE POLICY "Users can delete own accounts"
    ON accounts FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 4. TRANSACTIONS TABLE (Core Financial Data)
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    payment_method TEXT,
    merchant TEXT,
    notes TEXT,
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- RLS Policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 5. BUDGETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    monthly_limit DECIMAL(12, 2) NOT NULL,
    period_start DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    period_end DATE NOT NULL DEFAULT (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    rollover_unused BOOLEAN DEFAULT FALSE,
    alert_at_percentage INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id, period_start)
);

-- RLS Policies for budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own budgets" ON budgets;
CREATE POLICY "Users can view own budgets"
    ON budgets FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own budgets" ON budgets;
CREATE POLICY "Users can insert own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own budgets" ON budgets;
CREATE POLICY "Users can update own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own budgets" ON budgets;
CREATE POLICY "Users can delete own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 6. SAVINGS GOALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS savings_goals (
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

DROP POLICY IF EXISTS "Users can manage own savings goals" ON savings_goals;
CREATE POLICY "Users can manage own savings goals"
    ON savings_goals FOR ALL
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
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
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
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_savings_goals_updated_at ON savings_goals;
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals
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

-- =====================================================
-- 7. LOANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    loan_type TEXT CHECK (loan_type IN ('mortgage', 'auto', 'student', 'personal', 'credit_card', 'business', 'other')) NOT NULL,
    principal_amount DECIMAL(12, 2) NOT NULL,
    current_balance DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 0,
    monthly_payment DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    lender TEXT,
    status TEXT CHECK (status IN ('active', 'paid_off', 'deferred')) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for loans
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own loans" ON loans;
CREATE POLICY "Users can view own loans"
    ON loans FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own loans" ON loans;
CREATE POLICY "Users can insert own loans"
    ON loans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own loans" ON loans;
CREATE POLICY "Users can update own loans"
    ON loans FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own loans" ON loans;
CREATE POLICY "Users can delete own loans"
    ON loans FOR DELETE
    USING (auth.uid() = user_id);

-- Apply updated_at trigger to loans table
DROP TRIGGER IF EXISTS update_loans_updated_at ON loans;
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- NET WORTH CALCULATION VIEW
-- =====================================================

-- View: Net Worth Summary
CREATE OR REPLACE VIEW net_worth_summary AS
SELECT
    u.id as user_id,
    -- Assets
    COALESCE(SUM(CASE WHEN a.type IN ('checking', 'savings', 'cash', 'investment') THEN a.balance ELSE 0 END), 0) as cash_and_accounts,
    COALESCE(SUM(sg.current_amount), 0) as savings_goals_total,
    -- Liabilities
    COALESCE(SUM(CASE WHEN a.type = 'credit_card' AND a.balance < 0 THEN ABS(a.balance) ELSE 0 END), 0) as credit_card_debt,
    COALESCE(SUM(l.current_balance), 0) as loans_total,
    -- Net Worth Calculation
    COALESCE(SUM(CASE WHEN a.type IN ('checking', 'savings', 'cash', 'investment') THEN a.balance ELSE 0 END), 0) +
    COALESCE(SUM(sg.current_amount), 0) -
    COALESCE(SUM(CASE WHEN a.type = 'credit_card' AND a.balance < 0 THEN ABS(a.balance) ELSE 0 END), 0) -
    COALESCE(SUM(l.current_balance), 0) as net_worth
FROM auth.users u
LEFT JOIN accounts a ON a.user_id = u.id AND a.is_active = TRUE
LEFT JOIN savings_goals sg ON sg.user_id = u.id AND sg.is_completed = FALSE
LEFT JOIN loans l ON l.user_id = u.id AND l.status = 'active'
GROUP BY u.id;
