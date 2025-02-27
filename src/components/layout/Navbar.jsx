import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'New Event Registration',
      message: 'JKT48 Concert has been registered',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Venue Update',
      message: 'Gelora Bung Karno has been updated',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment for Coldplay Concert has been received',
      time: '3 hours ago',
      read: true
    }
  ];

  const handleLogout = async () => {
    await logout();
    // Redirect to login page would happen here
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left Side - Logo and Menu Toggle */}
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none mr-2 lg:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        
        <Link to="/" className="flex items-center">
          <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8L16 12L12 16L8 12L12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-xl font-semibold text-gray-800">Zoma Events</span>
        </Link>
      </div>
      
      {/* Center - Search */}
      <div className="hidden md:block w-1/3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search something here"
          />
        </div>
      </div>
      
      {/* Right Side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none relative"
          >
            <FiBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>
          
          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-200 text-center">
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="relative">
              <img
                src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="User"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full w-3 h-3 border-2 border-white"></div>
            </div>
            <div className="ml-2 hidden md:block">
              <div className="text-sm font-medium text-gray-800">{user?.name || "Arfi Ganteng"}</div>
              <div className="text-xs text-gray-500">{user?.email || "arfi.ganteng@gmail.com"}</div>
            </div>
            <svg className="h-5 w-5 ml-1 text-gray-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* User Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                to="/settings/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FiUser className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FiSettings className="mr-2 h-4 w-4" />
                Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <FiLogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;