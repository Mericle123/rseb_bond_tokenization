import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const InvestorLoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Image
          src="/RSEB.png"
          alt="RSEB Logo"
          width={130}
          height={130}
          className={styles.logo}
        />
        <h1 className={styles.title}>Login as User / Investor</h1>
        {/* === MODIFICATION START === */}
        <Link href="/investor/login/ndi" className={styles.loginButton}>
          Login with Bhutan NDI
        </Link>
        {/* === MODIFICATION END === */}
        <Link href="/admin/login" className={styles.adminLoginLink}>
          Admin login
        </Link>
      </div>
    </div>
  );
};

export default InvestorLoginPage;