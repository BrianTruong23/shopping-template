-- ============================================
-- UPDATE TRIGGER FOR USER REGISTRATION
-- ============================================

-- 1. Update the trigger function to handle split tables
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_store_id uuid;
  v_full_name text;
BEGIN
  -- Extract metadata
  v_store_id := (NEW.raw_user_meta_data->>'store_id')::uuid;
  v_full_name := NEW.raw_user_meta_data->>'full_name';

  -- 1. Insert into service_users (base table)
  INSERT INTO service_users (id, role)
  VALUES (NEW.id, 'client');

  -- 2. Insert into clients (extended table for customers)
  -- We assume new signups via this flow are always clients
  INSERT INTO clients (id, store_id, email, name, role)
  VALUES (
    NEW.id,
    v_store_id,
    NEW.email,
    v_full_name,
    'client'
  );

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If user already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user records for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Re-create the trigger (if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
