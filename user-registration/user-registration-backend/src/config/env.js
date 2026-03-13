const path = require('path');
const dotenv = require('dotenv');

const repoEnvPath = path.resolve(__dirname, '../../../../.env');
const localEnvPath = path.resolve(__dirname, '../../.env');

// Load monorepo-level .env first, then allow backend-local .env to override.
dotenv.config({ path: repoEnvPath });
dotenv.config({ path: localEnvPath, override: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const devFallbackSecrets = {
  jwtSecret: 'dev-jwt-secret-defence-incident-sentinel',
  jwtRefreshSecret: 'dev-jwt-refresh-secret-defence-incident-sentinel',
  encryptionKey: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
};

const jwtSecret = process.env.JWT_SECRET || (!isProduction ? devFallbackSecrets.jwtSecret : undefined);
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || (!isProduction ? devFallbackSecrets.jwtRefreshSecret : undefined);
const encryptionKey = process.env.ENCRYPTION_KEY || (!isProduction ? devFallbackSecrets.encryptionKey : undefined);

if (!jwtSecret || !jwtRefreshSecret || !encryptionKey) {
  throw new Error('Missing required security configuration: JWT_SECRET, JWT_REFRESH_SECRET, ENCRYPTION_KEY');
}

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET || !process.env.ENCRYPTION_KEY) {
  console.warn('[Config] Using development fallback secrets. Set JWT_SECRET, JWT_REFRESH_SECRET, and ENCRYPTION_KEY in .env for persistent secure sessions.');
}

module.exports = {
  // Server
  nodeEnv,
  port: parseInt(process.env.PORT_REGISTRATION || process.env.PORT, 10) || 4000,
  
  // MongoDB
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/defence_sentinel',
  
  // JWT
  jwtSecret,
  jwtRefreshSecret,
  
  // Encryption
  encryptionKey,
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM
  },
  
  // Frontend & CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:8080'],
  
  // Cookie settings
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true
  },
  
  // Token expiry
  tokens: {
    challengeExpiry: '5m',      // Login challenge
    registrationExpiry: '30m',  // Registration challenge
    accessExpiry: '7d',        // Access token
    refreshExpiry: '7d',        // Refresh token
    otpExpiry: 5 * 60 * 1000    // 5 minutes in ms
  },
  
  // Security
  security: {
    maxLoginAttempts: 3,
    lockoutDuration: 60 * 60 * 1000, // 60 minutes in ms
    argon2: {
      memoryCost: 65536,  // 64 MB
      timeCost: 3,
      parallelism: 4
    }
  },
  
  // IP Whitelisting
  ipWhitelist: {
    admin: process.env.ADMIN_ALLOWED_IPS 
      ? process.env.ADMIN_ALLOWED_IPS.split(',').map(ip => ip.trim()).filter(Boolean)
      : [],
    cert: process.env.CERT_ALLOWED_IPS
      ? process.env.CERT_ALLOWED_IPS.split(',').map(ip => ip.trim()).filter(Boolean)
      : []
  },
  
  // Dashboard Redirect URLs
  dashboards: {
    admin: process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5176',
    cert: process.env.CERT_DASHBOARD_URL || 'http://localhost:5175',
    personnel: process.env.PERSONNEL_DASHBOARD_URL || 'http://localhost:5174',
    family: process.env.FAMILY_DASHBOARD_URL || 'http://localhost:5174',
    veteran: process.env.VETERAN_DASHBOARD_URL || 'http://localhost:5174'
  }
};
