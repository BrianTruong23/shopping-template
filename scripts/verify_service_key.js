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
// Use Service Role Key
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Service Role Key not found in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('Starting verification with Service Role Key...');

  const storeId = '6aab4a51-0d89-47ee-b853-2f29dca2d480';
  console.log('Using Store ID:', storeId);

  // Step 1: Create Order
  const orderPayload = {
    store_id: storeId,
    customer_email: 'admin_verification@example.com',
    customer_name: 'Admin Verification',
    total_price: 150,
    currency: 'USD',
    status: 'paid',
    created_at: new Date().toISOString()
  };

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order with admin key:', orderError);
    return;
  }

  console.log('Order created successfully with admin key:', order.id);
}

main();
