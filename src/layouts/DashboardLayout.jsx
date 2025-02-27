import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setIsMobile(true);
      } else {
        setSidebarOpen(true);
        setIsMobile(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('/events')) return 'Events Management';
    if (path.includes('/venues')) return 'Venues Management';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        user={currentUser}
      />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        
        {/* Content Area */}
        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Home</span>
                {location.pathname !== '/' && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">{getPageTitle()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;