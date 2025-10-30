import AdminSidebar from '@/Components/AdminSidebar';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layoutContainer}>
            <AdminSidebar />
            <main className={styles.mainContent}>{children}</main>
        </div>
    );
}