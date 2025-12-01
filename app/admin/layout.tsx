import AdminSidebar from '@/Components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#f8f9fe]">
            <AdminSidebar />
            <main className="flex-grow p-10">{children}</main>
        </div>
    );
}
