"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InvestorSideNavbar from "@/Components/InvestorSideNavbar";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Copy, Wallet, ChevronDown } from "lucide-react";

/* ========================= Motion ========================= */
const fadeIn = {
  initial: { opacity: 0, y: 8, scale: 0.995 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" },
  viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const nf4 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 });

/* ========================= Wallet strip ========================= */
function WalletStrip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }
  return (
    <motion.div {...fadeIn} className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5B50D9]/10 ring-1 ring-[#5B50D9]/20">
            <Wallet className="w-4 h-4 text-[#5B50D9]" strokeWidth={1.75} />
          </span>
        <span className="font-medium">Wallet address:</span>
          <code className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-black/5 break-all">
            {address}
          </code>
        </div>
        <button
          onClick={copy}
          className="group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-black/10 hover:ring-black/20 bg-white hover:shadow-md transition-all"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </motion.div>
  );
}

/* ========================= Tabs (pill switcher) ========================= */
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
    <div className="inline-flex items-center rounded-full border border-[#D7DFF2] bg-white p-1 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            type="button"
            className={`px-3 py-1.5 text-[13px] rounded-full transition ${
              active ? "bg-[#5B50D9] text-white shadow-sm" : "text-neutral-700 hover:bg-gray-50"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ========================= Popover Select (custom dropdown) ========================= */
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
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKey}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[14px] bg-white transition
        ${open ? "border-[#5B50D9] ring-4 ring-[#5B50D9]/10" : "border-[#D7DFF2] hover:bg-gray-50"}`}
      >
        {icon}
        <span className="min-w-[6ch]">{value}</span>
        <ChevronDown className={`w-4 h-4 ${open ? "rotate-180" : ""} transition`} />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute mt-2 w-[220px] rounded-md border border-neutral-200 bg-white shadow-xl
            ${align === "right" ? "right-0" : "left-0"}`}
          style={{ maxHeight: menuMaxHeight, overflowY: "auto" }}
          onKeyDown={onKey}
        >
          {options.map((opt, idx) => {
            const active = idx === activeIndex;
            return (
              <div key={opt}>
                <button
                  type="button"
                  data-index={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    btnRef.current?.focus();
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] ${
                    active ? "bg-[#F4F5FF]" : "bg-white hover:bg-neutral-50"
                  }`}
                >
                  {opt}
                </button>
                {idx < options.length - 1 && <div className="mx-3 border-t border-neutral-200/70" />}
              </div>
            );
          })}
        </div>
      )}
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
  let acc = 6 + monthIndex; // tiny variation per month
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

/* ========================= Responsive chart ========================= */
function useContainerWidth<T extends HTMLElement>(min = 320) {
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
  const { ref, width } = useContainerWidth<HTMLDivElement>(360);
  const height = 260;
  const pad = { t: 18, r: 20, b: 36, l: 54 };

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

  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {[0, 1, 2, 3, 4].map((g) => {
          const y = pad.t + (g / 4) * (height - pad.t - pad.b);
          return <line key={g} x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="#EEF2FA" />;
        })}
        <text
          x={16}
          y={pad.t + (height - pad.t - pad.b) / 2}
          fill="#6b7280"
          fontSize="11"
          transform={`rotate(-90 16 ${pad.t + (height - pad.t - pad.b) / 2})`}
          textAnchor="middle"
        >
          {yLabel}
        </text>
        {xLabels.map((lbl, i) => {
          const x = pad.l + i * ((width - pad.l - pad.r) / (xLabels.length - 1 || 1));
          return (
            <text key={i} x={x} y={height - 10} textAnchor="middle" fontSize="11" fill="#6b7280">
              {lbl}
            </text>
          );
        })}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#5B50D9"
          strokeWidth={3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 1px 0 rgba(91,80,217,0.15))" }}
        />
      </svg>
    </div>
  );
}

