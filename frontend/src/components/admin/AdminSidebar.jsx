import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Users,
  BarChart,
  Settings,
  LogOut,
  DollarSign,
  CheckCircle // Added CheckCircle icon
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-adminGreen text-white fixed left-0 top-0" style={{ backgroundColor: '#243B33' }}>
      {/* LOGO */}
      <div className="p-6 text-lg font-semibold border-b border-white/20">
        ARRIVIO Admin
      </div>

      {/* NAV */}
      <nav className="mt-6 flex flex-col space-y-1">
        <SidebarLink to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <SidebarLink to="/admin/properties" icon={Home} label="Properties" />
        <SidebarLink to="/admin/tenants" icon={Users} label="Tenants" />
        <SidebarLink to="/admin/verifications" icon={CheckCircle} label="Verifications" />
        <SidebarLink to="/admin/users" icon={Users} label="Users" />
        <SidebarLink to="/admin/analytics" icon={BarChart} label="Analytics" />
        <SidebarLink to="/admin/payments" icon={DollarSign} label="Payments" />
        <SidebarLink to="/admin/settings" icon={Settings} label="Settings" />
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-6 w-full px-4">
        <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-white/10">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-3 transition ${isActive ? "bg-white/20" : "hover:bg-white/10"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
