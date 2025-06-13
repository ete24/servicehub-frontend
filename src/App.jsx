// src/App.jsx
import React, { useState, useEffect } from 'react';
// Import Navigate from react-router-dom for cleaner protected routes
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProviderDashboard from './components/ProviderDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Assuming this component exists

import axios from 'axios';
import './App.css';

function App() {
    const [user, setUser] = useState(null); // This will hold the provider user data
    const [admin, setAdmin] = useState(null); // This will hold the admin user data
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    // Function to set authentication state for both provider and admin
    const setAuth = ({ isAuthenticated, user, token, role }) => {
        if (role === 'provider' && isAuthenticated) {
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.removeItem('adminToken'); // Ensure only one type of token is active
            setAdmin(null); // Clear admin state
        } else if (role === 'admin' && isAuthenticated) {
            setAdmin(user); // 'user' here is actually the 'admin' object from backend response
            localStorage.setItem('adminToken', token);
            localStorage.removeItem('token'); // Ensure only one type of token is active
            setUser(null); // Clear user state
        } else {
            // Logout scenario
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            setUser(null);
            setAdmin(null);
        }
    };

    // Function to check if provider is logged in
    const checkProviderLoginStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:5001/api/providers/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.provider);
            } catch (error) {
                console.error('Failed to fetch provider profile:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    };

    // Function to check if admin is logged in
    const checkAdminLoginStatus = async () => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            try {
                const decoded = JSON.parse(atob(adminToken.split('.')[1]));
                // Basic check for admin role from token payload
                if (decoded && decoded.is_admin) {
                    setAdmin({
                        id: decoded.id,
                        name: decoded.name || 'Administrator', // Use 'Administrator' if name not present in token
                        email: decoded.email,
                        is_admin: decoded.is_admin,
                        // Assuming these might also be in the token for display purposes if needed
                        subscription_plan: decoded.subscription_plan,
                        status: decoded.status
                    });
                } else {
                    // Token exists but is not an admin token or corrupted
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                }
            } catch (error) {
                console.error('Failed to verify admin token:', error);
                localStorage.removeItem('adminToken');
                setAdmin(null);
            }
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // Check admin status first, then provider status
            // This order helps prioritize which dashboard to show if both tokens somehow exist
            await checkAdminLoginStatus();
            await checkProviderLoginStatus();
            setLoadingUser(false);
        };
        initializeAuth();
    }, []);

    const handleLogout = () => {
        setAuth({ isAuthenticated: false, user: null, token: null, role: null });
        navigate('/login'); // Redirect to provider login after logout
    };

    if (loadingUser) {
        return <div className="loading-message">Loading user session...</div>;
    }

    return (
        <div>
            <nav className="navbar">
                <div className="nav-left">
                    <Link to="/" className="nav-link">Home</Link>
                    {user && (
                        <Link to="/provider/dashboard" className="nav-link">Provider Dashboard</Link>
                    )}
                    {admin && (
                        <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                    )}
                </div>
                <div className="nav-right">
                    {user || admin ? (
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    ) : (
                        <>
                            <Link to="/register" className="nav-link">Register</Link>
                            <Link to="/login" className="nav-link">Provider Login</Link>
                            <Link to="/admin-login" className="nav-link">Admin Login</Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="content-area">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Original Provider Login Page */}
                    <Route path="/login" element={<LoginPage setAuth={setAuth} />} />

                    {/* NEW ADMIN LOGIN PAGE ROUTE */}
                    <Route path="/admin-login" element={<AdminLoginPage setAuth={setAuth} />} />

                    {/* Conditional rendering for Provider Dashboard using Navigate */}
                    <Route
                        path="/provider/dashboard"
                        element={
                            user ? (
                                <ProviderDashboard provider={user} token={localStorage.getItem('token')} />
                            ) : (
                                // Redirect to /login if not a provider
                                <Navigate replace to="/login" />
                            )
                        }
                    />

                    {/* Conditional rendering for Admin Dashboard using Navigate */}
                    <Route
                        path="/admin"
                        element={
                            admin ? (
                                <AdminDashboardPage admin={admin} token={localStorage.getItem('adminToken')} />
                            ) : (
                                // Redirect to /admin-login if not an admin
                                <Navigate replace to="/admin-login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;