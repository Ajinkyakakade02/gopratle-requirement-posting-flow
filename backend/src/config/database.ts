import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    console.warn(
      '⚠️  MONGODB_URI is not set. The server will start but database operations will fail.\n' +
      '   Set MONGODB_URI in your .env file to connect to MongoDB Atlas.'
    );
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'gopratle',
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB connection error:', (error as Error).message);
    console.error('   The server will continue running but submissions will fail.');
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('✅ MongoDB reconnected');
  });
}

export function getDBStatus(): { connected: boolean; readyState: string } {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: stateMap[mongoose.connection.readyState] || 'unknown',
  };
}
