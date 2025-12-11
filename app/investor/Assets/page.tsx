"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/context/UserContext";
import { fetchInvestorAllocations } from "@/server/db_actions/action";
import { listForSaleAndPersist } from "@/server/blockchain/bond";
import {
  IoCheckmarkCircle,
  IoTimeOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoEyeOutline,
  IoLockClosed,
  IoInformationCircle,
  IoTrendingUp,
  IoStatsChart,
  IoCalendarOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoSearchOutline,
  IoArrowRedoOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  bondId: string;
  seriesObjectId: string;
  name: string;
  ratePct: number; // Stored as percentage (e.g., 5.00 for 5%), NOT decimal
  total: number; // Units held - whole numbers only
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
  purchaseDate?: string;
  bondType?: string;
  faceValue?: number; // Total face value of all units held
  purchasePrice?: number; // Price paid per unit
  totalInvestment?: number; // Actual amount invested
  interestAccrued?: number;
  lastCouponDate?: string; // Last coupon payment date
  couponFrequency?: "monthly" | "quarterly" | "semi-annual" | "annual";
  // Add fields for blockchain units
  decimals?: number; // Token decimals (usually 18 for ERC-20)
  blockchainUnits?: bigint; // Actual on-chain units
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

/* ========================= Helpers ========================= */

// Parse "DD/MM/YYYY" into a Date
const parseMaturity = (dateStr: string): Date | null => {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

// Parse any date string (handles multiple formats)
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try DD/MM/YYYY format first
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }
  
  // Try ISO format
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }
  
  return null;
};

// Check if maturity date is in the past or today
const isMatured = (maturityStr: string): boolean => {
  const maturityDate = parseMaturity(maturityStr);
  if (!maturityDate) return false;
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const maturityMidnight = new Date(
    maturityDate.getFullYear(),
    maturityDate.getMonth(),
    maturityDate.getDate()
  );
  return maturityMidnight.getTime() <= todayMidnight.getTime();
};

// Convert blockchain units to display units
const toDisplayUnits = (blockchainUnits: bigint | number | undefined, decimals: number = 18): number => {
  if (!blockchainUnits) return 0;
  const unitsBigInt = BigInt(blockchainUnits);
  const divisor = BigInt(10 ** decimals);
  return Number(unitsBigInt / divisor);
};

// Convert display units to blockchain units
const toBlockchainUnits = (displayUnits: number, decimals: number = 18): bigint => {
  const multiplier = BigInt(10 ** decimals);
  return BigInt(Math.floor(displayUnits)) * multiplier;
};

// Calculate days between two dates
const daysBetween = (startDate: Date, endDate: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay);
};

// Calculate interest accrued based on actual bond mathematics
const calculateInterestAccrued = (row: Row): number => {
  // If API already provides accrued interest, use it
  if (row.interestAccrued !== undefined) return row.interestAccrued;
  
  // Calculate based on actual bond mathematics
  const faceValue = row.faceValue || row.total * 100; // Default: 100 per unit
  
  // Determine interest rate (ensure it's in decimal form)
  const annualRate = row.ratePct > 1 ? row.ratePct / 100 : row.ratePct;
  
  // Get purchase date and current date
  const purchaseDate = parseDate(row.purchaseDate || "");
  if (!purchaseDate) {
    // Fallback: simple calculation without date
    return faceValue * annualRate * 0.5; // Assume 6 months of interest
  }
  
  const currentDate = new Date();
  
  // Calculate days since purchase
  const daysSincePurchase = daysBetween(purchaseDate, currentDate);
  if (daysSincePurchase <= 0) return 0;
  
  // Calculate daily interest rate (ACT/365 day count convention)
  const dailyRate = annualRate / 365;
  
  // Calculate accrued interest
  const accruedInterest = faceValue * dailyRate * daysSincePurchase;
  
  return accruedInterest;
};

// Calculate total investment (principal)
const calculateTotalInvestment = (row: Row): number => {
  if (row.totalInvestment !== undefined) return row.totalInvestment;
  
  // Calculate based on units and price per unit
  const pricePerUnit = row.purchasePrice || 100; // Default: 100 per unit
  return row.total * pricePerUnit;
};

// Format rate for display - handles both decimal (0.05) and percentage (5.00) formats
const formatRateForDisplay = (ratePct: number): string => {
  // If rate is less than 1, it's likely decimal (0.05), convert to percentage
  // If rate is greater than 1, it's likely already percentage (5.00)
  const displayRate = ratePct < 1 ? ratePct * 100 : ratePct;
  return displayRate.toFixed(2);
};

// Validate unit amount (must be whole number)
const validateUnitAmount = (amount: number, maxAmount: number): boolean => {
  return Number.isInteger(amount) && amount > 0 && amount <= maxAmount;
};

/* ========================= Full Screen Loading Component ========================= */

