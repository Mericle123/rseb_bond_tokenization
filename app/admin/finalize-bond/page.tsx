'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import { bondCreation } from '@/server/bond/creation';

type DetailsState = Record<string, string>;

const FinalizeBondContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [details, setDetails] = useState<DetailsState>({});
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 👈 popup flag
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries()) as DetailsState;
    setDetails(params);
  }, [searchParams]);

  const toggleEdit = (field: string) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (name: string, placeholder: string) => (
    <div className={styles.fieldWrapper}>
      {editMode[name] ? (
        <input
          name={name}
          value={details[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
          autoFocus
          onBlur={() => toggleEdit(name)}
        />
      ) : (
        <div className={styles.fieldDisplay}>
          <span>{details[name] || placeholder}</span>
          <FiEdit2 onClick={() => toggleEdit(name)} className={styles.editIcon} />
        </div>
      )}
    </div>
  );

  async function handleSubmit() {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const formData = new FormData();
      Object.entries(details).forEach(([key, value]) => {
        if (value != null) formData.append(key, value);
      });

      const result = await bondCreation(formData);

      if (result?.success) {
        // ✅ Show success popup instead of redirecting immediately
        setShowSuccess(true);
      } else {
        setErrorMsg('Bond creation failed. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const goToAdmin = () => {
    router.push('/admin');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <IoArrowBack size={24} />
        </button>
        <h1 className={styles.title}>Finalize Bond</h1>
      </div>

      {/* Main card */}
      <div className={styles.formCard}>
        <div className={styles.grid}>
          {renderField('bondName', 'Bond Name')}
          {renderField('org_name', 'Organization Name')}
          {renderField('totalUnitOffered', 'Total unit offered')}
          {renderField('interest_rate', 'Interest rate')}
          {renderField('maturity', 'Maturity date')}
          {renderField('subscription_period', 'Subscription Period')}
          {renderField('face_value', 'Face Value')}
          {renderField('bond_type', 'Bond Type')}
          {renderField('bondSymbol2', 'Bond Symbol')}
        </div>

        <div className={styles.fieldWrapper}>
          {editMode.purpose ? (
            <textarea
              name="purpose"
              value={details.purpose || ''}
              onChange={handleChange}
              className={styles.textArea}
              rows={5}
              autoFocus
              onBlur={() => toggleEdit('purpose')}
            />
          ) : (
            <div className={`${styles.fieldDisplay} ${styles.textAreaDisplay}`}>
              <span>{details.purpose || 'Purpose of the Bond'}</span>
              <FiEdit2 onClick={() => toggleEdit('purpose')} className={styles.editIcon} />
            </div>
          )}
        </div>

        {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}
      </div>

      {/* Footer actions */}
      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => router.back()} disabled={submitting}>
          Back
        </button>
        <button
          className={styles.tokenizeBtn}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Tokenizing…' : 'Tokenize'}
        </button>
      </div>

      {/* Simple overlay while submitting (optional) */}
      {submitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Creating bond on-chain…</p>
        </div>
      )}

      {/* ✅ Success Popup Modal */}
      {showSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Bond Created 🎉</h2>
            <p className={styles.modalText}>
              Your bond has been successfully tokenized and stored on-chain.
            </p>

            <div className={styles.modalDetails}>
              <p><strong>{details.bondName}</strong> ({details.bondSymbol2})</p>
              <p>
                {details.totalUnitOffered} units · {details.interest_rate}% · Maturity:{' '}
                {details.maturity}
              </p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setShowSuccess(false)}
              >
                Stay on this page
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

// Page wrapper with Suspense
const FinalizeBondPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FinalizeBondContent />
  </Suspense>
);

export default FinalizeBondPage;
