import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let isConnecting = false;

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    console.warn(
      '⚠️  MONGODB_URI is not set. The server will start but database operations will fail.\n' +
      '   Set MONGODB_URI in your .env file to connect to MongoDB Atlas.'
    );
    return;
  }

  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  isConnecting = true;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'gopratle',
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', (error as Error).message);
    console.error('   The server will continue running and retry on subsequent requests.');
  } finally {
    isConnecting = false;
  }
}

// ── Connection lifecycle listeners ──────────────────────────────────────────
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection lost');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error event:', err.message);
});

/**
 * Ensure database is connected before critical operations.
 * Attempts a reconnection if connection dropped.
 */
export async function ensureDBConnected(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (MONGODB_URI && mongoose.connection.readyState === 0 && !isConnecting) {
    console.log('🔄 Attempting to re-establish MongoDB connection...');
    await connectDB();
  }

  return (mongoose.connection.readyState as number) === 1;
}

export function getDBStatus(): { connected: boolean; readyState: string } {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const state = mongoose.connection.readyState;

  return {
    connected: state === 1,
    readyState: stateMap[state] || 'unknown',
  };
}
