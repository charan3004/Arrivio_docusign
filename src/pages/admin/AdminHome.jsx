import React, { useState, useEffect } from 'react';
import { Users, Home, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const AdminHome = () => {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    revenue: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch Properties (Public endpoint, but we just need count)
        const propsRes = await fetch(`${API_BASE_URL}/properties`);
        const propsData = await propsRes.json();
        const propertyCount = Array.isArray(propsData) ? propsData.length : 0;

        // Fetch Users (Admin endpoint)
        let userCount = 0;
        try {
          const usersRes = await fetch(`${API_BASE_URL}/users`, { headers });
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            userCount = Array.isArray(usersData) ? usersData.length : 0;
          }
        } catch (error) {
          console.error("Failed to fetch users", error);
        }

        setStats({
          properties: propertyCount,
          users: userCount,
          revenue: 0, // Not implemented yet
          bookings: 0 // Not implemented yet
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Properties', value: stats.properties.toString(), icon: Home, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.users.toString(), icon: Users, color: 'bg-green-500' },
    { label: 'Revenue (Month)', value: `$${stats.revenue}`, icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Active Bookings', value: stats.bookings.toString(), icon: Calendar, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your platform's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.label}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {loading ? '...' : item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="flow-root">
             {/* Empty state for now as we don't have activity logs */}
             <div className="text-center py-8 text-gray-500">
                <p>No recent activity.</p>
             </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No revenue data available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
