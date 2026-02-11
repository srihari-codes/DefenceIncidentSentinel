/**
 * Application-wide type definitions
 * Contains all shared interfaces and types used across the application
 */

import type { LucideIcon } from "lucide-react";

// =============================================================================
// ROLE TYPES
// =============================================================================

/** Available user role identifiers */
export type RoleKey = "personnel" | "family" | "veteran" | "cert" | "admin";

/** Role option for UI dropdowns */
export interface RoleOption {
  label: string;
  value: RoleKey;
  icon: LucideIcon;
}

/** Password policy configuration */
export interface PasswordPolicy {
  minLength: number;
  requireSpecialCharacter: boolean;
  message: string;
}

/** Role-specific configuration */
export interface RoleConfig {
  idLabel: string;
  idPattern: RegExp;
  idValidationMessage: string;
  inputType: "text" | "email";
  placeholder?: string;
  tooltip?: string;
  enforceUppercase?: boolean;
  requiresDefenceEmail?: boolean;
  emailPattern?: RegExp;
  emailErrorMessage?: string;
  emailWarningMessage?: string;
  emailWhitelist?: string[];
  passwordPolicy?: PasswordPolicy;
  enforcedMfaMethod?: "totp" | "email";
  securityNotes?: string[];
  highPrivilege?: boolean;
  readOnlyRole?: boolean;
}

// =============================================================================
// AUTHENTICATION TYPES
// =============================================================================

/** MFA method options */
export type MfaMethod = "totp" | "email";

/** TOTP setup response */
export interface TotpSetup {
  secret: string;
  uri: string;
  qrCodeDataUrl: string;
  manualEntryKey?: string;
}

/** Authenticated user data */
export interface AuthUser {
  id: string;
  fullName?: string;
  email: string;
  role: string;
  mfaEnabled: boolean;
  mfaMethod?: "authenticator" | "email";
  totpSecret?: string;
}

/** Generic API response */
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

/** Authentication response */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
  requiresEmailVerification?: boolean;
}

// =============================================================================
// OTP TYPES
// =============================================================================

/** OTP purpose types */
export type OtpPurpose = "registration" | "login" | "reset_password" | "verification";

/** Send OTP request */
export interface SendOtpRequest {
  email: string;
  purpose: OtpPurpose;
}

/** Verify OTP request */
export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

/** OTP response */
export interface OtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

/** OTP state for hooks */
export interface OtpState {
  otpCode: string;
  otpSent: boolean;
  otpCountdown: number;
  otpError: string;
}

// =============================================================================
// LOGIN FLOW TYPES (Progressive 3-Step)
// =============================================================================

/** Step 1: Login Identity Request */
export interface LoginIdentityRequest {
  role: RoleKey;
  identifier: string;
  email: string;
}

/** Step 1: Login Identity Response */
export interface LoginIdentityResponse {
  nextStep: "PASSWORD";
  message: string;
}

/** Step 2: Login Password Request (cookie auto-sent) */
export interface LoginPasswordRequest {
  password: string;
}

/** Step 2: Login Password Response */
export interface LoginPasswordResponse {
  nextStep: "MFA";
  mfaRequired: boolean;
  allowedMethods: ("TOTP" | "EMAIL")[];
}

/** Step 3: Login MFA Request (cookie auto-sent) */
export interface LoginMfaRequest {
  method: "TOTP" | "EMAIL";
  code?: string;
  action?: "send_otp";
}

/** Step 3: Login MFA Response */
export interface LoginMfaResponse {
  message: string;
  user?: { user_id: string; role: string };
  expiresIn?: number; // For send_otp action
  // Authorization code flow (OAuth-like)
  redirect_url?: string;
  code?: string;
  expires_in?: number;
}

// =============================================================================
// REGISTRATION FLOW TYPES (Progressive 4-Step)
// =============================================================================

/** Step 1: Register Identity Request (send verification) */
export interface RegisterIdentitySendRequest {
  email: string;
  action: "send_verification";
}

/** Step 1: Register Identity Request (submit identity) */
export interface RegisterIdentitySubmitRequest {
  full_name: string;
  email: string;
  mobile: string;
  email_verification_code: string;
}

/** Step 1: Register Identity Response */
export interface RegisterIdentityResponse {
  nextStep?: "SERVICE";
  message?: string;
  expiresIn?: number;
}

/** Step 2: Register Service Request (cookie auto-sent) */
export interface RegisterServiceRequest {
  role: RoleKey;
  identifier: string;
}

/** Step 2: Register Service Response */
export interface RegisterServiceResponse {
  nextStep: "SECURITY";
}

/** Step 3: Register Security Request (cookie auto-sent) */
export interface RegisterSecurityRequest {
  mfa_method: "TOTP" | "EMAIL";
  password: string;
  terms_accepted: boolean;
}

/** Step 3: Register Security Response */
export interface RegisterSecurityResponse {
  nextStep: "ACTIVATE";
}

/** Step 4: Register Activate Request - Generate TOTP (cookie auto-sent) */
export interface RegisterActivateGenerateTotpRequest {
  action: "generate_totp";
}

/** Step 4: Register Activate Request - Send Email OTP (cookie auto-sent) */
export interface RegisterActivateSendOtpRequest {
  action: "send_otp";
}

/** Step 4: Register Activate Request - Verify TOTP (cookie auto-sent) */
export interface RegisterActivateVerifyTotpRequest {
  totp_verification_code: string;
  department?: string;
  designation?: string;
  hardware_token_requested?: boolean;
}

/** Step 4: Register Activate Request - Verify Email OTP (cookie auto-sent) */
export interface RegisterActivateVerifyEmailRequest {
  email_otp_code: string;
}

/** Step 4: Register Activate Response - TOTP Setup */
export interface RegisterActivateTotpSetupResponse {
  qr_code: string;
  manual_entry_key: string;
  backup_codes: string[];
}

/** Step 4: Register Activate Response - Completion */
export interface RegisterActivateCompleteResponse {
  message: string;
  status: string;
  estimated_approval: string;
  // Authorization code flow (OAuth-like)
  redirect_url?: string;
  code?: string;
  expires_in?: number;
}

/** Step 4: Register Activate Response - OTP Sent */
export interface RegisterActivateOtpSentResponse {
  message: string;
  expiresIn: number;
}

// =============================================================================
// AUTHORIZATION CODE EXCHANGE (OAuth-like flow)
// =============================================================================

/** Exchange authorization code for tokens */
export interface ExchangeAuthCodeRequest {
  code: string;
}

/** Code exchange response with user data (tokens in response body for cross-domain) */
export interface ExchangeAuthCodeResponse {
  message: string;
  access_token: string;      // JWT access token (15 min expiry)
  refresh_token: string;     // JWT refresh token (7 days expiry)
  expires_in: number;        // Access token expiry in seconds (900)
  token_type: 'Bearer';      // Token type for Authorization header
  user: {
    user_id: string;
    role: string;
    full_name: string;
    email: string;
    identifier: string;
    mfa_method: string;
  };
}

// =============================================================================
// UI TYPES
// =============================================================================

/** Step configuration for multi-step forms */
export interface FormStep {
  id: number;
  title: string;
  description: string;
}

/** Toast notification variants */
export type ToastVariant = "default" | "destructive";
