import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { motion } from "framer-motion";
import { Users as UsersIcon, ShieldCheck } from "lucide-react";

import { useLocation } from "react-router-dom"; // unused but keep if needed, or just clean up
import AdminSidebar from "../../components/admin/AdminSidebar";
import UserDetailsModal from "../../components/admin/users/UserDetailsModal";

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [normalUsers, setNormalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);

      const [usersRes, profilesRes] = await Promise.all([
        supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase.from("profiles").select("id"),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (profilesRes.error) throw profilesRes.error;

      const users = usersRes.data || [];
      const adminIds = new Set(profilesRes.data.map((p) => p.id));

      setAdmins(users.filter((u) => adminIds.has(u.id)));
      setNormalUsers(users.filter((u) => !adminIds.has(u.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // TABLE COMPONENT (Tailwind)
  // =========================
  const Table = ({ title, users, isAdmin }) => (
    <div className="mb-10">
      {/* section header */}
      <div className="flex items-center gap-2 mb-4">
        {isAdmin && <ShieldCheck size={18} className="text-green-600" />}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="text-xs text-gray-400">({users.length})</span>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-6 text-sm text-gray-400">No users</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Provider</th>
                <th className="p-4 text-left font-medium">Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-medium text-gray-900">
                    {user.name || "—"}
                  </td>

                  <td className="p-4 text-gray-600">{user.email}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 capitalize">
                      {user.provider || "email"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // =========================
  // UI
  // =========================
  return (
    <>
      <AdminSidebar />

      <div className="ml-64 min-h-screen bg-gray-50 p-8">
        {/* header */}
        <div className="flex items-center gap-3 mb-8">
          <UsersIcon className="text-gray-700" />
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading users...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Table title="Admins" users={admins} isAdmin />
            <Table title="Normal Users" users={normalUsers} />
          </motion.div>
        )}

        {/* MODAL */}
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </>
  );
}
