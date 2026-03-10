import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { CheckCircle, Clock, XCircle, Search, DollarSign, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentsTable() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPayments();
    }, []);

    async function fetchPayments() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("booking_intents")
                .select(`
          *,
          users(name, email),
          properties(title, city, price)
        `)
                .not('user_id', 'is', null) // Only show registered users
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, newStatus) {
        try {
            const { error } = await supabase
                .from("booking_intents")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            setPayments(prev =>
                prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
            );
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "success":
            case "paid":
                return "bg-green-100 text-green-700";
            case "refunded":
                return "bg-red-100 text-red-700";
            case "in progress":
            case "pending":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const filteredPayments = payments.filter(payment =>
        payment.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.properties?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adminGreen"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <DollarSign className="text-adminGreen" size={20} />
                    Payment History
                </h2>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-adminGreen/20 focus:border-adminGreen w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => {
                                // Calculate total amount (monthly + one-time)
                                const amount = (Number(payment.properties?.price) || 0) + 500; // Assuming 500 fee + rent

                                return (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-adminGreen/10 text-adminGreen flex items-center justify-center font-medium text-sm">
                                                    {(payment.users?.name || payment.users?.email || "G")[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{payment.users?.name || "Guest User"}</span>
                                                    <span className="text-xs text-gray-500">{payment.users?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 truncate max-w-[200px]" title={payment.properties?.title}>
                                                    {payment.properties?.title || "Unknown Property"}
                                                </span>
                                                <span className="text-xs text-gray-500">{payment.properties?.city}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            €{amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {payment.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block w-40">
                                                <select
                                                    value={payment.status || "Pending"}
                                                    onChange={(e) => updateStatus(payment.id, e.target.value)}
                                                    className={`block w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-adminGreen/20 focus:border-adminGreen appearance-none cursor-pointer ${payment.status === "Success" ? "bg-green-50 text-green-700 border-green-200" :
                                                        payment.status === "Refunded" ? "bg-red-50 text-red-700 border-red-200" :
                                                            "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                        }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Success">Success</option>
                                                    <option value="Refunded">Refunded</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No payments found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination Placeholder */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                <span>Showing {filteredPayments.length} of {payments.length} transactions</span>
                <div className="flex gap-2">
                    <button disabled className="px-3 py-1 border rounded bg-white text-gray-300 cursor-not-allowed">Previous</button>
                    <button disabled className="px-3 py-1 border rounded bg-white text-gray-300 cursor-not-allowed">Next</button>
                </div>
            </div >
        </div >
    );
}
