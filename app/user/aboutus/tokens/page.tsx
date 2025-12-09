"use client";

import Image from "next/image";
import Navbar from "@/Components/UserNavbar";
import Footer from "../../../../Components/UserFooter";
import { useEffect, useRef, useState, type ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

/** Simple, reusable fade-in on scroll */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    // Respect reduced motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setOn(true);
      return;
    }

    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setOn(true), delay);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={[
        "opacity-0 translate-y-3",
        on && "opacity-100 translate-y-0",
        "transition-all duration-700 ease-out will-change-transform",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

/** Reusable hover treatments (no layout change) */
const hoverFloat =
  "transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.015]";
const liftShadow =
  "transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5";
const softGlow =
  "hover:ring-1 hover:ring-indigo-300/60 hover:shadow-[0_0_0_4px_rgba(99,102,241,0.07)]";

export default function BondSummaryCard() {
  const router = useRouter();

  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(
    null
  );

  // NEW: state for real-time numeric inputs
  const [buyAmount, setBuyAmount] = useState<string>("");   // BTNC Coin
  const [spendAmount, setSpendAmount] = useState<string>(""); // Nu

  const showToast = useCallback((payload: { type: "success" | "error"; message: string }) => {
    setToast(payload);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      const title = "RSEB Infrastructure Bond – Series BNK002";
      const text =
        "Check out this digital RSEB Infrastructure Bond (BNK002) on the blockchain-powered platform.";

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast({ type: "success", message: "Link copied to clipboard" });
        return;
      }

      showToast({ type: "error", message: "Sharing not supported in this browser" });
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Share failed:", err);
      showToast({ type: "error", message: "Unable to share this bond" });
    }
  };

  // ========= Numeric helpers =========

  /**
   * Allow only: digits + at most one decimal point, and at most 2 decimal places.
   * Returns cleaned string or null if invalid (so we can ignore).
   */
  const sanitizeDecimalInput = (value: string): string | null => {
    if (value === "") return "";

    // Allow leading/trailing spaces but trim
    const trimmed = value.trim();

    // Regex: optional digits, optional decimal point + up to 2 decimals
    const decimalRegex = /^\d*\.?\d{0,2}$/;
    if (!decimalRegex.test(trimmed)) return null;

    return trimmed;
  };

  const handleBuyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = sanitizeDecimalInput(raw);
    if (cleaned === null) {
      // invalid -> ignore change
      return;
    }

    setBuyAmount(cleaned);

    // 1 BTNC = 1 Nu, so mirror the amount
    if (cleaned === "") {
      setSpendAmount("");
    } else {
      setSpendAmount(cleaned);
    }
  };

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = sanitizeDecimalInput(raw);
    if (cleaned === null) {
      // invalid -> ignore change
      return;
    }

    setSpendAmount(cleaned);

    // 1 BTNC = 1 Nu, so mirror the amount
    if (cleaned === "") {
      setBuyAmount("");
    } else {
      setBuyAmount(cleaned);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-indigo-50/20 flex flex-col">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pt-6 pb-16 flex-1">
        {/* ===== Bond Summary Card ===== */}
        <FadeIn>
          <div
            className={[
              "mt-4 sm:mt-6 rounded-3xl border border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-sm",
              hoverFloat,
              liftShadow,
              softGlow,
            ].join(" ")}
          >
            <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 sm:gap-6">
              {/* LEFT SECTION */}
              <div className="flex items-start gap-4 sm:gap-5 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="h-14 w-14 sm:h-[80px] sm:w-[80px] rounded-2xl border border-gray-200 bg-white grid place-items-center shadow-sm">
                    <Image
                      src="/RSEB.png"
                      alt="Royal Securities Exchange of Bhutan Logo"
                      width={56}
                      height={56}
                      className="object-contain rounded-xl"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-200 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">
                      Digital Bond • Blockchain
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                      Tokenized on Sui
                    </span>
                  </div>

                  <h1 className="text-[18px] sm:text-[22px] md:text-2xl font-extrabold text-neutral-900 leading-snug break-words">
                    RSEB Infrastructure Bond – Series BNK002
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-[12px] md:text-[13px] text-neutral-800">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1">
                      <span className="font-semibold text-neutral-900">
                        Symbol:
                      </span>
                      <span className="font-medium tracking-wide">
                        BNK002
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/80 border border-gray-200 px-2.5 py-1">
                      <span className="font-semibold text-neutral-900">
                        Issuer:
                      </span>
                      <span>Royal Securities Exchange of Bhutan</span>
                    </span>
                  </div>

                  <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-800">
                    <span className="text-neutral-800">Interest Rate:&nbsp;</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 font-semibold text-[11px] sm:text-[12px] border border-emerald-200">
                      + 5% p.a. (annual simple interest)
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex flex-col w-full sm:w-auto gap-3 sm:items-end">
                <button
                  onClick={handleShare}
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white/90 text-neutral-800 px-3.5 py-1.5 text-[11px] sm:text-[12px] font-medium",
                    "transition-all duration-300 hover:bg-gray-50 cursor-pointer",
                    "w-full xs:w-auto sm:w-auto",
                    liftShadow,
                    softGlow,
                  ].join(" ")}
                  aria-label="Share this bond"
                  title="Share this bond"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share
                </button>

                <div className="text-left sm:text-right space-y-1 w-full sm:w-auto">
                  <div className="text-[11px] sm:text-[12px] md:text-[13px]">
                    <p className="font-semibold text-neutral-900">Issued On</p>
                    <p className="text-neutral-700 whitespace-nowrap">
                      2nd September 2025
                    </p>
                  </div>

                  <div className="mt-2">
                    <p className="text-[11px] sm:text-[12px] text-neutral-700 mb-1">
                      Subscription Status
                    </p>
                    <div className="flex items-center gap-2 justify-start sm:justify-end">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                        Fully Subscribed
                      </span>
                    </div>
                    <div className="mt-2 w-full sm:w-40 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                    </div>
                    <p className="mt-1 text-[10px] sm:text-[11px] text-neutral-700">
                      <span className="font-semibold text-emerald-700">
                        1000
                      </span>{" "}
                      / 1000 units
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ===== About the Bond Section ===== */}
        <section className="w-full pt-8 sm:pt-10">
          <FadeIn delay={80}>
            <button
              type="button"
              aria-label="Back to previous page"
              onClick={handleBack}
              className={[
                "inline-flex items-center gap-2 text-neutral-800 hover:opacity-80 mb-3 sm:mb-4 cursor-pointer",
                "transition-opacity duration-200",
              ].join(" ")}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[12px] sm:text-[13px] font-medium">
                Back to bonds
              </span>
            </button>
          </FadeIn>

          <FadeIn delay={120}>
            <h2 className="text-[18px] sm:text-[22px] md:text-[24px] font-extrabold text-neutral-900">
              About the Bond
            </h2>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="mt-3 sm:mt-4 space-y-4 text-[12px] sm:text-[13px] md:text-[14px] leading-6 text-neutral-800 bg-white/80 backdrop-blur-sm border border-gray-200/70 rounded-2xl p-4 sm:p-5 md:p-6">
              <p>
                The Royal Securities Exchange of Bhutan (RSEB) is proud to
                introduce this digital bond as part of its mission to mobilize
                domestic capital for Bhutan’s long-term national development
                projects. These projects are vital to driving sustainable
                growth, modernizing infrastructure, and empowering communities
                across the country. By offering this bond on a secure,
                blockchain-based platform, RSEB opens the door for Bhutanese
                individuals and institutions to actively participate in shaping
                the nation’s financial future.
              </p>

              <p>
                For investors, this bond represents more than just an
                opportunity to earn stable and transparent returns. It is also a
                chance to be directly involved in strengthening Bhutan’s
                financial ecosystem, supporting critical infrastructure
                initiatives, and fostering innovation in capital markets.
                Through digital participation, investors contribute to a
                collective effort that balances economic progress with Bhutan’s
                values of sustainability and community empowerment.
              </p>
            </div>
          </FadeIn>

          <div className="mt-7 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT CARD – Bond Details */}
            <FadeIn delay={200} className="lg:col-span-6">
              <div
                className={[
                  "rounded-2xl border border-[#B5CAE2] bg-white/90 p-4 sm:p-5 md:p-6 backdrop-blur-sm",
                  hoverFloat,
                  liftShadow,
                  softGlow,
                ].join(" ")}
              >
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-neutral-900">
                  Bond Details
                </h3>

                <div className="mt-4 space-y-3 text-[12px] sm:text-[13px] md:text-[14px]">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Bond Name:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      RSEB Infrastructure Bond
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Bond Symbol:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      BNK002
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Issuer:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      Royal Securities Exchange of Bhutan
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Face Value (Nu):
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      Nu 100,000
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Total Units Offered:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      100
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Issued Date:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      2nd September 2025
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4 border-b border-gray-100 pb-2">
                    <span className="font-semibold text-neutral-900">
                      Maturity Date:
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      2nd September 2030
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1.5 sm:gap-4">
                    <span className="font-semibold text-neutral-900">
                      Face Value (per unit, BTNC Coin):
                    </span>
                    <span className="text-neutral-800 sm:text-right break-words">
                      10 BTNC Coin
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* RIGHT FORM – Subscription CTA */}
            <FadeIn delay={260} className="lg:col-span-6">
              <div
                className={[
                  "rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/90 to-orange-100/70 p-4 sm:p-5 md:p-6 shadow-sm",
                  hoverFloat,
                  liftShadow,
                ].join(" ")}
              >
                <h3 className="text-[16px] sm:text-[18px] font-semibold text-amber-900">
                  Subscription Summary
                </h3>

                <p className="mt-2 text-[12px] sm:text-[13px] md:text-[14px] text-amber-900/90 max-w-none md:max-w-[520px]">
                  Total units offered:{" "}
                  <span className="font-bold">1000</span>. This bond is fully
                  subscribed, demonstrating strong investor confidence in
                  Bhutan’s digital bond market and tokenized infrastructure
                  projects.
                </p>

                <p className="mt-3 text-[11px] sm:text-[12px] md:text-[13px] text-amber-900/90">
                  When live, you’ll be able to purchase BTNC Coin and subscribe
                  digitally via our secure blockchain-powered platform.
                </p>

                <div className="mt-4 sm:mt-5 bg-white/90 rounded-2xl border border-gray-200/70 p-4 sm:p-5">
                  <p className="text-[13px] sm:text-[14px] font-semibold text-neutral-900 mb-1">
                    Buy BTNC Coin
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-neutral-700 mb-3 sm:mb-4">
                    Use BTN Coin to subscribe to the bond units. 1 BTNC Coin is
                    pegged 1:1 with BTN (Nu).
                  </p>

                  {/* You Buy */}
                  <label className="mt-1 block text-[11px] sm:text-[12px] font-medium text-neutral-700">
                    You Buy
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="BTNC Coin"
                    value={buyAmount}
                    onChange={handleBuyChange}
                    className={[
                      "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-[12px] sm:text-[13px] text-neutral-900 placeholder-neutral-400 outline-none",
                      "focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300",
                      liftShadow,
                    ].join(" ")}
                  />

                  {/* Rate row */}
                  <div className="mt-2 flex items-center gap-2 text-[10px] sm:text-[11px] text-neutral-600">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                        fill="currentColor"
                        className="text-indigo-600"
                      />
                    </svg>
                    <span>1 BTNC Coin = BTN Nu 1</span>
                  </div>

                  {/* You Spend */}
                  <label className="mt-4 block text-[11px] sm:text-[12px] font-medium text-neutral-700">
                    You Spend
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Nu"
                    value={spendAmount}
                    onChange={handleSpendChange}
                    className={[
                      "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-[12px] sm:text-[13px] text-neutral-900 placeholder-neutral-400 outline-none",
                      "focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300",
                      liftShadow,
                    ].join(" ")}
                  />

                  {/* Button */}
                  <button
                    type="button"
                    className={[
                      "mt-4 sm:mt-5 inline-flex w-full items-center justify-center rounded-lg",
                      "bg-gradient-to-r from-[#5B50D9] to-[#8B5CF6] px-4 py-2.5 text-[12px] sm:text-[13px] font-semibold text-white",
                      hoverFloat,
                      liftShadow,
                      "ring-0 hover:ring-2 hover:ring-indigo-300/50",
                      "transition-all duration-300 cursor-not-allowed opacity-70",
                    ].join(" ")}
                    disabled
                  >
                    Buy/ Sell Now 
                  </button>

                  <p className="mt-2 text-[10px] sm:text-[11px] text-neutral-600">
                    Once live, subscriptions will be processed transparently on
                    the blockchain, with your holdings reflected in your digital
                    portfolio.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>

      <FadeIn delay={120}>
        <Footer />
      </FadeIn>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 inset-x-0 flex justify-center z-50 px-3">
          <div
            className={[
              "px-4 py-2 rounded-full text-xs sm:text-sm shadow-md border max-w-xs sm:max-w-md text-center",
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800",
            ].join(" ")}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
