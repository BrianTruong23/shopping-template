-- SQL to enable RLS policies for creating orders and products
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS on tables (if not already enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for ORDERS table
-- Allow anyone (anon and authenticated) to insert orders
-- This is necessary for guest checkout or logged-in users to place orders.
CREATE POLICY "Enable insert for everyone" 
ON public.orders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own orders (based on email or user_id if you add it later)
-- For now, we'll allow users to see orders they just created (if the session matches) 
-- or you might want to restrict this more. 
-- This simple policy allows reading if the customer_email matches the user's email.
CREATE POLICY "Enable select for own orders" 
ON public.orders 
FOR SELECT 
TO public 
USING (auth.jwt() ->> 'email' = customer_email);

-- 3. Create Policy for ORDER_PRODUCTS table
-- Allow anyone to insert order items (linked to the orders they create)
CREATE POLICY "Enable insert for everyone" 
ON public.order_products 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow viewing order items if the user can view the parent order
-- This requires a join or a more complex policy, but for simplicity/performance 
-- in Supabase, we often rely on the application logic or a simpler check.
-- Here is a policy that allows reading if the user has access to the order.
CREATE POLICY "Enable select for own order products" 
ON public.order_products 
FOR SELECT 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_products.order_id 
    AND orders.customer_email = (auth.jwt() ->> 'email')
  )
);
