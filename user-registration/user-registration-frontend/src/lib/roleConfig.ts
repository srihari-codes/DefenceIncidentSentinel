/**
 * Role Configuration
 * Defines role-specific settings, validation patterns, and security rules
 */

import { Shield, Users, Medal, Radar, Cpu } from "lucide-react";
import type { RoleKey, RoleConfig, RoleOption, PasswordPolicy } from "@/types";
import { VALIDATION_PATTERNS } from "@/lib/constants";

// Re-export types for backward compatibility
export type { RoleKey, RoleConfig, PasswordPolicy };

/** Defence email pattern for validation */
export const defenceEmailPattern = VALIDATION_PATTERNS.DEFENCE_EMAIL;

/** Available role options for selection dropdowns */
export const roleOptions: RoleOption[] = [
  { label: "Defence Personnel", value: "personnel", icon: Shield },
  { label: "Family / Dependent", value: "family", icon: Users },
  { label: "Veteran / Retired", value: "veteran", icon: Medal },
  { label: "CERT Analyst", value: "cert", icon: Radar },
  { label: "Admin / MoD Authority", value: "admin", icon: Cpu },
];

export const roleConfigurations: Record<RoleKey, RoleConfig> = {
  personnel: {
    idLabel: "Service Number / Army No",
    idPattern: /^[A-Z0-9-]{6,15}$/,
    idValidationMessage: "Enter a valid Service Number (e.g., IC-123456).",
    inputType: "text",
    requiresDefenceEmail: true,
    emailPattern: defenceEmailPattern,
    emailErrorMessage: "Official defence email (nic.in/gov.in/mil.in) required for personnel.",
    passwordPolicy: {
      minLength: 12,
      requireSpecialCharacter: true,
      message: "Password must be at least 12 characters with special characters.",
    },
    enforcedMfaMethod: "totp",
    securityNotes: ["Subject to military security protocols.", "Regular audit logging enabled."],
  },
  family: {
    idLabel: "Dependent Card No / PPO No",
    idPattern: /^[A-Z0-9-]{6,20}$/,
    idValidationMessage: "Enter a valid Dependent Card or PPO Number.",
    inputType: "text",
    requiresDefenceEmail: false,
    emailWarningMessage: "Non-defence email detected. Verification may take longer.",
    passwordPolicy: {
      minLength: 12,
      requireSpecialCharacter: true,
      message: "Minimum 12 characters for secure access.",
    },
    enforcedMfaMethod: "email",
    securityNotes: ["Verification may require PPO/Card confirmation."],
  },
  veteran: {
    idLabel: "PPO Number / Service Id",
    idPattern: /^[A-Z0-9-]{6,20}$/,
    idValidationMessage: "Enter your Pension Payment Order (PPO) number.",
    inputType: "text",
    requiresDefenceEmail: false,
    passwordPolicy: {
      minLength: 12,
      requireSpecialCharacter: true,
      message: "Strong password required for veteran portal.",
    },
    enforcedMfaMethod: "email",
    securityNotes: ["Access to pension and retirement benefits."],
  },
  cert: {
    idLabel: "CERT ID / Employee No",
    idPattern: /^[A-Z0-9-]{5,20}$/,
    idValidationMessage: "Enter your official CERT-In/Defence CERT ID.",
    inputType: "text",
    requiresDefenceEmail: false,
    emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    emailErrorMessage: "Please enter a valid email address.",
    highPrivilege: true,
    enforcedMfaMethod: "totp",
    securityNotes: ["High-level access monitored by Security Operations.", "Hardware token recommended."],
  },
  admin: {
    idLabel: "Admin Credentials",
    idPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    idValidationMessage: "Valid email required for admin role.",
    inputType: "email",
    requiresDefenceEmail: false,
    emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    emailErrorMessage: "Please enter a valid email address.",
    highPrivilege: true,
    enforcedMfaMethod: "totp",
    securityNotes: ["All administrative actions are recorded in the Secure Ledger.", "Requires executive MoD approval."],
  },
};
