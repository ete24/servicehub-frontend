// src/components/ServiceSearchForm.jsx
import React, { useState, useEffect } from 'react';

const ServiceSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Example categories (replace with dynamic data from backend if available)
  const categories = [
    'Cleaning', 'Repairs', 'Tutoring', 'Wellness', 'Beauty', 'Tech Support', 'Plumbing', 'Electrical'
  ];

  // Effect to get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Geolocation: Lat ${latitude}, Lon ${longitude}`);
          setLocation('Your Current Location (e.g., Lagos)'); // Placeholder for reverse geocoding
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Location access denied. Please enable it or enter your location manually.");
          } else {
            setLocationError("Could not retrieve location. Please enter manually.");
          }
          setLocation(''); // Clear any previous placeholder
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []); // Run only once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search initiated!");
    console.log("Query:", searchQuery);
    console.log("Category:", selectedCategory);
    console.log("Location:", location);
    // In a future step, this data will be used to:
    // 1. Navigate to a Service Listing page.
    // 2. Pass these parameters to the backend to filter services.
    // navigate('/services', { state: { query: searchQuery, category: selectedCategory, location: location } });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-xl max-w-full mx-auto flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
      {/* Category Dropdown */}
      <label htmlFor="category-select" className="sr-only">Select Category</label> {/* Hidden label for accessibility */}
      <select
        id="category-select" // Added ID
        name="category"     // Added Name
        className="flex-1 w-full md:w-auto p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Search Query Input */}
      <label htmlFor="search-query" className="sr-only">Search Query</label> {/* Hidden label for accessibility */}
      <input
        type="text"
        id="search-query" // Added ID
        name="query"      // Added Name
        className="flex-2 w-full md:w-auto p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        placeholder="e.g., 'deep cleaning', 'electrician'"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Location Input */}
      <div className="relative flex-1 w-full md:w-auto">
        <label htmlFor="location-input" className="sr-only">Location</label> {/* Hidden label for accessibility */}
        <input
          type="text"
          id="location-input" // Added ID
          name="location"     // Added Name
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder={isLocating ? "Detecting location..." : "Enter location"}
          value={isLocating ? "Detecting location..." : location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isLocating}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLocating ? (
             <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m10.607-10.607L13.414 3.1a1.998 1.998 0 00-2.828 0L6.343 7.343m10.607 10.607A8.001 8.001 0 0012 4a8 8 0 00-8 8h8a4 4 0 11-8 0h-4a12 12 0 0112-12h4a12 12 0 0112 12h-4a8 8 0 00-8-8z"></path>
            </svg>
          )}
        </div>
      </div>
      {locationError && <p className="text-red-500 text-sm mt-1 col-span-full text-center">{locationError}</p>}

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition"
      >
        Search Services
      </button>
    </form>
  );
};

export default ServiceSearchForm;
