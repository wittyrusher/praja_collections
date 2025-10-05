const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/praja-collections';

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create Admin User
    console.log('🔄 Creating admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@praja-collections.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('   Email: admin@praja-collections.com\n');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@praja-collections.com',
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
      });
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@praja-collections.com');
      console.log('   Password: Admin@123');
      console.log('   ID:', admin._id.toString(), '\n');
    }

    // Update existing user to ensure they have a role
    const existingUsers = await User.find({ role: { $exists: false } });
    if (existingUsers.length > 0) {
      for (const user of existingUsers) {
        await User.updateOne(
          { _id: user._id },
          { $set: { role: 'user' } }
        );
        console.log(`✅ Updated role for: ${user.email}`);
      }
      console.log();
    }

    // Display all users
    const allUsers = await User.find({}).select('-password');
    console.log('📝 Current Users in Database:');
    console.log('─────────────────────────────────────────');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log('─────────────────────────────────────────');
    });

    console.log('\n✅ Database setup completed successfully!\n');
    console.log('🔐 Login Credentials:');
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│ ADMIN LOGIN:                                │');
    console.log('│ Email: admin@praja-collections.com          │');
    console.log('│ Password: Admin@123                         │');
    console.log('└─────────────────────────────────────────────┘');
    console.log('\n🌐 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Login with admin credentials');
    console.log('   4. Access admin panel: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key error - user already exists');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
    process.exit(0);
  }
}

// Run setup
setupDatabase();