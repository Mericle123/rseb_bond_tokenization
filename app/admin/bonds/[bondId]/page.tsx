'use client';

// Import necessary hooks and components from React and Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Used for client-side navigation
import { useRouter } from 'next/navigation'; // Used for programmatic navigation (like the back button)
import Image from 'next/image'; // Optimized image component from Next.js

// Import the stylesheet and icons
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';

// The component receives `params`, which contains the dynamic parts of the URL.
// In this case, `params.bondId` will be the ID of the bond.
const AboutBondPage = ({ params }: { params: { bondId: string } }) => {
    const router = useRouter();

    // State to hold the calculated time left for the countdown timer.
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // The `useEffect` hook handles the real-time countdown logic.
    useEffect(() => {
        // IMPORTANT: In a real application, you would fetch the bond's closing date from your database
        // using `params.bondId` and use that to set the target date.
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14); // For demonstration, we set it to 14 days from now.

        // `setInterval` runs a function every 1000ms (1 second) to update the timer.
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            // Calculate the remaining days, hours, minutes, and seconds from the distance.
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // If the countdown is finished, stop the interval and set time to zero.
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                // Otherwise, update the state with the newly calculated time.
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        // This is a cleanup function. It stops the interval when the user navigates away
        // from this page, which prevents memory leaks.
        return () => clearInterval(interval);
    }, [params.bondId]); // The effect will re-run if the `bondId` changes.

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoArrowBack size={24} />
                </button>
                <h1 className={styles.title}>About Bond</h1>
            </div>

            <div className={styles.topSection}>
                <div className={styles.bondIntro}>
                    <div className={styles.bondIconWrapper}>
                        <Image src="/logo.png" alt="Bond Icon" width={40} height={40} />
                        <div className={styles.availabilityDot}></div>
                    </div>
                    <div>
                        <h2 className={styles.bondName}>RSEB Bond</h2>
                        <p className={styles.bondMeta}>Symbol: BNK002</p>
                        <p className={styles.interestRate}>Interest rate : + 5% yr</p>
                        <p className={styles.bondMeta}>From :Royal Security exchange of Bhutan</p>
                    </div>
                </div>
                <div className={styles.countdown}>
                    <p>Subscription Closes In:</p>
                    <h3>
                        {String(timeLeft.days).padStart(2, '0')} Days :{' '}
                        {String(timeLeft.hours).padStart(2, '0')} Hours :{' '}
                        {String(timeLeft.minutes).padStart(2, '0')} Minutes
                    </h3>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.detailsSection}>
                    <h3 className={styles.sectionTitle}>Details</h3>
                    <p><strong>Bond Name :</strong> RSEB Bond</p>
                    <p><strong>Bond Symbol :</strong> BNK002</p>
                    <p><strong>Issuer :</strong> Royal Security exchange of Bhutan</p>
                    <p><strong>Face value :</strong> 10 BTN Coin</p>
                    <p><strong>Total Units Offered :</strong> 100</p>
                    <p><strong>Issued Date :</strong> 2nd September 2025</p>
                    <p><strong>Maturity Date :</strong> 2nd September 2025</p>
                </div>
                <div className={styles.statsSection}>
                    <div className={styles.statsCard}>
                        <p><strong>Total Subscribed Units :</strong> 100 /1000</p>
                        <p><strong>Number of Investors :</strong> 100</p>
                        <p><strong>Average Subscriber :</strong> 25</p>
                    </div>
                    <div className={styles.actions}>
                        <Link href={`/admin/bonds/${params.bondId}/details`} className={styles.viewMoreBtn}>
                            View More
                        </Link>
                        {/* This is the corrected, clickable "Delete Bond" button */}
                        <Link href={`/admin/bonds/${params.bondId}/delete`} className={styles.deleteBtn}>
                            Delete Bond
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.description}>
                <p>
                    The Royal Securities Exchange of Bhutan (RSEB) is proud to introduce this digital bond as part of its mission to mobilize domestic capital for Bhutan’s long-term national development projects. These projects are vital to driving sustainable growth, modernizing infrastructure, and empowering communities across the country. By offering this bond on a secure, blockchain-based platform, RSEB opens the door for Bhutanese individuals and institutions to actively participate in shaping the nation’s financial future.
                </p>
                <p>
                    For investors, this bond represents more than just an opportunity to earn stable and transparent returns. It is also a chance to be directly involved in strengthening Bhutan’s financial ecosystem, supporting critical infrastructure initiatives, and fostering innovation in capital markets. Through digital participation, investors contribute to a collective effort that balances economic progress with Bhutan’s values of sustainability and community empowerment.
                </p>
            </div>
        </div>
    );
};

export default AboutBondPage;