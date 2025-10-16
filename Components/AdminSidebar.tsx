'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';
import { GoHomeFill } from 'react-icons/go';
import { FaBox } from 'react-icons/fa'; // Solid box icon

const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <nav className={styles.sidebar}>
            {/* Top section containing the logo and navigation */}
            <div>
                {/* The logo is now wrapped in a Link to the admin dashboard */}
                <Link href="/admin" className={styles.logoContainer}>
                    <Image src="/logo.png" alt="Logo" width={50} height={50} />
                </Link>

                <ul className={styles.navList}>
                    <li>
                        <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
                            <GoHomeFill size={22} />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/assets" className={`${styles.navLink} ${pathname.startsWith('/admin/assets') ? styles.active : ''}`}>
                            <FaBox size={20} />
                            <span>Assets</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Bottom section for the user's wallet/profile, which is always present */}
            <Link href="/admin/account" className={styles.profileLink}>
                <div className={styles.profile}>
                    {/* Ensure you have a 'wallet.png' in your public folder */}
                    <Image src="/wallet.png" alt="Wallet Icon" width={24} height={24} />
                    <span>11410007877</span>
                </div>
            </Link>
        </nav>
    );
};

export default AdminSidebar;