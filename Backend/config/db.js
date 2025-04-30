const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();
// Database connection with retry logic
let dbConnectionRetries = 1;

const connectToDatabase = async () => {
  while (dbConnectionRetries) {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
          
            ssl: true, // Enable SSL/TLS
            tlsAllowInvalidCertificates: false, // Ensure valid certificates
            tlsAllowInvalidHostnames: false, // Validate hostnames
          });
      logger.info('MongoDB connected successfully.');
      return;
    } catch (err) {
      logger.error(`Failed to connect to MongoDB. Retries left: ${dbConnectionRetries}`);
      logger.error(`Error details: ${err.message}`);
      dbConnectionRetries -= 1;
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
  logger.error('MongoDB connection failed after multiple retries.');
  process.exit(1); // Exit with failure
};

module.exports = connectToDatabase;