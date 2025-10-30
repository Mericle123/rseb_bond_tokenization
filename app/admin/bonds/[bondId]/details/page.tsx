'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
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

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Dummy data for the table
const activities = [
    { time: '2025-10-01', investorId: '10709006442', unit: 11, cumulative: 0.05 },
    { time: '2025-12-01', investorId: '10709006542', unit: 45, cumulative: 0.05 },
    { time: '2026-04-01', investorId: '10709006842', unit: 76, cumulative: 0.05 },
    { time: '2026-08-01', investorId: '10709006443', unit: 80, cumulative: 0.05 },
    { time: '2026-01-01', investorId: '10709006412', unit: 99, cumulative: 0.05 },
];

// Chart configuration and data
export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { ticks: { stepSize: 10 }, title: { display: true, text: 'BTN Coin' } },
        x: { title: { display: true, text: 'Date' } },
    },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'December'];
export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [10, 20, 25, 32, 31, 30, 45, 68, 72, 75, 80],
            borderColor: '#5A4BDA',
            backgroundColor: 'rgba(90, 75, 218, 0.5)',
            tension: 0.4,
        },
    ],
};


const MoreDetailsPage = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}><IoArrowBack /></button>
                <h1>More Details</h1>
            </div>

            <div className={styles.chartSection}>
                <div className={styles.chartHeader}>
                    <h2>RSEB Bond</h2>
                    <div className={styles.filters}>
                        <div className={styles.selectWrapper}>
                            <FaRegCalendarAlt />
                            <select><option>January</option></select>
                        </div>
                        <div className={styles.selectWrapper}>
                            <select><option>Month</option></select>
                        </div>
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    <Line options={options} data={data} />
                </div>
            </div>

            <div className={styles.activitiesSection}>
                <div className={styles.activitiesHeader}>
                    <h2>Activities</h2>
                    <div className={styles.toggleButtons}>
                        <button className={styles.active}>Day</button>
                        <button>Week</button>
                        <button>Month</button>
                    </div>
                </div>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <div>Time Stamp</div>
                        <div>Investor ID</div>
                        <div>Unit Subscribed</div>
                        <div>Cumulative amount (BTN Coin)</div>
                    </div>
                    {activities.map((act, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div>{act.time}</div>
                            <div>{act.investorId}</div>
                            <div>{act.unit}</div>
                            <div>{act.cumulative}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoreDetailsPage;