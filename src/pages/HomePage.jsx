// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.jsx';
import CategorySlider from '../components/CategorySlider.jsx'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001/api';

const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      setLoadingServices(true);
      setServicesError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setFeaturedServices(response.data.slice(0, 6)); // Display up to 6 featured services
      } catch (err) {
        console.error('Error fetching featured services:', err.response?.data || err.message);
        setServicesError('Failed to load featured services.');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Hero Section with Slider and Search Overlay */}
      <HeroSection />

      {/* Category Slider Section */}
      <CategorySlider />

      {/* Featured Services Section */}
      <section className="py-16 bg-white shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Explore Our Featured Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Hand-picked services to get you started!
          </p>

          {loadingServices && <p className="text-center text-gray-600">Loading featured services...</p>}
          {servicesError && <p className="text-center text-red-500">Error: {servicesError}</p>}
          
          {!loadingServices && !servicesError && featuredServices.length === 0 && (
            <p className="text-center text-gray-600">No featured services available at the moment.</p>
          )}

          {!loadingServices && !servicesError && featuredServices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Link to={`/services/${service.id}`} key={service.id} className="block">
                  <div className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col">
                    {/* CRITICAL FIX: Use service.image_urls[0] for the first image */}
                    {service.image_urls && service.image_urls.length > 0 ? (
                      <img 
                        src={service.image_urls[0]} // Display the first image from the array
                        alt={service.name} 
                        className="mt-2 mb-4 w-full h-40 object-cover rounded-md" 
                        onError={(e) => { e.target.src = 'https://placehold.co/400x200/cccccc/000000?text=No+Image'; }} 
                      />
                    ) : (
                        <img 
                          src="https://placehold.co/400x200/cccccc/000000?text=No+Image" 
                          alt="No Image Available" 
                          className="mt-2 mb-4 w-full h-40 object-cover rounded-md"
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
      </section>

      {/* How It Works Section - Now links to a new page */}
      <section className="py-16 bg-blue-50 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">How It Works</h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto mb-10">
            Simple steps to find and book your desired services.
          </p>
          <Link to="/how-it-works" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 inline-block">
            Learn More
          </Link>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Service?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Start your search today and connect with top-rated local professionals.
          </p>
          <Link to="/services" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 inline-block">
            Browse All Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
