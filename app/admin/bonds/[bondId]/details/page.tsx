'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";

/* ========================= Motion Animation ========================= */
const fadeIn = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
};

/* ========================= Reusable Components ========================= */

// Tabs (Day, Week, Month switcher)
function Tabs({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 p-1 shadow-sm">
            {options.map((o) => {
                const active = value === o;
                return (
                    <button key={o} onClick={() => onChange(o)} type="button" className={`px-4 py-1.5 text-sm rounded-full transition-colors ${active ? "bg-[#5B50D9] text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>
                        {o}
                    </button>
                );
            })}
        </div>
    );
}

// Custom Popover Select (Dropdown)
function MenuSelect({ value, options, onChange, icon, align = "left" }: { value: string; options: string[]; onChange: (v: string) => void; icon?: React.ReactNode; align?: "left" | "right" }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false); };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, []);
    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm bg-white transition ${open ? "border-[#5B50D9] ring-2 ring-[#5B50D9]/10" : "border-gray-200 hover:bg-gray-50"}`}>
                {icon}{value}<ChevronDown className={`w-4 h-4 text-gray-500 ${open ? "rotate-180" : ""} transition-transform`} />
            </button>
            {open && (
                <div ref={menuRef} className={`absolute mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-10 ${align === "right" ? "right-0" : "left-0"}`}>
                    {options.map((opt) => (<button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md">{opt}</button>))}
                </div>
            )}
        </div>
    );
}

// Custom Animated Line Chart (SVG-based)
function LineChart({ data, yLabel = "BTN Coin", xLabels }: { data: number[]; yLabel?: string; xLabels: string[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(360);
    const height = 300;
    const pad = { t: 20, r: 20, b: 40, l: 50 };
    useEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    const max = Math.max(...data);
    const pathD = data.map((v, i) => {
        const x = pad.l + i * ((width - pad.l - pad.r) / (data.length - 1 || 1));
        const y = pad.t + (1 - v / max) * (height - pad.t - pad.b);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(" ");
    return (
        <div ref={ref} className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {[...Array(5)].map((_, i) => <line key={i} x1={pad.l} x2={width - pad.r} y1={pad.t + (i / 4) * (height - pad.t - pad.b)} y2={pad.t + (i / 4) * (height - pad.t - pad.b)} stroke="#EEF2FA" />)}
                <text x={12} y={height / 2} fill="#6b7280" fontSize="12" transform={`rotate(-90 12 ${height / 2})`} textAnchor="middle">{yLabel}</text>
                {xLabels.map((lbl, i) => <text key={i} x={pad.l + i * ((width - pad.l - pad.r) / (xLabels.length - 1 || 1))} y={height - 12} textAnchor="middle" fontSize="12" fill="#6b7280">{lbl}</text>)}
                <motion.path d={pathD} fill="none" stroke="#5B50D9" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
            </svg>
        </div>
    );
}

/* ========================= Data Simulation Helpers ========================= */
function genDailySeries(monthIndex: number) { return Array.from({ length: new Date(2024, monthIndex + 1, 0).getDate() }, (_, i) => 10 + monthIndex * 2 + i * 0.5 + Math.sin(i / 5) * 2); }
function bucketWeekly(values: number[]) { const r = []; for (let i = 0; i < values.length; i += 7) r.push(values.slice(i, i + 7).pop()!); return r; }
function genMonthlySeries() { return Array.from({ length: 12 }, (_, i) => 10 + i * 5 + Math.sin(i / 2) * 5); }

// More detailed dummy data for the table
const allActivities = [
    { time: '2025-10-01', id: '10709006442', unit: 11, cumulative: 0.05 },
    { time: '2025-10-08', id: '10709006542', unit: 45, cumulative: 0.50 },
    { time: '2025-10-15', id: '10709006842', unit: 76, cumulative: 1.26 },
    { time: '2025-11-01', id: '10709006443', unit: 80, cumulative: 2.06 },
    { time: '2025-11-09', id: '10709006412', unit: 99, cumulative: 3.05 },
    { time: '2025-12-05', id: '10700006442', unit: 43, cumulative: 3.48 },
];

/* ========================= Main Page Component ========================= */
const MoreDetailsPage = () => {
    const router = useRouter();
    const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);

    // === DECOUPLED STATE ===
    const [monthFilter, setMonthFilter] = useState(months[0]);
    const [chartGranularity, setChartGranularity] = useState<'Day' | 'Week' | 'Month'>("Month"); // State for the chart
    const [tableGranularity, setTableGranularity] = useState<'Day' | 'Week' | 'Month'>("Day");   // State for the table

    // --- Chart-specific data logic ---
    const monthIndex = months.indexOf(monthFilter);
    const dailySeries = useMemo(() => genDailySeries(monthIndex), [monthIndex]);
    const weeklySeries = useMemo(() => bucketWeekly(dailySeries), [dailySeries]);
    const monthlySeries = useMemo(() => genMonthlySeries(), []);

    const { chartData, xLabels } = useMemo(() => {
        if (chartGranularity === "Day") return { chartData: dailySeries, xLabels: Array.from({ length: dailySeries.length }, (_, i) => `${i + 1}`) };
        if (chartGranularity === "Week") return { chartData: weeklySeries, xLabels: Array.from({ length: weeklySeries.length }, (_, i) => `W${i + 1}`) };
        return { chartData: monthlySeries, xLabels: months.map(m => m.slice(0, 3)) };
    }, [chartGranularity, dailySeries, weeklySeries, monthlySeries, months]);

    // --- Table-specific data logic ---
    const tableRows = useMemo(() => {
        if (tableGranularity === 'Week') {
            // Simulate weekly view by picking one entry per week
            return allActivities.filter((_, index) => index === 0 || index === 3);
        }
        if (tableGranularity === 'Month') {
            // Simulate monthly view by picking one entry per month
            return allActivities.filter((_, index) => index === 0 || index === 3 || index === 5);
        }
        return allActivities; // Default to 'Day' view, showing all activities
    }, [tableGranularity]);

    return (
        <motion.div initial="initial" animate="animate" variants={fadeIn} className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold">More Details</h1>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold">RSEB Bond</h2>
                    <div className="flex items-center gap-3">
                        <MenuSelect icon={<Calendar className="w-4 h-4 text-gray-600" />} value={monthFilter} onChange={setMonthFilter} options={months} align="right" />
                        <MenuSelect value={chartGranularity} onChange={(v) => setChartGranularity(v as any)} options={["Day", "Week", "Month"]} align="right" />
                    </div>
                </div>
                <div className="mb-8">
                    <LineChart data={chartData} xLabels={xLabels} />
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Activities</h2>
                    <Tabs value={tableGranularity} onChange={(v) => setTableGranularity(v as any)} options={["Day", "Week", "Month"]} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50/70 text-gray-500 uppercase text-xs rounded-lg">
                            <tr>
                                <th className="py-3 px-4 font-semibold">Time Stamp</th>
                                <th className="py-3 px-4 font-semibold">Investor ID</th>
                                <th className="py-3 px-4 font-semibold">Unit Subscribed</th>
                                <th className="py-3 px-4 font-semibold">Cumulative amount (BTN Coin)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tableRows.map((row) => (
                                <tr key={row.id}>
                                    <td className="py-3 px-4 text-gray-700">{row.time}</td>
                                    <td className="py-3 px-4 text-gray-700">{row.id}</td>
                                    <td className="py-3 px-4 text-gray-900 font-medium">{row.unit}</td>
                                    <td className="py-3 px-4 text-gray-900 font-medium">{row.cumulative}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default MoreDetailsPage;