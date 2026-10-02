import mongoose, { Mongoose } from "mongoose";

// Fetch the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Interface to define the cached mongoose connection structure
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend Node's global object to prevent TypeScript errors when caching in global scope
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// In Next.js development mode, hot-reloading causes modules to reload,
// creating multiple connections. We cache the connection in global space to persist it.
let cached: MongooseCache =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
  // Reuse only an active connection; discard stale cache entries so they can reconnect.
  if (cached.conn) {
    if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }

    cached.conn = null;
    cached.promise = null;
  }

  // If no connection attempt is in progress, create a new promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering so operations fail fast if not connected
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Await the connection promise and cache the connection instance
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise if connection fails so subsequent requests can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;