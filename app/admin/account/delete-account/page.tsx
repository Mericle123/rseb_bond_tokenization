'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';

const DeleteAccountPage = () => {
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
                <h2 className={styles.formTitle}>Are you sure ?</h2>
                <p className={styles.warningText}>
                    Are you sure you want to Delete your account? Doing so will log you out and require
                    you to set up your account again through the Admin
                </p>
                <div className={styles.emailCard}>
                    <Image src="/google-icon.png" alt="Google Icon" width={24} height={24} />
                    <span>ngawang927@gmail.com</span>
                </div>
            </div>

            <button className={styles.deleteButton}>Delete and Logout</button>
        </div>
    );
};

export default DeleteAccountPage;