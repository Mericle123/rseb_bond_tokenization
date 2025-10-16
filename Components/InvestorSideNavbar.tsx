"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft } from "lucide-react";

/* ------------------------------ Helpers ------------------------------ */

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* ----------------------------- Main UI ------------------------------- */

export default function InvestorSideNavbar() {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);

  const user = {
    name: "Ngawang Gyeltshen",
    id: "10709004662",
    walletAddress: "0i4u1290nfkjd809214190poij",
  };

  // Match your folder casing exactly
  const NAV_ITEMS = [
    { label: "Home", href: "/investor", icon: "🏠" },
    { label: "Assets", href: "/investor/Assets", icon: "🖼️" },
    { label: "Earnings", href: "/investor/Earnings", icon: "💰" },
    { label: "Activity", href: "/investor/Activity", icon: "👤" },
  ];

  // ✅ FIXED: make Home active only on exact path
  const isActive = (href: string) => {
    if (href === "/investor") {
      return pathname === href; // exact match only for home
    }
    return pathname.startsWith(href); // subpaths active for others
  };

  return (
    <>
      {/* ==================== Desktop Sidebar ==================== */}
      <aside
        className="
          hidden sm:flex flex-col justify-between
          bg-[#5B50D9] text-white w-[230px]
          rounded-[20px] p-4 m-2 shadow-xl ring-1 ring-black/5
          transition-all duration-300 ease-out
          sticky top-2 self-start
          h-[calc(100vh-1rem)]
        "
      >
        <div>
          {/* -------- Logo -------- */}
          <div className="flex justify-center mb-8 mt-4">
            <div className="h-12 w-12 bg-white rounded-full grid place-items-center shadow-inner">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
          </div>

          {/* -------- Navigation Items -------- */}
          <nav className="flex flex-col gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-full
                  font-semibold text-[14px] transition-all duration-300
                  ${
                    isActive(item.href)
                      ? "bg-white text-black shadow-md scale-[1.02]"
                      : "hover:bg-white/10 text-white/90 hover:scale-[1.03]"
                  }
                `}
              >
                <span className="text-[16px]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* -------- Footer -------- */}
        <button
          type="button"
          onClick={() => setAccountOpen(true)}
          className="bg-white text-black rounded-full py-2 px-4 flex items-center gap-2 justify-center shadow hover:shadow-md active:scale-[0.99] transition"
          aria-label="Open account panel"
        >
          <Image
            src="/NDI.png"
            alt="Profile"
            width={28}
            height={28}
            className="rounded-full"
          />
          <p className="text-[13px] font-semibold">{user.id}</p>
        </button>
      </aside>

      {/* ==================== Mobile Navbar ==================== */}
      <nav
        className="
          sm:hidden fixed inset-x-3 bottom-3 z-40
          bg-[#5B50D9] text-white rounded-[20px] px-3 py-2
          shadow-xl ring-1 ring-black/5 flex justify-around
        "
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center gap-1 text-[12px] font-medium transition-all
              ${
                isActive(item.href)
                  ? "text-white scale-[1.1]"
                  : "text-white/80 hover:text-white hover:scale-[1.08]"
              }
            `}
          >
            <span className="text-[18px]">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ==================== Slide-over Account Panel ==================== */}
      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        onRename={() => console.log("rename account")}
        onDelete={() => console.log("delete account")}
        onLogout={() => console.log("logout")}
      />
    </>
  );
}

/* --------------------------- Account Panel --------------------------- */

type AccountPanelProps = {
  open: boolean;
  onClose: () => void;
  user: { name: string; id: string; walletAddress: string };
  onRename: () => void;
  onDelete: () => void;
  onLogout: () => void;
};

function AccountPanel({
  open,
  onClose,
  user,
  onRename,
  onDelete,
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
        className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-[18px] border border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex items-center border-b border-black/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium pointer-events-none">
            Account
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[360px]">
            <h3 className="text-[15px] font-semibold">User</h3>
            <p className="mt-1 text-[13px] text-black/70">{user.name}</p>

            <div className="mt-4 rounded-2xl border border-[#5B50D9]/20 bg-[#5B50D9]/10 p-4">
              <div className="rounded-xl bg-[#5B50D9]/40 p-4">
                <div className="flex items-center gap-2 text-[13px]">
                  <Image
                    src="/NDI.png"
                    alt="avatar"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="font-medium">ID :</span>
                  <span>{user.id}</span>
                </div>
                <div className="mt-2 text-[13px]">
                  <span className="font-medium">Wallet address: </span>
                  <span className="break-all">{user.walletAddress}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={onRename}
                    className="flex flex-col items-center justify-center rounded-xl bg-white py-2 ring-1 ring-black/10 hover:ring-black/20 shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-[13px] font-medium">
                      Rename account
                    </span>
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex flex-col items-center justify-center rounded-xl bg-white py-2 ring-1 ring-black/10 hover:ring-black/20 shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-[13px] font-medium">
                      Delete account
                    </span>
                  </button>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="mt-8 w-full rounded-full bg-[#5B50D9] text-white py-3 font-semibold hover:opacity-95 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}
