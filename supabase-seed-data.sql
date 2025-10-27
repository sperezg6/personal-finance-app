-- =====================================================
-- SAMPLE SEED DATA FOR TESTING
-- =====================================================
-- This script creates sample transactions for testing the home page
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- You can get this by running: SELECT id, email FROM auth.users;
-- =====================================================

-- First, get the category IDs we'll need
-- Run this query first to see available categories:
-- SELECT id, name, type FROM categories WHERE is_system = true;

-- =====================================================
-- SAMPLE TRANSACTIONS (Last 28 Days)
-- =====================================================

-- Replace 'YOUR_USER_ID' with your actual user ID
DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
  v_salary_cat UUID;
  v_food_cat UUID;
  v_transport_cat UUID;
  v_rent_cat UUID;
  v_entertainment_cat UUID;
  v_shopping_cat UUID;
  v_utilities_cat UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_salary_cat FROM categories WHERE name = 'Salary' AND type = 'income' AND is_system = true LIMIT 1;
  SELECT id INTO v_food_cat FROM categories WHERE name = 'Food & Dining' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_transport_cat FROM categories WHERE name = 'Transport' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_rent_cat FROM categories WHERE name = 'Rent' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_entertainment_cat FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_shopping_cat FROM categories WHERE name = 'Shopping' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_utilities_cat FROM categories WHERE name = 'Utilities' AND type = 'expense' AND is_system = true LIMIT 1;

  -- Income transactions
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method)
  VALUES
    (v_user_id, v_salary_cat, CURRENT_DATE - INTERVAL '1 day', 'Monthly Salary - December', 5500.00, 'income', 'Bank Transfer'),
    (v_user_id, v_salary_cat, CURRENT_DATE - INTERVAL '15 days', 'Bonus Payment', 1200.00, 'income', 'Bank Transfer');

  -- Rent
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method, merchant)
  VALUES
    (v_user_id, v_rent_cat, CURRENT_DATE - INTERVAL '2 days', 'Monthly Rent Payment', 1800.00, 'expense', 'Bank Transfer', 'Property Management Co');

  -- Food & Dining (multiple entries)
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method, merchant)
  VALUES
    (v_user_id, v_food_cat, CURRENT_DATE, 'Lunch at downtown cafe', 24.50, 'expense', 'Credit Card', 'Downtown Cafe'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '1 day', 'Grocery shopping', 127.83, 'expense', 'Debit Card', 'Whole Foods'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '2 days', 'Coffee and pastry', 12.75, 'expense', 'Credit Card', 'Starbucks'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '3 days', 'Dinner with friends', 85.20, 'expense', 'Credit Card', 'Italian Restaurant'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '5 days', 'Grocery shopping', 156.42, 'expense', 'Debit Card', 'Trader Joes'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '7 days', 'Takeout dinner', 32.50, 'expense', 'Credit Card', 'Thai Palace'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '10 days', 'Weekend brunch', 48.90, 'expense', 'Credit Card', 'Sunday Brunch Spot'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '12 days', 'Grocery shopping', 143.67, 'expense', 'Debit Card', 'Whole Foods'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '14 days', 'Fast food lunch', 15.30, 'expense', 'Debit Card', 'Chipotle'),
    (v_user_id, v_food_cat, CURRENT_DATE - INTERVAL '18 days', 'Grocery shopping', 98.25, 'expense', 'Debit Card', 'Safeway');

  -- Transport
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method, merchant)
  VALUES
    (v_user_id, v_transport_cat, CURRENT_DATE - INTERVAL '1 day', 'Gas station fill-up', 52.30, 'expense', 'Credit Card', 'Shell'),
    (v_user_id, v_transport_cat, CURRENT_DATE - INTERVAL '4 days', 'Uber to airport', 45.75, 'expense', 'Credit Card', 'Uber'),
    (v_user_id, v_transport_cat, CURRENT_DATE - INTERVAL '8 days', 'Parking fee downtown', 18.00, 'expense', 'Cash', 'City Parking'),
    (v_user_id, v_transport_cat, CURRENT_DATE - INTERVAL '11 days', 'Gas station fill-up', 48.90, 'expense', 'Credit Card', 'Chevron'),
    (v_user_id, v_transport_cat, CURRENT_DATE - INTERVAL '16 days', 'Metro monthly pass', 95.00, 'expense', 'Debit Card', 'Metro Transit');

  -- Utilities
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method)
  VALUES
    (v_user_id, v_utilities_cat, CURRENT_DATE - INTERVAL '3 days', 'Internet Bill', 79.99, 'expense', 'Bank Transfer'),
    (v_user_id, v_utilities_cat, CURRENT_DATE - INTERVAL '5 days', 'Electricity Bill', 125.43, 'expense', 'Bank Transfer'),
    (v_user_id, v_utilities_cat, CURRENT_DATE - INTERVAL '20 days', 'Water Bill', 45.20, 'expense', 'Bank Transfer');

  -- Entertainment
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method, merchant)
  VALUES
    (v_user_id, v_entertainment_cat, CURRENT_DATE - INTERVAL '2 days', 'Netflix subscription', 15.99, 'expense', 'Credit Card', 'Netflix'),
    (v_user_id, v_entertainment_cat, CURRENT_DATE - INTERVAL '6 days', 'Movie tickets', 34.50, 'expense', 'Credit Card', 'AMC Theaters'),
    (v_user_id, v_entertainment_cat, CURRENT_DATE - INTERVAL '9 days', 'Spotify Premium', 10.99, 'expense', 'Credit Card', 'Spotify'),
    (v_user_id, v_entertainment_cat, CURRENT_DATE - INTERVAL '13 days', 'Concert tickets', 125.00, 'expense', 'Credit Card', 'Ticketmaster'),
    (v_user_id, v_entertainment_cat, CURRENT_DATE - INTERVAL '22 days', 'Gaming subscription', 14.99, 'expense', 'Credit Card', 'PlayStation Plus');

  -- Shopping
  INSERT INTO transactions (user_id, category_id, date, description, amount, type, payment_method, merchant)
  VALUES
    (v_user_id, v_shopping_cat, CURRENT_DATE - INTERVAL '4 days', 'New running shoes', 89.99, 'expense', 'Credit Card', 'Nike Store'),
    (v_user_id, v_shopping_cat, CURRENT_DATE - INTERVAL '7 days', 'Winter jacket', 145.00, 'expense', 'Credit Card', 'North Face'),
    (v_user_id, v_shopping_cat, CURRENT_DATE - INTERVAL '15 days', 'Home decor items', 67.50, 'expense', 'Credit Card', 'IKEA'),
    (v_user_id, v_shopping_cat, CURRENT_DATE - INTERVAL '19 days', 'Books from Amazon', 42.35, 'expense', 'Credit Card', 'Amazon'),
    (v_user_id, v_shopping_cat, CURRENT_DATE - INTERVAL '25 days', 'Electronics accessories', 28.99, 'expense', 'Credit Card', 'Best Buy');

