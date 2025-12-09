"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------ Helpers ------------------------------ */

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

type NavItem = {
  label: string;
  href: string;
};

/* ----------------------------- Main Navbar --------------------------- */

export default function UserNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "Home", href: "/user" },
    { label: "Public Bonds", href: "/user/aboutus" },
  ];

  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Scroll shadow + subtle background change
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ===================== Top Navbar ===================== */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-white/90 border-neutral-200 shadow-sm"
            : "bg-white/60 border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo → /user */}
          <Link href="/user" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative h-10 w-10 rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 grid place-items-center overflow-hidden"
            >
              <Image
                src="/logo.png"
                alt="RSEB Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </motion.div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-neutral-900">
                RSEB Bhutan
              </span>
              <span className="text-[11px] text-neutral-500">
                Retail Bond Tokenization
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-3 text-[0.95rem] font-medium">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative inline-flex items-center rounded-full px-4 py-2
                    transition-all duration-200
                    ${
                      active
                        ? "bg-[#6C4FE0] text-white shadow-sm"
                        : "text-[#2F2A7B]/85 hover:text-[#2F2A7B] hover:bg-neutral-100"
                    }
                  `}
                >
                  <span>{item.label}</span>
                  {/* Underline accent for active */}
                  {active && (
                    <motion.span
                      layoutId="user-navbar-pill"
                      className="absolute -bottom-1 left-4 right-4 h-[2px] rounded-full bg-white/90"
                    />
                  )}
                </Link>
              );
            })}

            {/* Login CTA */}
            <Link
              href="/auth/login"
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-[#6C4FE0]/60 px-4 py-2 text-[#2F2A7B] font-semibold hover:bg-[#6C4FE0] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-neutral-800 bg-white/80 shadow-sm border border-neutral-200/70 hover:bg-neutral-100 active:scale-95 transition-all"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.header>

      {/* ===================== Mobile Menu ===================== */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </>
  );
}

/* ---------------------------- Mobile Menu ---------------------------- */

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  isActive: (href: string) => boolean;
};

function MobileMenu({ open, onClose, navItems, isActive }: MobileMenuProps) {
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-black/55 supports-[backdrop-filter]:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slide-out panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute right-0 top-0 h-full w-[86%] max-w-[340px] bg-gradient-to-b from-[#5B50D9] to-[#6C63FF] rounded-l-[22px] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-white rounded-2xl grid place-items-center shadow-inner">
                  <Image
                    src="/logo.png"
                    alt="RSEB Logo"
                    width={28}
                    height={28}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    RSEB Bhutan
                  </span>
                  <span className="text-[11px] text-white/70">
                    Public Investor Portal
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="rounded-xl p-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                      text-[15px] font-medium transition-all duration-200
                      ${
                        isActive(item.href)
                          ? "bg-white/22 text-white border border-white/30 shadow-lg"
                          : "bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer: Login CTA */}
            <div className="px-4 pb-5 pt-3 border-t border-white/20 bg-black/5">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#2F2A7B] font-semibold py-3 shadow-lg hover:shadow-xl hover:-translate-y-[1px] active:translate-y-[1px] transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Continue</span>
              </Link>
              <p className="mt-3 text-[11px] text-white/70 text-center leading-snug">
                Access your tokenized bond portfolio, track allocations, and
                view upcoming offerings.
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
