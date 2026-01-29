import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Users,
    ShoppingCart,
    Banknote,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching dashboard stats", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading stats...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Farmers</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats?.total_farmers || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹ {stats?.total_sales_amount?.toLocaleString() || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mr-4">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Advances Given</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹ {stats?.total_advances_given?.toLocaleString() || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Stock Value</p>
                        <h3 className="text-sm font-semibold text-gray-800">
                            Pest: {stats?.stock_summary?.Pesticide || 0} | Fert: {stats?.stock_summary?.Fertilizer || 0}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Stock Overview</h3>
                    <div className="space-y-4">
                        {/* Simple visual representation */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Pesticides</span>
                                <span className="text-sm font-medium text-gray-700">{stats?.stock_summary?.Pesticide || 0} Units</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Fertilizers</span>
                                <span className="text-sm font-medium text-gray-700">{stats?.stock_summary?.Fertilizer || 0} Units</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <div className="bg-indigo-50 p-4 rounded-full mb-3 text-indigo-600">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Actions Required</h3>
                    <p className="text-gray-500 text-sm">
                        Check pending sample tests and payment settlements to keep operations smooth.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
