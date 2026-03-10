import { useEffect, useState } from "react";
import { Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function Verifications() {
    // Placeholder data for now
    const [verifications, setVerifications] = useState([
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice@example.com",
            documentType: "Passport",
            status: "Pending",
            submittedAt: "2024-02-14T10:00:00Z",
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob@example.com",
            documentType: "Driver's License",
            status: "Pending",
            submittedAt: "2024-02-13T14:30:00Z",
        },
        {
            id: 3,
            name: "Charlie Brown",
            email: "charlie@example.com",
            documentType: "Student ID",
            status: "Rejected",
            submittedAt: "2024-02-12T09:15:00Z",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredVerifications = verifications.filter((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVerify = (id, status) => {
        setVerifications(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    };

    return (
        <div className="flex min-h-screen bg-[#F4F5F7]">
            <AdminSidebar />

            <main className="ml-64 p-8 w-full animate-fade-in">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Verifications</h1>
                    <p className="text-gray-500 mt-1">Review and approve user documents</p>
                </header>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border-none focus:ring-0 text-gray-600 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Document Type</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredVerifications.length > 0 ? (
                                filteredVerifications.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-adminGreen/10 text-adminGreen flex items-center justify-center font-medium text-sm">
                                                    {item.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-gray-400" />
                                                {item.documentType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(item.submittedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status === "Pending" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                            {item.status === "Approved" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    <CheckCircle size={12} /> Approved
                                                </span>
                                            )}
                                            {item.status === "Rejected" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                    <XCircle size={12} /> Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {item.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerify(item.id, "Rejected")}
                                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(item.id, "Approved")}
                                                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button className="text-gray-400 hover:text-adminGreen transition-colors text-xs font-medium border border-gray-200 rounded px-3 py-1.5 hover:border-adminGreen hover:bg-adminGreen/5">
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No verifications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
