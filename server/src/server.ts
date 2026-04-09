import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import os from "os";
import path from 'path';
import morgan from 'morgan';
import { initScheduler } from './utils/scheduler.js';

const app = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
};
const LOCAL_IP = getLocalIP();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ msg: 'Agro Business API Server Running!' });
});

const startServer = async () => {
  try {
    console.log('📦 Loading routes...');
    const apiRouter = (await import('./Route/index.js')).default;
    app.use("/api", apiRouter);

    // Final fallback: 404 handler
    app.use((req: Request, res: Response) => {
      res.status(404).json({ success: false, msg: `Route ${req.originalUrl} not found` });
    });

    // Centralized error handling middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || 500;
      console.error(`[Error] ${req.method} ${req.url}:`, err.stack);
      res.status(status).json({
        success: false,
        msg: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    const PORT = process.env.PORT || 8000;

    app.listen(Number(PORT), "0.0.0.0", async () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`   ➜ Local:   http://localhost:${PORT}`);
      if (LOCAL_IP !== "localhost") {
        console.log(`   ➜ Network: http://${LOCAL_IP}:${PORT}`);
      }

      // Start automated jobs
      await initScheduler();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();