import AdminSidebar from "@/Components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // This div uses Tailwind classes for layout
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-2 sm:p-4">
                {children}
            </main>
        </div>
    );
}