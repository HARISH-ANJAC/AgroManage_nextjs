import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './Route/index.js';
import os from "os";
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware chain
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());
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
app.use("/uploads", cors(), express.static(path.join(__dirname, "../uploads")));
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
app.use("/api", apiRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.json({ msg: 'Agro Business API Server Running!' });
});

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


const PORT = process.env.PORT || 5000;


const startServer = async () => {
    try {

         // Wait for DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            if (process.env.NODE_ENV === "development") {
            console.log(`   ➜ Local:   http://localhost:${PORT}`); 

            if (LOCAL_IP !== "localhost") {
            console.log(`   ➜ Network: http://${LOCAL_IP}:${PORT}`);
            }
        }          
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();