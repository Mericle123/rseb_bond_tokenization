'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { loginUser } from '@/server/action/action';

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      setMessage("");
  
      const formData = new FormData(e.currentTarget);
      const result = await loginUser(formData);
      if (result.error) setMessage(`❌ ${result.error}`);
      else setMessage("✅ Login successful!");
  
      setLoading(false);
    }

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
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name='email'
            placeholder="Email Address"
            className={styles.input}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
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