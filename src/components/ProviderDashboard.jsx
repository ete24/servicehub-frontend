// src/components/ProviderDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Import your CSS file for ProviderDashboard
import './ProviderDashboard.css'; 

// Define your API base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Helper for image limit per plan (moved outside component to avoid re-creation)
const getImageLimit = (plan) => {
    switch (plan) {
        case 'Free': return 1; // Corrected: Should be 1 image for free tier
        case 'Basic Pro': return 3; // Corrected: Should be 3 images for basic pro
        case 'Premium Pro': 
        case 'Elite Pro': return 10; 
        default: return 0;
    }
};

// Helper for service limit per plan (moved outside component to avoid re-creation)
const getServiceLimit = (plan) => {
    switch (plan) {
        case 'Free': return 1;
        case 'Basic Pro': return 3;
        case 'Premium Pro': return 10;
        case 'Elite Pro': return Infinity;
        default: return 0;
    }
};

// Component for Provider Profile Management
const ProviderProfile = ({ profile, token, onProfileUpdate }) => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editProfileForm, setEditProfileForm] = useState({
        name: profile.name || '',
        email: profile.email || ''
    });
    const [profileMessage, setProfileMessage] = useState('');
    const [loadingProfileUpdate, setLoadingProfileUpdate] = useState(false);

    useEffect(() => {
        setEditProfileForm({
            name: profile.name || '',
            email: profile.email || ''
        });
    }, [profile]); // Update form when profile prop changes

    const handleProfileFormChange = (e) => {
        const { name, value } = e.target;
        setEditProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        setLoadingProfileUpdate(true);

        if (!editProfileForm.name.trim() || !editProfileForm.email.trim()) {
            setProfileMessage({ type: 'error', text: 'Name and Email cannot be empty.' });
            setLoadingProfileUpdate(false);
            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/providers/profile`, editProfileForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileMessage({ type: 'success', text: response.data.message || 'Profile updated successfully!' });
            setIsEditingProfile(false);
            onProfileUpdate(); // Callback to parent to re-fetch profile data
        } catch (err) {
            console.error('Error updating profile:', err.response?.data || err.message);
            setProfileMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
        } finally {
            setLoadingProfileUpdate(false);
        }
    };

    return (
        <div className="provider-profile-section p-6 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h3>
            {profileMessage && (
                <p className={`form-message mb-4 p-3 rounded-md text-center ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {profileMessage.text}
                </p>
            )}

            {!isEditingProfile ? (
                <>
                    <p className="text-lg text-gray-700"><strong>Name:</strong> {profile.name}</p>
                    <p className="text-lg text-gray-700"><strong>Email:</strong> {profile.email}</p>
                    <p className="text-lg text-gray-700"><strong>Plan:</strong> <span className="font-semibold text-blue-600">{profile.subscription_plan}</span></p>
                    <p className="text-lg text-gray-700"><strong>Status:</strong> <span className={`font-semibold ${profile.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>{profile.status}</span></p>
                    {profile.profile_picture_url ? (
                        <img src={profile.profile_picture_url} alt="Profile" className="w-24 h-24 rounded-full object-cover mt-4" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm mt-4">No Image</div>
                    )}

                    <button 
                        onClick={() => setIsEditingProfile(true)} 
                        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={() => alert("Upgrade subscription functionality coming soon!")} 
                        className="mt-6 ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition"
                    >
                        Upgrade Subscription
                    </button>
                </>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button className="modal-close-button absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none" onClick={() => setIsEditingProfile(false)}>&times;</button>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h3>
                        {profileMessage && (
                            <p className={`form-message mb-4 p-3 rounded-md text-center ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {profileMessage.text}
                            </p>
                        )}
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="profile-name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                <input
                                    type="text"
                                    id="profile-name"
                                    name="name"
                                    value={editProfileForm.name}
                                    onChange={handleProfileFormChange}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    id="profile-email"
                                    name="email"
                                    value={editProfileForm.email}
                                    onChange={handleProfileFormChange}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-actions flex justify-end space-x-4 mt-6">
                                <button type="submit" className="primary-button button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition" disabled={loadingProfileUpdate}>
                                    {loadingProfileUpdate ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="secondary-button button bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition" onClick={() => setIsEditingProfile(false)} disabled={loadingProfileUpdate}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Component for Provider Message Management
const ProviderMessages = ({ providerId, token }) => {
    const [conversations, setConversations] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messageError, setMessageError] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [replyMessage, setReplyMessage] = useState(null);

    const fetchConversations = async () => {
        setLoadingMessages(true);
        setMessageError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/providers/messages/my-conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedConversations = response.data;
            setConversations(fetchedConversations);
            // If an active conversation was selected, try to re-select it to refresh its messages
            if (activeConversation) {
                const updatedActiveConv = fetchedConversations.find(conv => conv.id === activeConversation.id);
                setActiveConversation(updatedActiveConv || null);
            } else if (fetchedConversations.length > 0) {
                setActiveConversation(fetchedConversations[0]); // Select first conversation by default if none active
            }
        } catch (err) {
            console.error('Error fetching conversations:', err.response?.data || err.message);
            setMessageError('Failed to load messages.');
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (providerId && token) {
            fetchConversations();
            // Set up an interval to refresh messages every 15 seconds
            const interval = setInterval(fetchConversations, 15000);
            return () => clearInterval(interval); // Clear interval on unmount
        }
    }, [providerId, token]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setSendingReply(true);
        setReplyMessage(null);

        if (!replyContent.trim()) {
            setReplyMessage({ type: 'error', text: 'Reply cannot be empty.' });
            setSendingReply(false);
            return;
        }
        if (!activeConversation) {
            setReplyMessage({ type: 'error', text: 'No active conversation selected.' });
            setSendingReply(false);
            return;
        }

        try {
            // The receiver is the 'other_party' in the current active conversation
            const receiverId = activeConversation.other_party_id; // Will be null for seeker-initiated unauth chats
            const receiverRole = activeConversation.other_party_role; // 'seeker', 'admin', 'provider'
            const receiverContact = activeConversation.messages[0].sender_contact; // Original seeker's contact for replies

            const payload = {
                receiverId: receiverId, 
                receiverRole: receiverRole,
                content: replyContent,
                parentMessageId: activeConversation.messages[0].id, // Reply to the initial message of the thread
                receiverContact: receiverRole === 'seeker' ? receiverContact : null // Only send contact for seeker replies
            };

            await axios.post(`${API_BASE_URL}/providers/messages`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setReplyContent('');
            setReplyMessage({ type: 'success', text: 'Reply sent successfully!' });
            fetchConversations(); // Re-fetch to update conversations
        } catch (err) {
            console.error('Error sending reply:', err.response?.data || err.message);
            setReplyMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send reply.' });
        } finally {
            setSendingReply(false);
        }
    };

    const getMessageSenderDisplayName = (message) => {
        if (message.sender_id === providerId) {
            return "You"; // Message sent by the current provider
        } else if (message.sender_role === 'seeker' && message.sender_contact) {
            return message.sender_contact; // Seeker's contact if they were the sender
        } else if (message.sender_email) {
            return message.sender_email.split('@')[0]; // Authenticated user's email prefix
        }
        return "Unknown";
    };

    return (
        <div className="provider-messages-section p-6 bg-white rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">My Messages</h3>
            {loadingMessages && <p className="text-center text-gray-600">Loading messages...</p>}
            {messageError && <p className="text-center text-red-500">Error: {messageError}</p>}
            {!loadingMessages && !messageError && conversations.length === 0 && (
                <p className="text-center text-gray-600">No conversations found.</p>
            )}

            {!loadingMessages && !messageError && conversations.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 h-[600px]"> {/* Fixed height for scrollable areas */}
                    {/* Conversation List (Left Panel) */}
                    <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-inner overflow-y-auto custom-scrollbar">
                        <h4 className="font-semibold text-lg mb-3 border-b pb-2 text-gray-800">Conversations</h4>
                        {conversations.map((conv) => (
                            <div 
                                key={conv.id} 
                                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-blue-100 rounded-md ${activeConversation?.id === conv.id ? 'bg-blue-200' : ''}`}
                                onClick={() => setActiveConversation(conv)}
                            >
                                <p className="font-medium text-gray-900 truncate">{conv.other_party_display || 'New Inquiry'}</p>
                                <p className="text-sm text-gray-600 line-clamp-1">{conv.messages[conv.messages.length - 1]?.content || conv.subject}</p>
                                <p className="text-xs text-gray-500 text-right">{new Date(conv.last_message_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Message Thread (Right Panel) */}
                    <div className="md:w-2/3 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col">
                        {activeConversation ? (
                            <>
                                <h4 className="font-semibold text-lg mb-3 border-b pb-2 text-gray-800">
                                    Conversation with: {activeConversation.other_party_display}
                                </h4>
                                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                    {activeConversation.messages.map((message) => (
                                        <div 
                                            key={message.id} 
                                            className={`mb-3 p-3 rounded-lg ${message.sender_id === providerId ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-200 mr-auto text-left'} max-w-[80%]`}
                                            style={{ maxWidth: '80%' }}
                                        >
                                            <p className="font-medium text-sm text-gray-700">
                                                {getMessageSenderDisplayName(message)}
                                                <span className="text-xs text-gray-500 ml-2">{new Date(message.sent_at).toLocaleString()}</span>
                                            </p>
                                            {message.service_description && message.sender_role === 'seeker' && (
                                                <p className="text-xs text-blue-800 font-semibold mb-1">
                                                    Inquiry about: {message.service_description}
                                                </p>
                                            )}
                                            <p className="text-gray-800">{message.content}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendMessage} className="mt-4 border-t pt-4">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Type your reply here..."
                                        rows="3"
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition mb-2"
                                        disabled={sendingReply}
                                    ></textarea>
                                    <button 
                                        type="submit" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition"
                                        disabled={sendingReply}
                                    >
                                        {sendingReply ? 'Sending...' : 'Send Reply'}
                                    </button>
                                    {replyMessage && (
                                        <p className={`mt-2 text-sm ${replyMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {replyMessage.text}
                                        </p>
                                    )}
                                </form>
                            </>
                        ) : (
                            <p className="text-center text-gray-600 flex-grow flex items-center justify-center">Select a conversation to view messages.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


const ProviderDashboard = ({ provider, token }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [providerProfile, setProviderProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('services'); // State for active tab: 'services', 'messages', 'profile'

    const [isModalOpen, setIsModalOpen] = useState(false); // State for Add/Edit Service modal

    const [serviceForm, setServiceForm] = useState({
        name: '', category: '', description: '', price: '',
        availability: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
        image_urls: '', 
    });
    const [isEditing, setIsEditing] = useState(false); // State to check if editing an existing service
    const [editServiceId, setEditServiceId] = useState(null); // ID of service being edited
    const [formMessage, setFormMessage] = useState(''); // Message after form submission

    const serviceLimit = providerProfile && providerProfile.subscription_plan 
                         ? getServiceLimit(providerProfile.subscription_plan) 
                         : 0;
    const imageLimit = providerProfile && providerProfile.subscription_plan 
                       ? getImageLimit(providerProfile.subscription_plan)
                       : 0;

    // --- Data Fetching: Provider Profile and Services ---
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        setFormMessage(''); // Clear any previous form messages

        try {
            const profileResponse = await axios.get(`${API_BASE_URL}/providers/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProviderProfile(profileResponse.data.provider); // Assuming response.data.provider structure
            
            const servicesResponse = await axios.get(`${API_BASE_URL}/providers/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : []);
            
        } catch (err) {
            console.error('ProviderDashboard: Error fetching dashboard data:', err);
            setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [token]); // Re-fetch data when token changes

    // Handle form changes for Add/Edit Service
    const handleServiceFormChange = (e) => {
        const { name, value, type } = e.target;
        if (name.startsWith('availability.')) {
            const day = name.split('.')[1];
            setServiceForm(prev => ({
                ...prev,
                availability: { ...prev.availability, [day]: value }
            }));
        } else {
            setServiceForm(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
            }));
        }
    };

    // Handle form submission for Add/Edit Service
    const handleServiceFormSubmit = async (e) => {
        e.preventDefault();
        setFormMessage('');

        if (!serviceForm.name || !serviceForm.category || !serviceForm.description || !serviceForm.price) {
            setFormMessage('Please fill in all required fields (Name, Category, Description, Price).');
            return;
        }
        if (isNaN(parseFloat(serviceForm.price)) || parseFloat(serviceForm.price) < 0) {
            setFormMessage('Price must be a valid non-negative number.');
            return;
        }

        if (!isEditing && services.length >= serviceLimit && serviceLimit !== Infinity) {
            setFormMessage(`You have reached your service limit (${serviceLimit}) for the '${providerProfile.subscription_plan}' plan. Consider upgrading!`);
            return;
        }

        const imageUrlsArray = serviceForm.image_urls
            .split(',')
            .map(url => url.trim())
            .filter(url => url !== ''); 

        if (imageUrlsArray.length > imageLimit) {
            setFormMessage(`Your plan (${providerProfile.subscription_plan}) allows a maximum of ${imageLimit} image(s) per service. You have provided ${imageUrlsArray.length}.`);
            return;
        }

        try {
            let response;
            const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
            const payload = { ...serviceForm, availability: serviceForm.availability, image_urls: imageUrlsArray };

            if (isEditing) {
                response = await axios.put(`${API_BASE_URL}/services/${editServiceId}`, payload, config); 
            } else {
                response = await axios.post(`${API_BASE_URL}/services`, payload, config); 
            }

            let successMsg = response.data.message || 'Service saved successfully!';
            setFormMessage(successMsg);
            
            fetchDashboardData(); // Re-fetch all data to ensure lists are updated
            resetServiceForm();
            setIsEditing(false);
            setEditServiceId(null);
            setIsModalOpen(false); 

        } 
        catch (err) {
            console.error('Error saving service:', err);
            setFormMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to save service.');
        }
    };

    // Handle service editing (populates form and opens modal)
    const handleEditService = (service) => {
        const availabilityForForm = {};
        Object.keys(serviceForm.availability).forEach(day => {
            availabilityForForm[day] = service.availability?.[day] || '';
        });

        setServiceForm({
            name: service.name,
            category: service.category,
            description: service.description,
            price: service.price,
            availability: availabilityForForm,
            image_urls: Array.isArray(service.image_urls) ? service.image_urls.join(', ') : '',
        });
        setIsEditing(true);
        setEditServiceId(service.id);
        setFormMessage('');
        setIsModalOpen(true); 
    };

    // Handle service deletion
    const handleDeleteService = async (serviceId) => {
        // IMPORTANT: Replace window.confirm with a custom modal in a real app
        const userConfirmed = window.confirm("Are you sure you want to request deletion for this service?"); 
        if (userConfirmed) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/services/${serviceId}`, { 
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormMessage(response.data.message || 'Service deletion processed.');
                fetchDashboardData(); // Re-fetch all data
            } catch (err) {
                console.error('Error deleting service:', err.response?.data || err.message);
                setFormMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to delete service.');
            }
        }
    };

    // Close the service form modal
    const handleCloseServiceModal = () => { 
        resetServiceForm();
        setIsEditing(false);
        setEditServiceId(null);
        setFormMessage('');
        setIsModalOpen(false); 
    };

    // Reset service form fields
    const resetServiceForm = () => {
        setServiceForm({
            name: '', category: '', description: '', price: '',
            availability: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
            image_urls: '',
        });
    };

    if (loading) {
        return <div className="loading-message text-center text-xl text-gray-600 mt-20">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="error-message text-center text-xl text-red-600 mt-20">Error: {error}</div>;
    }

    if (!providerProfile) {
        return <div className="loading-message text-center text-xl text-gray-600 mt-20">Provider profile not found. Please try logging in again.</div>;
    }

    return (
        <div className="provider-dashboard-container p-8 bg-white shadow-lg rounded-lg max-w-5xl mx-auto mt-10">
            <h2 className="dashboard-title text-3xl font-bold text-gray-800 mb-4 text-center">Provider Dashboard</h2>
            <p className="welcome-message text-lg text-gray-700 mb-2 text-center">Welcome, {providerProfile.name || providerProfile.email}!</p>
            <p className="subscription-info text-md text-gray-600 mb-6 text-center">
                Your Current Plan: <strong className="text-blue-600">{providerProfile.subscription_plan}</strong> -
                Services: {`${services.length}/${serviceLimit === Infinity ? 'Unlimited' : serviceLimit}`}
                {services.length >= serviceLimit && serviceLimit !== Infinity && (
                    <span className="limit-warning text-red-500 font-semibold"> (You've reached your service limit. Consider upgrading!)</span>
                )}
            </p>
            
            <button 
                onClick={logout} 
                className="logout-button w-full bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition mb-6"
            >
                Logout
            </button>

            <hr className="my-6 border-gray-300"/>

            {/* Dashboard Navigation Tabs */}
            <div className="flex justify-center border-b border-gray-200 mb-6">
                <button 
                    className={`px-6 py-3 text-lg font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('services')}
                >
                    My Services
                </button>
                <button 
                    className={`px-6 py-3 text-lg font-medium ${activeTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                </button>
                <button 
                    className={`px-6 py-3 text-lg font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
            </div>

            {/* Conditional Rendering based on activeTab */}
            {activeTab === 'services' && (
                <div className="my-services-section dashboard-section">
                    <button 
                        onClick={() => {
                            setIsModalOpen(true); 
                            resetServiceForm(); 
                            setIsEditing(false); 
                            setEditServiceId(null);
                            setFormMessage(''); 
                        }}
                        className="primary-button button add-service-toggle-button w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition mb-6"
                    >
                        Add New Service
                    </button>

                    {/* Service Form MODAL */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"> 
                            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <button className="modal-close-button absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none" onClick={handleCloseServiceModal}>&times;</button> 
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
                                {formMessage && <p className={`form-message mb-4 p-3 rounded-md text-center ${formMessage.includes('successfully') || formMessage.includes('submitted') || formMessage.includes('approval') || formMessage.includes('requested') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formMessage}</p>}
                                
                                <form onSubmit={handleServiceFormSubmit} className="service-form space-y-4">
                                    <div className="form-group">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Service Name:</label>
                                        <input type="text" id="name" name="name" value={serviceForm.name} onChange={handleServiceFormChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                        <input type="text" id="category" name="category" value={serviceForm.category} onChange={handleServiceFormChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                        <textarea id="description" name="description" value={serviceForm.description} onChange={handleServiceFormChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                                        <input type="number" id="price" name="price" value={serviceForm.price} onChange={handleServiceFormChange} step="0.01" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image_urls" className="block text-gray-700 text-sm font-bold mb-2">Image URLs (comma-separated, max {imageLimit} for your plan):</label>
                                        <input 
                                            type="text" 
                                            id="image_urls" 
                                            name="image_urls" 
                                            value={serviceForm.image_urls} 
                                            onChange={handleServiceFormChange} 
                                            placeholder="e.g., url1, url2, url3"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" 
                                        />
                                        {serviceForm.image_urls.split(',').filter(url => url.trim() !== '').length > imageLimit && (
                                            <p className="text-red-500 text-xs mt-1">You have exceeded your image limit for this plan ({imageLimit}).</p>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label className="block-label text-gray-700 text-sm font-bold mb-2">Availability:</label>
                                        <p className="hint-text text-gray-500 text-sm mb-2">Enter time range (e.g., "9am-5pm") or "Closed" for each day.</p>
                                        {Object.keys(serviceForm.availability).map(day => (
                                            <div key={day} className="availability-day-input-row flex items-center space-x-2 mb-2">
                                                <label htmlFor={`availability-${day}`} className="capitalize text-gray-700 w-1/3">{day}:</label>
                                                <input
                                                    type="text"
                                                    id={`availability-${day}`}
                                                    name={`availability.${day}`}
                                                    value={serviceForm.availability[day]}
                                                    onChange={handleServiceFormChange}
                                                    placeholder="e.g. 9am-5pm or Closed"
                                                    className="availability-time-input shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="form-actions flex justify-end space-x-4 mt-6">
                                        <button type="submit" className="primary-button button bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition">
                                            {isEditing ? 'Update Service' : 'Add Service'}
                                        </button>
                                        <button type="button" className="secondary-button button bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition" onClick={handleCloseServiceModal}> 
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Services</h3>
                    {services.length === 0 ? (
                        <p className="no-services-message text-center text-gray-600">You have not added any services yet.</p>
                    ) : (
                        <div className="services-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="service-card bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                                    <h4 className="text-xl font-semibold text-gray-700 mb-2">{service.name} ({service.status})</h4>
                                    <p className="text-gray-600 text-sm mb-1">Category: {service.category}</p>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">{service.description}</p>
                                    <p className="text-blue-700 font-bold mb-4">Price: ${service.price}</p>
                                    
                                    <p className="text-gray-700 font-semibold mb-2">Availability:</p>
                                    <ul className="availability-list text-sm text-gray-600 mb-4">
                                        {Object.entries(service.availability || {}).map(([day, time]) => (
                                            <li key={day} className="mb-1">
                                                <strong className="capitalize">{day}:</strong> {time || 'N/A'}
                                            </li>
                                        ))}
                                    </ul>
                                    {service.image_urls && service.image_urls.length > 0 ? (
                                        <img 
                                            src={service.image_urls[0]} 
                                            alt={service.name} 
                                            className="service-image w-full h-32 object-cover rounded-md mb-4" 
                                            onError={(e) => { e.target.src = 'https://placehold.co/300x150/cccccc/000000?text=No+Image'; }}
                                        />
                                    ) : (
                                        <img 
                                            src="https://placehold.co/300x150/cccccc/000000?text=No+Image" 
                                            alt="No Image Available" 
                                            className="service-image w-full h-32 object-cover rounded-md mb-4"
                                        />
                                    )}
                                    
                                    <div className="service-actions flex space-x-2 mt-auto">
                                        <button 
                                            onClick={() => handleEditService(service)} 
                                            className="edit-button button flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow-sm transition"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteService(service.id)} 
                                            className="delete-button button flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-sm transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'messages' && (
                <ProviderMessages providerId={provider.id} token={token} />
            )}

            {activeTab === 'profile' && providerProfile && (
                <ProviderProfile profile={providerProfile} token={token} onProfileUpdate={fetchDashboardData} />
            )}
        </div>
    );
};

export default ProviderDashboard;
