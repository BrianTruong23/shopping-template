-- SQL to manually insert an order and products
-- Run this in the Supabase SQL Editor

-- 1. Insert Order
-- We use a CTE (Common Table Expression) to capture the inserted order ID
WITH new_order AS (
  INSERT INTO public.orders (
    store_id,
    customer_email,
    customer_name,
    total_price,
    currency,
    status
  )
  VALUES (
    '6aab4a51-0d89-47ee-b853-2f29dca2d480', -- Store ID provided
    'thangtruong@example.com',
    'Thang Truong',
    290, -- Total Price (260 + 30)
    'USD',
    'paid'
  )
  RETURNING id
)

-- 2. Insert Order Products
INSERT INTO public.order_products (
  order_id,
  store_id,
  product_name,
  sku,
  quantity,
  unit_price,
  currency,
  line_total
)
SELECT
  id,
  '6aab4a51-0d89-47ee-b853-2f29dca2d480', -- Store ID
  product_name,
  sku,
  quantity,
  unit_price,
  'USD',
  line_total
FROM new_order, (VALUES
  ('Astrox 99 Pro', 'ASTROX-99-PRO', 1, 260, 260),
  ('Yonex Aerobite String', 'AEROBITE', 2, 15, 30)
) AS t(product_name, sku, quantity, unit_price, line_total);
