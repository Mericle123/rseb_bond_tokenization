"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  ArrowLeft, 
  Home, 
  PieChart, 
  DollarSign, 
  Activity,
  Menu,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { logout } from "@/server/action/action";
import { useCurrentUser } from "@/context/UserContext";

/* ------------------------------ Helpers ------------------------------ */

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* ----------------------------- Main UI ------------------------------- */

export default function InvestorSideNavbar() {
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const user = {
    name: currentUser?.name || "User",
    id: currentUser?.national_id || "Loading...",
    walletAddress: currentUser?.wallet_address || "Loading...",
  };

  const NAV_ITEMS = [
    { label: "Home", href: "/investor", icon: Home },
    { label: "Assets", href: "/investor/Assets", icon: PieChart },
    { label: "Earnings", href: "/investor/Earnings", icon: DollarSign },
    { label: "Activity", href: "/investor/Activity", icon: Activity },
    { label: "Trading Channel", href: "/investor/Negotiative", icon: MessageSquare }
  ];

  const isActive = (href: string) => {
    if (href === "/investor") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ==================== Desktop Sidebar ==================== */}
      <aside
        className={`
          hidden sm:flex flex-col justify-between
          bg-gradient-to-b from-[#5B50D9] to-[#6C63FF] text-white
          rounded-[20px] m-2 shadow-2xl ring-1 ring-white/10
          transition-all duration-300 ease-out
          sticky top-2 self-start
          h-[calc(100vh-1rem)]
          ${sidebarCollapsed ? "w-[80px] px-3 py-4 items-center" : "w-[230px] p-4"}
        `}
      >
        <div className="w-full">
          {/* -------- Top Row: Centered Logo + Collapse Toggle -------- */}
          <div
            className={`
              flex items-center justify-center relative
              ${sidebarCollapsed ? "mb-6" : "mb-8 mt-2"}
            `}
          >
            {/* Centered Logo */}
            <div
              className={`
                bg-white rounded-2xl grid place-items-center shadow-lg
                ${sidebarCollapsed ? "h-10 w-10" : "h-12 w-12"}
              `}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={sidebarCollapsed ? 26 : 32}
                height={sidebarCollapsed ? 26 : 32}
                className="rounded-lg"
              />
            </div>

            {/* Collapse Toggle - Positioned absolutely to not affect centering */}
            {!sidebarCollapsed && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-label="Collapse sidebar"
                className="
                  absolute right-0
                  text-white/70 hover:text-white hover:bg-white/10
                  rounded-xl p-1.5 transition-colors
                "
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* -------- Investor Tag -------- */}
          {!sidebarCollapsed && (
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Investor Console
              </div>
            </div>
          )}

          {/* -------- Navigation Items -------- */}
          <nav
            className={`
              flex flex-col
              ${sidebarCollapsed ? "gap-2 mt-2" : "gap-3"}
            `}
          >
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);

              if (sidebarCollapsed) {
                // Collapsed: icon only
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    className={`
                      flex items-center justify-center
                      rounded-2xl
                      p-2.5
                      transition-all duration-200
                      ${
                        active
                          ? "bg-white/20 text-white shadow-lg border border-white/30"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              }

              // Expanded: icon + label
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    font-medium text-[14px] transition-all duration-200
                    ${
                      active
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* -------- Footer -------- */}
        <button
          type="button"
          onClick={() => setAccountOpen(true)}
          className={`
            bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl
            flex items-center shadow-lg hover:bg-white/20 transition-all duration-200
            ${sidebarCollapsed ? "justify-center py-2.5 px-2 w-full" : "justify-start py-3 px-4 w-full"}
          `}
          aria-label="Open account panel"
        >
          <Image
            src="/NDI.png"
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full border-2 border-white/30"
          />
          {!sidebarCollapsed && (
            <div className="flex flex-col items-start ml-3">
              <p className="text-[13px] font-semibold text-white">{user.name}</p>
              <p className="text-[11px] text-white/60">View Account</p>
            </div>
          )}
        </button>
      </aside>

      {/* ====== SIDE EXPAND HANDLE (DESKTOP, ONLY WHEN COLLAPSED) ====== */}
      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Expand sidebar"
          className="
            hidden sm:flex
            fixed left-[90px] top-1/2 -translate-y-1/2
            z-30
            rounded-r-2xl
            bg-[#5B50D9] text-white
            px-2 py-3
            shadow-xl
            hover:bg-[#6C63FF]
            transition-all duration-200
          "
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* ==================== Floating Hamburger Button ==================== */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="sm:hidden fixed top-4 right-4 z-50 p-3 bg-gradient-to-br from-[#5B50D9] to-[#6C63FF] text-white rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-105 transition-all duration-200 backdrop-blur-sm"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* ==================== Mobile Menu Slide-out ==================== */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
        isActive={isActive}
        onAccountOpen={() => {
          setMobileMenuOpen(false);
          setAccountOpen(true);
        }}
        user={user}
      />

      {/* ==================== Slide-over Account Panel ==================== */}
      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        onLogout={logout}
      />
    </>
  );
}

/* --------------------------- Mobile Menu --------------------------- */

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navItems: { label: string; href: string; icon: any }[];
  isActive: (href: string) => boolean;
  onAccountOpen: () => void;
  user: { name: string; id: string; walletAddress: string };
};

function MobileMenu({
  open,
  onClose,
  navItems,
  isActive,
  onAccountOpen,
  user,
}: MobileMenuProps) {
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className={`absolute inset-0 bg-black/60 supports-[backdrop-filter]:backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Menu Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[85%] max-w-[320px] bg-gradient-to-b from-[#5B50D9] to-[#6C63FF] rounded-l-[20px] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Centered Logo Only */}
        <div className="flex items-center justify-center p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded-xl grid place-items-center shadow-inner">
              <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded" />
            </div>
            <span className="font-semibold text-white text-lg">Investor Menu</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-6">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl
                    font-medium text-[15px] transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "bg-white/20 text-white border border-white/20 shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/20">
          <button
            type="button"
            onClick={onAccountOpen}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl py-3 px-4 flex items-center gap-3 justify-start shadow-lg hover:bg-white/20 transition-all"
            aria-label="Open account panel"
          >
            <Image
              src="/NDI.png"
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border-2 border-white/30"
            />
            <div className="flex flex-col items-start">
              <p className="text-[14px] font-semibold">{user.name}</p>
              <p className="text-[12px] text-white/60">View Account</p>
            </div>
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}

/* --------------------------- Account Panel --------------------------- */

type AccountPanelProps = {
  open: boolean;
  onClose: () => void;
  user: { name: string; id: string; walletAddress: string };
  onLogout: () => void;
};

function AccountPanel({
  open,
  onClose,
  user,
  onLogout,
}: AccountPanelProps) {
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close overlay"
        className={`absolute inset-0 bg-black/50 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-gradient-to-b from-white to-gray-50 rounded-l-[20px] border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex items-center border-b border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-[16px] font-semibold pointer-events-none">
            Account Details
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[360px] space-y-6">
            {/* User Profile Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B50D9] to-[#6C63FF] mb-4 shadow-lg">
                <Image
                  src="/NDI.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900">{user.name}</h3>
              <p className="text-[14px] text-gray-600 mt-1">Investor Account</p>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">ID</span>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500 font-medium">National ID</p>
                    <p className="text-[14px] font-semibold text-gray-900">{user.id}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[12px] text-gray-500 font-medium mb-2">Wallet Address</p>
                  <p className="text-[13px] font-mono text-gray-800 break-all bg-white/50 p-2 rounded-lg">
                    {user.walletAddress}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#5B50D9] to-[#6C63FF] text-white py-4 font-semibold hover:shadow-lg transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Logout Account
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}