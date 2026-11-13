import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, getDbStatus } from './db.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, then root working directory
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/settings', settingsRoutes);

// Health check and system status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Apex Academy CET & NEET Management Platform',
    timestamp: new Date().toISOString(),
    db: getDbStatus()
  });
});

// Serve frontend in production if built
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Apex Academy API</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2>🎓 Apex Academy CET & NEET Server is Running</h2>
          <p>Backend API is active on port ${PORT}.</p>
          <p>Database Status: <strong>${getDbStatus().databaseName}</strong></p>
          <p><a href="/api/health" style="color: #2563eb;">Check API Health</a> | <a href="/api/students?category=IPUC_CET" style="color: #2563eb;">View Sample Students</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Start Server & Attempt DB Connection (only in non-test environment)
let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', async () => {
    console.log(`====================================================`);
    console.log(`🚀 Apex Academy CET & NEET Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);

    // Attempt DB Connection if MONGODB_URI is provided
    if (process.env.MONGODB_URI) {
      await connectDB(process.env.MONGODB_URI);
    } else {
      console.log(`ℹ️ [Notice] No MONGODB_URI found in .env.`);
      console.log(`   Running with all 165 students in memory.`);
      console.log(`   You can paste your MongoDB URI in .env or via the web UI settings!`);
    }
  });
}

export { app, server };
export default app;
