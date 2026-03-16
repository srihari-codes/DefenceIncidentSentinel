import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, ClipboardPlus, Compass, ListChecks, Sparkles, X } from 'lucide-react';
import { getUserProfile } from '../api/user';

const TOUR_VERSION = 'v2';

const TOUR_STEPS = [
  {
    id: 'dashboard-file-card',
    title: 'File A Complaint Card',
    subtitle: 'This card is the fastest way to start a new complaint.',
    path: '/dashboard',
    navId: 'dashboard',
    selector: '[data-tour="dashboard-card-file-complaint"]',
    icon: ClipboardPlus,
    highlights: [
      'Click this card from the dashboard to start filing immediately.',
      'It opens the complete complaint form in one step.',
      'Use this whenever a new incident needs to be reported.'
    ]
  },
  {
    id: 'dashboard-manage-card',
    title: 'Your Complaints Card',
    subtitle: 'Track all active and resolved cases here.',
    path: '/dashboard',
    navId: 'dashboard',
    selector: '[data-tour="dashboard-card-manage-complaints"]',
    icon: ListChecks,
    highlights: [
      'This card takes you to Manage Complaints.',
      'You can review status, search complaints, and open details.',
      'Use this section for follow-up after filing.'
    ]
  },
  {
    id: 'dashboard-ai-card',
    title: 'AI Assistant Card',
    subtitle: 'Open the chatbot for guided cybersecurity help.',
    path: '/dashboard',
    navId: 'dashboard',
    selector: '[data-tour="dashboard-card-ai-assistant"]',
    icon: Bot,
    highlights: [
      'This card opens the AI Assistant page.',
      'Use it for quick reporting, status checks, and analysis guidance.',
      'It is ideal when you are not sure what to do first.'
    ]
  },
  {
    id: 'manage-file-button',
    title: 'Exactly Where To File New Complaint',
    subtitle: 'From Manage Complaints, use this top-right button.',
    path: '/dashboard/manage-complaints',
    navId: 'manage-complaints',
    selector: '[data-tour="manage-complaints-file-button"]',
    icon: Compass,
    highlights: [
      'Click + File a Complaint here to open the filing page.',
      'This route is useful when you are already reviewing old complaints.',
      'Dashboard card and this button both lead to new complaint filing.'
    ]
  },
  {
    id: 'new-complaint-form',
    title: 'New Complaint Form',
    subtitle: 'This is the exact page where complaint submission happens.',
    path: '/dashboard/new-complaint',
    navId: 'manage-complaints',
    selector: '[data-tour="new-complaint-form"]',
    icon: ClipboardPlus,
    highlights: [
      'Complete the 4 steps: Basic Info, Incident Details, Evidence, Submit.',
      'Attach files as evidence before final submission.',
      'You receive a tracking ID once submitted successfully.'
    ]
  },
  {
    id: 'quick-actions-toggle',
    title: 'Quick Actions Area',
    subtitle: 'This panel contains fast AI workflows.',
    path: '/dashboard/chatbot',
    navId: 'chatbot',
    selector: '[data-tour="chat-quick-actions-toggle"]',
    triggerEvent: 'dis:open-chat-quick-actions',
    icon: Bot,
    highlights: [
      'Expand this section to reveal all quick actions.',
      'These actions guide users through common support tasks.',
      'Next steps will point to each quick action button.'
    ]
  },
  {
    id: 'quick-action-file-report',
    title: 'Quick Action: File Report',
    subtitle: 'AI asks structured questions and files a report from chat.',
    path: '/dashboard/chatbot',
    navId: 'chatbot',
    selector: '[data-tour="chat-quick-action-file-report"]',
    triggerEvent: 'dis:open-chat-quick-actions',
    icon: ClipboardPlus,
    highlights: [
      'Use this to submit a complaint conversationally.',
      'The assistant gathers details one field at a time.',
      'Great for first-time users who need guided filing.'
    ]
  },
  {
    id: 'quick-action-check-status',
    title: 'Quick Action: Check Status',
    subtitle: 'Track complaints by entering tracking ID.',
    path: '/dashboard/chatbot',
    navId: 'chatbot',
    selector: '[data-tour="chat-quick-action-check-status"]',
    triggerEvent: 'dis:open-chat-quick-actions',
    icon: ListChecks,
    highlights: [
      'Use this to fetch current status quickly.',
      'The assistant asks for tracking ID and returns updates.',
      'Useful when users do not want to open the full list view.'
    ]
  },
  {
    id: 'quick-action-risk-analysis',
    title: 'Quick Action: Risk Analysis',
    subtitle: 'Analyze scanner JSON and return risk summary.',
    path: '/dashboard/chatbot',
    navId: 'chatbot',
    selector: '[data-tour="chat-quick-action-risk-analysis"]',
    triggerEvent: 'dis:open-chat-quick-actions',
    icon: Sparkles,
    highlights: [
      'Paste incident JSON to generate risk score and category.',
      'Use this for triage before escalation.',
      'Helps users understand severity quickly.'
    ]
  },
  {
    id: 'quick-action-playbooks',
    title: 'Quick Action: Playbooks',
    subtitle: 'Generate simple response playbooks from analysis output.',
    path: '/dashboard/chatbot',
    navId: 'chatbot',
    selector: '[data-tour="chat-quick-action-playbooks"]',
    triggerEvent: 'dis:open-chat-quick-actions',
    icon: Bot,
    highlights: [
      'Creates short action plans users can follow immediately.',
      'Supports both technical and user-friendly response guidance.',
      'Use after risk analysis to decide next actions.'
    ]
  }
];

