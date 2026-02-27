import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Save, User, Lock, Bell, Mail } from "lucide-react";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="flex min-h-screen bg-[#F4F5F7]">
            <AdminSidebar />

            <main className="ml-64 p-8 w-full">
                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account and preferences</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row min-h-[600px]">
                        {/* Sidebar Navigation */}
                        <aside className="w-full md:w-64 border-r border-gray-100 bg-gray-50/50 p-4">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("general")}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "general"
                                        ? "bg-white text-adminGreen shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                        }`}
                                >
                                    <User size={18} />
                                    General
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "security"
                                        ? "bg-white text-adminGreen shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                        }`}
                                >
                                    <Lock size={18} />
                                    Security
                                </button>
                                <button
                                    onClick={() => setActiveTab("notifications")}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === "notifications"
                                        ? "bg-white text-adminGreen shadow-sm"
                                        : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                                        }`}
                                >
                                    <Bell size={18} />
                                    Notifications
                                </button>
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1 p-8">
                            {activeTab === "general" && <GeneralSettings />}
                            {activeTab === "security" && <SecuritySettings />}
                            {activeTab === "notifications" && <NotificationSettings />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function GeneralSettings() {
    return (
        <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">General Information</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                        type="text"
                        defaultValue="Admin User"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="email"
                            defaultValue="admin@arrivio.com"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all">
                        <option>UTC (Coordinated Universal Time)</option>
                        <option>EST (Eastern Standard Time)</option>
                        <option>PST (Pacific Standard Time)</option>
                    </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-2 bg-adminGreen text-white rounded-lg hover:bg-opacity-90 transition-colors">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-adminGreen focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-2 bg-adminGreen text-white rounded-lg hover:bg-opacity-90 transition-colors">
                        <Save size={18} />
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>

            <div className="space-y-4">
                {[
                    "Email me when a new booking is made",
                    "Email me when a user signs up",
                    "Email me with weekly summary reports",
                    "Notify me about system updates",
                ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-adminGreen"></div>
                        </label>
                    </div>
                ))}

                <div className="pt-4 border-t border-gray-100 mt-6">
                    <button className="flex items-center gap-2 px-6 py-2 bg-adminGreen text-white rounded-lg hover:bg-opacity-90 transition-colors">
                        <Save size={18} />
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
}
