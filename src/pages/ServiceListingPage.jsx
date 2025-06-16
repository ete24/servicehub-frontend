// src/pages/ServiceListingPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Your backend API base URL

const ServiceListingPage = () => {
  const location = useLocation();
  const { query, category, location: searchLocation } = location.state || {};

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (query) params.query = query;
        if (category) params.category = category;
        if (searchLocation) params.location = searchLocation; 

        const response = await axios.get(`${API_BASE_URL}/services`, { params });
        setServices(response.data);
      } catch (err) {
        console.error('Error fetching services:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [query, category, searchLocation]);

  return (
    <div className="container mx-auto p-8 mt-10 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Search Results</h1>
      
      <div className="mb-8 text-center text-gray-700">
        <p className="text-lg">
          Searching for: <span className="font-semibold text-blue-600">{query || 'Any Service'}</span>
        </p>
        <p className="text-lg">
          Category: <span className="font-semibold text-blue-600">{category || 'All Categories'}</span>
        </p>
        <p className="text-lg">
          In Location: <span className="font-semibold text-blue-600">{searchLocation || 'Any Location'}</span>
        </p>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Services</h2>

        {loading && <p className="text-center text-gray-600">Loading services...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        
        {!loading && !error && services.length === 0 && (
          <p className="text-center text-gray-600">No services found matching your criteria.</p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="block">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
                  {/* CRITICAL FIX: Use service.image_urls[0] for the first image */}
                  {service.image_urls && service.image_urls.length > 0 && (
                    <img 
                      src={service.image_urls[0]} // Display the first image from the array
                      alt={service.name} 
                      className="mt-4 w-full h-32 object-cover rounded-md" 
                      onError={(e) => { e.target.src = 'https://placehold.co/300x150/cccccc/000000?text=No+Image'; }} 
                    />
                  )}
                  {(!service.image_urls || service.image_urls.length === 0) && (
                      <img 
                        src="https://placehold.co/300x150/cccccc/000000?text=No+Image" 
                        alt="No Image Available" 
                        className="mt-4 w-full h-32 object-cover rounded-md"
                      />
                  )}
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Category: {service.category}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{service.description}</p>
                  <p className="text-blue-700 font-bold mt-auto">Price: ${service.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceListingPage;
