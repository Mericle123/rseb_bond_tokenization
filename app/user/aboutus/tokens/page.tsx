"use client";
import Image from "next/image";
import Navbar from "@/Components/UserNavbar";
import Footer from "../../../../Components/UserFooter";
import { useEffect, useRef, useState } from "react";

/** Simple, reusable fade-in on scroll */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    // Respect reduced motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setOn(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // add a tiny delay for staggering
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
        // start state
        "opacity-0 translate-y-3",
        // end state
        on && "opacity-100 translate-y-0",
        // transition
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
  return (
    <main className="min-h-screen bg-white py-10 flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-5xl px-4">
        {/* ===== Bond Summary Card ===== */}
        <FadeIn>
          <div
            className={[
              "rounded-2xl border border-[#B5CAE2] bg-neutral-50/70 shadow-sm mt-6",
              hoverFloat,
              liftShadow,
              softGlow,
            ].join(" ")}
          >
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* LEFT SECTION */}
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="h-[80px] w-[80px] rounded-full border border-neutral-300 bg-white grid place-items-center">
                    <Image
                      src="/RSEB.png"
                      alt="RSEB Logo"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <span className="absolute -bottom-1 left-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                <div>
                  <h1 className="text-[22px] sm:text-2xl font-extrabold text-neutral-900 leading-6">
                    RSEB Bond
                  </h1>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-neutral-800">
                    <span className="font-semibold">Symbol:</span> BNK002
                  </p>
                  <p className="mt-2 text-[13px] sm:text-[14px]">
                    <span className="text-neutral-800">Interest rate : </span>
                    <span className="text-emerald-600 font-medium">+ 5% yr</span>
                  </p>
                  <p className="mt-1 text-[13px] sm:text-[14px] text-neutral-800">
                    <span className="font-semibold">From:</span> Royal Security
                    exchange of Bhutan
                  </p>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex flex-col items-end w-full sm:w-auto">
                {/* Share Button */}
                <button
                  className={[
                    "inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white text-neutral-800 px-3 py-1.5 text-sm font-medium",
                    "transition-all duration-300 hover:bg-neutral-100",
                    liftShadow,
                    softGlow,
                  ].join(" ")}
                  aria-label="Share"
                  title="Share"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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

                <p className="mt-3 text-[13px] sm:text-sm font-semibold text-neutral-900">
                  Issued On
                </p>
                <p className="text-[12px] sm:text-[13px] text-neutral-800">
                  2nd September 2025
                </p>

                <p className="mt-3 text-[12px] text-neutral-700">
                  Subscribed: 100%
                </p>

                <div className="mt-2 inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1">
                  <span className="text-emerald-600 font-semibold">1000</span>
                  <span className="text-neutral-900 ml-1">/1000</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ===== About the Bond Section ===== */}
        <section className="w-full bg-white pt-10 pb-14">
          <FadeIn delay={80}>
            <button
              type="button"
              aria-label="Back"
              className={[
                "inline-flex items-center gap-2 text-neutral-800 hover:opacity-80 mb-3",
                "transition-opacity duration-200",
              ].join(" ")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </FadeIn>

          <FadeIn delay={120}>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-neutral-900">
              About the Bond
            </h2>
          </FadeIn>

          <FadeIn delay={160}>
            <div className="mt-4 space-y-4 text-[13px] sm:text-[14px] leading-6 text-neutral-800">
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

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT CARD */}
            <FadeIn delay={200} className="lg:col-span-6">
              <div
                className={[
                  "rounded-2xl border border-[#B5CAE2] bg-white p-5 sm:p-6",
                  hoverFloat,
                  liftShadow,
                  softGlow,
                ].join(" ")}
              >
                <h3 className="text-[18px] font-semibold text-neutral-900">
                  Details
                </h3>

                <div className="mt-4 space-y-3 text-[13px] sm:text-[14px]">
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Bond Name :{" "}
                    </span>
                    <span className="text-neutral-800">RSEB Bond</span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Bond Symbol :{" "}
                    </span>
                    <span className="text-neutral-800">BNK002</span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Issuer :{" "}
                    </span>
                    <span className="text-neutral-800">
                      Royal Security exchange of Bhutan
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Face value :{" "}
                    </span>
                    <span className="text-neutral-800">Nu 100,000</span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Total Units Offered :{" "}
                    </span>
                    <span className="text-neutral-800">100</span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Issued Date :{" "}
                    </span>
                    <span className="text-neutral-800">
                      2nd September &nbsp;2025
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Maturity Date :{" "}
                    </span>
                    <span className="text-neutral-800">
                      2nd September &nbsp;2025
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-neutral-900">
                      Face value :{" "}
                    </span>
                    <span className="text-neutral-800">10 BTN Coin</span>
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* RIGHT FORM */}
            <FadeIn delay={260} className="lg:col-span-6">
              <h3 className="text-[18px] font-semibold text-neutral-900">
                Total units Offered :{" "}
                <span className="font-extrabold">1000</span>
              </h3>

              <p className="mt-3 text-[13px] sm:text-[14px] text-neutral-800 max-w-[520px]">
                Don’t miss your chance — subscribe now before it’s too late!
                With our secure blockchain technology, you can invest in bonds
                with maximum security, transparency, and seamless management.
              </p>

              <div className="mt-5">
                <p className="text-[14px] font-semibold text-neutral-900">
                  Buy BTN Coin
                </p>

                {/* You Buy */}
                <label className="mt-3 block text-[12px] font-medium text-neutral-700">
                  You Buy
                </label>
                <input
                  type="text"
                  placeholder="BTN coin"
                  className={[
                    "mt-1 w-full max-w-md rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-[13px] text-neutral-900 placeholder-neutral-400 outline-none",
                    "focus:ring-2 focus:ring-neutral-200",
                    liftShadow,
                  ].join(" ")}
                />

                {/* Rate row */}
                <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                      fill="currentColor"
                      className="text-indigo-600"
                    />
                  </svg>
                  <span>1 BTN Coin = BTN Nu 1</span>
                </div>

                {/* You Spend */}
                <label className="mt-4 block text-[12px] font-medium text-neutral-700">
                  You Spend
                </label>
                <input
                  type="text"
                  placeholder="Nu"
                  className={[
                    "mt-1 w-full max-w-md rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-[13px] text-neutral-900 placeholder-neutral-400 outline-none",
                    "focus:ring-2 focus:ring-neutral-200",
                    liftShadow,
                  ].join(" ")}
                />

                {/* Button */}
                <button
                  type="button"
                  className={[
                    "mt-5 inline-flex w-full max-w-md items-center justify-center rounded-md",
                    "bg-gradient-to-r from-[#5B4AE3] to-[#4338CA] px-4 py-2.5 text-[13px] font-medium text-white",
                    hoverFloat,
                    liftShadow,
                    // soft glowing ring on hover
                    "ring-0 hover:ring-2 hover:ring-indigo-300/50",
                    "transition-all duration-300",
                  ].join(" ")}
                >
                  Subscribe Now
                </button>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>

      <FadeIn delay={120}>
        <Footer />
      </FadeIn>
    </main>
  );
}