const getTourStorageKey = (identity) => `dis-tour-${TOUR_VERSION}-${identity || 'guest'}`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function UserOnboardingTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const tooltipRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLocatingTarget, setIsLocatingTarget] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [navRect, setNavRect] = useState(null);
  const [tooltipHeight, setTooltipHeight] = useState(280);

  const [isProfileReady, setIsProfileReady] = useState(false);
  const [firstName, setFirstName] = useState('there');

  const currentStep = TOUR_STEPS[stepIndex];

  const progressPercent = useMemo(() => {
    return Math.round(((stepIndex + 1) / TOUR_STEPS.length) * 100);
  }, [stepIndex]);

  const closeTour = useCallback(() => {
    setIsOpen(false);
    setShowWelcome(false);
    setTargetRect(null);
    setNavRect(null);
  }, []);

  const goToStep = useCallback((index) => {
    const safeIndex = clamp(index, 0, TOUR_STEPS.length - 1);
    const step = TOUR_STEPS[safeIndex];

    setStepIndex(safeIndex);

    if (location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [location.pathname, navigate]);

  const openTour = useCallback(() => {
    setTargetRect(null);
    setNavRect(null);
    setIsOpen(false);
    setShowWelcome(true);
    navigate('/dashboard');
  }, [navigate]);

  const startActualTour = useCallback(() => {
    setShowWelcome(false);
    setIsOpen(true);
    goToStep(0);
  }, [goToStep]);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      try {
        const response = await getUserProfile();

        if (!isMounted) return;

        if (response?.success && response?.data) {
          const profile = response.data;
          if (profile.full_name) {
            setFirstName(profile.full_name.split(' ')[0]);
          }
        }
      } catch (error) {
        console.warn('Unable to initialize onboarding profile:', error);
      } finally {
        if (isMounted) {
          setIsProfileReady(true);
        }
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-open only when the user has just performed a manual login.
  // AuthCallback sets 'dis-just-logged-in' in sessionStorage before navigating
  // here. We consume it immediately so refreshes never retrigger the tour.
  useEffect(() => {
    if (!isProfileReady) return;

    try {
      const justLoggedIn = sessionStorage.getItem('dis-just-logged-in') === '1';
      if (!justLoggedIn) return;
      sessionStorage.removeItem('dis-just-logged-in');
    } catch {
      return;
    }

    openTour();
  }, [isProfileReady, openTour]);

  useEffect(() => {
    window.addEventListener('dis:start-tour', openTour);
    return () => window.removeEventListener('dis:start-tour', openTour);
  }, [openTour]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    if (location.pathname !== currentStep.path) {
      setTargetRect(null);
      return;
    }

    if (currentStep.triggerEvent) {
      window.dispatchEvent(new Event(currentStep.triggerEvent));
    }

    let isCancelled = false;
    let attempts = 0;
    const maxAttempts = 25;

    setIsLocatingTarget(true);

    const locateTarget = () => {
      if (isCancelled) return;

      const target = document.querySelector(currentStep.selector);

      if (!target) {
        if (attempts < maxAttempts) {
          attempts += 1;
          window.setTimeout(locateTarget, 120);
        } else {
          setIsLocatingTarget(false);
          setTargetRect(null);
        }
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

      window.setTimeout(() => {
        if (isCancelled) return;

        const rect = target.getBoundingClientRect();
        setTargetRect(rect);
        setIsLocatingTarget(false);
      }, 220);
    };

    locateTarget();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, currentStep, location.pathname]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const updateTargetRect = () => {
      const target = document.querySelector(currentStep.selector);
      if (target) {
        setTargetRect(target.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, currentStep]);

  // Track sidebar nav ring for current step
  useEffect(() => {
    if (!isOpen || !currentStep?.navId) { setNavRect(null); return; }

    const navEl = document.querySelector(`[data-tour-nav="${currentStep.navId}"]`);
    if (navEl) {
      setNavRect(navEl.getBoundingClientRect());
    } else {
      setNavRect(null);
    }

    const updateNavRect = () => {
      const el = document.querySelector(`[data-tour-nav="${currentStep.navId}"]`);
      if (el) setNavRect(el.getBoundingClientRect());
    };
    window.addEventListener('resize', updateNavRect);
    return () => window.removeEventListener('resize', updateNavRect);
  }, [isOpen, stepIndex, currentStep]);

  useEffect(() => {
    if (!tooltipRef.current) return;

    const measuredHeight = tooltipRef.current.getBoundingClientRect().height;
    if (measuredHeight > 0) {
      setTooltipHeight(measuredHeight);
    }
  }, [isOpen, stepIndex, targetRect, isLocatingTarget]);

  const handlePrevious = () => {
    goToStep(stepIndex - 1);
  };

  const handleNext = () => {
    if (stepIndex === TOUR_STEPS.length - 1) {
      closeTour();
      return;
    }

    goToStep(stepIndex + 1);
  };

  const handleSkip = () => {
    closeTour();
  };

  // ── Welcome Card ──────────────────────────────────────────────────────────
  if (showWelcome && !isOpen) {
    return (
      <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative w-full max-w-md rounded-2xl border border-blue-100 bg-white shadow-2xl">
          <div className="px-8 pb-6 pt-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome{firstName !== 'there' ? `, ${firstName}` : ''}!</h2>
            <p className="mt-1 text-sm font-semibold text-blue-600 uppercase tracking-wide">Quick User Guide Tour</p>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Let us walk you through the key features of this platform — filing complaints, tracking cases, and using the AI assistant — in just a few steps.
            </p>
            <ul className="mt-4 space-y-2 text-left">
              {[
                'Dashboard overview & action cards',
                'Filing and managing complaints',
                'AI assistant quick actions'
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles className="h-4 w-4 shrink-0 text-cyan-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3 border-t border-gray-100 px-8 py-5">
            <button
              onClick={() => closeTour()}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={startActualTour}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Start Tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen || !currentStep) {
    return null;
  }

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const isMobile = viewportWidth < 768;

  let spotlightStyle = null;

  if (targetRect) {
    const padding = 10;
    const rawTop = targetRect.top - padding;
    const rawLeft = targetRect.left - padding;

    const top = clamp(rawTop, 8, Math.max(8, viewportHeight - 40));
    const left = clamp(rawLeft, 8, Math.max(8, viewportWidth - 40));
    const width = clamp(targetRect.width + padding * 2, 60, Math.max(60, viewportWidth - left - 8));
    const height = clamp(targetRect.height + padding * 2, 40, Math.max(40, viewportHeight - top - 8));

    spotlightStyle = { top, left, width, height };
  }

  let tooltipStyle;

  if (isMobile || !targetRect) {
    tooltipStyle = {
      left: '50%',
      bottom: 16,
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: 440
    };
  } else {
    const isNewComplaintStep = currentStep.id === 'new-complaint-form';
    const SPACING = 18;
    const sl = spotlightStyle; // shorthand

    // Anchor coordinates around the spotlight
    const spotRight  = sl ? sl.left + sl.width  : targetRect.right;
    const spotLeft   = sl ? sl.left              : targetRect.left;
    const spotTop    = sl ? sl.top               : targetRect.top;
    const spotBottom = sl ? sl.top + sl.height   : targetRect.bottom;
    const spotCenterY = (spotTop + spotBottom) / 2;

    const basePanelWidth = Math.min(400, viewportWidth - 32);
    const leftSideMaxWidth = Math.max(220, spotLeft - SPACING - 10);
    const panelWidth = isNewComplaintStep
      ? Math.min(basePanelWidth, leftSideMaxWidth)
      : basePanelWidth;

    // Candidate positions for each of 4 directions
    const below = { top: spotBottom + SPACING, left: clamp(spotLeft, 16, viewportWidth - panelWidth - 16) };
    const above = { top: spotTop - tooltipHeight - SPACING, left: clamp(spotLeft, 16, viewportWidth - panelWidth - 16) };
    const right = { top: clamp(spotCenterY - tooltipHeight / 2, 16, viewportHeight - tooltipHeight - 16), left: spotRight + SPACING };
    const left  = { top: clamp(spotCenterY - tooltipHeight / 2, 16, viewportHeight - tooltipHeight - 16), left: spotLeft - panelWidth - SPACING };

    const fits = (pos) =>
      pos.left >= 8 &&
      pos.left + panelWidth <= viewportWidth - 8 &&
      pos.top >= 8 &&
      pos.top + tooltipHeight <= viewportHeight - 8;

    // Keep the New Complaint tooltip on the left when possible to keep the form fully visible.
    const placementOrder = isNewComplaintStep
      ? [left, right, above, below]
      : [below, above, right, left];
    const chosen = placementOrder.find(fits);

    if (chosen) {
      tooltipStyle = { top: chosen.top, left: chosen.left, width: panelWidth };
    } else {
      // Nothing fits without clipping — anchor to bottom center and let it scroll
      tooltipStyle = {
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: Math.min(panelWidth, viewportWidth - 32),
        maxHeight: '55vh',
        overflowY: 'auto'
      };
    }
  }

  const StepIcon = currentStep.icon;
  const isLastStep = stepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-90">
      {!spotlightStyle && <div className="absolute inset-0 bg-slate-900/55" />}

      {spotlightStyle && (
        <div
          className="pointer-events-none absolute rounded-2xl border-2 border-cyan-300/90 transition-all duration-300"
          style={{
            ...spotlightStyle,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.66)'
          }}
        />
      )}

      {/* Sidebar nav highlight ring – shows which nav section this step belongs to */}
      {navRect && navRect.width > 0 && (
        <div
          className="pointer-events-none absolute transition-all duration-300"
          style={{
            top: navRect.top - 3,
            left: navRect.left - 3,
            width: navRect.width + 6,
            height: navRect.height + 6,
            borderRadius: 10,
            boxShadow: '0 0 0 2px #f59e0b, 0 0 12px 4px rgba(245,158,11,0.45)'
          }}
        />
      )}

      <section
        ref={tooltipRef}
        className="absolute rounded-2xl border border-blue-100 bg-white shadow-2xl"
        style={tooltipStyle}
      >
        <button
          onClick={handleSkip}
          className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close tour"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-100 px-6 pb-5 pt-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
              <StepIcon className="h-5 w-5" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Guided UI Tour
            </div>
          </div>

          <h2 className="pr-10 text-xl font-bold text-gray-900 sm:text-2xl">{currentStep.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{currentStep.subtitle}</p>
          <p className="mt-3 text-xs text-gray-500">{firstName}, follow the highlighted area to get familiar quickly.</p>
        </div>

        <div className="px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Step {stepIndex + 1} of {TOUR_STEPS.length}</span>
            <span>{progressPercent}% complete</span>
          </div>

          <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-600 to-cyan-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <ul className="space-y-3">
            {currentStep.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-gray-700">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {isLocatingTarget && (
            <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              Locating highlighted UI element...
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleSkip}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={stepIndex === 0}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isLastStep ? 'Finish Tour' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
