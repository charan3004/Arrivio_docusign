import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Users, BarChart3, Settings, LogOut } from 'lucide-react';

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Home, label: 'Properties', path: '/admin/properties' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-[#2F5D50] text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-[#3e7565]">
        <h1 className="text-2xl font-bold font-heading">ARRIVIO Admin</h1>
        <p className="text-xs text-white/60 mt-1">Administration Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#3e7565] text-white shadow-sm' 
                  : 'text-white/70 hover:bg-[#3e7565]/50 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#3e7565]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:bg-[#3e7565]/50 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
