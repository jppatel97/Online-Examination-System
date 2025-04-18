const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count documents in each collection
    for (const collection of collections) {
      const count = await conn.connection.db.collection(collection.name).countDocuments();
      console.log(`Collection "${collection.name}" has ${count} documents`);
    }
    
    // List all users
    const users = await conn.connection.db.collection('users').find({}).toArray();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}), Role: ${user.role}, Created: ${user.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB(); 