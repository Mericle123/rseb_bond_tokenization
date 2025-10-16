import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const NdiLoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image
          src="/RSEB.png" // Assumes RSEB.png is in the public folder
          alt="RSEB Logo"
          width={100}
          height={100}
          className={styles.logo}
        />
        <h1 className={styles.title}>
          Login with <span className={styles.ndiText}>NDI</span>
        </h1>
        <div className={styles.qrCodeWrapper}>
          <Image
            src="/qr-code.png" // **IMPORTANT**: Replace with your actual QR code image path
            alt="NDI QR Code"
            width={180}
            height={180}
          />
        </div>
        <p className={styles.scanText}>Scan as Investor</p>
        <Link href="/investor/login" className={styles.backLink}>
          Back
        </Link>
      </div>
    </div>
  );
};

export default NdiLoginPage;