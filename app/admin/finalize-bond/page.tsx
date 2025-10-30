'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { FiEdit2 } from 'react-icons/fi';
import { bondCreation } from '@/server/bond/creation';
import { redirect } from 'next/navigation';

// A component to handle the logic, wrapped in Suspense
const FinalizeBondContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [details, setDetails] = useState({});
    const [editMode, setEditMode] = useState({});

    useEffect(() => {
        // Read all params from the URL and set the initial state
        const params = Object.fromEntries(searchParams.entries());
        setDetails(params);
    }, [searchParams]);

    const toggleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const renderField = (name, placeholder) => (
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
                    <FiEdit2 onClick={() => toggleEdit(name)} />
                </div>
            )}
        </div>
    );

    async function handleSubmit(){
        const formData = new FormData();
        Object.entries(details).forEach(([key, value]) => {
        formData.append(key, value);
        })
            
        const result =  await  bondCreation(formData)
        if(result.success){
            redirect("/admin")
            window.location.reload()
  
        }
        
    }
   


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    <IoArrowBack size={24} />
                </button>
                <h1 className={styles.title}>Finalize Bond</h1>
            </div>

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
                        ></textarea>
                    ) : (
                        <div className={`${styles.fieldDisplay} ${styles.textAreaDisplay}`}>
                            <span>{details.purpose || 'Purpose of the Bond'}</span>
                            <FiEdit2 onClick={() => toggleEdit('purpose')} />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.backBtn} onClick={() => router.back()}>
                    Back
                </button>
                {/* === UPDATED: Added onClick handler to navigate to the admin home page === */}
                <button className={styles.tokenizeBtn} onClick={handleSubmit}>
                    Tokenize
                </button>
            </div>
        </div>
    );
};

// The main page component wraps the logic in Suspense
const FinalizeBondPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <FinalizeBondContent />
    </Suspense>
);

export default FinalizeBondPage;