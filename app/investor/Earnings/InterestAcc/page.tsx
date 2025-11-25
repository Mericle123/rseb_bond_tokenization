"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Copy, Wallet, ChevronDown, TrendingUp, PieChart, Coins } from "lucide-react";

/* ========================= Animation Variants ========================= */
const fadeIn = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  viewport: { once: true, margin: "-50px 0px -50px 0px" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

/* ========================= Number Format ========================= */
const nf4 = new Intl.NumberFormat("en-IN", { 
  maximumFractionDigits: 4,
  minimumFractionDigits: 2 
});

/* ========================= Enhanced Wallet Strip ========================= */
function WalletStrip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  
  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }
  
  return (
    <motion.div 
      {...fadeIn}
      className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/70 shadow-sm shadow-slate-200/50 overflow-hidden backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B50D9] to-[#7B73E6] shadow-md"
          >
            <Wallet className="w-5 h-5 text-white" strokeWidth={2} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 mb-1">Wallet Address</p>
            <code className="block text-xs sm:text-sm font-mono text-slate-900 bg-white/50 px-3 py-2 rounded-lg border border-slate-200 truncate">
              {address}
            </code>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copy}
          className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 hover:border-[#5B50D9]/30 hover:shadow-md hover:shadow-[#5B50D9]/10 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: copied ? 360 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Copy className="w-4 h-4 text-slate-600 group-hover:text-[#5B50D9]" />
          </motion.div>
          <span className="text-slate-700 group-hover:text-[#5B50D9]">
            {copied ? "Copied!" : "Copy Address"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ========================= Enhanced Tabs ========================= */
function Tabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {options.map((o) => {
        const active = value === o;
        return (
          <motion.button
            key={o}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(o)}
            type="button"
            className={`relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
              active 
                ? "text-white" 
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-[#5B50D9] to-[#7B73E6] rounded-xl shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{o}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ========================= Enhanced Menu Select ========================= */
type MenuSelectProps = {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  menuMaxHeight?: number;
  align?: "left" | "right";
  ariaLabel?: string;
};

function MenuSelect({
  value,
  options,
  onChange,
  icon,
  menuMaxHeight = 300,
  align = "left",
  ariaLabel,
}: MenuSelectProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(0, options.findIndex((o) => o === value))
  );

  useEffect(() => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o === value)));
  }, [value, options]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const next = options[activeIndex] ?? value;
      onChange(next);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!open) return;
    const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  return (
    <div className="relative z-40">
      <motion.button
        ref={btnRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKey}
        className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium bg-white transition-all duration-300
        ${open 
          ? "border-[#5B50D9] bg-[#5B50D9]/5 shadow-lg shadow-[#5B50D9]/10" 
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
        }`}
      >
        {icon && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <span className="min-w-[6ch] text-slate-700">{value}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute mt-2 w-[220px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl shadow-slate-300/30
              ${align === "right" ? "right-0" : "left-0"}`}
            style={{ maxHeight: menuMaxHeight, overflowY: "auto" }}
            onKeyDown={onKey}
          >
            {options.map((opt, idx) => {
              const active = idx === activeIndex;
              const selected = value === opt;
              return (
                <div key={opt}>
                  <motion.button
                    type="button"
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      btnRef.current?.focus();
                    }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(91, 80, 217, 0.08)" }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 relative
                      ${active ? "bg-[#5B50D9]/10" : "bg-transparent"}
                      ${selected ? "text-[#5B50D9]" : "text-slate-700"}`}
                  >
                    {opt}
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-[#5B50D9]"
                      />
                    )}
                  </motion.button>
                  {idx < options.length - 1 && (
                    <div className="mx-4 border-t border-slate-100" />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================= Data helpers ========================= */
function daysIn(monthIndex: number, year = new Date().getFullYear()) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function genDailySeriesForMonth(monthIndex: number, year = new Date().getFullYear()) {
  const n = daysIn(monthIndex, year);
  const out: number[] = [];
  let acc = 6 + monthIndex;
  for (let i = 0; i < n; i++) {
    const slope = i > n * 0.25 ? 0.8 : 0.3;
    const wobble = Math.sin((i / n) * Math.PI) * 0.6;
    acc = acc + slope + wobble;
    out.push(acc);
  }
  return out;
}

function bucketWeekly(values: number[]) {
  const result: number[] = [];
  const weeks = Math.ceil(values.length / 7);
  for (let w = 0; w < weeks; w++) {
    const end = Math.min(values.length, (w + 1) * 7);
    result.push(values[end - 1]);
  }
  return result;
}

function genYearlyMonthlySeries() {
  return new Array(12).fill(0).map((_, i) => 8 + i * 3.6 + Math.max(0, Math.sin(i / 12) * 5));
}

/* ========================= Enhanced Responsive Chart ========================= */
function useContainerWidth<T extends HTMLElement>(min = 280) {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState<number>(min);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      setW(Math.max(min, entries[0].contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [min]);
  return { ref, width: w };
}

function LineChart({
  data,
  yLabel = "BTN Coin",
  xLabels,
}: {
  data: number[];
  yLabel?: string;
  xLabels: string[];
}) {
  const { ref, width } = useContainerWidth<HTMLDivElement>(280);
  const height = 300;
  const pad = { t: 25, r: 25, b: 45, l: 60 };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const n = data.length;
  const step = (width - pad.l - pad.r) / Math.max(1, n - 1);

  const pts = data.map((v, i) => {
    const x = pad.l + i * step;
    const y = pad.t + (1 - (v - min) / range) * (height - pad.t - pad.b);
    return [x, y] as const;
  });
  
  const pathD = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
  
  // Create area path for gradient
  const areaD = pathD + ` L ${pts[pts.length - 1][0]} ${height - pad.b} L ${pts[0][0]} ${height - pad.b} Z`;

  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B50D9" />
            <stop offset="100%" stopColor="#7B73E6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5B50D9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5B50D9" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((g) => {
          const y = pad.t + (g / 4) * (height - pad.t - pad.b);
          return (
            <line 
              key={g} 
              x1={pad.l} 
              x2={width - pad.r} 
              y1={y} 
              y2={y} 
              stroke="#F1F5F9" 
              strokeWidth={1}
            />
          );
        })}

        {/* Y-axis label */}
        <text
          x={20}
          y={pad.t + (height - pad.t - pad.b) / 2}
          fill="#64748B"
          fontSize="12"
          fontWeight="500"
          transform={`rotate(-90 20 ${pad.t + (height - pad.t - pad.b) / 2})`}
          textAnchor="middle"
        >
          {yLabel}
        </text>

        {/* X-axis labels */}
        {xLabels.map((lbl, i) => {
          const x = pad.l + i * ((width - pad.l - pad.r) / (xLabels.length - 1 || 1));
          return (
            <text 
              key={i} 
              x={x} 
              y={height - 15} 
              textAnchor="middle" 
              fontSize="11" 
              fill="#64748B" 
              fontWeight="500"
            >
              {lbl}
            </text>
          );
        })}

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Data points */}
        {pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="white"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.05,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ r: 6, strokeWidth: 3 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ========================= Stats Cards ========================= */
function StatsCard({ icon: Icon, label, value, change }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <motion.div
      {...scaleIn}
      className="rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-xl bg-slate-100/80">
          <Icon className="w-5 h-5 text-[#5B50D9]" />
        </div>
        {change && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm text-slate-600 font-medium">{label}</p>
    </motion.div>
  );
}

/* ========================= Main Page ========================= */
export default function InterestAccumulationPage() {
  const router = useRouter();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [chartGran, setChartGran] = useState<"Month" | "Week" | "Day">("Month");
  const [tableGran, setTableGran] = useState<"Month" | "Week" | "Day">("Day");

  const monthIndex = months.indexOf(month);
  const dailySeries = useMemo(() => genDailySeriesForMonth(monthIndex), [monthIndex]);
  const weeklySeries = useMemo(() => bucketWeekly(dailySeries), [dailySeries]);
  const monthlySeries = useMemo(() => genYearlyMonthlySeries(), []);

  /* ----- CHART derived from chartGran ----- */
  const { chartValues, xLabels } = useMemo(() => {
    if (chartGran === "Day") {
      return {
        chartValues: dailySeries,
        xLabels: Array.from({ length: dailySeries.length }, (_, i) => `${i + 1}`),
      };
    }
    if (chartGran === "Week") {
      return {
        chartValues: weeklySeries,
        xLabels: Array.from({ length: weeklySeries.length }, (_, i) => `W${i + 1}`),
      };
    }
    // Month
    return { chartValues: monthlySeries, xLabels: months.map(m => m.slice(0, 3)) };
  }, [chartGran, dailySeries, weeklySeries, monthlySeries, months]);

  /* ----- TABLE derived from tableGran ----- */
  const { tableTitle, tableRows } = useMemo(() => {
    if (tableGran === "Day") {
      const rows = dailySeries.map((_, i) => {
        const d = new Date();
        d.setMonth(monthIndex, i + 1);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const interestEarned = 0.05 + (Math.random() * 0.02);
        const cumulative = dailySeries[i];
        return { dateStr, interestEarned, cumulative };
      });
      return { tableTitle: "Daily Accumulation", tableRows: rows };
    }
    if (tableGran === "Week") {
      const rows = weeklySeries.map((val, i) => {
        const endDay = Math.min(dailySeries.length, (i + 1) * 7);
        const d = new Date();
        d.setMonth(monthIndex, endDay);
        const dateStr = `Week ${i + 1}`;
        const interestEarned = 0.35 + (Math.random() * 0.1);
        const cumulative = val;
        return { dateStr, interestEarned, cumulative };
      });
      return { tableTitle: "Weekly Accumulation", tableRows: rows };
    }
    // Month
    const rows = months.map((monthName, i) => {
      const interestEarned = 1.5 + (Math.random() * 0.5);
      const cumulative = monthlySeries[i];
      return { dateStr: monthName, interestEarned, cumulative };
    });
    return { tableTitle: "Monthly Accumulation", tableRows: rows };
  }, [tableGran, dailySeries, weeklySeries, monthlySeries, monthIndex, months]);

  const walletAddress = "0x742d35Cc6634C0532925a3b8Dc9F5e0f1a8a1b2c";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Interest Accumulation
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Track how your investment grows over time
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="group inline-flex items-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-semibold bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 w-fit"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
              <span className="text-slate-700 group-hover:text-slate-900">Back to Dashboard</span>
            </motion.button>
          </div>

          <WalletStrip address={walletAddress} />
        </motion.header>

        {/* Stats Grid */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatsCard 
            icon={TrendingUp} 
            label="Total Interest Earned" 
            value="124.85" 
            change="+5.2%" 
          />
          <StatsCard 
            icon={PieChart} 
            label="Current APY" 
            value="6.24%" 
          />
          <StatsCard 
            icon={Coins} 
            label="BTN Coin Value" 
            value="$1.42" 
            change="+2.1%" 
          />
          <StatsCard 
            icon={Wallet} 
            label="Total Balance" 
            value="892.36" 
          />
        </motion.section>

        {/* Main Content Card */}
        <motion.section
          {...fadeIn}
          className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm shadow-slate-200/50 overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#5B50D9] to-[#7B73E6] shadow-md"
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    RSEB Bond Performance
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Real-time tracking of your interest accumulation
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MenuSelect
                  icon={<Calendar className="w-4 h-4 text-slate-600" />}
                  value={month}
                  onChange={setMonth}
                  options={months}
                  menuMaxHeight={360}
                  ariaLabel="Select month"
                  align="right"
                />
                <MenuSelect
                  value={chartGran}
                  onChange={(v) => setChartGran(v as typeof chartGran)}
                  options={["Month", "Week", "Day"]}
                  ariaLabel="Select chart granularity"
                  align="right"
                  menuMaxHeight={200}
                />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <LineChart data={chartValues} xLabels={xLabels} yLabel="BTN Coin" />
          </div>

          {/* Table Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {tableTitle}
              </h3>
              <Tabs 
                value={tableGran} 
                onChange={(v) => setTableGran(v as typeof tableGran)} 
                options={["Day", "Week", "Month"]} 
              />
            </div>

            {/* Responsive Table Container */}
            <div className="rounded-2xl border border-slate-200 bg-white/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <colgroup>
                    <col className="w-[32%]" />
                    <col className="w-[34%]" />
                    <col className="w-[34%]" />
                  </colgroup>
                  <thead className="bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="py-4 pl-6 pr-4 text-left text-sm font-semibold text-slate-700">
                        {tableGran === "Day" ? "Date" : "Period"}
                      </th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-slate-700">
                        Interest Earned (BTN Coin)
                      </th>
                      <th className="py-4 pr-6 pl-4 text-right text-sm font-semibold text-slate-700">
                        Cumulative Amount (BTN Coin)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableRows.map((r, idx) => (
                      <motion.tr
                        key={`${r.dateStr}-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group hover:bg-slate-50/50 transition-colors duration-200"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <span className="text-sm font-medium text-slate-900">
                            {r.dateStr}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-semibold text-emerald-600">
                            {nf4.format(r.interestEarned)}
                          </span>
                        </td>
                        <td className="py-4 pr-6 pl-4 text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {nf4.format(r.cumulative)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden mt-6 space-y-3">
              {tableRows.slice(0, 5).map((r, idx) => (
                <motion.div
                  key={`mobile-${r.dateStr}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {r.dateStr}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      +{nf4.format(r.interestEarned)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Cumulative: <span className="font-semibold text-slate-900">
                      {nf4.format(r.cumulative)} BTN
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}