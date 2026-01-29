import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Ensure token is not expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    // Need to store role and username as well
                    // We can decode from token or fetch from /auth/me
                    // For simplicity, let's decode.
                    setUser({
                        username: decoded.sub,
                        role: decoded.role // We need to make sure backend includes role in token or we fetch me
                    });
                    // Actually, backend main.py:login returns token with role in response body, 
                    // but not necessarily inside encoded token payload unless we put it there.
                    // Let's check auth.py:create_access_token. It only puts sub and exp.
                    // We should trust the backend response on login or fetch /auth/me.
                    // Let's fetch /auth/me to be safe and get full details.
                    fetchUser();
                }
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user", err);
            logout();
        }
    };

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
        // Force a fetch to ensure we have latest data
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
