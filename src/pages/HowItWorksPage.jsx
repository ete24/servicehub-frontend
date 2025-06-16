// src/pages/HowItWorksPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  return (
    <div className="container mx-auto p-8 mt-10 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">How ServiceHub Works</h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto">
        Whether you're looking for a service or offering one, ServiceHub makes connecting easy and efficient.
      </p>

      {/* For Service Seekers */}
      <section className="mb-12 p-6 bg-blue-50 rounded-lg shadow-md border-l-4 border-blue-600">
        <h2 className="text-3xl font-semibold text-blue-700 mb-4 flex items-center">
          <span className="text-4xl mr-3">🔍</span> For Service Seekers
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-3">
          <li><strong>Search for Services:</strong> Use our intuitive search bar and category slider to find exactly what you need. Filter by location, price, and more!</li>
          <li><strong>Browse & Compare:</strong> View detailed service listings, including descriptions, prices, and provider profiles.</li>
          <li><strong>Contact Providers:</strong> Directly message service providers through our secure system to discuss your needs and get quotes.</li>
          <li><strong>Book & Enjoy:</strong> Schedule your service and experience hassle-free completion.</li>
        </ol>
      </section>

      {/* For Service Providers */}
      <section className="mb-12 p-6 bg-green-50 rounded-lg shadow-md border-l-4 border-green-600">
        <h2 className="text-3xl font-semibold text-green-700 mb-4 flex items-center">
          <span className="text-4xl mr-3">💼</span> For Service Providers
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-3">
          <li><strong>Register & Set Up Your Profile:</strong> Create an account and build a compelling profile showcasing your expertise.</li>
          <li><strong>List Your Services:</strong> Add detailed descriptions, pricing, and images for each service you offer.</li>
          <li><strong>Manage Your Dashboard:</strong> Track inquiries, manage your services, update your availability, and communicate with seekers.</li>
          <li><strong>Grow Your Business:</strong> Connect with a wider customer base and expand your reach.</li>
        </ol>
      </section>

      {/* General Information */}
      <section className="p-6 bg-gray-50 rounded-lg shadow-md border-l-4 border-gray-600">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4 flex items-center">
          <span className="text-4xl mr-3">🌟</span> Our Commitment
        </h2>
        <p className="text-gray-700 mb-4">
          ServiceHub is dedicated to fostering a trustworthy and efficient marketplace. We prioritize user experience, security, and seamless connections between those who need services and those who provide them.
        </p>
        <p className="text-gray-700">
          Have more questions? <Link to="/contact" className="text-blue-600 hover:underline">Contact our support team!</Link> (Note: Contact page is a future feature)
        </p>
      </section>

      <div className="text-center mt-12">
        <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
