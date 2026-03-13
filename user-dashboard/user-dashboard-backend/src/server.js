const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Development fallbacks for local multi-app setup
process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_user_dashboard_jwt_secret';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const complaintRoutes = require('./routes/complaint.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

// ──────────────────────────────────────────────
//  Global Middleware
// ──────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '60mb' })); // Allow large base64 evidence payloads

// ──────────────────────────────────────────────
//  Health Check
// ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'User Dashboard API is running', timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────────
//  Routes
// ──────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// ──────────────────────────────────────────────
//  404 Handler
// ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error_code: 'NOT_FOUND'
  });
});

// ──────────────────────────────────────────────
//  Global Error Handler
// ──────────────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────────────
//  Start Server
// ──────────────────────────────────────────────
const PORT = process.env.PORT_DASHBOARD || process.env.PORT || 4001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 User Dashboard Backend running on port ${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Frontend    : ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
    console.log(`   Auth Service: ${process.env.AUTH_SERVICE_URL}\n`);
  });
});

module.exports = app;
