-- ============================================
-- SERVICE_USERS TABLE
-- ============================================
-- This table links auth users to stores with roles

CREATE TABLE IF NOT EXISTS service_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS service_users_user_id_idx ON service_users(user_id);
CREATE INDEX IF NOT EXISTS service_users_store_id_idx ON service_users(store_id);

-- Enable RLS
ALTER TABLE service_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own service_user records
CREATE POLICY "Users can view their own service records"
  ON service_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- AUTOMATIC USER REGISTRATION TRIGGER
-- ============================================
-- This function automatically creates a service_user record
-- when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into service_users with client role and badminton store
  INSERT INTO service_users (user_id, store_id, role)
  VALUES (
    NEW.id,
    '2a066c2d-5226-4ac1-afa1-fe88a9bd31d2'::uuid,  -- Your badminton store ID
    'client'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If user already exists in service_users, ignore the error
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log other errors but don't prevent user creation
    RAISE WARNING 'Failed to create service_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- OPTIONAL: Backfill existing users
-- ============================================
-- Run this if you want to add existing users to service_users
-- (Skip if you only want new signups to be added)

INSERT INTO service_users (user_id, store_id, role)
SELECT 
  id,
  '2a066c2d-5226-4ac1-afa1-fe88a9bd31d2'::uuid,
  'client'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM service_users)
ON CONFLICT (user_id, store_id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- Check the trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- View all service_users
SELECT 
  su.id,
  su.user_id,
  u.email,
  su.store_id,
  s.name as store_name,
  su.role,
  su.created_at
FROM service_users su
JOIN auth.users u ON su.user_id = u.id
JOIN stores s ON su.store_id = s.id
ORDER BY su.created_at DESC;
