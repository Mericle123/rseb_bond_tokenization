"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { label: string; href: string };

interface FooterProps {
  logoSrc?: string;
  phone?: string;
  email?: string;
  navLinks?: NavLink[];
  enableAnimations?: boolean;
}

const LEGAL_LABEL_TERMS = "Terms of Service";
const LEGAL_LABEL_PRIVACY = "Privacy Policy";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

const cardHover = {
  whileHover: { y: -3, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemFade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function Footer({
  logoSrc = "/RSEB.png",
  phone = "+975 17495130",
  email = "Note@gmail.com",
  navLinks = [
    { label: "Home", href: "/user" },
    { label: "About RSEB", href: "/user/aboutus" },
    { label: LEGAL_LABEL_TERMS, href: "#" },
    { label: LEGAL_LABEL_PRIVACY, href: "#" },
  ],
  enableAnimations = true,
}: FooterProps) {
  const MotionWrapper: any = enableAnimations ? motion.div : (props: any) => <div {...props} />;
  const MotionSpan: any = enableAnimations ? motion.span : (props: any) => <span {...props} />;
  const MotionForm: any = enableAnimations ? motion.form : (props: any) => <form {...props} />;

  const [legalOpen, setLegalOpen] = useState<null | "terms" | "privacy">(null);
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent">("idle");
  const [showTopButton, setShowTopButton] = useState(false);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLegalOpen(null);
    if (legalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [legalOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!legalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [legalOpen]);

  // Show scroll-to-top button
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 240) setShowTopButton(true);
      else setShowTopButton(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openLegal = (which: "terms" | "privacy", btn: HTMLButtonElement | null) => {
    lastTriggerRef.current = btn;
    setLegalOpen(which);
  };

  const closeLegal = () => {
    setLegalOpen(null);
    setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const handleScrollTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full mt-16 sm:mt-20">
      {/* Top Section — gradient, full width, no horizontal scroll hacks */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#181445] via-[#2F2A72] to-[#472BA3]">
        {/* Soft pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0 0, rgba(255,255,255,0.16) 0, transparent 55%), radial-gradient(circle at 100% 100%, rgba(114,221,255,0.18) 0, transparent 55%)",
          }}
        />
        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,#8E7CFF_0%,transparent_60%)] blur-[70px] opacity-60" />
          <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,#42D2FF_0%,transparent_60%)] blur-[70px] opacity-60" />
        </div>

        <MotionWrapper
          {...(enableAnimations ? { ...fadeIn, variants: staggerContainer } : {})}
          viewport={enableAnimations ? { once: true, amount: 0.15 } : undefined}
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
        >
          {/* Small top strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/65 flex items-center gap-2">
              <span className="h-px w-5 bg-white/40" />
              Secure investor services
            </p>
            <p className="hidden sm:flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-white/65">
              Real-time status
              <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[0.65rem] border border-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational</span>
              </span>
            </p>
          </div>

          {/* Main grid — fully responsive */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
            {/* LEFT — Logo + message */}
            <MotionWrapper
              {...(enableAnimations ? { ...cardHover, variants: itemFade } : {})}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
            >
              <div className="relative">
                <motion.div
                  className="h-[80px] w-[80px] sm:h-[96px] sm:w-[96px] rounded-2xl bg-white/95 p-3 flex items-center justify-center shadow-[0_18px_45px_rgba(0,0,0,0.75)] ring-2 ring-white/70"
                  whileHover={enableAnimations ? { rotate: -1 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 16 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoSrc} alt="RSEB" className="h-full w-full object-contain" />
                </motion.div>
              </div>

              <div className="text-white leading-[1.1] pt-0.5">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.16em] mb-1 border border-white/15">
                  RSEB • Unclaimed Funds Portal
                </span>
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Claim your</p>
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">unclaimed funds</p>
                <p className="mt-2 text-[0.78rem] sm:text-[0.85rem] text-white/80 max-w-xs">
                  Check for pending entitlements, verify eligibility, and claim balances owed to you
                  through Bhutan&apos;s official securities exchange.
                </p>
              </div>
            </MotionWrapper>

            {/* MIDDLE — Navigation + feature chips */}
            <MotionWrapper
              {...(enableAnimations ? { variants: itemFade } : {})}
              className="text-white text-[0.9rem] flex flex-col justify-center"
              aria-label="Footer navigation"
            >
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                Navigation
              </p>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {navLinks.map(({ label, href }) => {
                  const isTerms = label === LEGAL_LABEL_TERMS;
                  const isPrivacy = label === LEGAL_LABEL_PRIVACY;

                  if (isTerms || isPrivacy) {
                    return (
                      <li key={label}>
                        <button
                          type="button"
                          className="group relative inline-flex items-center gap-1 text-[0.88rem] text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2F2A72] focus-visible:ring-white/80 rounded-full px-1.5 py-0.5 -mx-1.5"
                          onClick={(e) =>
                            openLegal(
                              isTerms ? "terms" : "privacy",
                              e.currentTarget as HTMLButtonElement
                            )
                          }
                        >
                          <span>{label}</span>
                          <span className="text-[0.6rem] opacity-80 group-hover:translate-x-0.5 transition-transform">
                            ↗
                          </span>
                          <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] bg-white/0 group-hover:bg-white/80 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        className="group relative inline-flex items-center gap-1 text-[0.88rem] text-white/90 hover:text-white rounded-full px-1.5 py-0.5 -mx-1.5"
                      >
                        <span>{label}</span>
                        <span className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[2px] bg-white/0 group-hover:bg-white/70 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/18 bg-white/5 px-3 py-3 backdrop-blur-sm">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-white/60 mb-1">
                    For investors
                  </p>
                  <p className="text-[0.8rem] text-white/85">
                    View registered holdings, corporate actions, and cash entitlements in one secure
                    place.
                  </p>
                </div>
                <div className="rounded-xl border border-white/18 bg-white/5 px-3 py-3 backdrop-blur-sm">
                  <p className="text-[0.7rem] uppercase tracking-[0.18em] text-white/60 mb-1">
                    Transparency
                  </p>
                  <p className="text-[0.8rem] text-white/85">
                    Full auditability and regulatory alignment for every claim request.
                  </p>
                </div>
              </div>
            </MotionWrapper>

            {/* RIGHT — Contact + Feedback */}
            <MotionWrapper
              {...(enableAnimations ? { variants: itemFade } : {})}
              className="text-white/95 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="text-[0.85rem] sm:text-sm flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[0.9rem]">
                    📞
                  </span>
                  <span>
                    <span className="font-semibold text-white">Call us :</span>
                    <span className="ml-2">{phone}</span>
                  </span>
                </div>
                <div className="text-[0.85rem] sm:text-sm flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[0.9rem]">
                    ✉️
                  </span>
                  <span>
                    <span className="font-semibold text-white">Email :</span>
                    <span className="ml-2">{email}</span>
                  </span>
                </div>
              </div>

              <MotionForm
                {...(enableAnimations ? { variants: itemFade } : {})}
                className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:items-center gap-2"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const feedback = String(data.get("feedback") || "").trim();
                  if (!feedback) return;

                  setFeedbackState("sending");
                  setTimeout(() => {
                    setFeedbackState("sent");
                    (e.currentTarget.elements.namedItem("feedback") as HTMLInputElement).value = "";
                    setTimeout(() => setFeedbackState("idle"), 2000);
                  }, 500);
                }}
              >
                <div className="relative flex-1">
                  <input
                    name="feedback"
                    type="text"
                    placeholder="Share quick feedback about this portal"
                    className="h-10 w-full rounded-md bg-white/95 px-3.5 sm:px-4 text-[#111] text-[0.8rem] sm:text-[0.9rem] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#FFD56A] shadow-[0_10px_28px_rgba(0,0,0,0.6)] border border-white/80"
                    aria-label="Feedback"
                  />
                  <MotionSpan
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.25 }}
                    className="pointer-events-none absolute -bottom-4 left-1 text-[0.6rem] text-white/75"
                  >
                    Please don&apos;t include account numbers or confidential data.
                  </MotionSpan>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="relative inline-flex items-center justify-center rounded-full bg-white text-[#111] h-10 px-4 sm:px-4 min-w-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2F2A72] focus-visible:ring-white"
                  aria-label="Send feedback"
                >
                  {feedbackState === "idle" && (
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-xs font-medium">Send</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 12h14M13 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                  {feedbackState === "sending" && (
                    <motion.div
                      className="flex items-center gap-2 text-xs font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="inline-block h-3 w-3 rounded-full border-[2px] border-[#111] border-t-transparent animate-spin" />
                      <span className="hidden sm:inline">Sending</span>
                    </motion.div>
                  )}
                  {feedbackState === "sent" && (
                    <motion.div
                      className="flex items-center gap-2 text-xs font-medium"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span>✔</span>
                      <span className="hidden sm:inline">Thank you</span>
                    </motion.div>
                  )}
                </motion.button>
              </MotionForm>
            </MotionWrapper>
          </div>
        </MotionWrapper>
      </div>

      {/* Bottom White Strip */}
      <div className="bg-white border-t border-neutral-200/70 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-center text-[0.8rem] sm:text-[0.9rem] text-neutral-600">
            ©{new Date().getFullYear()} Royal Securities Exchange of Bhutan. All rights reserved.
          </p>
          <p className="text-[0.7rem] sm:text-[0.75rem] text-neutral-500 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure connection</span>
          </p>
        </div>

        {/* Scroll-to-top FAB */}
        <AnimatePresence>
          {showTopButton && (
            <motion.button
              type="button"
              onClick={handleScrollTop}
              className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 rounded-full bg-[#2F2A72] text-white shadow-[0_14px_40px_rgba(0,0,0,0.5)] h-10 w-10 flex items-center justify-center hover:bg-[#3B3790] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5l-6 6M12 5l6 6M12 5v14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* LEGAL MODALS */}
      <LegalModal open={legalOpen === "terms"} title="Terms of Service" onClose={closeLegal}>
        <LegalContentTerms />
      </LegalModal>
      <LegalModal open={legalOpen === "privacy"} title="Privacy Policy" onClose={closeLegal}>
        <LegalContentPrivacy />
      </LegalModal>
    </footer>
  );
}

/* ------------------------------ Legal Modal ------------------------------ */

function LegalModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            aria-label="Close dialog"
            className="fixed inset-0 z-[90] bg-black/45 supports-[backdrop-filter]:backdrop-blur-[3px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Responsive container: bottom sheet on mobile, centered on sm+ */}
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              ref={dialogRef}
              className="
                w-full h-[88vh] sm:h-auto sm:max-h-[80vh] sm:w-[720px]
                rounded-t-2xl sm:rounded-2xl
                bg-white shadow-2xl ring-1 ring-black/10
                flex flex-col
              "
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 32, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-3 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-[#6b6f8b] mb-0.5">
                    Legal information
                  </p>
                  <h3 className="text-[1.02rem] font-semibold text-[#2F2A72]">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="px-3 py-1.5 rounded-full text-xs sm:text-[0.8rem] font-medium bg-[#6C4FE0] text-white hover:opacity-95 shadow-sm"
                    onClick={() => alert("Download PDF (wire this)")}
                  >
                    Download PDF
                  </motion.button>
                  <button
                    aria-label="Close"
                    className="p-2 rounded-md hover:bg-neutral-100"
                    onClick={onClose}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">{children}</div>

              {/* Sticky actions (bottom) */}
              <div className="sticky bottom-0 border-t border-neutral-200 bg-white/95 backdrop-blur-sm px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
                <p className="hidden sm:block text-[0.74rem] text-neutral-500">
                  By selecting &quot;Accept&quot; you confirm you have read and understood this
                  notice.
                </p>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-md text-[0.82rem] font-medium hover:bg-neutral-100"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -1 }}
                    className="px-4 py-2 rounded-md text-[0.82rem] font-semibold bg-[#6C4FE0] text-white hover:opacity-95 shadow-sm"
                    onClick={() => {
                      alert("Accepted (wire this)");
                      onClose();
                    }}
                  >
                    Accept
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Legal Content ------------------------------ */

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-neutral-200 rounded-xl mb-3 overflow-hidden bg-neutral-50/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-3 bg-neutral-50 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4FE0]/70"
        aria-expanded={open}
      >
        <span className="text-[0.95rem] font-semibold text-[#2F2A72]">{title}</span>
        <svg
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="px-3.5 py-3 text-[0.9rem] text-neutral-700 bg-white"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegalContentTerms() {
  return (
    <div className="space-y-3">
      <p className="text-neutral-700 text-[0.9rem]">
        Welcome to the Royal Securities Exchange of Bhutan (&quot;RSEB&quot;). By accessing or
        using our services, you agree to the following Terms of Service.
      </p>

      <Section title="1. Acceptance of Terms" defaultOpen>
        <p>You must be at least 18 years old and capable of entering into a binding agreement.</p>
      </Section>

      <Section title="2. Accounts & Security">
        <ul className="list-disc pl-5 space-y-1">
          <li>Keep your credentials secure and notify us of any unauthorized access.</li>
          <li>We may suspend accounts that breach our policies or applicable law.</li>
        </ul>
      </Section>

      <Section title="3. Use of the Platform">
        <p>Do not interfere with platform integrity, attempt to bypass security, or misuse APIs.</p>
      </Section>

      <Section title="4. Fees & Payments">
        <p>Applicable fees will be disclosed in relevant product pages or order flows.</p>
      </Section>

      <Section title="5. Disclaimers & Liability">
        <p>
          Services are provided &quot;as is&quot; to the extent permitted by law. We do not
          guarantee uninterrupted access.
        </p>
      </Section>

      <Section title="6. Changes to these Terms">
        <p>We may update terms. Continued use after changes constitutes acceptance.</p>
      </Section>
    </div>
  );
}

function LegalContentPrivacy() {
  return (
    <div className="space-y-3">
      <p className="text-neutral-700 text-[0.9rem]">
        This Privacy Policy explains how RSEB collects, uses, and protects your information.
      </p>

      <Section title="1. Data We Collect" defaultOpen>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account data (name, email, contact details)</li>
          <li>Usage data (device info, pages visited, interactions)</li>
          <li>Transaction data (orders, balances, statements)</li>
        </ul>
      </Section>

      <Section title="2. How We Use Data">
        <p>Provide services, improve the platform, ensure security, and meet legal obligations.</p>
      </Section>

      <Section title="3. Sharing & Disclosures">
        <p>
          We may share with service providers, regulators, or as legally required. We do not sell
          personal data.
        </p>
      </Section>

      <Section title="4. Your Rights">
        <ul className="list-disc pl-5 space-y-1">
          <li>Access, rectify, or delete your data where applicable.</li>
          <li>Object to certain processing or withdraw consent.</li>
        </ul>
      </Section>

      <Section title="5. Data Security & Retention">
        <p>
          We use safeguards to protect data and retain it as long as necessary for the stated
          purposes.
        </p>
      </Section>

      <Section title="6. Updates to this Policy">
        <p>We may revise this policy. Material changes will be communicated through the platform.</p>
      </Section>
    </div>
  );
}
