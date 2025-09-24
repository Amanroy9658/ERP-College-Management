const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    await mongoose.connect('mongodb://localhost:27017/student_erp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🚪 Port:', mongoose.connection.port);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Start MongoDB: mongod --dbpath ./data/db');
    console.log('3. Check if port 27017 is available');
  }
}

testConnection();
