'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';

const ChangePasswordPage = () => {
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
                <h2 className={styles.formTitle}>Change Password</h2>
                <form className={styles.form}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.changeButton}>Change</button>
                </form>
            </div>

            {/* This empty div helps push the form to the top */}
            <div className={styles.footerSpacer}></div>
        </div>
    );
};

export default ChangePasswordPage;