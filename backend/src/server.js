const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const mongoose = require('mongoose');
const Exam = require('./models/Exam');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Check for required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRE'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// Connect to database
const initializeDB = async () => {
  try {
    await connectDB();
    
    // Drop all indexes from exams collection
    const collections = await mongoose.connection.db.collections();
    const examsCollection = collections.find(c => c.collectionName === 'exams');
    if (examsCollection) {
      await examsCollection.dropIndexes();
      console.log('All indexes dropped successfully');
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
};

initializeDB();

// Route files
const auth = require('./routes/auth');
const exam = require('./routes/exam');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/exams', exam);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 