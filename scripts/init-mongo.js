// This script runs when MongoDB container first starts
db = db.getSiblingDB('praja-collections');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('categories');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ category: 1 });

print('✅ Database initialized successfully!');