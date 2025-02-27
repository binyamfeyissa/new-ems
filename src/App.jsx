import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import EventsList from './pages/events/EventsList';
import EventForm from './pages/events/EventForm';
import EventDetails from './pages/events/EventDetails';
import TicketTypesForm from './pages/events/TicketTypesForm';
import VenuesList from './pages/venues/VenuesList';
import VenueForm from './pages/venues/VenueForm';
import UsersList from './pages/users/UsersList';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, set to true

  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Events Routes */}
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/new" element={<EventForm />} />
            <Route path="/events/edit/:id" element={<EventForm />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:eventId/ticket-types/new" element={<TicketTypesForm />} />
            <Route path="/events/:eventId/ticket-types/edit/:typeId" element={<TicketTypesForm />} />
            
            {/* Venues Routes */}
            <Route path="/venues" element={<VenuesList />} />
            <Route path="/venues/new" element={<VenueForm />} />
            <Route path="/venues/edit/:id" element={<VenueForm />} />
            
            {/* Users Routes */}
            <Route path="/users" element={<UsersList />} />
            
            {/* Settings Routes */}
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;