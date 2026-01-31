import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-serif text-[#2C3E30] mb-4">Please log in to view your profile</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-[#2C3E30] text-[#EAE8E4] rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#2C3E30]/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 border-b border-[#2C3E30]/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C3E30] mb-2">My Profile</h1>
            <p className="text-[#2C3E30]/60 font-sans">Manage your account settings and preferences</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#2C3E30]/20 font-sans text-[10px] font-bold uppercase tracking-widest text-[#2C3E30] hover:bg-[#2C3E30] hover:text-[#EAE8E4] transition-all duration-300 group"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Personal Information */}
          <div className="space-y-8">
            <h2 className="text-xl font-serif text-[#2C3E30]">Personal Information</h2>
            
            <div className="flex items-start gap-4 p-4 bg-[#EAE8E4]/30 rounded-xl">
              <div className="p-3 bg-white rounded-full shadow-sm text-[#2C3E30]">
                <User size={20} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50 mb-1">Full Name</label>
                <p className="text-lg text-[#2C3E30] font-medium">{user.full_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#EAE8E4]/30 rounded-xl">
              <div className="p-3 bg-white rounded-full shadow-sm text-[#2C3E30]">
                <Mail size={20} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50 mb-1">Email Address</label>
                <p className="text-lg text-[#2C3E30] font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#EAE8E4]/30 rounded-xl">
              <div className="p-3 bg-white rounded-full shadow-sm text-[#2C3E30]">
                <Shield size={20} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2C3E30]/50 mb-1">Account Type</label>
                <p className="text-lg text-[#2C3E30] font-medium capitalize">{user.role || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Additional Section (Placeholder for future) */}
          <div className="bg-[#EAE8E4]/20 rounded-2xl p-8 border border-[#2C3E30]/5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-[#2C3E30]/5 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-[#2C3E30]/40" />
             </div>
             <h3 className="text-lg font-serif text-[#2C3E30] mb-2">Member Since</h3>
             <p className="text-[#2C3E30]/60">Your journey with Arrivio started recently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
