import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Banknote,
    FileText,
    LogOut,
    Menu,
    X,
    FlaskConical,
    Sprout
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Farmers', path: '/farmers', icon: <Users size={20} /> },
        { name: 'Stock', path: '/stock', icon: <Package size={20} /> },
        { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} /> },
        { name: 'Advances', path: '/advances', icon: <Banknote size={20} /> },
        { name: 'Samples', path: '/samples', icon: <FlaskConical size={20} /> },
        { name: 'Settlements', path: '/settlements', icon: <Sprout size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
                <div className="p-4 flex items-center justify-between border-b border-gray-700">
                    {isSidebarOpen && <span className="font-bold text-xl truncate">Farmer App</span>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    {isSidebarOpen && <span className="ml-3 truncate">{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center p-2 rounded-lg bg-slate-800 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.username}</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {navItems.find(i => i.path === location.pathname)?.name || 'Farmer Management System'}
                    </h1>
                </header>
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
