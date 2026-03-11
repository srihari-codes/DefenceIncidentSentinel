import { useState, useEffect } from "react";
import {
  X,
  HelpCircle,
  Mail,
  Shield,
  Key,
  Smartphone,
  LogIn,
  UserPlus,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REGISTER_STEPS = [
  {
    icon: Mail,
    step: "Step 1 – Identity",
    tip: "Enter your full name, email & mobile. Click Send Code, enter the 6-digit OTP in your inbox, then hit Verify.",
  },
  {
    icon: Shield,
    step: "Step 2 – Service Credentials",
    tip: "Pick your role (Personnel, Family, Veteran, CERT or Admin) and enter your ID — e.g. IC-123456 for Personnel.",
  },
  {
    icon: Key,
    step: "Step 3 – Security Setup",
    tip: "Create a password (12+ chars, uppercase, number, special char). Accept the terms and click Submit.",
  },
  {
    icon: Smartphone,
    step: "Step 4 – Activate",
    tip: "TOTP roles: scan the QR code in your authenticator app and enter the 6-digit code. Email OTP roles: request and enter the emailed code.",
  },
];

const LOGIN_STEPS = [
  {
    icon: Shield,
    step: "Step 1 – Unit Credentials",
    tip: "Select your role, enter your identifier (service no., card no., etc.) and your registered email.",
  },
  {
    icon: Key,
    step: "Step 2 – Password",
    tip: "Enter your password. 3 wrong attempts will lock your account for 60 minutes.",
  },
  {
    icon: Smartphone,
    step: "Step 3 – MFA",
    tip: "TOTP: open your authenticator app and enter the 6-digit code. Email OTP: click Send OTP then enter the code (valid 5 min).",
  },
];

interface QuickGuideProps {
  mode: "login" | "register";
}

export default function QuickGuide({ mode }: QuickGuideProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">(mode);

  useEffect(() => {
    setTab(mode);
  }, [mode]);

  const steps = tab === "register" ? REGISTER_STEPS : LOGIN_STEPS;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5",
          "bg-[hsl(213,100%,18%)] text-white shadow-lg text-sm font-medium",
          "hover:bg-[hsl(213,100%,26%)] transition-all duration-200",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <HelpCircle className="h-4 w-4" />
        Quick Guide
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-sm",
          "bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[hsl(213,100%,18%)] text-white">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <h2 className="text-sm font-semibold tracking-wide">Quick Start Guide</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b bg-[hsl(210,40%,96%)]">
          <button
            onClick={() => setTab("register")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
              tab === "register"
                ? "bg-white text-[hsl(213,100%,18%)] border-b-2 border-[hsl(213,100%,18%)]"
                : "text-[hsl(0,0%,45%)] hover:text-[hsl(213,100%,18%)]"
            )}
          >
            <UserPlus className="h-4 w-4" />
            Register
          </button>
          <button
            onClick={() => setTab("login")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
              tab === "login"
                ? "bg-white text-[hsl(213,100%,18%)] border-b-2 border-[hsl(213,100%,18%)]"
                : "text-[hsl(0,0%,45%)] hover:text-[hsl(213,100%,18%)]"
            )}
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <p className="text-xs text-[hsl(0,0%,45%)] leading-relaxed">
            {tab === "register"
              ? "Follow these 4 steps to create your account."
              : "Follow these 3 steps to securely access your account."}
          </p>

          {steps.map(({ icon: Icon, step, tip }, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(213,100%,18%)] text-white">
                  <Icon className="h-4 w-4" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-[hsl(213,100%,18%)]/15 min-h-[16px]" />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-1 mb-1">
                  <ChevronRight className="h-3 w-3 text-[hsl(213,100%,18%)]/40" />
                  <p className="text-xs font-semibold text-[hsl(213,100%,18%)]">{step}</p>
                </div>
                <p className="text-xs text-[hsl(0,0%,40%)] leading-relaxed">{tip}</p>
              </div>
            </div>
          ))}

          {/* Password rules */}
          {tab === "register" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Password Rules</span>
              </div>
              {["Min 12 characters", "1 uppercase letter (A–Z)", "1 digit (0–9)", "1 special character (!@#$%…)"].map((r) => (
                <p key={r} className="flex items-center gap-2 text-[11px] text-amber-700/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {r}
                </p>
              ))}
            </div>
          )}

          {/* MFA by role */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">MFA Method by Role</p>
            {[
              { role: "Personnel", method: "TOTP app" },
              { role: "CERT / Admin", method: "TOTP app" },
              { role: "Family", method: "Email OTP" },
              { role: "Veteran", method: "Email OTP" },
            ].map(({ role, method }) => (
              <p key={role} className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full flex-shrink-0",
                  method === "TOTP app" ? "bg-violet-500" : "bg-blue-500"
                )} />
                <span className="font-medium text-slate-700">{role}:</span> {method}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-[hsl(210,40%,96%)]">
          <button
            onClick={() => setOpen(false)}
            className="w-full rounded-lg bg-[hsl(213,100%,18%)] py-2.5 text-sm font-medium text-white hover:bg-[hsl(213,100%,26%)] transition-colors"
          >
            Got it, close guide
          </button>
        </div>
      </aside>
    </>
  );
}
