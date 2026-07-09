const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use Docker MongoDB connection
const MONGODB_URI = 'mongodb://mongodb:27017/praja-collections';

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

    const hashedPassword = await bcrypt.hash('Password@123', 10);
    
    await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user created/updated');
    console.log('Email: admin@example.com');
    console.log('Password: Password@123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setupAdmin();