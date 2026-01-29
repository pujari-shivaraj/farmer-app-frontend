import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Stock from './pages/Stock';
import Sales from './pages/Sales';
import Advances from './pages/Advances';
import Samples from './pages/Samples';
import Settlements from './pages/Settlements';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="farmers" element={<Farmers />} />
                        <Route path="stock" element={<Stock />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="advances" element={<Advances />} />
                        <Route path="samples" element={<Samples />} />
                        <Route path="settlements" element={<Settlements />} />
                        <Route path="reports" element={<Reports />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
