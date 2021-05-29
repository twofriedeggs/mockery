import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DATABASE } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

if (!MONGODB_DATABASE) {
  throw new Error(
    'Please define the MONGODB_DATABASE environment variable'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

const cache: any = global;

export async function getMongoDB() {
  if (!cache.mongodb) {
    const opts = {
      minSize: 1,
      useUnifiedTopology: true,
    };

    cache.mongodb = await MongoClient.connect(MONGODB_URI, opts);
  }

  return cache.mongodb;
}
