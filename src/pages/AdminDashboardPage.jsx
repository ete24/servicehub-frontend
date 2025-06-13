// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboardPage.css';

const AdminDashboardPage = ({ admin, token }) => {
    const [pendingProviders, setPendingProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMessage, setActionMessage] = useState(''); // State for feedback messages

    // Function to fetch pending providers
    const fetchPendingProviders = useCallback(async () => {
        console.log("AdminDashboardPage: Fetching pending providers...");
        if (!token) {
            setError('Authentication token not found.');
            setLoading(false);
            console.log("AdminDashboardPage: No token for fetching.");
            return;
        }

        try {
            const response = await axios.get('http://localhost:5001/api/admin/providers/pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPendingProviders(response.data);
            setLoading(false);
            setError(null); // Clear any previous errors
            console.log("AdminDashboardPage: Pending providers fetched successfully:", response.data.length);
        } catch (err) {
            console.error('AdminDashboardPage: Error fetching pending providers:', err.response?.status, err.response?.data);
            setError('Failed to load pending providers. Please try again.');
            setLoading(false);
        }
    }, [token]); // Dependency array for useCallback

    // Effect to fetch providers on component mount and when token changes
    useEffect(() => {
        fetchPendingProviders();
    }, [fetchPendingProviders]); // Depend on the memoized function

    // Handler for approving a provider
    const handleApprove = async (providerId) => {
        setActionMessage(''); // Clear previous messages
        console.log(`AdminDashboardPage: Attempting to approve provider: ${providerId}`);
        try {
            // Changed from axios.post to axios.put to match backend route
            const response = await axios.put(`http://localhost:5001/api/admin/providers/approve/${providerId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setActionMessage(response.data.message || 'Provider approved successfully!');
            console.log('AdminDashboardPage: Approve API success response:', response.data);
            fetchPendingProviders(); // Re-fetch the list to update UI
        } catch (err) {
            console.error('AdminDashboardPage: Error approving provider (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to approve provider.');
        }
    };

    // Handler for rejecting a provider
    const handleReject = async (providerId) => {
        setActionMessage(''); // Clear previous messages
        console.log(`AdminDashboardPage: Attempting to reject provider: ${providerId}`);
        try {
            // Changed from axios.post to axios.put to match backend route
            const response = await axios.put(`http://localhost:5001/api/admin/providers/reject/${providerId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setActionMessage(response.data.message || 'Provider rejected successfully!');
            console.log('AdminDashboardPage: Reject API success response:', response.data);
            fetchPendingProviders(); // Re-fetch the list to update UI
        } catch (err) {
            console.error('AdminDashboardPage: Error rejecting provider (API call):', err.response?.status, err.response?.data);
            setActionMessage(err.response?.data?.error || 'Failed to reject provider.');
        }
    };

    // Log current state on every render for debugging
    console.log("AdminDashboardPage render: Admin:", admin?.email, "Token exists:", !!token);

    if (loading) {
        return <div className="admin-dashboard-message">Loading admin data...</div>;
    }

    if (error) {
        return <div className="admin-dashboard-error">Error: {error}</div>;
    }

    if (!admin) {
        return <div className="admin-dashboard-message">No admin user data available.</div>;
    }

    return (
        <div className="admin-dashboard-container">
            <h1>Welcome, Administrator!</h1>
            <p>Email: {admin.email}</p>
            {/* Display action feedback */}
            {actionMessage && <div className="action-message">{actionMessage}</div>}

            <h2>Pending Provider Applications</h2>
            {pendingProviders.length === 0 ? (
                <p>No pending provider applications at this time.</p>
            ) : (
                <div className="provider-list">
                    {pendingProviders.map(provider => (
                        <div key={provider.id} className="provider-card">
                            <h3>{provider.name}</h3>
                            <p>Email: {provider.email}</p>
                            <p>Plan: {provider.subscription_plan}</p>
                            <p>Status: <span className={`status-${provider.status}`}>{provider.status}</span></p>
                            <div className="provider-actions">
                                {/* Attach event handlers to buttons */}
                                <button
                                    className="btn-approve"
                                    onClick={() => {
                                        console.log('Approve button clicked for provider ID:', provider.id); // Debug log
                                        handleApprove(provider.id);
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => {
                                        console.log('Reject button clicked for provider ID:', provider.id); // Debug log
                                        handleReject(provider.id);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;