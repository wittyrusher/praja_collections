const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Read .env and .env.local manually
let uri = 'mongodb://localhost:27017/praja-collections';
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  const match = envContent.match(/MONGODB_URI\s*=\s*([^\r\n]+)/);
  if (match) uri = match[1].trim();
} catch (e) {}

try {
  const envLocalContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const match = envLocalContent.match(/MONGODB_URI\s*=\s*([^\r\n]+)/);
  if (match) uri = match[1].trim();
} catch (e) {}

console.log('Connecting to:', uri);
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected!');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:');
    console.log(collections.map(c => c.name));
    
    const couponsColl = collections.find(c => c.name.toLowerCase().includes('coupon'));
    if (couponsColl) {
      console.log(`Found coupon collection: ${couponsColl.name}`);
      const docs = await mongoose.connection.db.collection(couponsColl.name).find().toArray();
      console.log('Coupon documents:', docs);
    } else {
      console.log('No coupon collection found.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
