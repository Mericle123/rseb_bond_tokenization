"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only /user and /user/aboutus
  const navItems = [
    { label: "Home", href: "/user" },
    { label: "About Us", href: "/user/aboutus" },
  ];

  // Active logic: Home exact; others prefix match
  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo → /user */}
          <Link href="/user" className="flex items-center gap-3">
            <Image src="/logo.png" alt="RSEB Logo" width={40} height={40} priority />
            <span className="hidden sm:block text-lg font-semibold tracking-tight text-neutral-900">
              RSEB Bhutan
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-2 text-[0.95rem] font-medium">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition-colors duration-200
                    ${active
                      ? "bg-[#6C4FE0] text-white shadow-sm"
                      : "text-[#2F2A7B]/85 hover:text-[#2F2A7B] hover:bg-neutral-100"}`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Login */}
            <Link
              href="/auth/login"
              className="ml-2 rounded-full border border-[#6C4FE0]/50 px-4 py-2 text-[#2F2A7B] font-medium hover:bg-[#6C4FE0] hover:text-white transition-colors duration-200 shadow-sm"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4FE0]/60"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed top-2 left-2 right-2 z-[60] rounded-2xl bg-white shadow-xl border border-neutral-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="RSEB Logo" width={28} height={28} />
                <span className="text-base font-semibold text-neutral-900">Menu</span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4FE0]/60"
                onClick={() => setOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="px-2 py-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-full px-4 py-3 text-[0.98rem] font-medium mb-2 transition-colors
                      ${active
                        ? "bg-[#6C4FE0] text-white shadow-sm"
                        : "text-neutral-800 hover:bg-neutral-100"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pb-4">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-full border border-[#6C4FE0]/60 px-4 py-2.5 text-[#2F2A7B] font-semibold hover:bg-[#6C4FE0] hover:text-white transition-colors duration-200 shadow-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}