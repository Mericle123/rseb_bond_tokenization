'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { fetchBondById } from '@/server/bond/creation';
import BondCountDown from '../../countdown';
import { allocateBondAndPersist } from '@/server/blockchain/bond';

function formatDMY(dateISO: string) {
  const d = new Date(dateISO);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day % 100 !== 11
      ? 'st'
      : day % 10 === 2 && day % 100 !== 12
      ? 'nd'
      : day % 10 === 3 && day % 100 !== 13
      ? 'rd'
      : 'th';
  const month = d.toLocaleString('en-GB', { month: 'long' });
  return `${day}${suffix} ${month} ${d.getFullYear()}`;
}

const AboutBondPage = ({ params }: { params: Promise<{ bondId: string }> }) => {
  const { bondId } = use(params);

  const [bond, setBond] = useState<any>(null);

  // existing modal to choose algorithm
  const [showModal, setShowModal] = useState(false);

  // NEW: allocation state
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocSuccess, setAllocSuccess] = useState(false);
  const [allocError, setAllocError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'prorata' | 'equal' | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function getBond() {
      try {
        const data = await fetchBondById(bondId);
        setBond(data);
      } catch (error) {
        console.error('Bond not found:', error);
      }
    }
    getBond();
  }, [bondId]);

  // Guard while fetching
  if (!bond) {
    return <div className={styles.loading}>Loading bond details...</div>;
  }

  // 🔹 Handles the allocation call + popup state
  async function handleAllocate(alg: 'prorata' | 'equal') {
    setSelectedAlgorithm(alg);
    setAllocError(null);
    setAllocLoading(true);

    try {
      const result = await allocateBondAndPersist(bond, alg);
      setTxDigest(result?.digest ?? null);
      setAllocSuccess(true);    // show success popup
      setShowModal(false);      // close algorithm chooser
    } catch (err: any) {
      console.error('Error allocating bond:', err);
      setAllocError(err?.message || 'Allocation failed. Please try again.');
      setAllocSuccess(false);
    } finally {
      setAllocLoading(false);
    }
  }

  const closeSuccessModal = () => {
    setAllocSuccess(false);
    setAllocError(null);
  };

  const goToAdmin = () => {
    router.push('/admin');
  };

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
            <p className={styles.interestRate}>Interest rate : + {bond.interest_rate}% yr</p>
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
          <p>
            <strong>Bond Name :</strong> {bond.bond_name}
          </p>
          <p>
            <strong>Bond Symbol :</strong> {bond.bond_symbol}
          </p>
          <p>
            <strong>Issuer :</strong> {bond.organization_name}
          </p>
          <p>
            <strong>Face value :</strong> {Number(bond.face_value) / 10}
          </p>
          <p>
            <strong>Total Units Offered :</strong> {Number(bond.tl_unit_offered) / 10}
          </p>
          <p>
            <strong>Issued Date :</strong> {formatDMY(bond.created_at)}
          </p>
          <p>
            <strong>Maturity Date :</strong> {formatDMY(bond.maturity)}
          </p>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsCard}>
            <p>
              <strong>Total Subscribed Units : </strong>{' '}
              {Number(bond.tl_unit_subscribed) / 10} / {Number(bond.tl_unit_offered) / 10}
            </p>
          </div>

          <div className={styles.actions}>
            <Link href={`/admin/bonds/${bondId}/details`} className={styles.viewMoreBtn}>
              View More
            </Link>
            <Link href={`/admin/bonds/${bondId}/delete`} className={styles.deleteBtn}>
              Delete Bond
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className={styles.allocateBond}
              disabled={allocLoading}
            >
              {allocLoading ? 'Allocating…' : 'Allocate'}
            </button>
          </div>
        </div>
      </div>

      {/* Existing description */}
      <div className={styles.description}>
        <p>{bond.purpose}</p>
      </div>

      {/* 🔹 Allocation method chooser (existing modal) */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Choose Allocation Method</h3>

            <div className={styles.modalActions}>
              <button
                onClick={() => handleAllocate('prorata')}
                className={styles.modalButton}
                disabled={allocLoading}
              >
                Pro-rata Allocation
              </button>

              <button
                onClick={() => handleAllocate('equal')}
                className={styles.modalButton}
                disabled={allocLoading}
              >
                Equal Allocation
              </button>
            </div>

            {allocError && <p className={styles.errorText}>{allocError}</p>}

            <button
              onClick={() => setShowModal(false)}
              className={styles.closeBtn}
              disabled={allocLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Global loading overlay while allocation is in progress */}
      {allocLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Finalizing allocation on-chain…</p>
        </div>
      )}

      {/* 🔹 Success popup when allocation finished */}
      {allocSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.successTitle}>Allocation Completed 🎉</h3>
            <p className={styles.successText}>
              Allocation for this bond has been finalized
              {selectedAlgorithm ? ` using the ${selectedAlgorithm} method.` : '.'}
            </p>

            {txDigest && (
              <p className={styles.txLine}>
                <span>Tx digest:</span> <code>{txDigest}</code>
              </p>
            )}

            <div className={styles.modalActions}>
              <button className={styles.secondaryBtn} onClick={closeSuccessModal}>
                Close
              </button>
              <button className={styles.primaryBtn} onClick={goToAdmin}>
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutBondPage;
