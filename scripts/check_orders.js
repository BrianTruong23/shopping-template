const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
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
const serviceRoleKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log('Checking orders in database...');

  // 1. List all orders to see what's there
  const { data: allOrders, error: allOrdersError } = await supabase
    .from('orders')
    .select('*, order_products(*)')
    .order('created_at', { ascending: false })
    .limit(5);

  if (allOrdersError) {
    console.error('Error fetching all orders:', allOrdersError);
  } else {
    console.log(`Found ${allOrders.length} recent orders (total).`);
    allOrders.forEach(o => {
      console.log(`- Order ${o.id}: Email="${o.customer_email}", Total=${o.total_price}`);
      if (o.order_products && o.order_products.length > 0) {
        console.log(`  Products (${o.order_products.length}):`);
        o.order_products.forEach(p => {
          console.log(`    - ${p.product_name} (Qty: ${p.quantity})`);
        });
      } else {
        console.log('  No products found for this order.');
      }
    });
  }

  // 2. Check for a specific test email if known, or just rely on the list above
  // The user likely used the email from their account.
  // We can't know the exact email without asking, but seeing the list helps.
}

main();
