// src/pages/AdminLoginPage.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Use the custom useAuth hook

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth(); // Access login function and user from AuthContext

    useEffect(() => {
        setError('');
        console.log('AdminLoginPage: Mounted. Current user:', user); // Debug log
        if (user && user.role === 'admin') { // Check if already logged in as admin
            console.log('AdminLoginPage: Already logged in as admin, navigating to dashboard.');
            navigate('/admin/dashboard');
        }
    }, [user, navigate]); // Depend on user and navigate for automatic redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('AdminLoginPage: Attempting admin login for email:', email); // Debug log

        try {
            const response = await axios.post('http://localhost:5001/api/admin/login', {
                email,
                password,
            });

            console.log('AdminLoginPage: Backend login response received:', response.data); // Debug log

            const { token, admin } = response.data; // Assuming backend returns token and admin data
            // The admin token payload should ideally already contain { role: 'admin' }
            login(token, { ...admin, role: 'admin' }); // Ensure role is set in AuthContext's user state

            console.log('AdminLoginPage: Admin login successful. Navigating to /admin/dashboard.');
            navigate('/admin/dashboard'); // Redirect to admin dashboard

        } catch (err) {
            console.error('AdminLoginPage: Admin login error caught:', err); // Log full error object
            if (err.response) {
                console.error('AdminLoginPage: Error response data:', err.response.data);
                console.error('AdminLoginPage: Error response status:', err.response.status);
                setError(err.response.data.error || err.response.data.message || 'An unexpected error occurred during admin login. Please try again.');
            } else if (err.request) {
                setError('No response from server. Please check your internet connection or try again later.');
            } else {
                setError('Error setting up the admin login request. Please try again.');
            }
        } finally {
            setLoading(false);
            console.log('AdminLoginPage: Loading state set to false.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <div className="mb-4">
                        <label htmlFor="adminEmail" className="block text-gray-700 text-sm font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="adminEmail"
                            name="adminEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="adminPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="adminPassword"
                            name="adminPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