/* ========================= Page ========================= */
export default function InterestAccumulationPage() {
  const router = useRouter();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const [month, setMonth] = useState(months[new Date().getMonth()]);
  const [chartGran, setChartGran] = useState<"Month" | "Week" | "Day">("Month"); // chart-only
  const [tableGran, setTableGran] = useState<"Month" | "Week" | "Day">("Day");   // table-only

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
        xLabels: Array.from({ length: weeklySeries.length }, (_, i) => `Wk${i + 1}`),
      };
    }
    // Month
    return { chartValues: monthlySeries, xLabels: months };
  }, [chartGran, dailySeries, weeklySeries, monthlySeries, months]);

  /* ----- TABLE derived from tableGran ----- */
  const { tableTitle, tableRows } = useMemo(() => {
    if (tableGran === "Day") {
      const rows = dailySeries.map((_, i) => {
        const d = new Date();
        d.setMonth(monthIndex, i + 1);
        const dateStr = d.toISOString().slice(0, 10);
        const interestEarned = 0.05;
        const cumulative = interestEarned * (i + 1);
        return { dateStr, interestEarned, cumulative };
      });
      return { tableTitle: "Daily Accumulation", tableRows: rows };
    }
    if (tableGran === "Week") {
      const rows = weeklySeries.map((_, i) => {
        const endDay = Math.min(dailySeries.length, (i + 1) * 7);
        const d = new Date();
        d.setMonth(monthIndex, endDay);
        const dateStr = d.toISOString().slice(0, 10);
        const interestEarned = 0.05 * 7;
        const cumulative = interestEarned * (i + 1);
        return { dateStr, interestEarned, cumulative };
      });
      return { tableTitle: "Weekly Accumulation", tableRows: rows };
    }
    // Month
    const rows = months.map((_, i) => {
      const d = new Date();
      d.setMonth(i, 1);
      const yyyyMm = `${d.getFullYear()}-${String(i + 1).padStart(2, "0")}`;
      const interestEarned = 0.05 * 30;
      const cumulative = interestEarned * (i + 1);
      return { dateStr: `${yyyyMm}`, interestEarned, cumulative };
    });
    return { tableTitle: "Monthly Accumulation", tableRows: rows };
  }, [tableGran, dailySeries, weeklySeries, monthIndex, months]);

  const walletAddress = "0i4u1290nfkjd809214190poij";

  return (
    <div className="flex min-h-screen bg-[#F7F8FB]">
      <InvestorSideNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6">
        <WalletStrip address={walletAddress} />

        <motion.section {...fadeIn} className="mt-6 rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-3 sm:px-4 pt-4 pb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="inline-grid place-items-center h-8 w-8 rounded-full hover:bg-neutral-100"
                aria-label="Back"
                type="button"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
                  Interest Acclimation
                </h2>
                <p className="text-[13px] text-neutral-600">
                  Track how your investment grows every day
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pr-3 sm:pr-4">
              <MenuSelect
                icon={<Calendar className="w-4 h-4 text-neutral-600" />}
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

          {/* Bond label */}
          <p className="px-3 sm:px-4 pb-2 text-[17px] font-semibold tracking-[0.2px]">RSEB&nbsp; Bond</p>

          {/* Chart */}
          <div className="px-3 sm:px-4">
            <LineChart data={chartValues} xLabels={xLabels} yLabel="BTN Coin" />
          </div>

          {/* ===== Table controls (independent) ===== */}
          <div className="px-3 sm:px-4 pt-3 pb-2 flex justify-end">
            <Tabs value={tableGran} onChange={(v) => setTableGran(v as typeof tableGran)} options={["Day", "Week", "Month"]} />
          </div>

          {/* Table */}
          <h3 className="px-3 sm:px-4 pt-1 text-[20px] font-extrabold text-neutral-900">
            {tableTitle}
          </h3>

          <div className="m-3 sm:m-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[34%]" />
                <col className="w-[34%]" />
              </colgroup>

              <thead className="bg-[#FBFCFF] text-[13px] text-neutral-600">
                <tr>
                  <th className="py-3 pl-4 pr-3 font-medium">{tableGran === "Day" ? "Date" : "Period"}</th>
                  <th className="py-3 px-3 font-medium text-right">Interest Earned (BTN Coin)</th>
                  <th className="py-3 pr-4 pl-3 font-medium text-right">Cumulative amount (BTN Coin)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 text-[14px] text-neutral-900">
                {tableRows.map((r, idx) => (
                  <tr key={`${r.dateStr}-${idx}`} className={idx % 2 === 1 ? "bg-[#FCFDFF]" : ""}>
                    <td className="py-[14px] pl-4 pr-3 align-middle">{r.dateStr}</td>
                    <td className="py-[14px] px-3 align-middle text-right">{nf4.format(r.interestEarned)}</td>
                    <td className="py-[14px] pr-4 pl-3 align-middle text-right">{nf4.format(r.cumulative)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
