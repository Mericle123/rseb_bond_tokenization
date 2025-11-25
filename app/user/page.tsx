"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import UserNavbar from "@/Components/UserNavbar"; 
import Footer from "../../Components/UserFooter";

// Enhanced animations
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardHover = {
  whileHover: { 
    y: -8, 
    scale: 1.02,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    } 
  },
  whileTap: { scale: 0.98 }
};

const floatAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const gradientShift = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export default function UserLanding() {
  const constraintsRef = useRef(null);

  return (
    <>
      {/* Sticky Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="min-h-screen bg-white text-neutral-900 pt-8 sm:pt-10 overflow-x-hidden">
        {/* ===== Outer Container ===== */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          {/* ===== Hero + Mission/Vision/Claim Funds ===== */}
          <motion.div 
            className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* LEFT: Hero */}
            <motion.section
              variants={fadeInUp}
              className="col-span-1 rounded-3xl relative overflow-hidden lg:col-span-7 text-white"
            >
              {/* Animated Gradient Background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-800"
                variants={gradientShift}
                animate="animate"
              />
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              
              <div className="relative z-10 p-6 sm:p-8 lg:p-12">
                <motion.div 
                  className="mb-5 sm:mb-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.span 
                    className="block h-2 w-2 rounded-full bg-white/80"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Invest in the nation&apos;s growth
                </motion.div>

                <motion.h1 
                  className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.05] tracking-tight"
                  variants={staggerContainer}
                >
                  <motion.span variants={fadeInUp} className="block">Bhutan&apos;s</motion.span>
                  <motion.span variants={fadeInUp} className="block">Digital</motion.span>
                  <motion.span variants={fadeInUp} className="block">Bond</motion.span>
                  <motion.span variants={fadeInUp} className="block">Market</motion.span>
                </motion.h1>

                <motion.p 
                  className="mt-4 sm:mt-6 max-w-md text-white/90 text-sm sm:text-base font-medium"
                  variants={fadeInUp}
                >
                  With secure, transparent digital
                  <br />
                  bonds.
                </motion.p>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"
                  variants={floatAnimation}
                  animate="animate"
                />
                <motion.div
                  className="absolute bottom-12 left-12 w-8 h-8 rounded-full bg-white/5 backdrop-blur-sm"
                  variants={floatAnimation}
                  animate="animate"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            </motion.section>

            {/* RIGHT: Mission / Vision / Claim Funds */}
            <motion.section
              variants={fadeInUp}
              className="col-span-1 grid grid-cols-1 gap-6 md:gap-8 lg:col-span-5"
            >
              {/* Top row: Mission + Vision */}
              <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2">
                <motion.div
                  {...cardHover}
                  className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-semibold">Mission</h3>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/90">
                      &quot;To develop and establish a fair, orderly and transparent securities
                      market with the objective to facilitate efficient mobilization and
                      allocation of capital and ensure apt regulation to maintain market
                      integrity and investor confidence&quot;
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  {...cardHover}
                  className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-semibold">Vision</h3>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/90">
                      &quot;To become an integral part of the financial system and participate
                      in the nation building&quot;
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Bottom row: Claim Unclaimed Funds */}
              <motion.div
                {...cardHover}
                className="rounded-3xl bg-gradient-to-br from-gray-900 to-black p-5 sm:p-6 md:p-7 lg:p-8 text-white shadow-2xl relative overflow-hidden group"
                ref={constraintsRef}
              >
                {/* Animated background elements */}
                <motion.div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="grid grid-cols-1 items-start gap-6 md:gap-8 sm:grid-cols-3 relative z-10">
                  {/* Illustration */}
                  <motion.div 
                    className="order-last sm:order-first sm:col-span-1"
                    whileHover={{ rotate: -2, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="mx-auto h-36 w-28 sm:h-40 sm:w-32 -rotate-6 overflow-hidden rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 p-3 sm:p-4 shadow-inner border border-white/10">
                      <div className="mx-auto mt-0.5 h-24 w-20 rounded-lg bg-white/95 p-2.5 sm:p-3 shadow-md">
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
                  </motion.div>

                  {/* Copy */}
                  <div className="sm:col-span-2">
                    <motion.h3 
                      className="text-2xl sm:text-3xl font-semibold leading-tight"
                      whileInView={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.6 }}
                    >
                      Claim Your
                      <br />
                      Unclaimed Funds
                    </motion.h3>
                    <motion.p 
                      className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/85"
                      whileInView={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      The Royal Securities Exchange of Bhutan (RSEB) is safeguarding Nu. 87.4
                      million in unclaimed funds, including Nu. 77.5 million in dividends from
                      14 listed companies and Nu. 9.9 million in share proceeds from 5 delisted
                      companies.
                    </motion.p>
                    
                    <motion.button
                      className="mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Claim Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </motion.div>

          {/* ===== About Section ===== */}
          <motion.section
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              {/* LEFT: About copy */}
              <motion.div 
                className="lg:col-span-5"
                variants={staggerContainer}
              >
                <motion.h2 
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                  variants={fadeInUp}
                >
                  About RSEB
                </motion.h2>
                <motion.p 
                  className="mt-6 text-[0.95rem] sm:text-base leading-7 text-neutral-700"
                  variants={fadeInUp}
                >
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
                </motion.p>
              </motion.div>

              {/* RIGHT: Cards area */}
              <motion.div 
                className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                variants={staggerContainer}
              >
                {/* RSEB logo */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100 flex items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src="/RSEB.png"
                    alt="RSEB"
                    className="max-h-[78%] md:max-h-[82%] w-auto object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>

                {/* Slush Wallet */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src="/slush.png"
                    alt="Slush Wallet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4 relative z-10"
                    whileHover={{ rotate: 5 }}
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center relative z-10">
                    Slush
                    <br />
                    Wallet
                  </div>
                </motion.div>

                {/* SUI Blockchain */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-gradient-to-br from-[#4DA2FF] to-[#2D76CC] text-white shadow-xl flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src="/sui drop.png"
                    alt="SUI droplet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4 relative z-10"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center relative z-10">
                    SUI
                    <br />
                    Blockchain
                  </div>
                </motion.div>

                {/* Secure Wallet */}
                <motion.div
                  {...cardHover}
                  className="rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-xl flex flex-col items-center justify-center h-[220px] sm:h-[240px] md:h-[270px] lg:h-[300px] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.img
                    src="/wallet.png"
                    alt="Secure Wallet"
                    className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain mb-3 sm:mb-4 relative z-10"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight text-center relative z-10">
                    Secure
                    <br />
                    Wallet
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* ===== Scalable Blockchain Section ===== */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 sm:mt-16 lg:mt-20 w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-hidden"
        >
          {/* Animated gradient background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[#5B4AE3] via-[#6C43E0] to-[#4338CA]"
            variants={gradientShift}
            animate="animate"
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 items-center gap-8 md:gap-10 md:grid-cols-12">
              {/* Left: coin image */}
              <motion.div
                className="flex justify-center md:col-span-5"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div 
                  className="rounded-2xl p-2 sm:p-4"
                  animate={{ rotateY: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  <img
                    src="/coin.png"
                    alt="Sui Coin"
                    className="h-56 w-56 sm:h-72 sm:w-72 object-contain drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                  />
                </motion.div>
              </motion.div>

              {/* Right: text content */}
              <motion.div 
                className="md:col-span-7 text-white"
                variants={staggerContainer}
              >
                <motion.div 
                  className="inline-flex items-center rounded-full border border-white/30 px-3.5 py-1 text-[10px] sm:text-xs uppercase tracking-wide bg-white/10 backdrop-blur-sm"
                  variants={fadeInUp}
                >
                  Innovative &amp; Reliable
                </motion.div>
                <motion.h2 
                  className="mt-5 sm:mt-6 text-3xl sm:text-4xl font-extrabold leading-tight"
                  variants={fadeInUp}
                >
                  The Future of
                  <br />
                  Scalable Blockchain.
                </motion.h2>
                <motion.p 
                  className="mt-3 sm:mt-4 max-w-2xl text-white/90 text-sm sm:text-base"
                  variants={fadeInUp}
                >
                  Sui harnesses cutting-edge architecture and parallel transaction processing
                  to deliver unmatched speed, security, and efficiency—paving the way for a
                  new era of decentralized applications and digital assets.
                </motion.p>

                <motion.div 
                  className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2"
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                      <motion.span 
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      High Performance
                    </h3>
                    <p className="mt-2 sm:mt-3 text-white/85 text-sm">
                      Experience lightning-fast transactions powered by Sui&apos;s unique
                      object-centric model and horizontal scalability.
                    </p>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                      <motion.span 
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      Secure by Design
                    </h3>
                    <p className="mt-2 sm:mt-3 text-white/85 text-sm">
                      Built with security-first principles ensuring your assets and data
                      remain protected at all times.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ===== Our Story Section ===== */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-20 sm:mt-24 lg:mt-28 max-w-7xl px-4 sm:px-6 lg:px-12"
        >
          <div className="grid grid-cols-1 items-center gap-12 sm:gap-16 lg:gap-20 lg:grid-cols-12">
            {/* Left Content */}
            <motion.div 
              className="lg:col-span-6"
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl sm:text-4xl font-extrabold text-black"
                variants={fadeInUp}
              >
                Our story
              </motion.h2>
              <motion.div 
                className="mt-6 sm:mt-8 space-y-5 sm:space-y-6 leading-8 sm:leading-9 text-neutral-700 text-[0.98rem] sm:text-[1.05rem]"
                variants={staggerContainer}
              >
                <motion.p variants={fadeInUp}>
                  Founded in 2023, RSEB Bhutan was born out of a vision to simplify and
                  modernize Bhutan&apos;s energy and resources sector…
                </motion.p>
                <motion.p variants={fadeInUp}>
                  What began as an initiative to bridge these gaps has grown into a trusted
                  platform that empowers communities…
                </motion.p>
                <motion.p variants={fadeInUp}>
                  As we continue our journey, we remain committed to building a future where
                  technology and sustainability work hand in hand…
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Right Tilted Card */}
            <motion.div
              className="lg:col-span-6"
              variants={fadeInUp}
            >
              <motion.div 
                className="relative mx-auto w-full max-w-[560px]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0 translate-x-6 sm:translate-x-8 translate-y-8 sm:translate-y-10 rounded-[28px] sm:rounded-[32px] bg-[#BDA9FF] opacity-90 shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                  aria-hidden="true"
                  animate={{ rotate: [0, 1, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div 
                  className="relative rotate-[5deg] sm:rotate-[6deg] rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#7C5CFB] via-[#6C4FE0] to-[#3C28A1] p-8 sm:p-10 text-white shadow-2xl border border-white/10"
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold">Our Goal at RSEB Bhutan</h3>
                  <p className="mt-4 sm:mt-5 text-[0.98rem] sm:text-[1.05rem] leading-7 sm:leading-8 text-white/90">
                    The RSEB provides a platform for equity capital, encourages wider share
                    ownership, and manages unclaimed funds for shareholders.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* ===== Our Core Value ===== */}
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <motion.div 
            className="flex justify-end"
            variants={fadeInUp}
          >
            <h2 className="text-right font-extrabold text-black leading-[0.9] text-[2.75rem] md:text-[4.25rem] lg:text-[6rem] bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Core Value
            </h2>
          </motion.div>

          <motion.div 
            className="mt-6 sm:mt-8 grid items-start gap-8 md:gap-10 lg:grid-cols-12"
            variants={staggerContainer}
          >
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-10">
              {(() => {
                const card =
                  "rounded-[14px] bg-gradient-to-br from-[#7C5CFB] via-[#6C4FE0] to-[#2F2A7B] p-6 sm:p-8 text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] border border-white/10 relative overflow-hidden group";
                return (
                  <>
                    <motion.div 
                      {...cardHover} 
                      className={card}
                      variants={fadeInUp}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                          Transparency
                        </h3>
                        <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                          We uphold openness and accountability, fostering trust among all
                          stakeholders.
                        </p>
                      </div>
                    </motion.div>

                    <div className="hidden md:block" />

                    <motion.div 
                      {...cardHover} 
                      className={card}
                      variants={fadeInUp}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                          Sustainability
                        </h3>
                        <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                          We are dedicated to protecting the environment and ensuring long-term
                          growth.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      {...cardHover} 
                      className={card}
                      variants={fadeInUp}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <h3 className="mb-3 sm:mb-4 text-[1.5rem] sm:text-[2rem] font-extrabold">
                          Innovation
                        </h3>
                        <p className="max-w-[22rem] text-[0.98rem] sm:text-[1.02rem] leading-7 text-white/90">
                          We embrace technology and creativity to drive progress in Bhutan&apos;s
                          energy sector.
                        </p>
                      </div>
                    </motion.div>
                  </>
                );
              })()}
            </div>

            <motion.div 
              className="lg:col-span-5"
              variants={fadeInUp}
            >
              <div className="ml-auto max-w-[560px] text-right text-black">
                <motion.div 
                  className="text-[0.98rem] sm:text-[1.05rem] leading-6 text-neutral-700 mb-3 sm:mb-4"
                  variants={staggerContainer}
                >
                  <motion.p variants={fadeInUp}>The principles that</motion.p>
                  <motion.p variants={fadeInUp}>guide everything we do</motion.p>
                  <motion.p variants={fadeInUp}>at RSEB</motion.p>
                </motion.div>

                <motion.div variants={staggerContainer}>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    Our <span className="font-extrabold">mission</span>
                  </motion.p>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    is to build trust, drive
                  </motion.p>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    progress, and
                  </motion.p>
                  <motion.p 
                    className="mt-1 text-[1.75rem] sm:text-[2.25rem] font-extrabold leading-[1.2]"
                    variants={fadeInUp}
                  >
                    create
                  </motion.p>
                  <motion.p 
                    className="mt-1 text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    a resilient future where
                  </motion.p>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    innovation, sustainability, and
                  </motion.p>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    community empowerment go
                  </motion.p>
                  <motion.p 
                    className="text-[1.4rem] sm:text-[1.75rem] leading-[1.25]"
                    variants={fadeInUp}
                  >
                    hand in hand
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <Footer/>
      </main>
    </>
  );
}