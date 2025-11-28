const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
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

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function listServiceUsers() {
  const { data, error } = await supabase.from('service_users').select('*');
  if (error) {
    console.error('Error listing service_users:', error);
  } else {
    console.log('Service Users:', JSON.stringify(data, null, 2));
  }
}

listServiceUsers();
