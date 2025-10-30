'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';

const DeleteBondPage = () => {
    const router = useRouter();
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = "Yes I am sure";
    const isButtonDisabled = confirmationText !== requiredText;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoArrowBack size={24} />
                </button>
                <h1 className={styles.title}>Deletion</h1>
            </div>

            <div className={styles.content}>
                <h2 className={styles.formTitle}>Are you sure ?</h2>
                <p className={styles.warningText}>
                    Are you sure you want to Delete your this bond? Doing so will remove this from the marketplace and remove this permanently
                </p>

                <div className={styles.bondCard}>
                    <div className={styles.bondIconWrapper}>
                        <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                        <div className={styles.availabilityDot}></div>
                    </div>
                    <div>
                        <h3 className={styles.bondName}>RSEB Bond</h3>
                        <p className={styles.bondMeta}>Symbol: BNK002</p>
                        <p className={styles.interestRate}>Interest rate : + 5% yr</p>
                        <p className={styles.bondMeta}>From :Royal Security exchange of Bhutan</p>
                    </div>
                </div>

                <p className={styles.promptText}>
                    Type "<strong>Yes I am sure</strong>" to confirm the Deletion
                </p>
                <input
                    type="text"
                    placeholder="Type"
                    className={styles.input}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                />
            </div>

            <button className={styles.deleteButton} disabled={isButtonDisabled}>
                Delete
            </button>
        </div>
    );
};

export default DeleteBondPage;