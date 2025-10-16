'use client';

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import Link from 'next/link'; // Import the Link component
import styles from './page.module.css';

const OtpVerificationPage = () => {
    // State to hold the 6 digits of the OTP
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));

    // Ref to hold references to the input elements
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Function to handle changes in OTP input fields
    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Ensure only numeric values are entered
        if (isNaN(Number(value))) return;

        // Create a new OTP array and update the digit at the current index
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Get the last digit
        setOtp(newOtp);

        // If a value is entered and it's not the last input, focus the next one
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Function to handle the backspace key for easier editing
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        // If backspace is pressed on an empty input, move focus to the previous one
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Forgot Password</h1>
                <p className={styles.subtitle}>
                    Enter the 6-digit code we sent in your mail
                </p>
                <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className={styles.otpInput}
                        />
                    ))}
                </div>

                {/* Link to the reset password page, styled as a button */}
                <Link href="/forgot-password/reset-password" className={styles.verifyButton}>
                    Verify & Continue
                </Link>

                <p className={styles.resendText}>
                    Didn't get the code? <button className={styles.resendLink}>Resend</button>
                </p>
            </div>
        </div>
    );
};

export default OtpVerificationPage;