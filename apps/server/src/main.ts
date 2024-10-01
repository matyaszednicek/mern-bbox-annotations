import { startServer } from './app';
import { connectToDB } from './db';

async function init() {
  try {
    await connectToDB();
    startServer();

    console.log('Server started successfully 🚀');
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

void init();
