const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

// Load env from config.env in the project root or express-backend folder
const envPathRoot = path.resolve(__dirname, '..', 'config.env');
const envPathLocal = path.resolve(__dirname, 'config.env');
dotenv.config({ path: envPathRoot });
dotenv.config({ path: envPathLocal });

const ATLAS_URI = process.env.ATLAS_URIS || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!ATLAS_URI) {
  console.warn('Warning: no MongoDB connection string found in environment (ATLAS_URIS).');
}

// Connect Mongoose
let mongooseConnected = false;
const connectMongoose = async () => {
  if (mongooseConnected) return mongoose;
  try {
    await mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongooseConnected = true;
    console.log('Mongoose connected');
    return mongoose;
  } catch (err) {
    console.error('Mongoose connection error:', err.message);
    throw err;
  }
};

// Provide a helper to get a native MongoDB client if raw collection access is desired
const getMongoClient = async () => {
  if (!ATLAS_URI) throw new Error('No ATLAS_URIS set in environment');
  const client = new MongoClient(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
};

module.exports = {
  connectMongoose,
  getMongoClient,
  mongoose
};
