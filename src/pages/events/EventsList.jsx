import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiMoreVertical, FiDownload, FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const EventsList = () => {
  // State for events data
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    category: 'all'
  });
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });
  
  // State for filter modal
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockEvents = [
          {
            id: '14587',
            title: 'JKT 48 11th Anniversary Concert',
            sellingPeriod: 'Sep 1, 2023 - Dec 1, 2023',
            ticketsAvailable: '25467',
            price: '$120',
            status: 'active',
            category: 'concert',
            type: 'inperson',
            venue: 'Gelora Bung Karno Stadium',
            createdAt: '2023-08-15T10:30:00Z'
          },
          {
            id: '33932',
            title: 'Coldplay Concert - From The Ground to The Sky',
            sellingPeriod: 'Dec 16, 2023 - May 14, 2024',
            ticketsAvailable: '20480',
            price: '$110',
            status: 'active',
            category: 'concert',
            type: 'inperson',
            venue: 'Jakarta International Stadium',
            createdAt: '2023-11-20T14:15:00Z'
          },
          {
            id: '33173',
            title: 'Neck Deep - From The Deep and More to Deep',
            sellingPeriod: 'Jan 22, 2023 - Mar 25, 2023',
            ticketsAvailable: '18188',
            price: '$115',
            status: 'completed',
            category: 'concert',
            type: 'inperson',
            venue: 'Istora Senayan',
            createdAt: '2023-01-05T09:45:00Z'
          },
          {
            id: '42411',
            title: 'ONE OK ROCK - Jinsei x Boku World Tour 2023',
            sellingPeriod: 'Apr 23, 2023 - Aug 5, 2023',
            ticketsAvailable: '14483',
            price: '$94',
            status: 'completed',
            category: 'concert',
            type: 'inperson',
            venue: 'Ancol Beach City',
            createdAt: '2023-03-10T11:20:00Z'
          },
          {
            id: '22727',
            title: 'Blink-182 World Tour 2023-2024',
            sellingPeriod: 'Mar 13, 2023 - Sep 1, 2023',
            ticketsAvailable: '26498',
            price: '$75',
            status: 'completed',
            category: 'concert',
            type: 'inperson',
            venue: 'Sentul International Convention Center',
            createdAt: '2023-02-28T16:40:00Z'
          },
          {
            id: '32547',
            title: 'Itzy \'Checkmate\' World Tour 2023',
            sellingPeriod: 'Apr 1, 2023 - Dec 13, 2023',
            ticketsAvailable: '15658',
            price: '$142',
            status: 'active',
            category: 'concert',
            type: 'inperson',
            venue: 'Tennis Indoor Senayan',
            createdAt: '2023-03-15T13:10:00Z'
          },
          {
            id: '32079',
            title: 'Blackpink \'Born Pink\' World Tour 2023',
            sellingPeriod: 'Apr 7, 2023 - Nov 21, 2023',
            ticketsAvailable: '13374',
            price: '$200',
            status: 'active',
            category: 'concert',
            type: 'inperson',
            venue: 'Gelora Bung Karno Stadium',
            createdAt: '2023-03-20T10:05:00Z'
          },
          {
            id: '18514',
            title: 'Bring Me The Horizon World Tour 2023',
            sellingPeriod: 'Dec 22, 2023 - Mar 2, 2024',
            ticketsAvailable: '20706',
            price: '$144',
            status: 'upcoming',
            category: 'concert',
            type: 'inperson',
            venue: 'Istora Senayan',
            createdAt: '2023-11-30T09:30:00Z'
          },
          {
            id: '17091',
            title: 'Green Day World Tour 2023',
            sellingPeriod: 'May 3, 2023 - Jul 14, 2023',
            ticketsAvailable: '25386',
            price: '$123',
            status: 'completed',
            category: 'concert',
            type: 'inperson',
            venue: 'Jakarta Convention Center',
            createdAt: '2023-04-15T14:50:00Z'
          },
          {
            id: '42776',
            title: 'Ngaji Bareng In The House',
            sellingPeriod: 'Apr 15, 2023 - Oct 4, 2023',
            ticketsAvailable: '22287',
            price: '$443',
            status: 'completed',
            category: 'seminar',
            type: 'hybrid',
            venue: 'Jakarta Convention Center',
            createdAt: '2023-03-30T08:20:00Z'
          },
          {
            id: '55123',
            title: 'Tech Conference 2024',
            sellingPeriod: 'Jan 15, 2024 - Mar 20, 2024',
            ticketsAvailable: '5000',
            price: '$350',
            status: 'upcoming',
            category: 'conference',
            type: 'hybrid',
            venue: 'Jakarta Convention Center',
            createdAt: '2023-12-10T11:30:00Z'
          },
          {
            id: '55124',
            title: 'Digital Marketing Workshop',
            sellingPeriod: 'Feb 1, 2024 - Feb 28, 2024',
            ticketsAvailable: '200',
            price: '$75',
            status: 'upcoming',
            category: 'workshop',
            type: 'online',
            venue: 'Virtual Event',
            createdAt: '2024-01-15T09:45:00Z'
          }
        ];
        
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
        setTotalPages(Math.ceil(mockEvents.length / pageSize));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        setIsLoading(false);
        toast.error('Failed to fetch events. Please try again later.');
      }
    };
    
    fetchEvents();
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
    let result = [...events];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(event => event.status === filters.status);
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(event => event.category === filters.category);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
      
      result = result.filter(event => {
        const eventDate = new Date(event.createdAt);
        if (filters.dateRange === 'last30days') {
          return eventDate >= thirtyDaysAgo;
        } else if (filters.dateRange === 'last90days') {
          return eventDate >= ninetyDaysAgo;
        }
        return true;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredEvents(result);
    setTotalPages(Math.ceil(result.length / pageSize));
    setCurrentPage(1); // Reset to first page when filters change
  }, [events, searchTerm, filters, sortConfig, pageSize]);
  
  // Get current page of events
  const getCurrentPageEvents = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEvents.slice(startIndex, endIndex);
  };
  
  // Handle sort
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Handle delete event
  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    }
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // In a real app, this would generate and download a CSV file
    toast.info('Exporting events to CSV...');
    setTimeout(() => {
      toast.success('Events exported successfully');
    }, 1500);
  };
  
  // Export to PDF
  const exportToPDF = () => {
    // In a real app, this would generate and download a PDF file
    toast.info('Exporting events to PDF...');
    setTimeout(() => {
      toast.success('Events exported successfully');
    }, 1500);
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'upcoming':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'completed':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
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
            placeholder="Search events by name or ID"
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
          
          <div className="relative inline-block text-left">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => document.getElementById('exportDropdown').classList.toggle('hidden')}
            >
              <FiDownload className="h-5 w-5 mr-2" />
              Export
            </button>
            <div
              id="exportDropdown"
              className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
          
          <Link
            to="/events/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add New Event
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Events</h3>
                
                <div className="space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                    >
                      <option value="all">All Categories</option>
                      <option value="concert">Concert</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    >
                      <option value="all">All Time</option>
                      <option value="last30days">Last 30 Days</option>
                      <option value="last90days">Last 90 Days</option>
                    </select>
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
                      status: 'all',
                      dateRange: 'all',
                      category: 'all'
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
      
      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 py-3 text-left">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      Event ID
                      {sortConfig.key === 'id' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      Event Name
                      {sortConfig.key === 'title' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('sellingPeriod')}
                    >
                      Ticket Selling Period
                      {sortConfig.key === 'sellingPeriod' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('ticketsAvailable')}
                    >
                      Ticket Available
                      {sortConfig.key === 'ticketsAvailable' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      Ticket Price
                      {sortConfig.key === 'price' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortConfig.key === 'status' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageEvents().map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.id}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.sellingPeriod}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.ticketsAvailable}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.price}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {renderStatusBadge(event.status)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded-full bg-gray-200 text-gray-600">
                            <FiMoreVertical className="h-4 w-4" />
                          </button>
                          <Link to={`/events/edit/${event.id}`} className="p-1 rounded-md bg-blue-500 text-white">
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                          <button 
                            className="p-1 rounded-md bg-red-500 text-white"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, filteredEvents.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredEvents.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsList;