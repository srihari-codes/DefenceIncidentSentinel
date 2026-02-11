/**
 * Application-wide constants
 * Centralizes magic strings, numbers, and configuration values
 */

// =============================================================================
// API & ENDPOINTS
// =============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const API_ENDPOINTS = {
  AUTH: {
    // Login Flow (3 progressive steps)
    LOGIN_IDENTITY: `${API_BASE_URL}/auth/login/identity`,
    LOGIN_PASSWORD: `${API_BASE_URL}/auth/login/password`,
    LOGIN_MFA: `${API_BASE_URL}/auth/login/mfa`,
    
    // Registration Flow (4 progressive steps)
    REGISTER_IDENTITY: `${API_BASE_URL}/auth/register/identity`,
    REGISTER_SERVICE: `${API_BASE_URL}/auth/register/service`,
    REGISTER_SECURITY: `${API_BASE_URL}/auth/register/security`,
    REGISTER_ACTIVATE: `${API_BASE_URL}/auth/register/activate`,
    
    // Authorization Code Exchange (OAuth-like)
    EXCHANGE_CODE: `${API_BASE_URL}/auth/exchange`,
  },
} as const;

// =============================================================================
// APPLICATION METADATA
// =============================================================================

export const APP_CONFIG = {
  NAME: "Defence Incident Sentinel",
  SHORT_NAME: "SecureDefence Portal",
  DESCRIPTION: "Secure Access System",
  ORGANIZATION: "Ministry of Defence | Government of India",
  TOTP_ISSUER: "SecureDefence Portal",
} as const;

// =============================================================================
// AUTHENTICATION & SECURITY
// =============================================================================

export const AUTH_CONFIG = {
  /** Minimum password length for all users */
  MIN_PASSWORD_LENGTH: 12,
  
  /** OTP expiry time in seconds */
  OTP_EXPIRY_SECONDS: 60,
  
  /** Number of backup codes to generate */
  BACKUP_CODES_COUNT: 10,
  
  /** Account lockout threshold (failed attempts) */
  MAX_LOGIN_ATTEMPTS: 3,
  
  /** Account lockout duration in minutes */
  LOCKOUT_DURATION_MINUTES: 60,
  
  /** TOTP token validity window (allows ±1 period for time drift) */
  TOTP_WINDOW: 1,
  
  /** TOTP configuration */
  TOTP: {
    ALGORITHM: "SHA1" as const,
    DIGITS: 6,
    PERIOD: 30,
    SECRET_SIZE: 20,
  },
} as const;

// =============================================================================
// VALIDATION PATTERNS
// =============================================================================

export const VALIDATION_PATTERNS = {
  /** Base password policy: min 12 chars, 1 uppercase, 1 number, 1 special char */
  PASSWORD: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/,
  
  /** General email format validation */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** Official defence email domains */
  DEFENCE_EMAIL: /^[a-zA-Z0-9._%+-]+@(nic\.in|gov\.in|defence\.gov\.in|mil\.in|indianarmy\.nic\.in|indiannavy\.nic\.in|indianairforce\.nic\.in)$/,
  
  /** CERT/Gov official email */
  CERT_EMAIL: /^[a-zA-Z0-9._%+-]+@(cert-in\.org\.in|gov\.in|nic\.in)$/,
  
  /** MoD Admin email */
  MOD_ADMIN_EMAIL: /^[a-zA-Z0-9._%+-]+@mod\.gov\.in$/,
  
  /** OTP format (6 digits) */
  OTP: /^\d{6}$/,
  
  /** Mobile number (10-15 digits) */
  MOBILE: /^\d{10,15}$/,
} as const;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UI_CONFIG = {
  /** Mobile breakpoint for responsive design */
  MOBILE_BREAKPOINT: 768,
  
  /** Toast notification durations in ms */
  TOAST_DURATION: {
    SHORT: 3000,
    NORMAL: 5000,
    LONG: 10000,
  },
  
  /** Animation durations in ms */
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;

// =============================================================================
// ROLE-BASED REDIRECTS
// =============================================================================

export const ROLE_REDIRECTS = {
  personnel: "/dashboard/personnel",
  family: "/dashboard/family",
  veteran: "/dashboard/veteran",
  cert: "/dashboard/cert",
  admin: "https://cert-dashbord.vercel.app",
  officer: "/dashboard/personnel",
  staff: "/dashboard/family",
  analyst: "/dashboard/cert",
  guest: "/dashboard/veteran",
  default: "/dashboard",
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  USER_ROLE: "userRole",
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    ACCOUNT_LOCKED: "Too many failed attempts. Your account is locked.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    MFA_REQUIRED: "Multi-factor authentication is required.",
    INVALID_OTP: "Invalid verification code.",
    OTP_EXPIRED: "OTP has expired. Please request a new one.",
  },
  VALIDATION: {
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    WEAK_PASSWORD: "Password does not meet the security requirements.",
    INVALID_MOBILE: "Please enter a valid mobile number (10-15 digits).",
  },
  NETWORK: {
    CONNECTION_ERROR: "Unable to connect to the server. Please try again.",
    TIMEOUT: "Request timed out. Please try again.",
  },
} as const;

// =============================================================================
// SUCCESS MESSAGES
// =============================================================================

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Successfully logged in!",
    REGISTER_SUCCESS: "Registration complete!",
    MFA_VERIFIED: "Authentication successful.",
    EMAIL_VERIFIED: "Your email has been verified.",
    OTP_SENT: "Verification code sent to your email.",
  },
} as const;
