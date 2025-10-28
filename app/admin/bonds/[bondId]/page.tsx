'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';

// Helper Hook to ensure component is mounted on the client before rendering a portal
function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

const AboutBondPage = ({ params }: { params: { bondId: string } }) => {
    const router = useRouter();
    const [isDeletePanelOpen, setDeletePanelOpen] = useState(false);

    // State for the countdown timer
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

    // Example bond data - in a real app, you'd fetch this using params.bondId
    const bond = {
        id: params.bondId,
        name: 'RSEB Bond',
        symbol: 'BNK002',
        interestRate: '+ 5% yr',
        issuer: 'Royal Security exchange of Bhutan',
    };

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 13); // Example date
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="p-2 sm:p-4 bg-white rounded-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><IoArrowBack size={20} /></button>
                    <h1 className="text-2xl font-bold text-gray-800">About Bond</h1>
                </div>

                {/* Top Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="p-2 border rounded-full"><Image src="/logo.png" alt="Bond Icon" width={40} height={40} /></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{bond.name}</h2>
                            <p className="text-sm text-gray-500">Symbol: {bond.symbol}</p>
                            <p className="text-sm font-semibold text-green-500">Interest rate : {bond.interestRate}</p>
                            <p className="text-sm text-gray-500">From: {bond.issuer}</p>
                        </div>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
                        <p className="text-sm text-gray-500">Subscription Closes In:</p>
                        <h3 className="text-xl font-bold">{timeLeft.days} Days : {timeLeft.hours} Hours : {timeLeft.minutes} Minutes</h3>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-3 gap-8 mb-6">
                    <div className="md:col-span-2 space-y-2 text-sm">
                        <h3 className="text-lg font-semibold mb-4">Details</h3>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Bond Name :</strong> RSEB Bond</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Bond Symbol :</strong> BNK002</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Issuer :</strong> Royal Security exchange of Bhutan</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Face value :</strong> 10 BTN Coin</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Total Units :</strong> 100</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Issued Date :</strong> 2nd September 2025</p>
                        <p><strong className="font-semibold text-gray-700 w-32 inline-block">Maturity Date :</strong> 2nd September 2025</p>
                    </div>
                    <div>
                        <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl mb-4 text-sm space-y-3">
                            <p><strong className="font-semibold">Total Subscribed Units :</strong> 100 / 1000</p>
                            <p><strong className="font-semibold">Number of Investors :</strong> 100</p>
                            <p><strong className="font-semibold">Average Subscriber :</strong> 25</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/admin/bonds/${params.bondId}/details`} className="flex-1 text-center py-3 px-6 bg-[#5B50D9] text-white font-semibold rounded-xl hover:opacity-90 transition">View More</Link>
                            <button onClick={() => setDeletePanelOpen(true)} className="flex-1 py-3 px-6 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition">Delete Bond</button>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                    <p>The Royal Securities Exchange of Bhutan (RSEB) is proud to introduce this digital bond as part of its mission...</p>
                    <p>For investors, this bond represents more than just an opportunity to earn stable and transparent returns...</p>
                </div>
            </div>

            <DeleteBondPanel
                open={isDeletePanelOpen}
                onClose={() => setDeletePanelOpen(false)}
                bond={bond}
            />
        </>
    );
};

/* --------------------------- Delete Bond Panel --------------------------- */

type DeletePanelProps = {
    open: boolean;
    onClose: () => void;
    bond: { name: string; symbol: string; interestRate: string; issuer: string; };
};

function DeleteBondPanel({ open, onClose, bond }: DeletePanelProps) {
    const mounted = useMounted();
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = "Yes I am sure";

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button type="button" onClick={onClose} aria-label="Close overlay" className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
            <aside className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-l-[18px] border-l border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog">
                <div className="relative flex items-center border-b border-black/10 px-4 py-3">
                    <button type="button" onClick={onClose} aria-label="Back" className="p-2 rounded-full hover:bg-black/5 active:bg-black/10"><ArrowLeft className="w-4 h-4" /></button>
                    <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium pointer-events-none">Deletion</h2>
                </div>
                <div className="flex flex-col justify-between flex-1 p-6 text-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-3">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to Delete your this bond? Doing so will remove this from the marketplace and remove this permanently.</p>
                        <div className="flex gap-4 p-4 bg-purple-100 rounded-lg text-left mb-6">
                            <div className="relative flex-shrink-0">
                                <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                                <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 rounded-full border-2 border-purple-100"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{bond.name}</h3>
                                <p className="text-xs text-gray-600">Symbol: {bond.symbol}</p>
                                <p className="text-xs text-green-500 font-medium">Interest rate : {bond.interestRate}</p>
                                <p className="text-xs text-gray-600">From: {bond.issuer}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Type "<strong>Yes I am sure</strong>" to confirm the Deletion</p>
                        <input
                            type="text"
                            placeholder="Type"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            className="w-full p-3 text-center border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                        />
                    </div>
                    <button disabled={confirmationText !== requiredText} className="w-full p-4 mt-6 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition disabled:bg-red-300 disabled:cursor-not-allowed">
                        Delete
                    </button>
                </div>
            </aside>
        </div>,
        document.body
    );
}

export default AboutBondPage;