import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// Validate that the MongoDB URI is provided in environment variables
// This prevents the application from starting without proper database configuration
if (!DB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.<development/production>.local"
  );
}

// Async function to establish connection to MongoDB database
const connectToDatabase = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    // Mongoose handles connection pooling and reconnection automatically
    await mongoose.connect(DB_URI);

    // Log successful connection with current environment mode
    console.log(`connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    // Log connection error details for debugging
    console.error("Error connecting to database", error);

    // Exit the application if database connection fails
    // This prevents the app from running without database access
    process.exit(1);
  }
};

export default connectToDatabase;
