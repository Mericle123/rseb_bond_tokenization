import Image from 'next/image';
import Link from 'next/link'; // Make sure Link is imported
import styles from './page.module.css';

const ForgotPasswordPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Image
                    src="/RSEB.png"
                    alt="RSEB Logo"
                    width={120}
                    height={120}
                    className={styles.logo}
                />
                <h1 className={styles.title}>Forgot Password</h1>
                <div className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className={styles.input}
                    />
                    {/* === MODIFICATION START === */}
                    <Link href="/forgot-password/verify-otp" className={styles.submitButton}>
                        Submit
                    </Link>
                    {/* === MODIFICATION END === */}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;