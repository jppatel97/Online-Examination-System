const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // Test the connection by listing collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 