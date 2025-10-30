'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const ResetPasswordPage = () => {
    // You can add state management for password inputs if needed
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Image
                    src="/RSEB.png" // Assumes RSEB.png is in the public folder
                    alt="RSEB Logo"
                    width={120}
                    height={120}
                    className={styles.logo}
                />
                <h1 className={styles.title}>Forgot Password</h1>
                <form className={styles.form}>
                    <input
                        type="password"
                        placeholder="New Password"
                        className={styles.input}
                    // value={newPassword}
                    // onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className={styles.input}
                    // value={confirmPassword}
                    // onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;