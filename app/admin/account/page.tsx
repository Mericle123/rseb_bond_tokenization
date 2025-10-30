'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import { FaTrashAlt } from 'react-icons/fa';
import { logout } from '@/server/action/action';    
import { useCurrentUser } from '@/context/UserContext';


const AccountPage = () => {
    const currentUser  = useCurrentUser();
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoArrowBack size={24} />
                </button>
                <h1 className={styles.title}>Account</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.userCard}>
                    <h2 className={styles.cardTitle}>User</h2>
                    <p className={styles.userName}>{currentUser?.name}</p>

                    <div className={styles.emailCard}>
                        <div className={styles.emailInfo}>
                            {/* <Image src="/google-icon.png" alt="Google Icon" width={24} height={24} /> */}
                            <span>{currentUser?.email}</span>
                        </div>
                        <div className={styles.actionButtons}>
                            <Link href="/admin/account/change-password" className={styles.actionBtn}>
                                <FiEdit2 />
                                <span>Change Password</span>
                            </Link>
                            {/* === MODIFICATION: CHANGED BUTTON TO LINK === */}
                            <Link href="/admin/account/delete-account" className={styles.actionBtn}>
                                <FaTrashAlt />
                                <span>Delete account</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </div>
    );
};

export default AccountPage;