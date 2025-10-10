"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function UserNavbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm"
    >
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 group"
        >
          <motion.div
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
          <span className="hidden sm:block text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-[#2F2A7B] transition-colors duration-300">
            RSEB Bhutan
          </span>
        </motion.a>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-4 sm:gap-6 text-[0.95rem] font-medium">
          <motion.a
            href="#about"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 250 }}
            className="text-[#2F2A7B]/80 hover:text-[#2F2A7B] transition-colors duration-200"
          >
            About Us
          </motion.a>

          <motion.a
            href="/login"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="rounded-full border border-[#6C4FE0]/50 px-4 py-2 text-[#2F2A7B] font-medium
                       hover:bg-[#6C4FE0] hover:text-white transition-all duration-300
                       shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4FE0]/60"
          >
            Login
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
}
