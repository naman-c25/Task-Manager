import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { disconnectRedis } from './config/redis.js';

// Bootstrap: pehle database connect karo, phir HTTP server start karo
async function bootstrap() {
  try {
    await connectDatabase();

    const app = createApp();
    const server = app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });

    // Graceful shutdown taaki chal rahe requests poore ho jaayein aur DB theek se band ho
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received - shutting down gracefully...`);
      server.close(async () => {
        await Promise.allSettled([disconnectDatabase(), disconnectRedis()]);
        process.exit(0);
      });
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();
