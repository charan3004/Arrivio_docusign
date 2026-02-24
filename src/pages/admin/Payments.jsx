import AdminSidebar from "../../components/admin/AdminSidebar";
import PaymentsTable from "../../components/admin/PaymentsTable";

export default function Payments() {
    return (
        <div className="flex min-h-screen bg-[#F4F5F7]">
            <AdminSidebar />

            <main className="ml-64 p-8 w-full animate-fade-in">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Payments</h1>
                    <p className="text-gray-500 mt-1">Manage transactions and refunds</p>
                </header>

                <PaymentsTable />
            </main>
        </div>
    );
}
