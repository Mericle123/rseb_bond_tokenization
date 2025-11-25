'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
// 1. Lucide Icons for modern UI
import { 
    ArrowLeft, 
    LayoutDashboard, // Home
    Package,         // Assets
    LogOut,          // Logout
    User,            // Mobile Profile
    Pencil,          // Edit
    Trash2           // Delete
} from "lucide-react";

// 2. PRESERVED AUTH & SERVER ACTION IMPORTS
import { logout } from '@/server/action/action';
import { useCurrentUser } from '@/context/UserContext';

/* ------------------------------ Helpers ------------------------------ */

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

/* ----------------------------- Main UI ------------------------------- */

export default function AdminSidebar() {
    const pathname = usePathname();
    const [accountOpen, setAccountOpen] = useState(false);
    
    // 3. PRESERVED AUTH STATE
    const currentUser = useCurrentUser(); 

    const NAV_ITEMS = [
        { label: "Home", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { label: "Assets", href: "/admin/assets", icon: <Package size={18} /> },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden sm:flex flex-col justify-between bg-[#5B50D9] text-white w-[230px] rounded-[20px] p-4 m-2 shadow-xl ring-1 ring-black/5 transition-all duration-300 ease-out sticky top-2 self-start h-[calc(100vh-1rem)]">
                <div>
                    <div className="flex justify-center mb-8 mt-4">
                        <Link href="/admin" className="h-12 w-12 bg-white rounded-full grid place-items-center shadow-inner">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} />
                        </Link>
                    </div>
                    <nav className="flex flex-col gap-3">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold text-[14px] transition-all duration-300 ${isActive(item.href) ? "bg-white text-black shadow-md scale-[1.02]" : "hover:bg-white/10 text-white/90 hover:scale-[1.03]"}`}>
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <button type="button" onClick={() => setAccountOpen(true)} className="bg-white text-black rounded-full py-2 px-4 flex items-center gap-3 justify-center shadow hover:shadow-md active:scale-[0.99] transition" aria-label="Open account panel">
                    <Image src="/google-icon.png" alt="Profile" width={28} height={28} className="rounded-full" />
                    {/* 4. Display Real User Email */}
                    <p className="text-[13px] font-semibold truncate max-w-[100px]">
                        {currentUser?.email || "Loading..."}
                    </p>
                </button>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="sm:hidden fixed inset-x-3 bottom-3 z-40 bg-[#5B50D9] text-white rounded-[20px] px-3 py-2 shadow-xl ring-1 ring-black/5 flex justify-around items-center">
                {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 text-[12px] font-medium transition-all ${isActive(item.href) ? "text-white scale-[1.1]" : "text-white/80 hover:text-white hover:scale-[1.08]"}`}>
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
                <button onClick={() => setAccountOpen(true)} className="flex flex-col items-center gap-1 text-[12px] font-medium text-white/80 hover:text-white hover:scale-[1.08] transition-all">
                    <User size={18} />
                    Profile
                </button>
            </nav>
            
            {/* 5. Pass Auth Data and Logout Action to Panel */}
            <AccountPanel 
                open={accountOpen} 
                onClose={() => setAccountOpen(false)} 
                user={currentUser} 
                onLogout={logout} 
            />
        </>
    );
}

/* --------------------------- Account Panel & Views --------------------------- */

type View = 'main' | 'changePassword' | 'deleteAccount';

type AccountPanelProps = {
    open: boolean;
    onClose: () => void;
    user: any; 
    onLogout: () => void;
};

function AccountPanel({ open, onClose, user, onLogout }: AccountPanelProps) {
    const mounted = useMounted();
    const [view, setView] = useState<View>('main');

    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => setView('main'), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const getTitle = () => {
        if (view === 'main') return 'Account';
        return ''; 
    };

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button type="button" onClick={onClose} aria-label="Close overlay" className={`absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
            <aside className={`absolute right-0 top-0 h-full w-[92%] sm:w-[420px] bg-white rounded-l-[18px] border-l border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`} role="dialog">
                <div className="relative flex items-center border-b border-black/10 px-4 py-3">
                    <button type="button" onClick={view === 'main' ? onClose : () => setView('main')} aria-label="Back" className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h2 className="absolute left-0 right-0 text-center text-[15px] font-medium pointer-events-none">{getTitle()}</h2>
                </div>
                <div className="flex flex-col justify-between flex-1 overflow-y-auto p-6">
                    {view === 'main' && <MainAccountView user={user} setView={setView} onLogout={onLogout} />}
                    {view === 'changePassword' && <ChangePasswordView />}
                    {view === 'deleteAccount' && <DeleteAccountView user={user} />}
                </div>
            </aside>
        </div>,
        document.body
    );
}


/* === SUB-COMPONENTS === */

// Main View 
const MainAccountView = ({ user, setView, onLogout }: any) => (
    <div className="flex flex-col justify-between h-full">
        <div>
            <h2 className="text-2xl font-bold">User</h2>
            <p className="text-lg text-gray-500 mb-6">{user?.name || "Admin"}</p>

            <div className="bg-purple-100 p-6 rounded-2xl">
                <div className="bg-purple-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Image src="/google-icon.png" alt="Google Icon" width={24} height={24} />
                        <span className="font-semibold text-gray-800 break-all">{user?.email}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setView('changePassword')} className="flex flex-col items-center justify-center gap-2 bg-white text-gray-800 font-semibold py-4 px-2 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition">
                            <Pencil size={20} className="text-[#5B50D9]" />
                            <span className="text-xs">Change Password</span>
                        </button>
                        <button onClick={() => setView('deleteAccount')} className="flex flex-col items-center justify-center gap-2 bg-white text-gray-800 font-semibold py-4 px-2 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 active:scale-95 transition">
                            <Trash2 size={20} className="text-red-500" />
                            <span className="text-xs">Delete Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* 6. Real Logout Action Triggered Here */}
        <button onClick={onLogout} className="w-full p-4 bg-[#5B50D9] text-white font-semibold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all mt-8 flex items-center justify-center gap-2 shadow-lg shadow-purple-200">
            <LogOut size={20} />
            Logout
        </button>
    </div>
);

// Change Password View 
const ChangePasswordView = () => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
        <form className="flex flex-col gap-5">
            <input type="password" placeholder="Current Password" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none transition" />
            <input type="password" placeholder="New Password" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B50D9] focus:border-transparent outline-none transition" />
            <button type="submit" className="w-full p-4 bg-[#5B50D9] text-white font-semibold rounded-xl hover:opacity-90 transition mt-2 shadow-md">Change</button>
        </form>
    </div>
);

// Delete Account View 
const DeleteAccountView = ({ user }: any) => {
    return (
        <div className="flex flex-col justify-between h-full text-center animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="flex-grow flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold mb-4">Are you sure?</h2>
                <p className="text-base text-gray-600 mb-8 max-w-sm leading-relaxed">
                    Are you sure you want to Delete your account? Doing so will log you out and require you to set up your account again through the Admin
                </p>
                <div className="inline-flex items-center gap-3 py-3 px-6 bg-purple-100 rounded-full mb-8">
                    <Image src="/google-icon.png" alt="Google Icon" width={24} height={24} />
                    <span className="font-semibold text-gray-800">{user?.email}</span>
                </div>
            </div>

            <button className="w-full p-4 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                Delete and Logout
            </button>
        </div>
    );
};