END $$;

-- =====================================================
-- SAMPLE BUDGETS
-- =====================================================

DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
  v_food_cat UUID;
  v_transport_cat UUID;
  v_entertainment_cat UUID;
  v_shopping_cat UUID;
  v_utilities_cat UUID;
  v_rent_cat UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO v_food_cat FROM categories WHERE name = 'Food & Dining' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_transport_cat FROM categories WHERE name = 'Transport' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_entertainment_cat FROM categories WHERE name = 'Entertainment' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_shopping_cat FROM categories WHERE name = 'Shopping' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_utilities_cat FROM categories WHERE name = 'Utilities' AND type = 'expense' AND is_system = true LIMIT 1;
  SELECT id INTO v_rent_cat FROM categories WHERE name = 'Rent' AND type = 'expense' AND is_system = true LIMIT 1;

  -- Insert budgets for current month
  INSERT INTO budgets (user_id, category_id, monthly_limit, period_start, period_end)
  VALUES
    (v_user_id, v_food_cat, 800.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    (v_user_id, v_transport_cat, 300.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    (v_user_id, v_entertainment_cat, 200.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    (v_user_id, v_shopping_cat, 400.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    (v_user_id, v_utilities_cat, 300.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'),
    (v_user_id, v_rent_cat, 2000.00, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day');
END $$;

-- =====================================================
-- SAMPLE SAVINGS GOALS
-- =====================================================

DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
BEGIN
  INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, color, icon, description)
  VALUES
    (v_user_id, 'Emergency Fund', 15000.00, 8500.00, CURRENT_DATE + INTERVAL '6 months', 'rgb(16 185 129)', 'shield', '3-6 months of expenses'),
    (v_user_id, 'Vacation to Europe', 5000.00, 2200.00, CURRENT_DATE + INTERVAL '9 months', 'rgb(139 92 246)', 'plane', 'Summer 2025 trip'),
    (v_user_id, 'New Car Fund', 25000.00, 12000.00, CURRENT_DATE + INTERVAL '18 months', 'rgb(59 130 246)', 'car', 'Down payment for new vehicle'),
    (v_user_id, 'Home Down Payment', 50000.00, 18500.00, CURRENT_DATE + INTERVAL '30 months', 'rgb(99 102 241)', 'home', 'First home purchase'),
    (v_user_id, 'Education Fund', 10000.00, 4200.00, CURRENT_DATE + INTERVAL '12 months', 'rgb(249 115 22)', 'graduation-cap', 'Professional certifications');
END $$;

-- =====================================================
-- VERIFY DATA WAS INSERTED
-- =====================================================

-- Check transactions:
-- SELECT
--   t.date,
--   t.description,
--   t.amount,
--   t.type,
--   c.name as category,
--   t.merchant
-- FROM transactions t
-- LEFT JOIN categories c ON t.category_id = c.id
-- WHERE t.user_id = 'YOUR_USER_ID'
-- ORDER BY t.date DESC;

-- Check budgets with spending:
-- SELECT
--   b.monthly_limit,
--   c.name as category,
--   COALESCE(SUM(t.amount), 0) as spent,
--   b.monthly_limit - COALESCE(SUM(t.amount), 0) as remaining
-- FROM budgets b
-- LEFT JOIN categories c ON b.category_id = c.id
-- LEFT JOIN transactions t ON t.category_id = b.category_id
--   AND t.user_id = b.user_id
--   AND t.type = 'expense'
--   AND t.date BETWEEN b.period_start AND b.period_end
-- WHERE b.user_id = 'YOUR_USER_ID'
-- GROUP BY b.id, b.monthly_limit, c.name;

-- Check savings goals:
-- SELECT
--   name,
--   target_amount,
--   current_amount,
--   ROUND((current_amount / target_amount * 100)::numeric, 1) as progress_percentage,
--   deadline
-- FROM savings_goals
-- WHERE user_id = 'YOUR_USER_ID'
-- ORDER BY current_amount DESC;

-- =====================================================
-- SAMPLE LOANS
-- =====================================================

DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
BEGIN
  INSERT INTO loans (user_id, name, loan_type, principal_amount, current_balance, interest_rate, monthly_payment, start_date, end_date, lender, status, notes)
  VALUES
    (v_user_id, 'Federal Student Loan', 'student', 25000.00, 18500.00, 4.53, 227.00, '2020-09-01', '2030-08-31', 'Great Lakes', 'active', 'Subsidized federal loan'),
    (v_user_id, 'Auto Loan - Honda Civic', 'auto', 28000.00, 15200.00, 3.99, 520.00, '2022-03-15', '2027-03-15', 'Chase Bank', 'active', '5-year car loan'),
    (v_user_id, 'Personal Loan', 'personal', 8000.00, 4500.00, 7.25, 175.00, '2023-06-01', '2026-06-01', 'Marcus by Goldman Sachs', 'active', 'Home improvement loan'),
    (v_user_id, 'Mortgage', 'mortgage', 320000.00, 298500.00, 3.75, 1850.00, '2021-01-15', '2051-01-15', 'Wells Fargo', 'active', '30-year fixed mortgage');
END $$;

-- =====================================================
-- SAMPLE ACCOUNTS (for net worth calculation)
-- =====================================================

DO $$
DECLARE
  v_user_id UUID := 'YOUR_USER_ID'; -- REPLACE THIS!
BEGIN
  INSERT INTO accounts (user_id, name, type, balance, currency, institution, is_active)
  VALUES
    (v_user_id, 'Main Checking', 'checking', 5420.00, 'USD', 'Chase', true),
    (v_user_id, 'High-Yield Savings', 'savings', 15750.00, 'USD', 'Ally Bank', true),
    (v_user_id, 'Emergency Fund', 'savings', 12000.00, 'USD', 'Marcus', true),
    (v_user_id, '401k', 'investment', 42500.00, 'USD', 'Fidelity', true),
    (v_user_id, 'Roth IRA', 'investment', 18200.00, 'USD', 'Vanguard', true);
END $$;

-- =====================================================
-- INSTRUCTIONS FOR USE:
-- =====================================================
-- 1. First, run this query to get your user ID:
--    SELECT id, email FROM auth.users;
--
-- 2. Replace ALL occurrences of 'YOUR_USER_ID' in this file with your actual UUID
--    (There are 5 occurrences - one in each DO block)
--
-- 3. Run the entire script in Supabase SQL Editor
--
-- 4. Verify the data was inserted with the queries above
--    (Uncomment them and replace YOUR_USER_ID)
--
-- 5. Refresh your application to see the data!
-- =====================================================
