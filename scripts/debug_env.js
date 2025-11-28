const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
try {
  const envFile = fs.readFileSync(envPath, 'utf8');
  console.log('Keys found in .env.local:');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      console.log(match[1].trim());
    }
  });
} catch (err) {
  console.error('Error reading .env.local:', err);
}
