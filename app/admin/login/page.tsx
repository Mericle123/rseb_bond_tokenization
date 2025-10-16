'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <Image
          src="/RSEB.png" // Assumes RSEB.png is in the public folder
          alt="RSEB Logo"
          width={120}
          height={120}
          className={styles.logo}
        />
        <h1 className={styles.title}>Login as Admin</h1>
        <form className={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            className={styles.input}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* You can use an image or an SVG icon here */}
              👁️
            </button>
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <div className={styles.links}>
          <Link href="/forgot-password" className={styles.link}>
            Forgot Password?
          </Link>
          <Link href="/investor/login" className={styles.link}>
            Login as User / investor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;