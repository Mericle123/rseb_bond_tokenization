'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { bondMint, fetchBondById } from '@/server/bond/creation';
import BondCountDown from '../../countdown';
import allocateBond, { allocateBondAndPersist, mintBond } from '@/server/blockchain/bond';


function formatDMY(dateISO: string) {
    const d = new Date(dateISO);
    const day = d.getDate();
    const suffix =
        day % 10 === 1 && day % 100 !== 11
            ? "st"
            : day % 10 === 2 && day % 100 !== 12
                ? "nd"
                : day % 10 === 3 && day % 100 !== 13
                    ? "rd"
                    : "th";
    const month = d.toLocaleString("en-GB", { month: "long" });
    return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

const AboutBondPage = ({ params }: { params: Promise<{ bondId: string }> }) => {
    const [showModal, setShowModal] = useState(false);
    const [algorithm, setAlgorithm] = useState<string>("")
    // ✅ unwrap params properly for Next.js 15+
    const { bondId } = use(params);

    const [bond, setBond] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const router = useRouter();

    // ✅ Fetch bond data once
    useEffect(() => {
        async function getBond() {
            try {
                const data = await fetchBondById(bondId);
                setBond(data);

            } catch (error) {
                console.error("Bond not found:", error);
            }
        }
        getBond();


        // Countdown timer


    }, [bondId]);

    // ✅ Safe render guard
    if (!bond) {
        return <div className={styles.loading}>Loading bond details...</div>;
    }
    // const trans = await bondMint({})
 async function allocate(bond, alg) {
  try {
    const result = await allocateBondAndPersist(bond, alg);

    if (!result) {
      console.log("Error allocating bond: no result returned");
      return;
    }

    console.log("Allocation successful, digest:", result);
  } catch (err) {
    console.error("Error allocating bond:", err);
  }
}


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
                        <h2 className={styles.bondName}>{bond.name}</h2>
                        <p className={styles.bondMeta}>{bond.bondSymbol}</p>
                        <p className={styles.interestRate}>Interest rate : + {bond.interest_rate} yr</p>
                        <p className={styles.bondMeta}>From : {bond.organization_name}</p>
                    </div>
                </div>

                <div className={styles.countdown}>
                    <p>Subscription Closes In:</p>
                    <h3>
                        <BondCountDown endDate={bond.subscription_end_date} />
                    </h3>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.detailsSection}>
                    <h3 className={styles.sectionTitle}>Details</h3>
                    <p><strong>Bond Name :</strong> {bond.bond_name}</p>
                    <p><strong>Bond Symbol :</strong> {bond.bond_symbol}</p>
                    <p><strong>Issuer :</strong> {bond.organization_name}</p>
                    <p><strong>Face value :</strong> {bond.face_value}</p>
                    <p><strong>Total Units Offered :</strong> {bond.tl_unit_offered}</p>
                    <p><strong>Issued Date :</strong> {formatDMY(bond.created_at)}</p>
                    <p><strong>Maturity Date :</strong> {formatDMY(bond.maturity)}</p>
                </div>

                <div className={styles.statsSection}>
                    <div className={styles.statsCard}>
                        <p><strong>Total Subscribed Units : </strong> {bond.tl_unit_subscribed} / {bond.tl_unit_offered}</p>
                        {/* <p><strong>Number of Investors :</strong> 100</p> */}
                    </div>

                    <div className={styles.actions}>
                        <Link href={`/admin/bonds/${bondId}/details`} className={styles.viewMoreBtn}>
                            View More
                        </Link>
                        <Link href={`/admin/bonds/${bondId}/delete`} className={styles.deleteBtn}>
                            Delete Bond
                        </Link>
                        <button onClick={() => setShowModal(true)} className={styles.allocateBond}>
                            Allocate
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Choose Allocation Method</h3>

                        <div className={styles.modalActions}>
                            <button onClick={() => allocate(bond, "prorata") }
                                                                    
                                className={styles.modalButton}
                            >
                                Pro-rata Allocation
                            </button>

                            <button onClick={() => allocate(bond, "equal")}
                                className={styles.modalButton}
                            >
                                Equal Allocation
                            </button>
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className={styles.closeBtn}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.description}>
                <p>
                    {bond.purpose}
                    {/* The Royal Securities Exchange of Bhutan (RSEB) is proud to introduce this digital bond... */}
                </p>
            </div>
        </div>
    );
};

export default AboutBondPage;
