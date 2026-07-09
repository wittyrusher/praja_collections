const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/praja-collections';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model('User', UserSchema);

async function checkAdmin() {
  try {
    console.log('🔍 Checking Admin User...\n');
    await mongoose.connect(MONGODB_URI);

    // Find admin user
    const admin = await User.findOne({ email: 'admin@example.com' });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND!\n');
      console.log('Creating admin user now...\n');

      const hashedPassword = await bcrypt.hash('Password@123', 10);
      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        phone: '9876543210',
      });

      console.log('✅ Admin user created!');
      console.log('   ID:', newAdmin._id);
      console.log('   Email:', newAdmin.email);
      console.log('   Role:', newAdmin.role);
    } else {
      console.log('✅ Admin user found!');
      console.log('─────────────────────────────────────');
      console.log('   ID:', admin._id);
      console.log('   Name:', admin.name);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Phone:', admin.phone);
      console.log('   Password Hash:', admin.password.substring(0, 20) + '...');
      console.log('─────────────────────────────────────\n');

      // Test password
      console.log('🔐 Testing password...');
      const testPassword = 'Password@123';
      const isMatch = await bcrypt.compare(testPassword, admin.password);

      if (isMatch) {
        console.log('✅ Password is CORRECT!');
      } else {
        console.log('❌ Password is INCORRECT!');
        console.log('\nResetting password to: Password@123\n');

        const newHashedPassword = await bcrypt.hash('Password@123', 10);
        await User.updateOne(
          { _id: admin._id },
          { password: newHashedPassword }
        );
        console.log('✅ Password reset successfully!');
      }

      // Check role
      console.log('\n👤 Checking role...');
      if (admin.role === 'admin') {
        console.log('✅ Role is correct: admin');
      } else {
        console.log(`❌ Role is incorrect: ${admin.role}`);
        console.log('Fixing role...\n');
        await User.updateOne({ _id: admin._id }, { role: 'admin' });
        console.log('✅ Role fixed to: admin');
      }
    }

    console.log('\n📊 All Users:');
    console.log('─────────────────────────────────────');
    const allUsers = await User.find({});
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n✅ Check completed!');
    console.log('\n🔐 Login with:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Password@123\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkAdmin();