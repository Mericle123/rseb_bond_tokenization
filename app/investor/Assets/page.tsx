// app/investor/earnings/page.tsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { fetchInvestorEarnings } from "@/server/db_actions/action";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/io5";

/* ========================= Types ========================= */

type Status = "up" | "down" | "flat";

type Row = {
  id: string;
  name: string;
  ratePct: number; // 0.05 -> 5%
  interestAccrued: number; // e.g. 10, 20 ...
  maturity: string; // DD/MM/YYYY
  status: Status;
  disabled?: boolean;
  purchaseDate: string;
  bondType: string;
  faceValue: number;
  totalInvestment: number;
};

/* ========================= Motion ========================= */

const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
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

/* ========================= Loader ========================= */

function ServerLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* From Uiverse.io by Juanes200122 (converted to JSX) */}
      <svg
        id="svg-global"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 94 136"
        height="136"
        width="94"
      >
        <style>{`
          #node-server {
            animation: earnings-bob 2s ease-in-out infinite;
            transform-origin: 50% 50%;
          }
          #line-v1, #line-v2 {
            stroke-dasharray: 260;
            stroke-dashoffset: 260;
            animation: earnings-draw 2.5s ease-in-out infinite;
          }
          .particle {
            opacity: 0;
            animation: earnings-float 2.2s ease-in-out infinite;
          }
          .particle.p1 { animation-delay: 0s; }
          .particle.p2 { animation-delay: 0.15s; }
          .particle.p3 { animation-delay: 0.3s; }
          .particle.p4 { animation-delay: 0.45s; }
          .particle.p5 { animation-delay: 0.6s; }
          .particle.p6 { animation-delay: 0.75s; }
          .particle.p7 { animation-delay: 0.9s; }
          .particle.p8 { animation-delay: 1.05s; }
          .particle.p9 { animation-delay: 1.2s; }

          @keyframes earnings-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes earnings-draw {
            0% { stroke-dashoffset: 260; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 260; }
          }
          @keyframes earnings-float {
            0%, 100% { opacity: 0; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-3px); }
          }
        `}</style>

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
            d="M2.48637 72.0059L43.8699 96.9428C45.742 98.0709 48.281 97.8084 50.9284 96.2133L91.4607 71.7833C92.1444 71.2621 92.4197 70.9139 92.5421 70.1257V86.1368C92.5421 86.9686 92.0025 87.9681 91.3123 88.3825C84.502 92.4724 51.6503 112.204 50.0363 113.215C48.2352 114.343 45.3534 114.343 43.5523 113.215C41.9261 112.197 8.55699 91.8662 2.08967 87.926C1.39197 87.5011 1.00946 86.5986 1.00946 85.4058V70.1257C1.11219 70.9289 1.49685 71.3298 2.48637 72.0059Z"
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
            style={{ maskType: "luminance" }}
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
              style={{ maskType: "luminance" }}
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
        {/* defs truncated for brevity but kept minimal gradients */}
        <defs>
          <linearGradient
            id="paint0_linear_204_217"
            x1="1.00946"
            y1="92.0933"
            x2="92.5421"
            y2="92.0933"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5727CC"></stop>
            <stop offset="1" stopColor="#4354BF"></stop>
          </linearGradient>
          <linearGradient
            id="paint1_linear_204_217"
            x1="92.5"
            y1="70"
            x2="6.72169"
            y2="91.1638"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4559C4"></stop>
            <stop offset="0.29" stopColor="#332C94"></stop>
            <stop offset="1" stopColor="#5727CB"></stop>
          </linearGradient>
          <linearGradient
            id="paint2_linear_204_217"
            x1="92.5"
            y1="70"
            x2="3.55544"
            y2="85.0762"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#91DDFB"></stop>
            <stop offset="1" stopColor="#8841D5"></stop>
          </linearGradient>
          <linearGradient
            id="paint3_linear_204_217"
            x1="43.5482"
            y1="28.7976"
            x2="43.5482"
            y2="32.558"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint4_linear_204_217"
            x1="50.0323"
            y1="44.5915"
            x2="50.0323"
            y2="48.3519"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint5_linear_204_217"
            x1="40.3062"
            y1="59.6332"
            x2="40.3062"
            y2="62.6416"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint6_linear_204_217"
            x1="50.7527"
            y1="68.6583"
            x2="50.7527"
            y2="73.9229"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint7_linear_204_217"
            x1="48.5913"
            y1="74.675"
            x2="48.5913"
            y2="76.9312"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint8_linear_204_217"
            x1="52.9153"
            y1="66.402"
            x2="52.9153"
            y2="67.1541"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint9_linear_204_217"
            x1="52.1936"
            y1="41.5832"
            x2="52.1936"
            y2="43.8394"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint10_linear_204_217"
            x1="57.2367"
            y1="27.2935"
            x2="57.2367"
            y2="29.5497"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
          <linearGradient
            id="paint11_linear_204_217"
            x1="43.9084"
            y1="33.3102"
            x2="43.9084"
            y2="34.8144"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5927CE"></stop>
            <stop offset="1" stopColor="#91DDFB"></stop>
          </linearGradient>
        </defs>
      </svg>

      <p className="mt-4 text-gray-600 text-sm sm:text-base">
        Loading your earnings...
      </p>
    </div>
  );
}

