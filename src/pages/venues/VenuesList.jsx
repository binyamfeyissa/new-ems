import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiGrid, FiList, FiMapPin, FiUsers, FiCalendar, FiSearch, FiFilter, FiPlus } from 'react-icons/fi';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';

const VenuesList = () => {
  // State for venues data
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    capacity: 'all',
    amenities: []
  });
  
  // State for filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Fetch venues data
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockVenues = [
          {
            id: '1',
            name: 'Gelora Bung Karno Stadium',
            location: 'Jakarta, Indonesia',
            capacity: 77193,
            amenities: ['Parking', 'Food & Beverage', 'VIP Lounges', 'Accessibility'],
            image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=2000',
            description: 'Indonesia\'s largest stadium, perfect for major concerts and sporting events.',
            rating: 4.7,
            priceRange: '$$$'
          },
          {
            id: '2',
            name: 'Jakarta Convention Center',
            location: 'Jakarta, Indonesia',
            capacity: 5000,
            amenities: ['Parking', 'Food & Beverage', 'Wi-Fi', 'Audio/Visual Equipment'],
            image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=2000',
            description: 'Modern convention center for conferences, exhibitions, and corporate events.',
            rating: 4.5,
            priceRange: '$$$'
          },
          {
            id: '3',
            name: 'Istora Senayan',
            location: 'Jakarta, Indonesia',
            capacity: 7000,
            amenities: ['Parking', 'Food & Beverage', 'Air Conditioning'],
            image: 'https://images.unsplash.com/photo-1560184611-ff3e53f00e8f?auto=format&fit=crop&q=80&w=2000',
            description: 'Indoor arena suitable for concerts, sports events, and exhibitions.',
            rating: 4.3,
            priceRange: '$$'
          },
          {
            id: '4',
            name: 'Ancol Beach City',
            location: 'Jakarta, Indonesia',
            capacity: 10000,
            amenities: ['Parking', 'Food & Beverage', 'Beachfront', 'Outdoor Space'],
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=2000',
            description: 'Beachfront venue perfect for outdoor concerts and festivals.',
            rating: 4.4,
            priceRange: '$$'
          },
          {
            id: '5',
            name: 'Tennis Indoor Senayan',
            location: 'Jakarta, Indonesia',
            capacity: 4000,
            amenities: ['Parking', 'Air Conditioning', 'Locker Rooms'],
            image: 'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?auto=format&fit=crop&q=80&w=2000',
            description: 'Indoor sports venue that can be converted for concerts and events.',
            rating: 4.1,
            priceRange: '$$'
          },
          {
            id: '6',
            name: 'Balai Sarbini',
            location: 'Jakarta, Indonesia',
            capacity: 2500,
            amenities: ['Parking', 'Food & Beverage', 'Audio/Visual Equipment'],
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2000',
            description: 'Concert hall with excellent acoustics for musical performances.',
            rating: 4.2,
            priceRange: '$$'
          },
          {
            id: '7',
            name: 'Jakarta International Expo',
            location: 'Jakarta, Indonesia',
            capacity: 15000,
            amenities: ['Parking', 'Food & Beverage', 'Wi-Fi', 'Exhibition Space'],
            image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=2000',
            description: 'Large exhibition center for trade shows, conventions, and large events.',
            rating: 4.6,
            priceRange: '$$$'
          },
          {
            id: '8',
            name: 'Sentul International Convention Center',
            location: 'Bogor, Indonesia',
            capacity: 11000,
            amenities: ['Parking', 'Food & Beverage', 'Outdoor Space', 'Accommodation'],
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000',
            description: 'Spacious convention center surrounded by nature, outside the city center.',
            rating: 4.4,
            priceRange: '$$$'
          },
          {
            id: '9',
            name: 'The Kasablanka Hall',
            location: 'Jakarta, Indonesia',
            capacity: 3000,
            amenities: ['Parking', 'Food & Beverage', 'Wi-Fi', 'Shopping Mall Access'],
            image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=2000',
            description: 'Modern event space located within a shopping mall complex.',
            rating: 4.3,
            priceRange: '$$'
          },
          {
            id: '10',
            name: 'Ciputra Artpreneur',
            location: 'Jakarta, Indonesia',
            capacity: 1200,
            amenities: ['Parking', 'Food & Beverage', 'Art Gallery', 'Theater Seating'],
            image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=2000',
            description: 'Elegant theater and art space for cultural performances and events.',
            rating: 4.5,
            priceRange: '$$$'
          },
          {
            id: '11',
            name: 'ICE BSD City',
            location: 'Tangerang, Indonesia',
            capacity: 20000,
            amenities: ['Parking', 'Food & Beverage', 'Wi-Fi', 'Exhibition Space', 'Outdoor Area'],
            image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=2000',
            description: 'Indonesia\'s largest exhibition and convention center located in BSD City.',
            rating: 4.7,
            priceRange: '$$$'
          },
          {
            id: '12',
            name: 'Kuningan City Ballroom',
            location: 'Jakarta, Indonesia',
            capacity: 1500,
            amenities: ['Parking', 'Food & Beverage', 'Wi-Fi', 'Shopping Mall Access'],
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000',
            description: 'Elegant ballroom for corporate events, weddings, and social gatherings.',
            rating: 4.2,
            priceRange: '$$'
          }
        ];
        
        setVenues(mockVenues);
        setFilteredVenues(mockVenues);
        setTotalPages(Math.ceil(mockVenues.length / pageSize));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch venues. Please try again later.');
        setIsLoading(false);
        toast.error('Failed to fetch venues. Please try again later.');
      }
    };
    
    fetchVenues();
  }, [pageSize]);
  
  // Handle search with debounce
  const debouncedSearch = useMemo(() => {
    return debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
  }, []);
  
  // Apply search and filters
  useEffect(() => {
    let result = [...venues];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply capacity filter
    if (filters.capacity !== 'all') {
      result = result.filter(venue => {
        if (filters.capacity === 'small') return venue.capacity < 3000;
        if (filters.capacity === 'medium') return venue.capacity >= 3000 && venue.capacity < 10000;
        if (filters.capacity === 'large') return venue.capacity >= 10000;
        return true;
      });
    }
    
    // Apply amenities filter
    if (filters.amenities.length > 0) {
      result = result.filter(venue => 
        filters.amenities.every(amenity => venue.amenities.includes(amenity))
      );
    }
    
    setFilteredVenues(result);
    setTotalPages(Math.ceil(result.length / pageSize));
    setCurrentPage(1); // Reset to first page when filters change
  }, [venues, searchTerm, filters, pageSize]);
  
  // Get current page of venues
  const getCurrentPageVenues = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredVenues.slice(startIndex, endIndex);
  };
  
  // Handle delete venue
  const handleDeleteVenue = (id) => {
    if (window.confirm('Are you sure you want to delete this venue?')) {
      setVenues(venues.filter(venue => venue.id !== id));
      toast.success('Venue deleted successfully');
    }
  };
  
  // Toggle amenity filter
  const toggleAmenityFilter = (amenity) => {
    if (filters.amenities.includes(amenity)) {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter(a => a !== amenity)
      });
    } else {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, amenity]
      });
    }
  };
  
  // All available amenities
  const allAmenities = [
    'Parking',
    'Food & Beverage',
    'Wi-Fi',
    'Air Conditioning',
    'Audio/Visual Equipment',
    'Outdoor Space',
    'VIP Lounges',
    'Accessibility',
    'Accommodation'
  ];
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search venues by name or location"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFilter className="h-5 w-5 mr-2" />
            Filter
          </button>
          
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
          
          <Link
            to="/venues/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add New Venue
          </Link>
        </div>
      </div>
      
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowFilterModal(false)}></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Venues</h3>
                
                <div className="space-y-4">
                  {/* Capacity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={filters.capacity}
                      onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                    >
                      <option value="all">All Capacities</option>
                      <option value="small">Small (Less than 3,000)</option>
                      <option value="medium">Medium (3,000 - 10,000)</option>
                      <option value="large">Large (More than 10,000)</option>
                    </select>
                  </div>
                  
                  {/* Amenities Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {allAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`amenity-${amenity}`}
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => toggleAmenityFilter(amenity)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowFilterModal(false)}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setFilters({
                      capacity: 'all',
                      amenities: []
                    });
                    setShowFilterModal(false);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Venues Display */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-red-500">{error}</div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getCurrentPageVenues().map((venue) => (
                <div key={venue.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={venue.image} 
                      alt={venue.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{venue.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <FiMapPin className="h-4 w-4 mr-1" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FiUsers className="h-4 w-4 mr-1" />
                      <span>Capacity: {venue.capacity.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                      <span className="text-sm text-gray-600">{venue.priceRange}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link 
                        to={`/venues/edit/${venue.id}`}
                        className="flex-1 flex justify-center items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"                      >
                        <FiEdit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteVenue(venue.id)}
                        className="flex-1 flex justify-center items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        <FiTrash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {getCurrentPageVenues().map((venue) => (
                <div key={venue.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="h-48 w-48 overflow-hidden">
                      <img 
                        src={venue.image} 
                        alt={venue.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{venue.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <FiMapPin className="h-4 w-4 mr-1" />
                        <span>{venue.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <FiUsers className="h-4 w-4 mr-1" />
                        <span>Capacity: {venue.capacity.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {venue.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {venue.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            +{venue.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm font-medium">{venue.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{venue.priceRange}</span>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Link 
                          to={`/venues/edit/${venue.id}`}
                          className="flex-1 flex justify-center items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          <FiEdit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteVenue(venue.id)}
                          className="flex-1 flex justify-center items-center px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          <FiTrash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VenuesList;