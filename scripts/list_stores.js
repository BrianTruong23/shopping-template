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

async function listStores() {
  const { data, error } = await supabase.from('stores').select('*');
  if (error) {
    console.error('Error listing stores:', error);
  } else {
    console.log('Stores:', JSON.stringify(data, null, 2));
  }
}

listStores();
