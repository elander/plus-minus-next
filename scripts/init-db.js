// scripts/init-db.js
const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Created data directory');
} else {
  console.log('Data directory already exists');
}