function FullScreenLoading() {
  return (
    <div className="fixed inset-0 bg-[#F7F8FB] z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          id="svg-global"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 94 136"
          height="200"
          width="140"
          className="mx-auto"
        >
          <path
            stroke="#4B22B5"
            d="M87.3629 108.433L49.1073 85.3765C47.846 84.6163 45.8009 84.6163 44.5395 85.3765L6.28392 108.433C5.02255 109.194 5.02255 110.426 6.28392 111.187L44.5395 134.243C45.8009 135.004 47.846 135.004 49.1073 134.243L87.3629 111.187C88.6243 110.426 88.6243 109.194 87.3629 108.433Z"
            id="line-v1"
          ></path>
          <path
            stroke="#5728CC"
            d="M91.0928 95.699L49.2899 70.5042C47.9116 69.6734 45.6769 69.6734 44.2986 70.5042L2.49568 95.699C1.11735 96.5298 1.11735 97.8767 2.49568 98.7074L44.2986 123.902C45.6769 124.733 47.9116 124.733 49.2899 123.902L91.0928 98.7074C92.4712 97.8767 92.4712 96.5298 91.0928 95.699Z"
            id="line-v2"
          ></path>
          <g id="node-server">
            <path
              fill="url(#paint0_linear_204_217)"
              d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 87.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
            ></path>
            <path
              stroke="url(#paint2_linear_204_217)"
              fill="url(#paint1_linear_204_217)"
              d="M91.0928 68.7324L49.2899 43.5375C47.9116 42.7068 45.6769 42.7068 44.2986 43.5375L2.49568 68.7324C1.11735 69.5631 1.11735 70.91 2.49568 71.7407L44.2986 96.9356C45.6769 97.7663 47.9116 97.7663 49.2899 96.9356L91.0928 71.7407C92.4712 70.91 92.4712 69.5631 91.0928 68.7324Z"
            ></path>
            <mask
              height="41"
              width="67"
              y="50"
              x="13"
              maskUnits="userSpaceOnUse"
              style={{ maskType: 'luminance' }}
              id="mask0_204_217"
            >
              <path
                fill="white"
                d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
              ></path>
            </mask>
            <g mask="url(#mask0_204_217)">
              <path
                fill="#332C94"
                d="M78.3486 68.7324L49.0242 51.0584C47.6459 50.2276 45.4111 50.2276 44.0328 51.0584L14.7084 68.7324C13.3301 69.5631 13.3301 70.91 14.7084 71.7407L44.0328 89.4148C45.4111 90.2455 47.6459 90.2455 49.0242 89.4148L78.3486 71.7407C79.7269 70.91 79.727 69.5631 78.3486 68.7324Z"
              ></path>
              <mask
                height="29"
                width="48"
                y="56"
                x="23"
                maskUnits="userSpaceOnUse"
                style={{ maskType: 'luminance' }}
                id="mask1_204_217"
              >
                <path
                  fill="white"
                  d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                ></path>
              </mask>
              <g mask="url(#mask1_204_217)">
                <path
                  fill="#5E5E5E"
                  d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
                ></path>
                <path
                  fill="#71B1C6"
                  d="M70.1311 69.3884L48.42 56.303C47.3863 55.6799 45.7103 55.6799 44.6765 56.303L22.5275 69.6523C21.4938 70.2754 21.4938 71.2855 22.5275 71.9086L44.2386 84.994C45.2723 85.617 46.9484 85.617 47.9821 84.994L70.1311 71.6446C71.1648 71.0216 71.1648 70.0114 70.1311 69.3884Z"
                ></path>
                <path
                  fill="#80C0D4"
                  d="M70.131 70.8923L48.4199 57.8069C47.3862 57.1839 45.7101 57.1839 44.6764 57.8069L22.5274 71.1562C21.4937 71.7793 21.4937 72.7894 22.5274 73.4125L44.2385 86.4979C45.2722 87.1209 46.9482 87.1209 47.982 86.4979L70.131 73.1486C71.1647 72.5255 71.1647 71.5153 70.131 70.8923Z"
                ></path>
                <path
                  fill="#89D3EB"
                  d="M69.751 72.1675L48.4199 59.3111C47.3862 58.6881 45.7101 58.6881 44.6764 59.3111L23.2004 72.2548C22.1667 72.8779 22.1667 73.888 23.2004 74.5111L44.5315 87.3674C45.5653 87.9905 47.2413 87.9905 48.2751 87.3674L69.751 74.4238C70.7847 73.8007 70.7847 72.7905 69.751 72.1675Z"
                ></path>
                <path
                  fill="#97E6FF"
                  d="M68.5091 72.9231L48.4199 60.8153C47.3862 60.1922 45.7101 60.1922 44.6764 60.8153L24.8146 72.7861C23.7808 73.4091 23.7808 74.4193 24.8146 75.0424L44.9038 87.1502C45.9375 87.7733 47.6135 87.7733 48.6473 87.1502L68.5091 75.1794C69.5428 74.5563 69.5428 73.5462 68.5091 72.9231Z"
                ></path>
                <path
                  fill="#97E6FF"
                  d="M66.6747 73.3219L48.4199 62.3197C47.3862 61.6966 45.7101 61.6966 44.6764 62.3197L26.4412 73.3101C25.4075 73.9332 25.4075 74.9433 26.4412 75.5664L44.696 86.5686C45.7297 87.1917 47.4058 87.1917 48.4395 86.5686L66.6747 75.5782C67.7084 74.9551 67.7084 73.945 66.6747 73.3219Z"
                ></path>
              </g>
              <path
                strokeWidth="0.5"
                stroke="#F4F4F4"
                d="M68.9898 68.7324L49.0242 56.699C47.6459 55.8683 45.4111 55.8683 44.0328 56.699L24.0673 68.7324C22.6889 69.5631 22.6889 70.91 24.0673 71.7407L44.0328 83.7741C45.4111 84.6048 47.6459 84.6048 49.0242 83.7741L68.9898 71.7407C70.3681 70.91 70.3681 69.5631 68.9898 68.7324Z"
              ></path>
            </g>
          </g>
          <g id="particles">
            <path
              fill="url(#paint3_linear_204_217)"
              d="M43.5482 32.558C44.5429 32.558 45.3493 31.7162 45.3493 30.6778C45.3493 29.6394 44.5429 28.7976 43.5482 28.7976C42.5535 28.7976 41.7471 29.6394 41.7471 30.6778C41.7471 31.7162 42.5535 32.558 43.5482 32.558Z"
              className="particle p1"
            ></path>
            <path
              fill="url(#paint4_linear_204_217)"
              d="M50.0323 48.3519C51.027 48.3519 51.8334 47.5101 51.8334 46.4717C51.8334 45.4333 51.027 44.5915 50.0323 44.5915C49.0375 44.5915 48.2311 45.4333 48.2311 46.4717C48.2311 47.5101 49.0375 48.3519 50.0323 48.3519Z"
              className="particle p2"
            ></path>
            <path
              fill="url(#paint5_linear_204_217)"
              d="M40.3062 62.6416C41.102 62.6416 41.7471 61.9681 41.7471 61.1374C41.7471 60.3067 41.102 59.6332 40.3062 59.6332C39.5104 59.6332 38.8653 60.3067 38.8653 61.1374C38.8653 61.9681 39.5104 62.6416 40.3062 62.6416Z"
              className="particle p3"
            ></path>
            <path
              fill="url(#paint6_linear_204_217)"
              d="M50.7527 73.9229C52.1453 73.9229 53.2743 72.7444 53.2743 71.2906C53.2743 69.8368 52.1453 68.6583 50.7527 68.6583C49.3601 68.6583 48.2311 69.8368 48.2311 71.2906C48.2311 72.7444 49.3601 73.9229 50.7527 73.9229Z"
              className="particle p4"
            ></path>
            <path
              fill="url(#paint7_linear_204_217)"
              d="M48.5913 76.9312C49.1882 76.9312 49.672 76.4262 49.672 75.8031C49.672 75.1801 49.1882 74.675 48.5913 74.675C47.9945 74.675 47.5107 75.1801 47.5107 75.8031C47.5107 76.4262 47.9945 76.9312 48.5913 76.9312Z"
              className="particle p5"
            ></path>
            <path
              fill="url(#paint8_linear_204_217)"
              d="M52.9153 67.1541C53.115 67.1541 53.2768 66.9858 53.2768 66.7781C53.2768 66.5704 53.115 66.402 52.9153 66.402C52.7156 66.402 52.5538 66.5704 52.5538 66.7781C52.5538 66.9858 52.7156 67.1541 52.9153 67.1541Z"
              className="particle p6"
            ></path>
            <path
              fill="url(#paint9_linear_204_217)"
              d="M52.1936 43.8394C52.7904 43.8394 53.2743 43.3344 53.2743 42.7113C53.2743 42.0883 52.7904 41.5832 52.1936 41.5832C51.5967 41.5832 51.1129 42.0883 51.1129 42.7113C51.1129 43.3344 51.5967 43.8394 52.1936 43.8394Z"
              className="particle p7"
            ></path>
            <path
              fill="url(#paint10_linear_204_217)"
              d="M57.2367 29.5497C57.8335 29.5497 58.3173 29.0446 58.3173 28.4216C58.3173 27.7985 57.8335 27.2935 57.2367 27.2935C56.6398 27.2935 56.156 27.7985 56.156 28.4216C56.156 29.0446 56.6398 29.5497 57.2367 29.5497Z"
              className="particle p8"
            ></path>
            <path
              fill="url(#paint11_linear_204_217)"
              d="M43.9084 34.8144C44.3063 34.8144 44.6289 34.4777 44.6289 34.0623C44.6289 33.647 44.3063 33.3102 43.9084 33.3102C43.5105 33.3102 43.188 33.647 43.188 34.0623C43.188 34.4777 43.5105 34.8144 43.9084 34.8144Z"
              className="particle p9"
            ></path>
          </g>
          <g id="reflectores">
            <path
              fillOpacity="0.2"
              fill="url(#paint12_linear_204_217)"
              d="M49.2037 57.0009L68.7638 68.7786C69.6763 69.3089 69.7967 69.9684 69.794 70.1625V13.7383C69.7649 13.5587 69.6807 13.4657 69.4338 13.3096L48.4832 0.601307C46.9202 -0.192595 46.0788 -0.208238 44.6446 0.601307L23.6855 13.2118C23.1956 13.5876 23.1966 13.7637 23.1956 14.4904L23.246 70.1625C23.2948 69.4916 23.7327 69.0697 25.1768 68.2447L43.9084 57.0008C44.8268 56.4344 45.3776 56.2639 46.43 56.2487C47.5299 56.2257 48.1356 56.4222 49.2037 57.0009Z"
            ></path>
            <path
              fillOpacity="0.2"
              fill="url(#paint13_linear_204_217)"
              d="M48.8867 27.6696C49.9674 26.9175 68.6774 14.9197 68.6774 14.9197C69.3063 14.5327 69.7089 14.375 69.7796 13.756V70.1979C69.7775 70.8816 69.505 71.208 68.7422 71.7322L48.9299 83.6603C48.2003 84.1258 47.6732 84.2687 46.5103 84.2995C45.3295 84.2679 44.8074 84.1213 44.0907 83.6603L24.4348 71.8149C23.5828 71.3313 23.2369 71.0094 23.2316 70.1979L23.1884 13.9816C23.1798 14.8398 23.4982 15.3037 24.7518 16.0874C24.7518 16.0874 42.7629 26.9175 44.2038 27.6696C45.6447 28.4217 46.0049 28.4217 46.5452 28.4217C47.0856 28.4217 47.806 28.4217 48.8867 27.6696Z"
            ></path>
          </g>
          <g id="panel-rigth">
            <mask fill="white" id="path-26-inside-1_204_217">
              <path
                d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
              ></path>
            </mask>
            <path
              fill="#91DDFB"
              d="M72 91.8323C72 90.5121 72.9268 88.9068 74.0702 88.2467L87.9298 80.2448C89.0731 79.5847 90 80.1198 90 81.44V81.44C90 82.7602 89.0732 84.3656 87.9298 85.0257L74.0702 93.0275C72.9268 93.6876 72 93.1525 72 91.8323V91.8323Z"
            ></path>
            <path
              mask="url(#path-26-inside-1_204_217)"
              fill="#489CB7"
              d="M72 89.4419L90 79.0496L72 89.4419ZM90.6928 81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L74.763 93.4275C73.237 94.3085 72 93.5943 72 91.8323V91.8323C72 92.7107 72.9268 92.8876 74.0702 92.2275L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84L90.6928 81.44ZM72 94.2227V89.4419V94.2227ZM88.2762 80.0448C89.6109 79.2742 90.6928 79.8989 90.6928 81.44V81.44C90.6928 82.9811 89.6109 84.8551 88.2762 85.6257L87.9298 84.2257C88.6905 83.7865 89.3072 82.7184 89.3072 81.84V81.84C89.3072 80.5198 88.6905 79.8056 87.9298 80.2448L88.2762 80.0448Z"
            ></path>
            <mask fill="white" id="path-28-inside-2_204_217">
              <path
                d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
              ></path>
            </mask>
            <path
              fill="#91DDFB"
              d="M67 94.6603C67 93.3848 67.8954 91.8339 69 91.1962V91.1962C70.1046 90.5584 71 91.0754 71 92.3509V92.5129C71 93.7884 70.1046 95.3393 69 95.977V95.977C67.8954 96.6147 67 96.0978 67 94.8223V94.6603Z"
            ></path>
            <path
              mask="url(#path-28-inside-2_204_217)"
              fill="#489CB7"
              d="M67 92.3509L71 90.0415L67 92.3509ZM71.6928 92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69.3464 96.577C68.0505 97.3252 67 96.7187 67 95.2223V94.8223C67 95.6559 67.8954 95.8147 69 95.177L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129L71.6928 92.5129ZM67 97.1317V92.3509V97.1317ZM69.2762 91.0367C70.6109 90.2661 71.6928 90.8908 71.6928 92.4319V92.5129C71.6928 94.0093 70.6423 95.8288 69.3464 96.577L69 95.177C69.7219 94.7602 70.3072 93.7465 70.3072 92.9129V92.7509C70.3072 91.4754 69.7219 90.7794 69 91.1962L69.2762 91.0367Z"
            ></path>
          </g>
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="92.0933"
              x2="92.5421"
              y1="92.0933"
              x1="1.00946"
              id="paint0_linear_204_217"
            >
              <stop stopColor="#5727CC"></stop>
              <stop stopColor="#4354BF" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="91.1638"
              x2="6.72169"
              y1="70"
              x1="92.5"
              id="paint1_linear_204_217"
            >
              <stop stopColor="#4559C4"></stop>
              <stop stopColor="#332C94" offset="0.29"></stop>
              <stop stopColor="#5727CB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="85.0762"
              x2="3.55544"
              y1="70"
              x1="92.5"
              id="paint2_linear_204_217"
            >
              <stop stopColor="#91DDFB"></stop>
              <stop stopColor="#8841D5" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="32.558"
              x2="43.5482"
              y1="28.7976"
              x1="43.5482"
              id="paint3_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="48.3519"
              x2="50.0323"
              y1="44.5915"
              x1="50.0323"
              id="paint4_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="62.6416"
              x2="40.3062"
              y1="59.6332"
              x1="40.3062"
              id="paint5_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="73.9229"
              x2="50.7527"
              y1="68.6583"
              x1="50.7527"
              id="paint6_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="76.9312"
              x2="48.5913"
              y1="74.675"
              x1="48.5913"
              id="paint7_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="67.1541"
              x2="52.9153"
              y1="66.402"
              x1="52.9153"
              id="paint8_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="43.8394"
              x2="52.1936"
              y1="41.5832"
              x1="52.1936"
              id="paint9_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="29.5497"
              x2="57.2367"
              y1="27.2935"
              x1="57.2367"
              id="paint10_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="34.8144"
              x2="43.9084"
              y1="33.3102"
              x1="43.9084"
              id="paint11_linear_204_217"
            >
              <stop stopColor="#5927CE"></stop>
              <stop stopColor="#91DDFB" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="16.0743"
              x2="62.9858"
              y1="88.5145"
              x1="67.8638"
              id="paint12_linear_204_217"
            >
              <stop stopColor="#97E6FF"></stop>
              <stop stopOpacity="0" stopColor="white" offset="1"></stop>
            </linearGradient>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              y2="39.4139"
              x2="31.4515"
              y1="88.0938"
              x1="36.2597"
              id="paint13_linear_204_217"
            >
              <stop stopColor="#97E6FF"></stop>
              <stop stopOpacity="0" stopColor="white" offset="1"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="text-xl font-semibold text-gray-700 mt-8">Loading your earnings...</p>
      <p className="text-gray-500 mt-2">Please wait while we fetch your bond allocations</p>
      
      <style jsx>{`
        #svg-global {
          zoom: 1.2;
          overflow: visible;
        }

        @keyframes fade-particles {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px);
            opacity: 0;
          }
        }

        #particles {
          animation: fade-particles 5s infinite alternate;
        }
        .particle {
          animation: floatUp linear infinite;
        }

        .p1 {
          animation-duration: 2.2s;
          animation-delay: 0s;
        }
        .p2 {
          animation-duration: 2.5s;
          animation-delay: 0.3s;
        }
        .p3 {
          animation-duration: 2s;
          animation-delay: 0.6s;
        }
        .p4 {
          animation-duration: 2.8s;
          animation-delay: 0.2s;
        }
        .p5 {
          animation-duration: 2.3s;
          animation-delay: 0.4s;
        }
        .p6 {
          animation-duration: 3s;
          animation-delay: 0.1s;
        }
        .p7 {
          animation-duration: 2.1s;
          animation-delay: 0.5s;
        }
        .p8 {
          animation-duration: 2.6s;
          animation-delay: 0.2s;
        }
        .p9 {
          animation-duration: 2.4s;
          animation-delay: 0.3s;
        }

        @keyframes bounce-lines {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        #line-v1,
        #line-v2,
        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation: bounce-lines 3s ease-in-out infinite alternate;
        }
        #line-v2 {
          animation-delay: 0.2s;
        }

        #node-server,
        #panel-rigth,
        #reflectores,
        #particles {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

/* ========================= Enhanced Sell Modal Component ========================= */

function SellBondModal({
  row,
  isOpen,
  onClose,
  onConfirm
}: {
  row: Row | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
}) {
  const [sellAmount, setSellAmount] = useState("");
  const [sellLoading, setSellLoading] = useState(false);
  const [step, setStep] = useState<"input" | "confirm" | "processing" | "success">("input");
  const [transactionHash, setTransactionHash] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!row || !isOpen) return null;

  const amount = parseInt(sellAmount) || 0;
  const isValid = validateUnitAmount(amount, row.total);
  const percentage = (amount / row.total) * 100;

  const resetModal = () => {
    setSellAmount("");
    setStep("input");
    setTransactionHash("");
    setSellLoading(false);
    setValidationError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleAmountChange = (value: string) => {
    setSellAmount(value);
    const numValue = parseInt(value);
    
    if (value && !Number.isInteger(numValue)) {
      setValidationError("Units must be whole numbers");
    } else if (numValue > row.total) {
      setValidationError(`Cannot exceed ${row.total} units`);
    } else if (numValue <= 0) {
      setValidationError("Must be at least 1 unit");
    } else {
      setValidationError("");
    }
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    
    setStep("confirm");
  };

  const executeSell = async () => {
    try {
      setStep("processing");
      setSellLoading(true);
      
      await onConfirm(amount);
      
      // Simulate transaction hash (replace with actual from blockchain)
      setTransactionHash(`0x${Math.random().toString(16).slice(2, 42)}`);
      setStep("success");
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Sell failed:", error);
      setValidationError("Sale failed. Please try again.");
      setStep("input");
      setSellLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <IoStorefrontOutline className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {step === "success" ? "Sale Listed Successfully!" : "Sell Bond"}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {step === "success" 
                          ? "Your bond has been listed for sale" 
                          : `Sell units of ${row.name}`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  
                  {/* Bond Info Card */}
                  {(step === "input" || step === "confirm") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{row.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <span>{formatRateForDisplay(row.ratePct)}% / yr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Your Holdings</p>
                          <p className="font-semibold text-gray-900">{row.total.toLocaleString()} units</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Maturity</p>
                          <p className="font-semibold text-gray-900">{row.maturity}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Input Amount */}
                  {step === "input" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Units to Sell (Whole numbers only)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max={row.total}
                            step="1"
                            value={sellAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className={`w-full px-4 py-3 text-lg border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${
                              validationError 
                                ? "border-red-300 focus:ring-red-500" 
                                : "border-gray-300 focus:ring-red-500"
                            }`}
                            placeholder="0"
                          />
                          <button
                            type="button"
                            onClick={() => handleAmountChange(row.total.toString())}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            MAX
                          </button>
                        </div>
                        
                        {validationError && (
                          <p className="mt-2 text-sm text-red-600">{validationError}</p>
                        )}
                        
                        {/* Amount Slider */}
                        <div className="mt-4">
                          <input
                            type="range"
                            min="1"
                            max={row.total}
                            step="1"
                            value={sellAmount || 1}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 unit</span>
                            <span>{percentage.toFixed(0)}%</span>
                            <span>{row.total} units</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      {amount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <IoInformationCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Sale Summary</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Units to sell:</span>
                              <span className="font-semibold text-blue-900">{amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Remaining after sale:</span>
                              <span className="font-semibold text-blue-900">{(row.total - amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Percentage sold:</span>
                              <span className="font-semibold text-blue-900">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Warning for full sale */}
                      {amount === row.total && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-amber-50 rounded-xl p-3 border border-amber-200"
                        >
                          <div className="flex items-center gap-2">
                            <IoLockClosed className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">Full Sale</span>
                          </div>
                          <p className="text-xs text-amber-700 mt-1">
                            You're selling all your units. This action cannot be undone.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Confirmation */}
                  {step === "confirm" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IoStorefrontOutline className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Confirm Sale
                        </h3>
                        <p className="text-gray-600 text-sm">
                          You are about to list {amount.toLocaleString()} units for sale
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bond Name:</span>
                          <span className="font-medium">{row.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Units Selling:</span>
                          <span className="font-medium">{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining Holdings:</span>
                          <span className="font-medium">{(row.total - amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coupon Rate:</span>
                          <span className="font-medium">{formatRateForDisplay(row.ratePct)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Processing */}
                  {step === "processing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Sale
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Listing your bond units on the marketplace...
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <IoTimeOutline className="w-4 h-4" />
                        <span>This may take a few seconds</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Success */}
                  {step === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IoCheckmarkCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sale Listed Successfully!
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your {amount.toLocaleString()} units have been listed for sale
                      </p>
                      
                      {transactionHash && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs">
                          <p className="text-gray-600 mb-1">Transaction Hash:</p>
                          <code className="text-gray-800 break-all">{transactionHash}</code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer Actions */}
                {(step === "input" || step === "confirm") && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      {step === "input" ? (
                        <>
                          <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleConfirm}
                            disabled={!isValid || sellLoading || !!validationError}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            Continue
                            <IoArrowRedoOutline className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setStep("input")}
                            className="flex-1 px-4 py-3 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={executeSell}
                            disabled={sellLoading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-red-400 disabled:to-orange-300 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          >
                            {sellLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Listing...
                              </>
                            ) : (
                              "Confirm Sale"
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Custom slider styles */}
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #dc2626;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #dc2626;
              cursor: pointer;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}

/* ========================= Component ========================= */

export default function EarningsPage() {
  const currentUser = useCurrentUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [sortBy, setSortBy] = useState<"maturity" | "rate" | "interest" | "units">("maturity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // list vs cards (desktop behaviour)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // search
  const [searchQuery, setSearchQuery] = useState("");

  // Sell modal state
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; row: Row | null }>({
    isOpen: false,
    row: null
  });

  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Debug logging for API response
  useEffect(() => {
    if (!currentUser?.id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInvestorAllocations(currentUser.id);
        
        // Debug: Check what the API returns
        console.log("API Response data:", data);
        if (data && data.length > 0) {
          console.log("Sample row:", data[0]);
          console.log("ratePct value:", data[0]?.ratePct, "type:", typeof data[0]?.ratePct);
          console.log("total value:", data[0]?.total, "type:", typeof data[0]?.total);
          console.log("blockchainUnits:", data[0]?.blockchainUnits);
          console.log("decimals:", data[0]?.decimals);
        }
        
        // Transform the data with proper unit and rate handling
        const transformedData = data.map((row: any) => {
          // Determine if units are blockchain units or display units
          let displayUnits = row.total;
          let blockchainUnits = row.blockchainUnits;
          const decimals = row.decimals || 18;
          
          // If we have blockchain units, convert to display units
          if (blockchainUnits) {
            displayUnits = toDisplayUnits(blockchainUnits, decimals);
            // Ensure whole number for display
            displayUnits = Math.floor(displayUnits);
          } else if (row.total) {
            // If total is already display units, ensure whole number
            displayUnits = Math.floor(row.total);
          }
          
          // Calculate interest and investment
          const interestAccrued = calculateInterestAccrued(row);
          const totalInvestment = calculateTotalInvestment(row);
          
          return {
            ...row,
            total: displayUnits, // Whole number display units
            blockchainUnits: blockchainUnits || toBlockchainUnits(displayUnits, decimals),
            decimals: decimals,
            interestAccrued: interestAccrued,
            totalInvestment: totalInvestment,
            bondType: row.bondType || "Government Bond",
            faceValue: row.faceValue || displayUnits * 100, // Default: 100 per unit
            purchaseDate: row.purchaseDate || "01/01/2024",
            purchasePrice: row.purchasePrice || 100, // Default: 100 per unit
            lastCouponDate: row.lastCouponDate || row.purchaseDate || "01/01/2024",
            couponFrequency: row.couponFrequency || "semi-annual"
          };
        });
        
        setRows(transformedData);
      } catch (e: any) {
        console.error("Failed to load earnings:", e);
        setError("Failed to load earnings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser?.id]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const fields = [
        r.name,
        r.bondType || "",
        r.maturity,
        r.purchaseDate || "",
      ].map((f) => f.toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows];

    copy.sort((a, b) => {
      if (sortBy === "maturity") {
        const aDate = parseMaturity(a.maturity)?.getTime() ?? 0;
        const bDate = parseMaturity(b.maturity)?.getTime() ?? 0;
        return sortDir === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === "rate") {
        // Use formatted rate for comparison
        const aRate = formatRateForDisplay(a.ratePct);
        const bRate = formatRateForDisplay(b.ratePct);
        return sortDir === "asc" ? parseFloat(aRate) - parseFloat(bRate) : parseFloat(bRate) - parseFloat(aRate);
      }
      if (sortBy === "interest") {
        const aInterest = calculateInterestAccrued(a);
        const bInterest = calculateInterestAccrued(b);
        return sortDir === "asc" ? aInterest - bInterest : bInterest - aInterest;
      }
      if (sortBy === "units") {
        return sortDir === "asc" ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

    return copy;
  }, [filteredRows, sortBy, sortDir]);

  const toggleSort = (field: "maturity" | "rate" | "interest" | "units") => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + calculateInterestAccrued(r), 0),
    [rows]
  );

  const totalInvested = useMemo(
    () => rows.reduce((sum, r) => sum + calculateTotalInvestment(r), 0),
    [rows]
  );

  const totalUnits = useMemo(
    () => rows.reduce((sum, r) => sum + r.total, 0),
    [rows]
  );

  const averageRate = useMemo(() => {
    if (!rows.length) return 0;
    // Convert all rates to percentage for averaging
    const sum = rows.reduce((acc, r) => {
      const rate = parseFloat(formatRateForDisplay(r.ratePct));
      return acc + rate;
    }, 0);
    return sum / rows.length;
  }, [rows]);

  const handleRedeem = (row: Row) => {
    if (!isMatured(row.maturity)) return;
    // TODO: plug actual redeem backend/blockchain logic here
    console.log("Redeem clicked for", row.bondId);
    alert(`Redeem functionality for ${row.name} would be implemented here.`);
  };

  const openSellModal = (row: Row) => {
    setSellModal({ isOpen: true, row });
  };

  const closeSellModal = () => {
    setSellModal({ isOpen: false, row: null });
  };

  const handleConfirmSell = async (amount: number) => {
    if (!sellModal.row || !currentUser) return;

    try {
      // Convert display units to blockchain units
      const decimals = sellModal.row.decimals || 18;
      const blockchainUnits = toBlockchainUnits(amount, decimals);
      
      await listForSaleAndPersist({
        userId: currentUser.id,
        bondId: sellModal.row.bondId,
        sellerAddress: currentUser.wallet_address!,
        sellerMnemonic: currentUser.hashed_mnemonic,
        seriesObjectId: sellModal.row.seriesObjectId,
        amountUnits: Number(blockchainUnits), // Send blockchain units
      });

      // Update local state (subtract whole units)
      setRows(prev =>
        prev.map(r =>
          r.bondId === sellModal.row!.bondId
            ? { ...r, total: r.total - amount }
            : r
        )
      );
    } catch (err) {
      console.error("Sell failed:", err);
      throw err;
    }
  };

  const handleExportCSV = () => {
    if (!sortedRows.length) return;

    const header = [
      "Bond Name",
      "Bond Type",
      "Coupon Rate (%)",
      "Interest Earned",
      "Principal",
      "Face Value",
      "Units Held",
      "Purchase Date",
      "Maturity",
      "Status",
    ];

    const lines = sortedRows.map((r) => {
      const cells = [
        r.name,
        r.bondType || "Government Bond",
        formatRateForDisplay(r.ratePct),
        calculateInterestAccrued(r).toFixed(2),
        calculateTotalInvestment(r).toFixed(2),
        (r.faceValue || r.total * 100).toFixed(2),
        r.total.toLocaleString(),
        r.purchaseDate || "01/01/2024",
        r.maturity,
        isMatured(r.maturity) ? "Matured" : "Ongoing",
      ];
      // Wrap each cell in quotes to be safe for CSV
      return cells.map((c) => `"${c}"`).join(",");
    });

    const csvContent = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "earnings_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!rows.length) return;

    const summary = [
      "RSEB Earnings Summary",
      "",
      `Total Interest Earned: Nu. ${totalInterest.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Total Principal: Nu. ${totalInvested.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
      `Total Units Held: ${totalUnits.toLocaleString()}`,
      `Average Coupon Rate: ${averageRate.toFixed(2)}%`,
      "",
      "Shared from the RSEB Bond Tokenization Platform.",
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "RSEB Earnings Summary",
          text: summary,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        alert("Earnings summary copied to clipboard.");
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header {...fadeIn} className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Earnings & Redemptions
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Track your coupon earnings, monitor maturity timelines, and redeem
            matured bond positions.
          </p>
        </motion.header>

        {/* KPI cards – light theme, consistent with marketplace */}
        <motion.section
          {...fadeIn}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {/* Total Interest */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Interest Earned
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInterest.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-600">
                  <IoTrendingUp className="w-4 h-4" />
                  <span>Accruing over time</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoCashOutline className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Principal */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Principal
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Nu.{" "}
                  {totalInvested.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>Across all active bonds</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoDocumentTextOutline className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Units */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Units Held
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {totalUnits.toLocaleString()}
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoStatsChart className="w-4 h-4" />
                  <span>Whole units only</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B50D9]" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Toolbar – info + Export / Share */}
        <motion.div
          {...fadeIn}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
        >
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
            <div className="mt-0.5">
              <IoInformationCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p>
              <span className="font-medium text-gray-800">
                Redemption & Sale rules:
              </span>{" "}
              Bonds can be redeemed only after reaching maturity. You can sell bonds anytime on the secondary market.{" "}
              <span className="text-[#5B50D9] font-medium">Redeem</span>{" "}
              button is enabled when eligible.{" "}
              <span className="text-red-600 font-medium">Sell</span>{" "}
              button is always available.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoDownloadOutline className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium text-gray-800 transition-colors"
            >
              <IoShareSocialOutline className="w-4 h-4" />
              Share Summary
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div {...fadeIn} className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative max-w-md w-full">
              <IoSearchOutline className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by bond name, type, maturity or purchase date..."
                className="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl border border-gray-300 bg-white pl-9 pr-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B50D9] focus:border-[#5B50D9] transition-all"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {sortedRows.length}
              </span>{" "}
              earning position{sortedRows.length === 1 ? "" : "s"}
              {searchQuery.trim()
                ? " matching your search."
                : " across your portfolio."}
            </p>
          </div>
        </motion.div>

        {/* Desktop view toggle (list/table vs box/cards) */}
        <motion.div
          {...fadeIn}
          className="hidden lg:flex items-center justify-between mb-3"
        >
          <h2 className="text-sm font-semibold text-gray-800">
            Earning Positions
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "cards"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Card view"
            >
              <GridIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg border text-gray-500 hover:bg-gray-50 transition-colors ${
                viewMode === "table"
                  ? "bg-gray-100 border-[#5B50D9] text-[#5B50D9]"
                  : "border-gray-200"
              }`}
              title="Table view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Desktop table (list view) */}
        {viewMode === "table" && (
          <motion.div
            {...fadeIn}
            className="hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Bond
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("rate")}
                    >
                      Rate
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("interest")}
                    >
                      Interest Earned
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Principal
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("units")}
                    >
                      Units Held
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => toggleSort("maturity")}
                    >
                      Maturity
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {error && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-6 text-center text-red-500 text-sm"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!error && sortedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-6 text-center text-gray-500 text-sm"
                      >
                        {searchQuery.trim()
                          ? "No earnings match your search."
                          : "No earnings to display yet."}
                      </td>
                    </tr>
                  )}

                  {!error &&
                    sortedRows.map((row) => {
                      const matured = isMatured(row.maturity);
                      const redeemDisabled = !matured || row.disabled;
                      const interestAccrued = calculateInterestAccrued(row);
                      const totalInvestment = calculateTotalInvestment(row);
                      const displayRate = formatRateForDisplay(row.ratePct);

                      return (
                        <tr
                          key={row.bondId}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Bond */}
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-lg border border-gray-200 bg-white grid place-items-center shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                  src="/RSEB.png"
                                  alt="Issuer"
                                  width={22}
                                  height={22}
                                  className="object-contain"
                                />
                                <span
                                  aria-hidden
                                  className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                                    row.status === "up"
                                      ? "bg-emerald-500"
                                      : row.status === "down"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
                                  }`}
                                />
                                <span className="sr-only">
                                  {row.status === "up"
                                    ? "Trending up"
                                    : row.status === "down"
                                      ? "Trending down"
                                      : "No change"}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-gray-900">
                                  {row.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {row.bondType || "Government Bond"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Purchased on {row.purchaseDate || "01/01/2024"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-emerald-600">
                              {displayRate}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Fixed coupon rate
                            </p>
                          </td>

                          {/* Interest */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {interestAccrued.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Accrued to date
                            </p>
                          </td>

                          {/* Principal */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {totalInvestment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Face value: Nu.{" "}
                              {(row.faceValue || row.total * 100).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </td>

                          {/* Units Held */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {row.total.toLocaleString()}
                              <span className="text-xs text-gray-500 ml-1">units</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Whole units only
                            </p>
                          </td>

                          {/* Maturity */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              {row.maturity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {matured ? "Maturity reached" : "Ongoing tenure"}
                            </p>
                          </td>

                          {/* Status pill */}
                          <td className="px-4 py-4 align-top">
                            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-xs bg-gray-50 border-gray-200">
                              {matured ? (
                                <>
                                  <IoCheckmarkCircle className="w-4 h-4 text-emerald-600" />
                                  <span className="text-emerald-700 font-medium">
                                    Ready to redeem
                                  </span>
                                </>
                              ) : (
                                <>
                                  <IoLockClosed className="w-4 h-4 text-amber-500" />
                                  <span className="text-amber-700 font-medium">
                                    Locked till maturity
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* IMPROVED Actions Section */}
                          <td className="px-6 py-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRow(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                <IoEyeOutline className="w-4 h-4" />
                                View
                              </button>

                              {/* IMPROVED Sell Button */}
                              <motion.button
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openSellModal(row)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold
                                 text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                                 shadow-md hover:shadow-lg focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                                 transition-all duration-200 border border-red-600/20"
                                disabled={row.disabled}
                                aria-disabled={row.disabled || undefined}
                                aria-label={`Sell ${row.name}`}
                              >
                                <IoStorefrontOutline className="w-3.5 h-3.5" />
                                Sell Units
                              </motion.button>

                              {/* IMPROVED Redeem Button */}
                              <button
                                type="button"
                                onClick={() => handleRedeem(row)}
                                disabled={redeemDisabled}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold border transition-all duration-200 ${
                                  redeemDisabled
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                                    : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-lg"
                                }`}
                              >
                                <IoCheckmarkCircle className="w-3.5 h-3.5" />
                                Redeem
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Desktop cards (box view) */}
        {viewMode === "cards" && !error && sortedRows.length > 0 && (
          <motion.div
            {...fadeIn}
            className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4 mt-2"
          >
            {sortedRows.map((row) => {
              const matured = isMatured(row.maturity);
              const redeemDisabled = !matured || row.disabled;
              const interestAccrued = calculateInterestAccrued(row);
              const totalInvestment = calculateTotalInvestment(row);
              const displayRate = formatRateForDisplay(row.ratePct);

              return (
                <div
                  key={row.bondId}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Bond
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.name}
                        </p>
                        <p className="text-xs text-gray-500">{row.bondType || "Government Bond"}</p>
                        <p className="text-xs text-gray-400">
                          Purchased on {row.purchaseDate || "01/01/2024"}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                        <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 mb-0.5">Rate</p>
                        <p className="text-sm font-semibold text-emerald-600">
                          {displayRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Interest</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {interestAccrued.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Principal</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {totalInvestment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Units Held</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.total.toLocaleString()}
                          <span className="text-xs text-gray-500 ml-1">units</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Maturity</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {row.maturity}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                        {matured ? (
                          <>
                            <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">
                              Ready to redeem
                            </span>
                          </>
                        ) : (
                          <>
                            <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-amber-700 font-medium">
                              Locked till maturity
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IMPROVED Actions Section */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                      View
                    </button>
                    
                    {/* IMPROVED Sell Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openSellModal(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold
                       text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                       shadow-md hover:shadow-md focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                       transition-all duration-200 border border-red-600/20"
                      disabled={row.disabled}
                      aria-disabled={row.disabled || undefined}
                    >
                      <IoStorefrontOutline className="w-3.5 h-3.5" />
                      Sell
                    </motion.button>
                    
                    {/* IMPROVED Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(row)}
                      disabled={redeemDisabled}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-all duration-200 ${
                        redeemDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                          : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-md"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-3.5 h-3.5" />
                      Redeem
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Desktop cards view error / empty messaging (when cards selected) */}
        {viewMode === "cards" && error && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-red-500 bg-white rounded-2xl border border-gray-200 py-8">
            {error}
          </div>
        )}
        {viewMode === "cards" && !error && sortedRows.length === 0 && (
          <div className="hidden lg:flex items-center justify-center mt-4 text-sm text-gray-500 bg-white rounded-2xl border border-gray-200 py-8">
            {searchQuery.trim()
              ? "No earnings match your search."
              : "No earnings to display yet."}
          </div>
        )}

        {/* Mobile / small screens – horizontal slider with fixed-size cards */}
        <motion.div {...fadeIn} className="lg:hidden mt-4">
          <p className="text-xs text-gray-500 mb-2">
            Swipe horizontally to view all of your bond earnings.
          </p>
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {!error &&
              sortedRows.map((row) => {
                const matured = isMatured(row.maturity);
                const redeemDisabled = !matured || row.disabled;
                const interestAccrued = calculateInterestAccrued(row);
                const totalInvestment = calculateTotalInvestment(row);
                const displayRate = formatRateForDisplay(row.ratePct);

                return (
                  <div
                    key={row.bondId}
                    className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Bond
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {row.bondType || "Government Bond"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {row.purchaseDate || "01/01/2024"}
                          </p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                          <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500 mb-0.5">Rate</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {displayRate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Interest</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {interestAccrued.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Principal</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {totalInvestment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Units Held</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.total.toLocaleString()}
                            <span className="text-xs text-gray-500 ml-1">units</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Maturity</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {row.maturity}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-[11px] bg-gray-50 border-gray-200">
                          {matured ? (
                            <>
                              <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">
                                Ready to redeem
                              </span>
                            </>
                          ) : (
                            <>
                              <IoLockClosed className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-amber-700 font-medium">
                                Locked till maturity
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* IMPROVED Actions Section */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </button>
                      
                      {/* IMPROVED Sell Button */}
                      <motion.button
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openSellModal(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold
                         text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                         shadow-md hover:shadow-md focus:outline-none disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                         transition-all duration-200 border border-red-600/20"
                        disabled={row.disabled}
                        aria-disabled={row.disabled || undefined}
                      >
                        <IoStorefrontOutline className="w-3.5 h-3.5" />
                        Sell
                      </motion.button>
                      
                      {/* IMPROVED Redeem Button */}
                      <button
                        type="button"
                        onClick={() => handleRedeem(row)}
                        disabled={redeemDisabled}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold border transition-all duration-200 ${
                          redeemDisabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                            : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-md"
                        }`}
                      >
                        <IoCheckmarkCircle className="w-3.5 h-3.5" />
                        Redeem
                      </button>
                    </div>
                  </div>
                );
              })}

            {error && (
              <div className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-center text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Slide-over details modal - FIXED LARGER BUTTONS */}
        <AnimatePresence>
          {selectedRow && (
            <motion.div
              className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-gray-200 shadow-xl p-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <div className="space-y-5 pt-2">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <IoDocumentTextOutline className="w-5 h-5 text-[#5B50D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bond Details
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedRow.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedRow.bondType || "Government Bond"} · Purchased on{" "}
                        {selectedRow.purchaseDate || "01/01/2024"}
                      </p>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Coupon Rate</p>
                      <p className="text-gray-900 font-semibold">
                        {formatRateForDisplay(selectedRow.ratePct)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Earned</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {calculateInterestAccrued(selectedRow).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Principal</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {calculateTotalInvestment(selectedRow).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Face Value</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {(selectedRow.faceValue || selectedRow.total * 100).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Units Held</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedRow.total.toLocaleString()} units
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Maturity</p>
                      <p className="text-gray-900 font-semibold">
                        {selectedRow.maturity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="text-gray-900 font-semibold">
                        {isMatured(selectedRow.maturity)
                          ? "Maturity reached"
                          : "Still in tenure"}
                      </p>
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                    <div className="flex items-start gap-2">
                      <IoTimeOutline className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">
                          How redemption works
                        </p>
                        <p className="text-sm">
                          Once this bond reaches maturity, your principal and
                          final coupon are eligible for redemption. The{" "}
                          <span className="font-semibold">Redeem</span> button
                          will be enabled and the transaction will be processed
                          on-chain via the RSEB tokenization platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FIXED: LARGER Footer actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Close
                    </button>
                    
                    {/* FIXED: LARGER Sell Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openSellModal(selectedRow)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold
                       text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                       shadow-md hover:shadow-lg focus:outline-none disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 border border-red-600/20 px-4 py-3"
                      disabled={selectedRow.disabled}
                      aria-disabled={selectedRow.disabled || undefined}
                    >
                      <IoStorefrontOutline className="w-4 h-4" />
                      Sell Units
                    </motion.button>
                    
                    {/* FIXED: LARGER Redeem Button */}
                    <button
                      type="button"
                      onClick={() => handleRedeem(selectedRow)}
                      disabled={
                        !isMatured(selectedRow.maturity) || selectedRow.disabled
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold border transition-all duration-200 ${
                        !isMatured(selectedRow.maturity) ||
                        selectedRow.disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm"
                          : "border-[#5B50D9] bg-gradient-to-r from-[#5B50D9] to-[#4a45b5] text-white hover:from-[#4a45b5] hover:to-[#3a36a5] shadow-md hover:shadow-lg"
                      }`}
                    >
                      <IoCheckmarkCircle className="w-4 h-4" />
                      Redeem
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Sell Modal */}
        <SellBondModal
          row={sellModal.row}
          isOpen={sellModal.isOpen}
          onClose={closeSellModal}
          onConfirm={handleConfirmSell}
        />
      </main>
    </div>
  );
}

/* ========================= View Icons ========================= */

function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}