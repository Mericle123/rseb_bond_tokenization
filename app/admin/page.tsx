import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { IoSearch, IoDocumentTextOutline } from 'react-icons/io5';
import { FaPlus, FaSackDollar } from 'react-icons/fa6';
import { FaUserFriends } from 'react-icons/fa';
import { BsFileEarmarkTextFill } from 'react-icons/bs';

// Dummy data for the table - replace with your actual data later
const activeOfferings = [
    { id: 1, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000' },
    { id: 2, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000' },
    { id: 3, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000' },
    { id: 4, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000' },
    { id: 5, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000' },
    { id: 6, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '1000/1000' },
    { id: 7, name: 'RICB Bond', created: '2025-10-01', interest: '+ 5% yr', totalUnit: 1000, available: '900/1000' },
];

const AdminHomePage = () => {
    return (
        <div className={styles.container}>
            {/* System Overview Section */}
            <h1 className={styles.title}>System Overview</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#E4E2FB' }}><BsFileEarmarkTextFill color="#5A4BDA" /></div>
                    <div>
                        <p className={styles.statLabel}>Total Active Offerings</p>
                        <p className={styles.statValue}>10</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#E4E2FB' }}><FaSackDollar color="#5A4BDA" /></div>
                    <div>
                        <p className={styles.statLabel}>Total Active Offerings</p>
                        <p className={styles.statValue}>Nu 10 K</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#E4E2FB' }}><FaUserFriends color="#5A4BDA" /></div>
                    <div>
                        <p className={styles.statLabel}>Total Registered Users</p>
                        <p className={styles.statValue}>10,000</p>
                    </div>
                </div>
            </div>

            {/* Active Offerings Section */}
            <div className={styles.offeringsHeader}>
                <h2 className={styles.subtitle}>Active Offerings</h2>
                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <IoSearch className={styles.searchIcon} />
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <Link href="/admin/create-bond" className={styles.createButton}>
                        Create Bond <FaPlus />
                    </Link>
                </div>
            </div>

            {/* Offerings Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>Bond</div>
                    <div>Created</div>
                    <div>Interest Rate</div>
                    <div>Total Unit offered</div>
                    <div>Unit available</div>
                    <div>Action</div>
                </div>
                {activeOfferings.map((bond) => (
                    <div key={bond.id} className={styles.tableRow}>
                        <div className={styles.bondCell}>
                            <div className={styles.bondIconWrapper}>
                                <Image src="/logo.png" alt="Bond Icon" width={32} height={32} />
                                <div className={styles.availabilityDot}></div>
                            </div>
                            <span>{bond.name}</span>
                        </div>
                        <div>{bond.created}</div>
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

export default AdminHomePage;