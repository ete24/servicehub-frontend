// src/pages/ServiceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Your backend API base URL

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the contact modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [seekerName, setSeekerName] = useState('');
  const [seekerContact, setSeekerContact] = useState('');
  const [seekerMessage, setSeekerMessage] = useState('');
  const [contactFormMessage, setContactFormMessage] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/services/${id}`);
        setService(response.data);
      } catch (err) {
        console.error('Error fetching service details:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    } else {
      setError('No service ID provided.');
      setLoading(false);
    }
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactFormMessage(null);
    setIsSendingMessage(true);

    if (!seekerName || !seekerContact || !seekerMessage) {
      setContactFormMessage({ type: 'error', text: 'Please fill in all required contact fields.' });
      setIsSendingMessage(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/public/messages/inquiry`, {
        senderName: seekerName,
        senderContact: seekerContact,
        content: seekerMessage,
        receiverId: service.provider_id,
        receiverRole: 'provider',
        subject: `Inquiry about ${service.name} from ${seekerName}`,
        serviceDescription: service.name
      });
      setContactFormMessage({ type: 'success', text: response.data.message });
      
      setSeekerName('');
      setSeekerContact('');
      setSeekerMessage('');
      setTimeout(() => setIsContactModalOpen(false), 2000); 
    } catch (err) {
      console.error('Error sending inquiry:', err.response?.data || err.message);
      setContactFormMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send inquiry. Please try again.' });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSeekerName('');
    setSeekerContact('');
    setSeekerMessage('');
    setContactFormMessage(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center">
        <p className="text-xl text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <Link to="/services" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          Back to Service Listings
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto p-8 mt-10 text-center bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">The service you are looking for does not exist or is not active.</p>
        <Link to="/services" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          Back to Service Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 mt-10 bg-white shadow-lg rounded-lg min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Service Image Display */}
        <div className="md:w-1/2 flex justify-center items-center">
          {service.image_urls && service.image_urls.length > 0 ? (
            <img 
              src={service.image_urls[0]} // Display the first image
              alt={service.name} 
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
              onError={(e) => { e.target.src = 'https://placehold.co/600x400/cccccc/000000?text=No+Image+Available'; }}
            />
          ) : (
            <img 
              src="https://placehold.co/600x400/cccccc/000000?text=No+Image+Available" 
              alt="No Image Available" 
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
            />
          )}
        </div>

        {/* Service Details */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{service.name}</h1>
          <p className="text-xl text-gray-700 mb-4">Category: <span className="font-semibold text-blue-600">{service.category}</span></p>
          <p className="text-lg text-gray-600 mb-6">{service.description}</p>
          <p className="text-2xl font-bold text-blue-700 mb-6">Price: ${service.price}</p>

          <h2 className="text-xl font-semibold text-gray-700 mb-3">Availability:</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 bg-gray-50 p-4 rounded-md">
            {Object.entries(service.availability || {}).map(([day, time]) => (
              <li key={day} className="mb-1">
                <span className="font-medium capitalize">{day}:</span> {time || 'Not specified'}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => setIsContactModalOpen(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition"
          >
            Contact Provider
          </button>

          <Link to="/services" className="block text-center mt-6 text-blue-600 hover:text-blue-800 transition">
            ← Back to all services
          </Link>
        </div>
      </div>

      {/* Contact Provider Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative">
            <button
              onClick={closeContactModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inquire About {service.name}</h2>
            
            {contactFormMessage && (
              <p className={`mb-4 p-3 rounded-md text-center ${contactFormMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {contactFormMessage.text}
              </p>
            )}

            <form onSubmit={handleContactSubmit}>
              <div className="mb-4">
                <label htmlFor="seekerName" className="block text-gray-700 text-sm font-bold mb-2">Your Name:</label>
                <input
                  type="text"
                  id="seekerName"
                  name="seekerName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  value={seekerName}
                  onChange={(e) => setSeekerName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="seekerContact" className="block text-gray-700 text-sm font-bold mb-2">Your Contact (Phone Number):</label>
                <input
                  type="text" 
                  id="seekerContact"
                  name="seekerContact"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  value={seekerContact}
                  onChange={(e) => setSeekerContact(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="seekerMessage" className="block text-gray-700 text-sm font-bold mb-2">Your Message:</label>
                <textarea
                  id="seekerMessage"
                  name="seekerMessage"
                  rows="5"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                  value={seekerMessage}
                  onChange={(e) => setSeekerMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full transition"
                disabled={isSendingMessage}
              >
                {isSendingMessage ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
