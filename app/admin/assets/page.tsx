"use client"

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { IoSearch, IoDocumentTextOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { fetchBond } from '@/server/bond/creation';


const AssetsPage = () => {
      const [bonds, setBonds] = useState([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        async function getBonds() {
          try {
            const data = await fetchBond();
     
            setBonds(data);
            console.log("bond: ", data)
          } catch (error) {
            console.error("Error fetching bonds:", error);
          } finally {
            setLoading(false);
          }
        }
        getBonds();
      }, []);
    

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Bond Ledger</h1>
                <div className={styles.searchWrapper}>
                    <IoSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Search" className={styles.searchInput} />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>Bond</div>
                    <div>Interest Rate</div>
                    <div>Total Unit offered</div>
                    <div>Total Units Subscribed</div>
                    <div>Action</div>
                </div>
                {bonds.map((bond) => (
                    <div key={bond.id} className={styles.tableRow}>
                        <div className={styles.bondCell}>
                            <div className={styles.bondIconWrapper}>
                                <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                                {/* The status dot's class is determined by bond.status */}
                                <div className={`${styles.statusDot} ${styles[bond.status]}`}></div>
                            </div>
                            <span className={bond.status === 'inactive' ? styles.inactiveText : ''}>
                                {bond.bond_name}
                            </span>
                        </div>
                        <div className={styles.interestCell}>{bond.interest_rate}</div>
                        <div>{bond.tl_unit_offered}</div>
                        <div>{bond.tl_unit_subscribed}</div>
                        <div>
                            <Link href={`/admin/bonds/${bond.id}`} className={styles.actionButton}>
                                <IoDocumentTextOutline />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetsPage;