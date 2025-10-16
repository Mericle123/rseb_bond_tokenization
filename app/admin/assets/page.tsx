import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { IoSearch, IoDocumentTextOutline } from 'react-icons/io5';

// Dummy data for the ledger, including a 'status' for the dot color
const bondLedger = [
    { id: 1, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000', status: 'active' },
    { id: 2, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000', status: 'active' },
    { id: 3, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000', status: 'inactive' }, // Example of an inactive bond
    { id: 4, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000', status: 'active' },
    { id: 5, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000', status: 'active' },
    { id: 6, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000', status: 'active' },
    { id: 7, name: 'RICB Bond', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000', status: 'active' },
];

const AssetsPage = () => {
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
                    <div>Unit available</div>
                    <div>Action</div>
                </div>
                {bondLedger.map((bond) => (
                    <div key={bond.id} className={styles.tableRow}>
                        <div className={styles.bondCell}>
                            <div className={styles.bondIconWrapper}>
                                <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                                {/* The status dot's class is determined by bond.status */}
                                <div className={`${styles.statusDot} ${styles[bond.status]}`}></div>
                            </div>
                            <span className={bond.status === 'inactive' ? styles.inactiveText : ''}>
                                {bond.name}
                            </span>
                        </div>
                        <div className={styles.interestCell}>{bond.interest}</div>
                        <div>{bond.totalUnit}</div>
                        <div>{bond.available}</div>
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