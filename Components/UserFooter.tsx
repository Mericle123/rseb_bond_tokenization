"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Responsive Footer + Legal Modals
 * - Mobile: modal is a full-height bottom sheet
 * - Desktop: centered dialog
 * - Sticky modal header/actions, scrollable content
 */

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
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const cardHover = {
  whileHover: { y: -4, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
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
  const [legalOpen, setLegalOpen] = useState<null | "terms" | "privacy">(null);
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

  const openLegal = (which: "terms" | "privacy", btn: HTMLButtonElement | null) => {
    lastTriggerRef.current = btn;
    setLegalOpen(which);
  };
  const closeLegal = () => {
    setLegalOpen(null);
    setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  return (
    <footer className="w-full mt-16 sm:mt-20">
      {/* Top Purple Section — full-bleed */}
      <div className="bg-[#2F2A72] w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <MotionWrapper
          {...(enableAnimations ? fadeIn : {})}
          viewport={enableAnimations ? { once: true, amount: 0.15 } : undefined}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
        >
          {/* Responsive layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
            {/* LEFT — Logo + Text */}
            <MotionWrapper
              {...(enableAnimations ? cardHover : {})}
              className="flex items-start sm:items-center gap-4 sm:gap-5"
            >
              <div className="h-[84px] w-[84px] sm:h-[96px] sm:w-[96px] rounded-full bg-white p-3 flex items-center justify-center shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt="RSEB" className="h-full w-full object-contain" />
              </div>
              <div className="text-white leading-[1.1] pt-0.5">
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Claim</p>
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Your</p>
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Unclaimed</p>
                <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Funds</p>
              </div>
            </MotionWrapper>

            {/* MIDDLE — Nav links */}
            <nav className="text-white text-[0.95rem] lg:justify-center" aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {navLinks.map(({ label, href }) => {
                  const isTerms = label === LEGAL_LABEL_TERMS;
                  const isPrivacy = label === LEGAL_LABEL_PRIVACY;

                  if (isTerms || isPrivacy) {
                    return (
                      <li key={label}>
                        <button
                          type="button"
                          className="hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                          onClick={(e) =>
                            openLegal(isTerms ? "terms" : "privacy", e.currentTarget as HTMLButtonElement)
                          }
                        >
                          {label}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={label}>
                      <a href={href} className="hover:text-white/80">
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* RIGHT — Contact Info + Feedback */}
            <div className="text-white/95">
              <div className="space-y-2.5">
                <div className="text-sm sm:text-base">
                  <span className="font-semibold text-white">Call us :</span>
                  <span className="ml-2">{phone}</span>
                </div>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold text-white">Email :</span>
                  <span className="ml-2">{email}</span>
                </div>
              </div>

              <form
                className="mt-3 sm:mt-4 flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const feedback = String(data.get("feedback") || "").trim();
                  if (feedback) alert(`Thanks for your feedback: ${feedback}`);
                }}
              >
                <input
                  name="feedback"
                  type="text"
                  placeholder="Write your feedback"
                  className="h-10 w-full sm:w-[260px] rounded-md bg-white px-3.5 sm:px-4 text-[#111] text-sm placeholder:text-[#666] focus:outline-none"
                  aria-label="Feedback"
                />
                <button
                  type="submit"
                  className="ml-2 h-10 w-10 flex items-center justify-center rounded-md bg-white hover:bg-white/90 text-[#111]"
                  aria-label="Send feedback"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </MotionWrapper>
      </div>

      {/* Bottom White Strip */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-[0.85rem] sm:text-[0.9rem] text-neutral-600">
            ©{new Date().getFullYear()} Royal Securities Exchange of Bhutan. All rights reserved.
          </p>
        </div>
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
            className="fixed inset-0 z-[90] bg-black/45 supports-[backdrop-filter]:backdrop-blur-[2px]"
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
                w-full h-[88vh] sm:h-auto sm:w-[700px]
                rounded-t-2xl sm:rounded-2xl
                bg-white shadow-2xl ring-1 ring-black/10
                flex flex-col
              "
              initial={{ y: 32, opacity: 0, scale: 1 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ overflow: "hidden" }}
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white">
                <h3 className="text-[1.05rem] font-semibold text-[#2F2A72]">{title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#6C4FE0] text-white hover:opacity-95"
                    onClick={() => alert('Download PDF (wire this)')}
                  >
                    Download PDF
                  </button>
                  <button
                    aria-label="Close"
                    className="p-2 rounded-md hover:bg-neutral-100"
                    onClick={onClose}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3">
                {children}
              </div>

              {/* Sticky actions (bottom) */}
              <div className="sticky bottom-0 border-t border-neutral-200 bg-white px-4 py-3 flex items-center justify-end gap-2">
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-neutral-100"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-[#6C4FE0] text-white hover:opacity-95"
                  onClick={() => {
                    alert('Accepted (wire this)');
                    onClose();
                  }}
                >
                  Accept
                </button>
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
    <div className="border border-neutral-200 rounded-xl mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-3 bg-neutral-50 hover:bg-neutral-100"
        aria-expanded={open}
      >
        <span className="text-[0.98rem] font-semibold text-[#2F2A72]">{title}</span>
        <svg className={`transition-transform ${open ? "rotate-180" : ""}`} width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div className={`px-3.5 py-3 text-[0.95rem] text-neutral-700 ${open ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

function LegalContentTerms() {
  return (
    <div className="space-y-3">
      <p className="text-neutral-700">
        Welcome to the Royal Securities Exchange of Bhutan (“RSEB”). By accessing or using our services,
        you agree to the following Terms of Service.
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
        <p>Services are provided “as is” to the extent permitted by law. We do not guarantee uninterrupted access.</p>
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
      <p className="text-neutral-700">
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
        <p>We may share with service providers, regulators, or as legally required. We do not sell personal data.</p>
      </Section>

      <Section title="4. Your Rights">
        <ul className="list-disc pl-5 space-y-1">
          <li>Access, rectify, or delete your data where applicable.</li>
          <li>Object to certain processing or withdraw consent.</li>
        </ul>
      </Section>

      <Section title="5. Data Security & Retention">
        <p>We use safeguards to protect data and retain it as long as necessary for the stated purposes.</p>
      </Section>

      <Section title="6. Updates to this Policy">
        <p>We may revise this policy. Material changes will be communicated through the platform.</p>
      </Section>
    </div>
  );
}
