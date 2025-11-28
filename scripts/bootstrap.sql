-- SQL to bootstrap the database
-- Run this in the Supabase SQL Editor

-- 1. Create a store (assuming you have a user ID)
-- Replace 'YOUR_USER_ID' with your actual User ID from Authentication -> Users
-- If you don't have a user, sign up in the app first.

INSERT INTO public.stores (owner_id, name, slug, category)
VALUES ('YOUR_USER_ID', 'Badminton Store', 'badminton', 'sports');

-- 2. (Optional) If you need to manually insert an order via SQL
-- Replace 'YOUR_STORE_ID' with the ID of the store you just created

/*
INSERT INTO public.orders (store_id, customer_email, customer_name, total_price, currency, status)
VALUES ('YOUR_STORE_ID', 'thangtruong@example.com', 'Thang Truong', 260, 'USD', 'paid');
*/
