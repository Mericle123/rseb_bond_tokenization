'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
    IoArrowBack, 
    IoCalendarOutline,
    IoStatsChart,
    IoTimeOutline,
    IoPersonOutline,
    IoDocumentTextOutline
} from 'react-icons/io5';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// -------- Types --------
type SubscriptionActivity = {
    // ISO datetime string, e.g. "2025-10-01T14:30:00Z"
    time: string;
    // NDI / CID or any investor identifier
    investorId: string;
    // Number of units subscribed in this transaction
    units: number;
    // Cumulative BTN amount *after* this subscription (for analytics/graph)
    cumulative: number;
};

// Animation variants
const fadeIn = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.45, ease: "easeOut" },
    viewport: { once: true, margin: "-10% 0% -10% 0%" },
};

const staggerChildren = {
    initial: { opacity: 0, y: 20 },
    whileInView: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1
        }
    }
};

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5B50D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Bond Analytics...</p>
        </div>
    </div>
);

// Chart options (static; data is dynamic)
const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
                label: function(context: any) {
                    if (context.parsed.y == null) return '';
                    return `BTN ${context.parsed.y.toLocaleString()}`;
                }
            }
        }
    },
    scales: {
        y: { 
            ticks: { 
                stepSize: 10000,
                callback: function(value: any) {
                    return `BTN ${Number(value).toLocaleString()}`;
                }
            }, 
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
            },
            title: { 
                display: true, 
                text: 'Amount (BTN)',
                color: '#6B7280',
                font: { weight: '600', size: 12 }
            } 
        },
        x: { 
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
            },
            title: { 
                display: true, 
                text: 'Timeline',
                color: '#6B7280',
                font: { weight: '600', size: 12 }
            } 
        },
    },
    elements: {
        point: {
            radius: 4,
            hoverRadius: 6,
            backgroundColor: '#5B50D9',
            borderColor: '#FFFFFF',
            borderWidth: 2
        }
    },
    interaction: {
        intersect: false,
        mode: 'index' as const,
    },
};

