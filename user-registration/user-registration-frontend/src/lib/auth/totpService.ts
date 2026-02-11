import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { APP_CONFIG, AUTH_CONFIG } from "@/lib/constants";
import type { TotpSetup } from "@/types";

// Re-export type for backward compatibility
export type { TotpSetup };

/**
 * Configure TOTP for a user
 */
export const setupTotp = async (email: string, _fullName: string): Promise<TotpSetup> => {
  // Generate a random secret
  const secret = new OTPAuth.Secret({ size: AUTH_CONFIG.TOTP.SECRET_SIZE });
  const secretBase32 = secret.base32;

  // Create a new TOTP object
  const totp = new OTPAuth.TOTP({
    issuer: APP_CONFIG.TOTP_ISSUER,
    label: email,
    algorithm: AUTH_CONFIG.TOTP.ALGORITHM,
    digits: AUTH_CONFIG.TOTP.DIGITS,
    period: AUTH_CONFIG.TOTP.PERIOD,
    secret: secret,
  });

  const uri = totp.toString();
  const qrCodeDataUrl = await QRCode.toDataURL(uri);

  return {
    secret: secretBase32,
    uri,
    qrCodeDataUrl,
    manualEntryKey: secretBase32,
  };
};

/**
 * Verify a TOTP token against a secret
 */
export const verifyTotpToken = (token: string, secretBase32: string): boolean => {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: APP_CONFIG.TOTP_ISSUER,
      algorithm: AUTH_CONFIG.TOTP.ALGORITHM,
      digits: AUTH_CONFIG.TOTP.DIGITS,
      period: AUTH_CONFIG.TOTP.PERIOD,
      secret: secretBase32,
    });

    // The 'delta' parameter allows for time drift
    const delta = totp.validate({
      token,
      window: AUTH_CONFIG.TOTP_WINDOW,
    });

    return delta !== null;
  } catch (error) {
    console.error("TOTP Verification Error:", error);
    return false;
  }
};

/**
 * Generate recovery/backup codes
 */
export const generateBackupCodes = (count: number = 8): string[] => {
  const codes: string[] = [];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous characters

  for (let i = 0; i < count; i++) {
    let code = "";
    for (let j = 0; j < 10; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Format as XXXX-XXXX
    codes.push(code.slice(0, 5) + "-" + code.slice(5));
  }

  return codes;
};
