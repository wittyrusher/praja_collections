const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://mongodb:27017/praja-collections';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String,
  images: [String],
  stock: Number,
  sizes: [String],
  colors: [String],
  featured: Boolean,
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);

async function setupAdminAndProducts() {
  try {
    console.log('🚀 Starting Docker Setup...\n');
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    // Create Admin User
    console.log('👤 Creating Admin User...');
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    
    const admin = await User.findOneAndUpdate(
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

    console.log('✅ Admin user created!');
    console.log('─────────────────────────────────────');
    console.log('   Email: admin@example.com');
    console.log('   Password: Password@123');
    console.log('─────────────────────────────────────\n');

    // Create Sample Products
    console.log('📦 Creating Sample Products...\n');

    const sampleProducts = [
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Premium quality 100% cotton t-shirt',
        price: 599,
        discountPrice: 449,
        category: 'men',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        stock: 100,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Blue'],
        featured: true,
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit denim jeans',
        price: 1999,
        discountPrice: 1499,
        category: 'men',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
        stock: 75,
        sizes: ['28', '30', '32', '34'],
        colors: ['Blue', 'Black'],
        featured: true,
      },
      {
        name: 'Summer Dress',
        description: 'Light and comfortable summer dress',
        price: 1499,
        discountPrice: 999,
        category: 'women',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
        stock: 50,
        sizes: ['S', 'M', 'L'],
        colors: ['Red', 'Blue'],
        featured: true,
      },
    ];

    for (const product of sampleProducts) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        { upsert: true, new: true }
      );
      console.log(`   ✅ ${product.name}`);
    }

    console.log('\n✅ Setup Complete!\n');
    console.log('🌐 Access your application:');
    console.log('   App: http://localhost:3000');
    console.log('   Admin: http://localhost:3000/admin');
    console.log('   Login: admin@example.com / Password@123\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setupAdminAndProducts();