const MoreDetailsPage = ({ params }: { params: Promise<{ bondId: string }> }) => {
    const router = useRouter();
    const timeFilters = ['Day', 'Week', 'Month', 'Year'];
    const [activeTimeFilter, setActiveTimeFilter] = useState('Month');

    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState<SubscriptionActivity[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { bondId } = useParams<{ bondId : string}>();

    // 🚀 CHANGE THIS to your actual API route
    const SUBSCRIPTION_API = "";

    // Fetch subscription data from backend
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const res = await fetch(`/api/admin/bonds/subscriptions?bondId=${bondId}`);
                if (!res.ok) {
                    throw new Error(`Failed to load subscriptions (${res.status})`);
                }

                // Expecting an array of SubscriptionActivity-like objects
                const json = await res.json();

                // You can adapt this mapping depending on your backend DTO:
                // e.g. json.map((s: any) => ({ time: s.created_at, investorId: s.ndi, units: s.amount_tenths / 10, cumulative: s.total_btn }))
                const mapped: SubscriptionActivity[] = json.map((row: any) => ({
                    time: row.time ?? row.createdAt,     // ISO string
                    investorId: row.investorId ?? row.investor_id,
                    units: row.units ?? row.quantity ?? 0,
                    cumulative: row.cumulative ?? row.cumulativeAmountBtn ?? 0,
                }));

                // Sort by time ascending
                mapped.sort(
                    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
                );

                setActivities(mapped);
            } catch (e: any) {
                console.error('Error loading subscriptions:', e);
                setError(e?.message || 'Failed to load subscription data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptions();
    }, [SUBSCRIPTION_API]);

    // Dynamic chart data computed from activities
    const chartData = useMemo(() => {
        if (!activities.length) {
            return {
                labels: [],
                datasets: [
                    {
                        label: 'Subscription Volume',
                        data: [],
                        borderColor: '#5B50D9',
                        backgroundColor: 'rgba(91, 80, 217, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                    },
                ],
            };
        }

        // Group by month, use the latest cumulative in that month
        const byMonth = new Map<string, { label: string; value: number }>();

        activities.forEach((act) => {
            const d = new Date(act.time);
            const key = `${d.getFullYear()}-${d.getMonth()}`; // e.g. 2025-0 for Jan 2025
            const monthLabel = d.toLocaleDateString(undefined, {
                month: 'short',
                year: 'numeric',
            });
            const current = byMonth.get(key);

            // We want the last cumulative value in that month (since activities sorted)
            if (!current || act.cumulative >= current.value) {
                byMonth.set(key, { label: monthLabel, value: act.cumulative });
            }
        });

        const sortedKeys = Array.from(byMonth.keys()).sort((a, b) => {
            const [ay, am] = a.split('-').map(Number);
            const [by, bm] = b.split('-').map(Number);
            return ay === by ? am - bm : ay - by;
        });

        const labels = sortedKeys.map((k) => byMonth.get(k)!.label);
        const values = sortedKeys.map((k) => byMonth.get(k)!.value);

        return {
            labels,
            datasets: [
                {
                    label: 'Subscription Volume',
                    data: values,
                    borderColor: '#5B50D9',
                    backgroundColor: 'rgba(91, 80, 217, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                },
            ],
        };
    }, [activities]);

    // Dynamic stats from data
    const {
        totalVolume,
        avgSubscription,
        peakMonthLabel,
        growthRate,
        totalUnits,
        activeInvestors,
    } = useMemo(() => {
        if (!activities.length) {
            return {
                totalVolume: 0,
                avgSubscription: 0,
                peakMonthLabel: 'N/A',
                growthRate: 0,
                totalUnits: 0,
                activeInvestors: 0,
            };
        }

        const last = activities[activities.length - 1];
        const first = activities[0];

        const totalVolume = last.cumulative;
        const avgSubscription = totalVolume / activities.length;

        // Peak month = month with highest cumulative value (same as last in chart)
        let peakMonthLabel = 'N/A';
        if (chartData.labels.length && chartData.datasets[0].data.length) {
            const dataArr = chartData.datasets[0].data as number[];
            const maxVal = Math.max(...dataArr);
            const idx = dataArr.indexOf(maxVal);
            peakMonthLabel = chartData.labels[idx] || 'N/A';
        }

        const growthRate =
            first.cumulative > 0
                ? ((last.cumulative - first.cumulative) / first.cumulative) * 100
                : 0;

        const totalUnits = activities.reduce((sum, a) => sum + a.units, 0);
        const investorSet = new Set(activities.map((a) => a.investorId));

        return {
            totalVolume,
            avgSubscription,
            peakMonthLabel,
            growthRate,
            totalUnits,
            activeInvestors: investorSet.size,
        };
    }, [activities, chartData]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-blue-50/30 to-indigo-50/20 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <motion.div
                    {...fadeIn}
                    className="flex items-center gap-4 mb-8"
                >
                    <button 
                        onClick={() => router.back()}
                        className="p-2 rounded-xl hover:bg-gray-100/80 text-gray-600 transition-colors group"
                    >
                        <IoArrowBack className="w-6 h-6 group-hover:text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bond Analytics</h1>
                        <p className="text-gray-600 mt-1">Detailed insights and subscription activities</p>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="whileInView"
                    className="space-y-8"
                >
                    {/* Chart Section */}
                    <motion.div
                        {...fadeIn}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <IoStatsChart className="w-5 h-5 text-[#5B50D9]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Subscription Trend</h2>
                                    <p className="text-sm text-gray-600">RSEB Bond Performance Overview</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/80 border border-gray-200/60 rounded-xl">
                                    <IoCalendarOutline className="w-4 h-4 text-gray-500" />
                                    <select className="bg-transparent border-none outline-none text-sm font-medium text-gray-700">
                                        <option>All Time</option>
                                        <option>Last 12 Months</option>
                                        <option>Last 6 Months</option>
                                        <option>Last 3 Months</option>
                                        <option>Last Month</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/80 border border-gray-200/60 rounded-xl">
                                    <select className="bg-transparent border-none outline-none text-sm font-medium text-gray-700">
                                        <option>All Metrics</option>
                                        <option>Subscriptions</option>
                                        <option>Revenue</option>
                                        <option>Growth</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[400px]">
                            {chartData.labels.length ? (
                                <Line options={options} data={chartData} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                    No subscription data available yet.
                                </div>
                            )}
                        </div>

                        {/* Chart Stats (dynamic) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60">
                                <p className="text-sm font-medium text-blue-700 mb-1">Total Volume</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    BTN {totalVolume.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60">
                                <p className="text-sm font-medium text-green-700 mb-1">Avg. Subscription</p>
                                <p className="text-2xl font-bold text-green-900">
                                    BTN {Math.round(avgSubscription).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60">
                                <p className="text-sm font-medium text-purple-700 mb-1">Peak Month</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {peakMonthLabel}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/60">
                                <p className="text-sm font-medium text-orange-700 mb-1">Growth Rate</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {growthRate >= 0 ? '+' : ''}
                                    {growthRate.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activities Section */}
                    <motion.div
                        {...fadeIn}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 p-6 shadow-sm"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                    <IoDocumentTextOutline className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Subscription Activities</h2>
                                    <p className="text-sm text-gray-600">Real-time bond subscription records</p>
                                </div>
                            </div>
                            
                            {/* Time Filter Buttons (currently just change summary label) */}
                            <div className="flex bg-gray-100/80 rounded-xl p-1 border border-gray-200/60">
                                {timeFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveTimeFilter(filter)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                            activeTimeFilter === filter
                                                ? 'bg-[#5B50D9] text-white shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activities Table */}
                        <div className="overflow-hidden rounded-xl border border-gray-200/60">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
                                <div className="col-span-3 flex items-center gap-2">
                                    <IoTimeOutline className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-700">Time Stamp</span>
                                </div>
                                <div className="col-span-3 flex items-center gap-2">
                                    <IoPersonOutline className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-semibold text-gray-700">Investor ID</span>
                                </div>
                                <div className="col-span-3 text-sm font-semibold text-gray-700 text-center">Units Subscribed</div>
                                <div className="col-span-3 text-sm font-semibold text-gray-700 text-right">Cumulative Amount</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-100">
                                {activities.length === 0 ? (
                                    <div className="p-6 text-center text-sm text-gray-500">
                                        No subscription activities yet.
                                    </div>
                                ) : (
                                    activities.map((activity, index) => {
                                        const d = new Date(activity.time);
                                        const datePart = d.toLocaleDateString();
                                        const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50/50 transition-colors"
                                            >
                                                <div className="col-span-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {datePart}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {timePart}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                                                        {activity.investorId}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-center">
                                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                                        {activity.units / 10} units
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-right">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        BTN {activity.cumulative.toLocaleString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Table Summary (dynamic) */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50/50 rounded-xl border border-indigo-200/60">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <IoStatsChart className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-indigo-700">Total Summary</p>
                                    <p className="text-xs text-indigo-600">Last {activeTimeFilter.toLowerCase()} activities</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-gray-600">Total Units</p>
                                    <p className="font-semibold text-gray-900">{totalUnits.toLocaleString()} units</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600">Total Amount</p>
                                    <p className="font-semibold text-gray-900">BTN {totalVolume.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600">Active Investors</p>
                                    <p className="font-semibold text-gray-900">{activeInvestors} investors</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MoreDetailsPage;
