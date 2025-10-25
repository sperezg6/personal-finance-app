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
-- VERIFY DATA WAS INSERTED
-- =====================================================
-- Run this query to check your transactions:
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

-- =====================================================
-- INSTRUCTIONS FOR USE:
-- =====================================================
-- 1. First, run this query to get your user ID:
--    SELECT id, email FROM auth.users;
--
-- 2. Replace 'YOUR_USER_ID' in line 12 with your actual UUID
--
-- 3. Run the entire script in Supabase SQL Editor
--
-- 4. Verify the data was inserted with the query above
--
-- 5. Refresh your home page to see the data!
-- =====================================================
