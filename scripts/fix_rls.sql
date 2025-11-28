-- SQL to FIX RLS policies for creating orders and products
-- Run this in the Supabase SQL Editor

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.orders;
DROP POLICY IF EXISTS "Enable select for own orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.order_products;
DROP POLICY IF EXISTS "Enable select for own order products" ON public.order_products;

-- 2. Enable RLS on tables (ensure it's on)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;

-- 3. Re-create Policy for ORDERS table
-- Allow anyone (anon and authenticated) to insert orders
CREATE POLICY "Enable insert for everyone" 
ON public.orders 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow users to view their own orders (Case Insensitive)
CREATE POLICY "Enable select for own orders" 
ON public.orders 
FOR SELECT 
TO public 
USING (lower(auth.jwt() ->> 'email') = lower(customer_email));

-- 4. Re-create Policy for ORDER_PRODUCTS table
-- Allow anyone to insert order items
CREATE POLICY "Enable insert for everyone" 
ON public.order_products 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow viewing order items if the user can view the parent order (Case Insensitive)
CREATE POLICY "Enable select for own order products" 
ON public.order_products 
FOR SELECT 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_products.order_id 
    AND lower(orders.customer_email) = lower(auth.jwt() ->> 'email')
  )
);