/* ========================= Component ========================= */

export default function EarningsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [sortBy, setSortBy] = useState<"maturity" | "rate" | "interest">(
    "maturity"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // list vs cards (desktop behaviour)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInvestorEarnings();
        setRows(data as Row[]);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load earnings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedRows = useMemo(() => {
    const copy = [...rows];

    copy.sort((a, b) => {
      if (sortBy === "maturity") {
        const aDate = parseMaturity(a.maturity)?.getTime() ?? 0;
        const bDate = parseMaturity(b.maturity)?.getTime() ?? 0;
        return sortDir === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortBy === "rate") {
        return sortDir === "asc" ? a.ratePct - b.ratePct : b.ratePct - a.ratePct;
      }
      if (sortBy === "interest") {
        return sortDir === "asc"
          ? a.interestAccrued - b.interestAccrued
          : b.interestAccrued - a.interestAccrued;
      }
      return 0;
    });

    return copy;
  }, [rows, sortBy, sortDir]);

  const toggleSort = (field: "maturity" | "rate" | "interest") => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + r.interestAccrued, 0),
    [rows]
  );

  const totalInvested = useMemo(
    () => rows.reduce((sum, r) => sum + r.totalInvestment, 0),
    [rows]
  );

  const averageRate = useMemo(() => {
    if (!rows.length) return 0;
    const sum = rows.reduce((acc, r) => acc + r.ratePct, 0);
    return sum / rows.length;
  }, [rows]);

  const handleRedeem = (row: Row) => {
    if (!isMatured(row.maturity)) return;
    // TODO: plug actual redeem backend/blockchain logic here
    console.log("Redeem clicked for", row.id);
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
      "Purchase Date",
      "Maturity",
      "Status",
    ];

    const lines = sortedRows.map((r) => {
      const cells = [
        r.name,
        r.bondType,
        (r.ratePct * 100).toFixed(2),
        r.interestAccrued.toFixed(2),
        r.totalInvestment.toFixed(2),
        r.faceValue.toFixed(2),
        r.purchaseDate,
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
      `Average Coupon Rate: ${(averageRate * 100).toFixed(2)}%`,
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

  // Full page loader while fetching
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F7F8FB]">
        <InvestorSideNavbar />
        <main className="flex-1 min-w-0 p-6 flex items-center justify-center">
          <ServerLoader />
        </main>
      </div>
    );
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

          {/* Average Rate */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Average Coupon Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  {(averageRate * 100).toFixed(2)}%
                </p>
                <div className="inline-flex items-center gap-1 mt-2 text-xs text-gray-600">
                  <IoStatsChart className="w-4 h-4" />
                  <span>Weighted by holdings</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center">
                <IoTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B50D9]" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Toolbar – info + Export / Share with working handlers */}
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
                Redemption rules:
              </span>{" "}
              Bonds can be redeemed only after reaching maturity. The{" "}
              <span className="text-[#5B50D9] font-medium">Redeem</span>{" "}
              button will be enabled automatically when eligible.
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
                        colSpan={7}
                        className="px-6 py-6 text-center text-red-500 text-sm"
                      >
                        {error}
                      </td>
                    </tr>
                  )}

                  {!error && sortedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-gray-500 text-sm"
                      >
                        No earnings to display yet.
                      </td>
                    </tr>
                  )}

                  {!error &&
                    sortedRows.map((row) => {
                      const matured = isMatured(row.maturity);
                      const redeemDisabled = !matured || row.disabled;

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          {/* Bond */}
                          <td className="px-6 py-4 align-top">
                            <div className="space-y-0.5">
                              <p className="text-sm font-semibold text-gray-900">
                                {row.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {row.bondType}
                              </p>
                              <p className="text-xs text-gray-400">
                                Purchased on {row.purchaseDate}
                              </p>
                            </div>
                          </td>

                          {/* Rate */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-emerald-600">
                              {(row.ratePct * 100).toFixed(2)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Fixed coupon rate
                            </p>
                          </td>

                          {/* Interest */}
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-gray-900">
                              Nu.{" "}
                              {row.interestAccrued.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
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
                              {row.totalInvestment.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Face value: Nu.{" "}
                              {row.faceValue.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
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

                          {/* Actions */}
                          <td className="px-6 py-4 align-top text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedRow(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                              >
                                <IoEyeOutline className="w-4 h-4" />
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRedeem(row)}
                                disabled={redeemDisabled}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                                  redeemDisabled
                                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
                                }`}
                              >
                                <IoCheckmarkCircle className="w-4 h-4" />
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

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
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
                        <p className="text-xs text-gray-500">{row.bondType}</p>
                        <p className="text-xs text-gray-400">
                          Purchased on {row.purchaseDate}
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
                          {(row.ratePct * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Interest</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.interestAccrued.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-0.5">Principal</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Nu.{" "}
                          {row.totalInvestment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
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

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRedeem(row)}
                      disabled={redeemDisabled}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                        redeemDisabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
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
            No earnings to display yet.
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

                return (
                  <div
                    key={row.id}
                    className="min-w-[280px] max-w-[280px] snap-start bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
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
                            {row.bondType}
                          </p>
                          <p className="text-xs text-gray-400">
                            Purchased on {row.purchaseDate}
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
                            {(row.ratePct * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Interest</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.interestAccrued.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-0.5">Principal</p>
                          <p className="text-sm font-semibold text-gray-900">
                            Nu.{" "}
                            {row.totalInvestment.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
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

                    {/* Fixed-size action strip */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <IoEyeOutline className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRedeem(row)}
                        disabled={redeemDisabled}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition-colors ${
                          redeemDisabled
                            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
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

        {/* Slide-over details modal */}
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
                className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border border-gray-200 shadow-xl p-5 sm:p-6"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRow(null)}
                  className="absolute right-4 top-4 w-7 h-7 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm"
                >
                  ✕
                </button>

                <div className="space-y-4 pt-4 sm:pt-2">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                      <IoDocumentTextOutline className="w-4 h-4 text-[#5B50D9]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bond Details
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedRow.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedRow.bondType} · Purchased on{" "}
                        {selectedRow.purchaseDate}
                      </p>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500">Coupon Rate</p>
                      <p className="text-gray-900 font-semibold">
                        {(selectedRow.ratePct * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Earned</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.interestAccrued.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Principal</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.totalInvestment.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Face Value</p>
                      <p className="text-gray-900 font-semibold">
                        Nu.{" "}
                        {selectedRow.faceValue.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
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
                  <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                    <div className="flex items-start gap-2">
                      <IoTimeOutline className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">
                          How redemption works
                        </p>
                        <p>
                          Once this bond reaches maturity, your principal and
                          final coupon are eligible for redemption. The{" "}
                          <span className="font-semibold">Redeem</span> button
                          will be enabled and the transaction will be processed
                          on-chain via the RSEB tokenization platform.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(null)}
                      className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRedeem(selectedRow)}
                      disabled={
                        !isMatured(selectedRow.maturity) || selectedRow.disabled
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold border transition-colors ${
                        !isMatured(selectedRow.maturity) ||
                        selectedRow.disabled
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-[#5B50D9] bg-[#5B50D9] text-white hover:bg-[#4a45b5]"
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
