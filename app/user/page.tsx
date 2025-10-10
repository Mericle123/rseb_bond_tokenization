"use client";

import { motion } from "framer-motion";
import UserNavbar from "@/Components/UserNavbar"; // or "../../Components/UserNavbar"

const fadeIn = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const cardHover = {
  whileHover: { y: -4, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
};

export default function UserLanding() {
  return (
    <>
      {/* Sticky Navbar */}
      <UserNavbar />

      {/* Main Content - reduced top padding */}
      <main className="min-h-screen bg-white text-neutral-900 pt-8 sm:pt-10">
        {/* ===== Outer Container ===== */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          {/* ===== Hero + Mission/Vision/Claim Funds ===== */}
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
            {/* LEFT: Hero */}
            <motion.section
              {...fadeIn}
              viewport={{ once: true, amount: 0.3 }}
              className="col-span-1 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-900 p-6 sm:p-8 lg:col-span-7 lg:p-12 text-white"
            >
              <div className="mb-5 sm:mb-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur">
                <span className="block h-2 w-2 rounded-full bg-white/80" />
                Invest in the nation&apos;s growth
              </div>

              <h1 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.05] tracking-tight">
                Bhutan&apos;s
                <br />
                Digital
                <br />
                Bond
                <br />
                Market
              </h1>

              <p className="mt-4 sm:mt-6 max-w-md text-white/90 text-sm sm:text-base">
                With secure, transparent digital
                <br />
                bonds.
              </p>
            </motion.section>

            {/* RIGHT: Mission / Vision / Claim Funds */}
            <motion.section
              {...fadeIn}
              viewport={{ once: true, amount: 0.2 }}
              className="col-span-1 grid grid-cols-1 gap-6 md:gap-8 lg:col-span-5"
            >
              {/* Top row: Mission + Vision */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <motion.div
                  {...cardHover}
                  className="rounded-3xl bg-blue-500/90 p-5 sm:p-6 text-white shadow-lg"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold">Mission</h3>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/90">
                    &quot;To develop and establish a fair, orderly and transparent securities
                    market with the objective to facilitate efficient mobilization and
                    allocation of capital and ensure apt regulation to maintain market
                    integrity and investor confidence&quot;
                  </p>
                </motion.div>

                <motion.div
                  {...cardHover}
                  className="rounded-3xl bg-indigo-700 p-5 sm:p-6 text-white shadow-lg"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold">Vision</h3>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/90">
                    &quot;To become an integral part of the financial system and participate
                    in the nation building&quot;
                  </p>
                </motion.div>
              </div>

              {/* Bottom row: Claim Unclaimed Funds */}
              <motion.div
                {...cardHover}
                className="rounded-3xl bg-black p-5 sm:p-6 md:p-7 lg:p-8 text-white shadow-xl"
              >
                <div className="grid grid-cols-1 items-start gap-6 md:gap-8 sm:grid-cols-3">
                  {/* Illustration */}
                  <div className="order-last sm:order-first sm:col-span-1">
                    <div className="mx-auto h-36 w-28 sm:h-40 sm:w-32 -rotate-6 overflow-hidden rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 p-3 sm:p-4 shadow-inner">
                      <div className="mx-auto mt-0.5 h-24 w-20 rounded-lg bg-white/95 p-2.5 sm:p-3">
                        <div className="mx-auto mb-1 h-4 w-14 rounded bg-slate-200" />
                        <div className="flex items-start gap-2">
                          <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-violet-400" />
                          <div className="flex-1 space-y-1 pt-1">
                            <div className="h-2 w-full rounded bg-slate-200" />
                            <div className="h-2 w-11/12 rounded bg-slate-200" />
                            <div className="h-2 w-10/12 rounded bg-slate-200" />
                            <div className="h-2 w-8/12 rounded bg-slate-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copy */}
                  <div className="sm:col-span-2">
                    <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
                      Claim Your
                      <br />
                      Unclaimed Funds
                    </h3>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/85">
                      The Royal Securities Exchange of Bhutan (RSEB) is safeguarding Nu. 87.4
                      million in unclaimed funds, including Nu. 77.5 million in dividends from
                      14 listed companies and Nu. 9.9 million in share proceeds from 5 delisted
                      companies.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </div>

          {/* ===== About Section (Uniform tiles, bigger images) ===== */}
          <motion.section
            {...fadeIn}
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              {/* LEFT: About copy */}
              <div className="lg:col-span-5">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  About RSEB
                </h2>
                <p className="mt-6 text-[0.95rem] sm:text-base leading-7 text-neutral-700">
                  The Royal Securities Exchange of Bhutan (RSEB), established in August 1993
                  under the Royal Monetary Authority, began trading on 11 October the same
                  year. Its aim is to promote share ownership, mobilize savings, raise equity,
                  and provide liquidity. Supported by the Asian Development Bank, it was later
                  incorporated under the Companies Act 2000 and is regulated by the Financial
                  Services Act 2011. RSEB became autonomous in 1996 and now operates with five
                  brokerage firms—subsidiaries of four financial institutions plus DrukyuI
                  Securities Broker Pvt. Ltd. Shareholders increased from 1,828 in 1993 to over
                  62,610 by 2018, with listed companies rising from four to 21 and market
                  capitalization from Nu. 493.40 million to Nu. 29.36 billion. In April 2012,
                  RSEB introduced the Integrated System, developed by InfoTech Pvt. Ltd. with
                  World Bank support, replacing the manual system and improving market
                  efficiency.
                </p>
              </div>

              {/* RIGHT: Cards area (responsive grid) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* RSEB logo — larger */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-white shadow-lg flex items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px]"
                >
                  <img
                    src="/RSEB.png"
                    alt="RSEB"
                    className="max-h-[78%] md:max-h-[82%] w-auto object-contain"
                  />
                </motion.div>

                {/* Slush Wallet — larger icon */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-neutral-900 text-white shadow-lg flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px]"
                >
                  <img
                    src="/slush.png"
                    alt="Slush Wallet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4"
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center">
                    Slush
                    <br />
                    Wallet
                  </div>
                </motion.div>

                {/* SUI Blockchain — larger icon */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-[#4DA2FF] text-white shadow-lg flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px]"
                >
                  <img
                    src="/sui drop.png"
                    alt="SUI droplet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4"
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center">
                    SUI
                    <br />
                    Blockchain
                  </div>
                </motion.div>

                {/* Secure Wallet — larger icon */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-[#8B5CF6] text-white shadow-lg flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px]"
                >
                  <img
                    src="/wallet.png"
                    alt="Secure Wallet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4"
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center">
                    Secure
                    <br />
                    Wallet
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ===== Scalable Blockchain Section (full-bleed, exact design) ===== */}
        <motion.section
          {...fadeIn}
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 sm:mt-16 lg:mt-20 w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-br from-[#5B4AE3] via-[#6C43E0] to-[#4338CA] overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 items-center gap-8 md:gap-10 md:grid-cols-12">
              {/* Left: coin image */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="flex justify-center md:col-span-5"
              >
                <div className="rounded-2xl p-2 sm:p-4">
                  <img
                    src="/coin.png"
                    alt="Sui Coin"
                    className="h-56 w-56 sm:h-72 sm:w-72 object-contain drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                  />
                </div>
              </motion.div>

              {/* Right: text content */}
              <div className="md:col-span-7 text-white">
                <div className="inline-flex items-center rounded-full border border-white/30 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-wide">
                  Innovative &amp; Reliable
                </div>
                <h2 className="mt-5 sm:mt-6 text-3xl sm:text-4xl font-extrabold leading-tight">
                  The Future of
                  <br />
                  Scalable Blockchain.
                </h2>
                <p className="mt-3 sm:mt-4 max-w-2xl text-white/90 text-sm sm:text-base">
                  Sui harnesses cutting-edge architecture and parallel transaction processing
                  to deliver unmatched speed, security, and efficiency—paving the way for a
                  new era of decentralized applications and digital assets.
                </p>

                <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">High Performance</h3>
                    <p className="mt-2 sm:mt-3 text-white/85 text-sm">
                      Experience lightning-fast transactions powered by Sui’s unique
                      object-centric model and horizontal scalability.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">Secure by Design</h3>
                    <p className="mt-2 sm:mt-3 text-white/85 text-sm">
                      Experience lightning-fast transactions powered by Sui’s unique
                      object-centric model and horizontal scalability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== Our Story Section (Enlarged) ===== */}
        <motion.section
          {...fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-20 sm:mt-24 lg:mt-28 max-w-7xl px-4 sm:px-6 lg:px-12"
        >
          <div className="grid grid-cols-1 items-center gap-12 sm:gap-16 lg:gap-20 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-black">Our story</h2>
              <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6 leading-8 sm:leading-9 text-neutral-700 text-[0.98rem] sm:text-[1.05rem]">
                <p>
                  Founded in 2023, RSEB Bhutan was born out of a vision to simplify and
                  modernize Bhutan&apos;s energy and resources sector…
                </p>
                <p>
                  What began as an initiative to bridge these gaps has grown into a trusted
                  platform that empowers communities…
                </p>
                <p>
                  As we continue our journey, we remain committed to building a future where
                  technology and sustainability work hand in hand…
                </p>
              </div>
            </div>

            {/* Right Tilted Card */}
            <motion.div
              {...cardHover}
              className="lg:col-span-6"
            >
              <div className="relative mx-auto w-full max-w-[560px]">
                <div
                  className="absolute inset-0 translate-x-6 sm:translate-x-8 translate-y-8 sm:translate-y-10 rounded-[28px] sm:rounded-[32px] bg-[#BDA9FF] opacity-90 shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                  aria-hidden="true"
                />
                <div className="relative rotate-[5deg] sm:rotate-[6deg] rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#7C5CFB] via-[#6C4FE0] to-[#3C28A1] p-8 sm:p-10 text-white shadow-2xl">
                  <h3 className="text-xl sm:text-2xl font-bold">Our Goal at RSEB Bhutan</h3>
                  <p className="mt-4 sm:mt-5 text-[0.98rem] sm:text-[1.05rem] leading-7 sm:leading-8 text-white/90">
                    The RSEB provides a platform for equity capital, encourages wider share
                    ownership, and manages unclaimed funds for shareholders.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== Our Core Value ===== */}
        <motion.section
          {...fadeIn}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex justify-end">
            <h2 className="text-right font-extrabold text-black leading-[0.9] text-[2.75rem] md:text-[4.25rem] lg:text-[6rem]">
              Our Core Value
            </h2>
          </div>

          <div className="mt-6 sm:mt-8 grid items-start gap-8 md:gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-10">
              {(() => {
                const card =
                  "rounded-[14px] bg-gradient-to-br from-[#7C5CFB] via-[#6C4FE0] to-[#2F2A7B] p-6 sm:p-8 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]";
                return (
                  <>
                    <motion.div {...cardHover} className={card}>
                      <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                        Transparency
                      </h3>
                      <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                        We uphold openness and accountability, fostering trust among all
                        stakeholders.
                      </p>
                    </motion.div>

                    <div className="hidden md:block" />

                    <motion.div {...cardHover} className={card}>
                      <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                        Sustainability
                      </h3>
                      <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                        We are dedicated to protecting the environment and ensuring long-term
                        growth.
                      </p>
                    </motion.div>

                    <motion.div {...cardHover} className={card}>
                      <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                        Innovation
                      </h3>
                      <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                        We embrace technology and creativity to drive progress in Bhutan’s
                        energy sector.
                      </p>
                    </motion.div>
                  </>
                );
              })()}
            </div>

            <div className="lg:col-span-5">
              <div className="ml-auto max-w-[560px] text-right text-black">
                <div className="text-[0.98rem] sm:text-[1.05rem] leading-6 text-neutral-700 mb-3 sm:mb-4">
                  <p>The principles that</p>
                  <p>guide everything we do</p>
                  <p>at RSEB</p>
                </div>

                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">
                  Our <span className="font-extrabold">mission</span>
                </p>
                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">is to build trust, drive</p>
                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">progress, and</p>
                <p className="mt-1 text-[1.75rem] sm:text-[2.25rem] font-extrabold leading-[1.2]">
                  create
                </p>
                <p className="mt-1 text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">
                  a resilient future where
                </p>
                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">
                  innovation, sustainability, and
                </p>
                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">
                  community empowerment go
                </p>
                <p className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]">hand in hand</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== Footer (exact 3-column layout) ===== */}
        <footer className="w-full mt-16 sm:mt-20">
          {/* Top Purple Section — full-bleed */}
          <div className="bg-[#2F2A72] w-screen relative left-1/2 right-1/2 -mx-[50vw]">
            <motion.div
              {...fadeIn}
              viewport={{ once: true, amount: 0.15 }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-9"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10">
                {/* LEFT — Logo + Text */}
                <motion.div {...cardHover} className="flex items-start sm:items-center gap-4 sm:gap-5">
                  <div className="h-[84px] w-[84px] sm:h-[96px] sm:w-[96px] rounded-full bg-white p-3 flex items-center justify-center shadow">
                    <img src="/RSEB.png" alt="RSEB" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-white leading-[1.1] pt-0.5">
                    <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Claim</p>
                    <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Your</p>
                    <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Unclaimed</p>
                    <p className="text-[1.4rem] sm:text-[1.8rem] font-semibold">Funds</p>
                  </div>
                </motion.div>

                {/* MIDDLE — Nav links */}
                <nav className="text-white text-[0.95rem]">
                  <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-start">
                    <li><a href="#" className="hover:text-white/80">Home</a></li>
                    <li><a href="#" className="hover:text-white/80">About RSEB</a></li>
                    <li><a href="#" className="hover:text-white/80">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white/80">Privacy Policy</a></li>
                  </ul>
                </nav>

                {/* RIGHT — Contact Info + Feedback */}
                <div className="text-white/95 w-full sm:w-auto">
                  <div className="space-y-2.5">
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold text-white">Call us :</span>
                      <span className="ml-2">+975 17495130</span>
                    </div>
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold text-white">Email :</span>
                      <span className="ml-2">Note@gmail.com</span>
                    </div>
                  </div>

                  <form className="mt-3 sm:mt-4 flex items-center">
                    <input
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
                        <path
                          d="M4 12h14M13 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom White Strip */}
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <p className="text-center text-[0.85rem] sm:text-[0.9rem] text-neutral-600">
                ©2025 Royal Securities Exchange of Bhutan. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
