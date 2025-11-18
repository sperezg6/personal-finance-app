-- Function to calculate next due date based on frequency
CREATE OR REPLACE FUNCTION calculate_next_due_date(
  p_current_date DATE,
  p_frequency TEXT,
  p_interval_count INTEGER,
  p_day_of_month INTEGER,
  p_day_of_week INTEGER
) RETURNS DATE AS $$
DECLARE
  next_date DATE;
BEGIN
  CASE p_frequency
    WHEN 'daily' THEN
      next_date := p_current_date + (p_interval_count || ' days')::INTERVAL;

    WHEN 'weekly' THEN
      next_date := p_current_date + (p_interval_count || ' weeks')::INTERVAL;
      -- If day_of_week is specified, adjust to that day
      IF p_day_of_week IS NOT NULL THEN
        next_date := next_date + ((p_day_of_week - EXTRACT(DOW FROM next_date)::INTEGER + 7) % 7 || ' days')::INTERVAL;
      END IF;

    WHEN 'biweekly' THEN
      next_date := p_current_date + (p_interval_count * 2 || ' weeks')::INTERVAL;
      IF p_day_of_week IS NOT NULL THEN
        next_date := next_date + ((p_day_of_week - EXTRACT(DOW FROM next_date)::INTEGER + 7) % 7 || ' days')::INTERVAL;
      END IF;

    WHEN 'monthly' THEN
      next_date := p_current_date + (p_interval_count || ' months')::INTERVAL;
      -- If day_of_month is specified, adjust to that day
      IF p_day_of_month IS NOT NULL THEN
        next_date := DATE_TRUNC('month', next_date) + (p_day_of_month - 1 || ' days')::INTERVAL;
      END IF;

    WHEN 'quarterly' THEN
      next_date := p_current_date + (p_interval_count * 3 || ' months')::INTERVAL;
      IF p_day_of_month IS NOT NULL THEN
        next_date := DATE_TRUNC('month', next_date) + (p_day_of_month - 1 || ' days')::INTERVAL;
      END IF;

    WHEN 'yearly' THEN
      next_date := p_current_date + (p_interval_count || ' years')::INTERVAL;
      IF p_day_of_month IS NOT NULL THEN
        next_date := DATE_TRUNC('month', next_date) + (p_day_of_month - 1 || ' days')::INTERVAL;
      END IF;

    ELSE
      next_date := p_current_date;
  END CASE;

  RETURN next_date;
END;
$$ LANGUAGE plpgsql;

-- Main function to process recurring transactions
CREATE OR REPLACE FUNCTION process_recurring_transactions()
RETURNS TABLE(
  processed_count INTEGER,
  created_transaction_ids UUID[]
) AS $$
DECLARE
  recurring_rec RECORD;
  new_transaction_id UUID;
  transaction_ids UUID[] := ARRAY[]::UUID[];
  count INTEGER := 0;
BEGIN
  -- Find all active recurring transactions that are due
  FOR recurring_rec IN
    SELECT *
    FROM recurring_transactions
    WHERE is_active = true
      AND (next_due_date IS NULL OR next_due_date <= CURRENT_DATE)
      AND (end_date IS NULL OR end_date >= CURRENT_DATE)
      AND auto_create = true
  LOOP
    -- Create a new transaction from the recurring entry
    INSERT INTO transactions (
      user_id,
      date,
      description,
      amount,
      type,
      category,
      payment_method,
      recurring_transaction_id
    ) VALUES (
      recurring_rec.user_id,
      COALESCE(recurring_rec.next_due_date, CURRENT_DATE),
      recurring_rec.description,
      recurring_rec.amount,
      recurring_rec.type,
      recurring_rec.category,
      recurring_rec.payment_method,
      recurring_rec.id
    )
    RETURNING id INTO new_transaction_id;

    -- Add to our array of created transaction IDs
    transaction_ids := array_append(transaction_ids, new_transaction_id);
    count := count + 1;

    -- Calculate next due date
    UPDATE recurring_transactions
    SET
      last_created_date = CURRENT_DATE,
      next_due_date = calculate_next_due_date(
        COALESCE(next_due_date, CURRENT_DATE),
        frequency,
        COALESCE(interval_count, 1),
        day_of_month,
        day_of_week
      )
    WHERE id = recurring_rec.id;

    -- If we've reached the end date, deactivate
    UPDATE recurring_transactions
    SET is_active = false
    WHERE id = recurring_rec.id
      AND end_date IS NOT NULL
      AND next_due_date > end_date;
  END LOOP;

  RETURN QUERY SELECT count, transaction_ids;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_next_due_date TO authenticated;
GRANT EXECUTE ON FUNCTION process_recurring_transactions TO authenticated;

-- Create an index on next_due_date for performance
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_next_due_date
  ON recurring_transactions(next_due_date)
  WHERE is_active = true;

-- Add comment
COMMENT ON FUNCTION process_recurring_transactions IS 'Processes all due recurring transactions by creating actual transactions and updating next_due_date';
