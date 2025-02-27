import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiMapPin, FiUsers, FiSettings, 
  FiBarChart2, FiCreditCard, FiHelpCircle, FiChevronDown, 
  FiChevronRight, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    events: location.pathname.includes('/events'),
    venues: location.pathname.includes('/venues'),
    users: location.pathname.includes('/users'),
    reports: false,
    settings: location.pathname.includes('/settings')
  });

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };

  // Sidebar menu items
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FiHome className="h-5 w-5" />,
      path: '/',
      exact: true
    },
    {
      title: 'Events',
      icon: <FiCalendar className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        { title: 'All Events', path: '/events' },
        { title: 'Create Event', path: '/events/new' },
        { title: 'Categories', path: '/events/categories' }
      ]
    },
    {
      title: 'Venues',
      icon: <FiMapPin className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        { title: 'All Venues', path: '/venues' },
        { title: 'Add Venue', path: '/venues/new' }
      ]
    },
    {
      title: 'Users',
      icon: <FiUsers className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        { title: 'All Users', path: '/users' },
        { title: 'Organizers', path: '/users/organizers' },
        { title: 'Attendees', path: '/users/attendees' }
      ]
    },
    {
      title: 'Reports',
      icon: <FiBarChart2 className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        { title: 'Sales', path: '/reports/sales' },
        { title: 'Attendance', path: '/reports/attendance' },
        { title: 'Analytics', path: '/reports/analytics' }
      ]
    },
    {
      title: 'Transactions',
      icon: <FiCreditCard className="h-5 w-5" />,
      path: '/transactions'
    },
    {
      title: 'Settings',
      icon: <FiSettings className="h-5 w-5" />,
      submenu: true,
      submenuItems: [
        { title: 'Profile', path: '/settings/profile' },
        { title: 'Account', path: '/settings/account' },
        { title: 'Notifications', path: '/settings/notifications' },
        { title: 'Security', path: '/settings/security' }
      ]
    },
    {
      title: 'Help & Support',
      icon: <FiHelpCircle className="h-5 w-5" />,
      path: '/support'
    }
  ];

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Overlay for mobile
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        variants={isMobile ? sidebarVariants : {}}
        className={`bg-indigo-600 text-white fixed h-full z-40 transition-all duration-300 ${
          isOpen && !isMobile ? 'w-64' : isMobile ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-indigo-700 focus:outline-none"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}

        <div className="p-6">
          
          
          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.title.toLowerCase())}
                      className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-indigo-700 transition-colors ${
                        expandedMenus[item.title.toLowerCase()] ? 'bg-indigo-700' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {expandedMenus[item.title.toLowerCase()] ? (
                        <FiChevronDown className="h-5 w-5" />
                      ) : (
                        <FiChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    <AnimatePresence>
                      {expandedMenus[item.title.toLowerCase()] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-12 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.submenuItems.map((subItem, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `block py-2 px-3 rounded-md text-sm ${
                                  isActive
                                    ? 'bg-indigo-800 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-700'
                                }`
                              }
                              onClick={() => isMobile && setIsOpen(false)}
                            >
                              {subItem.title}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : 'text-white hover:bg-indigo-700'
                      }`
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pro Upgrade Banner */}
        <div className="absolute bottom-11 w-full p-4">
          <div className="bg-indigo-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Upgrade to Pro</h4>
            <p className="text-indigo-200 text-sm mb-3">Get more features and premium support</p>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;