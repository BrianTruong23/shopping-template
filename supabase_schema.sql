-- Supabase Database Schema for User Carts and Orders

-- 1. user_carts table (for persistent cart storage)
CREATE TABLE IF NOT EXISTS user_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and modify their own cart
CREATE POLICY "Users can manage their own cart"
  ON user_carts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Update orders table to link to users
-- Add user_id column if it doesn't exist (nullable for guest orders)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own orders, store owners can see all orders for their store
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can create orders (server-side)
CREATE POLICY "System can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);

-- 3. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to user_carts
CREATE TRIGGER update_user_carts_updated_at 
  BEFORE UPDATE ON user_carts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Grant necessary permissions (adjust based on your setup)
-- Note: Supabase handles most permissions automatically

-- Optional: Create a demo user via SQL (or do it via Supabase Auth UI)
-- INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES ('demo@ofcourt.com', crypt('Demo123!', gen_salt('bf')), NOW(), NOW(), NOW());
