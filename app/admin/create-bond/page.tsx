'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdArrowDropDown } from 'react-icons/md';

const TokenizationBondPage = () => {
  const [bondDetails, setBondDetails] = useState({
    bondName: '',
    org_name: '',
    issueDate: '',
    maturity: '',
    bond_symbol: '',
    purpose: '',
    totalAmount: '',
    totalUnitOffered: '',
    bond_type: '',
    interest_rate: '',
    face_value: '',
    bondSymbol2: '',
    subscription_period: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBondDetails(prev => ({ ...prev, [name]: value }));
  };

  // This function creates the URL to pass data to the finalize page
  const generateFinalizeLink = () => {
    const params = new URLSearchParams(bondDetails);
    return `/admin/finalize-bond?${params.toString()}`;
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <button className={styles.backButton}><IoArrowBack size={24} /></button>
        <h1 className={styles.title}>Tokenization Bond</h1>
      </div>

      {/* Main content grid */}
      <div className={styles.mainGrid}>
        {/* Left Side - Form */}
        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <input name="bondName" value={bondDetails.bondName} onChange={handleChange} type="text" placeholder="Bond Name" className={styles.input} />
            <input name="org_name" value={bondDetails.org_name} onChange={handleChange} type="text" placeholder="Organization Name" className={styles.input} />
            <input name="totalUnitOffered" value={bondDetails.totalUnitOffered} onChange={handleChange} type="text" placeholder="Total unit offered" className={styles.input} />
            <div className={styles.inputWrapper}>
              <input name="interest_rate" value={bondDetails.interest_rate} onChange={handleChange} type="text" placeholder="Interest rate" className={styles.input} />
              <span className={styles.inputUnit}></span>
            </div>
            <div className={styles.inputWrapper}>
              <input name="maturity" value={bondDetails.maturity} onChange={handleChange} type="date" placeholder="Maturity date" className={styles.input} />
              <FaRegCalendarAlt className={styles.inputIcon} />
            </div>
            <div className={styles.inputWrapper}>
              <input name="face_value" value={bondDetails.face_value} onChange={handleChange} type="text" placeholder="Face Value" className={styles.input} />
              <span className={styles.inputUnit}>BTN</span>
            </div>
            <div className={styles.inputWrapper}>
              <select name="bond_type" value={bondDetails.bond_type} onChange={handleChange} className={styles.input}>
                <option value="">Bond Type</option>
                <option value="government_Bond">Government Bond</option>
                <option value="corporate_Bond">Corporate Bond</option>
                <option value="green_Bond">Green Bond</option>
                <option value="development_Bond">Development Bond</option>
                <option value="domestic_BondM2">Domestic Project Bond</option>
                <option value="SYM2">Others</option>
              </select>
              <MdArrowDropDown className={styles.inputIcon} />
            </div>
             <input name="subscription_period" value={bondDetails.subscription_period} onChange={handleChange} type="text" placeholder="Subscription Period" className={styles.input} />
            <input name="bondSymbol2" value={bondDetails.bondSymbol2} onChange={handleChange} type="text" placeholder="Bond Symbol" className={styles.input} />
          </div>
          <textarea name="purpose" value={bondDetails.purpose} onChange={handleChange} placeholder="Purpose of the Bond" className={styles.textArea} rows={6}></textarea>
        </div>

        {/* Right Side - Bond Details */}
        <div className={styles.detailsSection}>
          <div className={styles.detailsCard}>
            <h3 className={styles.detailsTitle}>Bond Details</h3>
            <p><strong>Bond type :</strong> {bondDetails.bond_type || '...'}</p>
            {/* <p><strong>Total Amount:</strong> {bondDetails.totalAmount || '...'}</p> */}
            <p><strong>Total unit :</strong> {bondDetails.totalUnitOffered || '...'}</p>
            <p><strong>Interest rate :</strong> {bondDetails.interest_rate ? `${bondDetails.interest_rate} %` : '...'}</p>
            <p><strong>Face Value :</strong> {bondDetails.face_value ? `${bondDetails.face_value} BTN` : '...'}</p>
            <p><strong>Bond Name :</strong> {bondDetails.bondName || '...'}</p>
            <p><strong>Bond Symbol:</strong> {bondDetails.bondSymbol2 || '...'}</p>
            {/* <p><strong>Issue date :</strong> {bondDetails.issueDate || '...'}</p> */}
            <p><strong>Maturity date :</strong> {bondDetails.maturity || '...'}</p>
            <p><strong>Subscription period :</strong> {bondDetails.subscription_period || '...'}</p>
            <p><strong>Purpose of the Bond:</strong> {bondDetails.purpose || '...'}</p>
          </div>
        </div>
      </div>

      {/* Allocation Method Section */}
      {/* <div className={styles.allocationSection}>
        <h3 className={styles.allocationTitle}>Select Allocation Method</h3>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input type="radio" name="allocationMethod" value="Equal Allocation" checked={bondDetails.allocationMethod === 'Equal Allocation'} onChange={handleChange} />
            Equal Allocation
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="allocationMethod" value="Pro-rata Allocation" checked={bondDetails.allocationMethod === 'Pro-rata Allocation'} onChange={handleChange} />
            Pro-rata Allocation
          </label>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className={styles.actions}>
        <Link href="/admin" className={styles.cancelBtn}>
          Cancel
        </Link>
        <Link href={generateFinalizeLink()} className={styles.finalizeBtn}>
          Finalize
        </Link>
      </div>
    </div>
  );
};

export default TokenizationBondPage;