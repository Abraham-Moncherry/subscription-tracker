// Import dotenv configuration function to load environment variables from .env files
import { config } from "dotenv";

// Load environment variables from environment-specific .env file
// Falls back to development.local if NODE_ENV is not set
// Example: .env.production.local, .env.development.local, etc.
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// Export PORT environment variable for use throughout the application
// This allows the server to run on the port specified in the .env file
export const { PORT, NODE_ENV } = process.env;
