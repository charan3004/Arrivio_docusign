import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { Search, Users, Mail, Phone, Calendar, Home, CheckCircle } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchTenants();
    }, []);

    async function fetchTenants() {
        setLoading(true);
        try {
            // Fetch bookings that are paid/successful to identify tenants
            const { data, error } = await supabase
                .from("booking_intents")
                .select(`
          *,
          users (
            id,
            name,
            email,
            phone,
            created_at
          ),
          properties (
            title,
            city
          )
        `)
                .in('status', ['Success', 'Paid', 'Active']) // Assuming these are tenant statuses
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTenants(data || []);
        } catch (error) {
            console.error("Error fetching tenants:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTenants = tenants.filter(tenant =>
        tenant.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#F4F5F7]">
            <AdminSidebar />

            <main className="ml-64 p-8 w-full animate-fade-in">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Tenants</h1>
                        <p className="text-gray-500 mt-1">Manage your tenants and their information</p>
                    </div>
                    <button className="bg-adminGreen text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
                        + Add Tenant
                    </button>
                </header>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tenants..."
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
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Move-in Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        Loading tenants...
                                    </td>
                                </tr>
                            ) : filteredTenants.length > 0 ? (
                                filteredTenants.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-adminGreen/10 text-adminGreen flex items-center justify-center font-medium text-sm">
                                                    {(item.users?.name || item.users?.email || "U")[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{item.users?.name || "Unknown User"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} /> {item.users?.email}
                                                </div>
                                                {item.users?.phone && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Phone size={14} /> {item.users?.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 flex items-center gap-1.5">
                                                    <Home size={14} className="text-gray-400" />
                                                    {item.properties?.title || "Unknown Property"}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-5">{item.properties?.city}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <CheckCircle size={12} />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(item.check_in).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-adminGreen transition-colors font-medium text-xs border border-gray-200 rounded px-3 py-1.5 hover:border-adminGreen hover:bg-adminGreen/5">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No tenants found matching your search.
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
