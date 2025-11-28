const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
let envConfig = {};
try {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envConfig[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
} catch (err) {
  console.error('Error reading .env.local:', err);
  process.exit(1);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use Anon key to simulate public access (like the API route)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Starting verification of order creation logic...');

  const storeId = '6aab4a51-0d89-47ee-b853-2f29dca2d480';
  console.log('Using Store ID:', storeId);

  // Define the items to purchase
  const itemsToPurchase = [
    {
      product_name: 'Astrox 99 Pro',
      sku: 'ASTROX-99-PRO',
      quantity: 1,
      unit_price: 260,
    }
  ];

  // Calculate total price
  const totalPrice = itemsToPurchase.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

  // Step 1: Create Order
  const orderPayload = {
    store_id: storeId,
    customer_email: 'test_verification@example.com',
    customer_name: 'Test Verification',
    total_price: totalPrice,
    currency: 'USD',
    status: 'paid',
    created_at: new Date().toISOString()
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return;
  }

  console.log('Order created successfully:', order.id);

  // Step 2: Create Order Items
  for (const item of itemsToPurchase) {
      const itemPayload = {
        order_id: order.id,
        store_id: storeId,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency: 'USD',
        line_total: item.quantity * item.unit_price
      };

      const { error: itemError } = await supabase
        .from('order_products')
        .insert(itemPayload);

      if (itemError) {
        console.error(`Error creating order item (${item.product_name}):`, itemError);
      } else {
        console.log(`Order item created successfully: ${item.product_name}`);
      }
  }
}

main();
