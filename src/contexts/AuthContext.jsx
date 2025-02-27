import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login function
  const login = (email, password) => {
    // In a real app, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser({
          id: '1',
          name: 'Arfi Ganteng',
          email: 'arfi.ganteng@gmail.com',
          role: 'admin',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        });
        resolve(true);
      }, 1000);
    });
  };

  // Mock logout function
  const logout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        resolve(true);
      }, 500);
    });
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    // In a real app, this would check for a token in localStorage or cookies
    const user = {
      id: '1',
      name: 'Arfi Ganteng',
      email: 'arfi.ganteng@gmail.com',
      role: 'admin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    };
    
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};