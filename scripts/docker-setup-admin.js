const path = require('path');
try {
  const { loadEnvConfig } = require('@next/env');
  loadEnvConfig(path.join(__dirname, '..'));
} catch (e) {
  // Fallback
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");
}

// Use Docker MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/praja-collections';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
});

const User = mongoose.model('User', UserSchema);

async function setupAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: 'Admin User',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user created/updated');
    console.log(`Email: ${ADMIN_EMAIL}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setupAdmin();