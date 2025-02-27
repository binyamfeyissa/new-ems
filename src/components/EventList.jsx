import { useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';

const EventList = ({ events }) => {
  // If no events are provided, use sample data
  const eventData = events || [
    {
      id: 1,
      title: 'Tech Conference 2025',
      date: new Date('2025-06-15'),
      location: 'San Francisco, CA',
      category: 'Conference',
      price: 299,
      maxAttendees: 500,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 2,
      title: 'Music Festival',
      date: new Date('2025-07-20'),
      location: 'Austin, TX',
      category: 'Concert',
      price: 150,
      maxAttendees: 2000,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=2070'
    },
    {
      id: 3,
      title: 'Startup Networking Mixer',
      date: new Date('2025-05-10'),
      location: 'New York, NY',
      category: 'Networking',
      price: 0,
      maxAttendees: 100,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069'
    }
  ];

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventData.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Event Image */}
            <div className="h-48 overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Event Details */}
            <div className="p-5">
              <div className="flex items-center mb-2">
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {event.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
              
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  <span>{event.date.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center">
                  <FiMapPin className="mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <FiUsers className="mr-1 text-gray-400" />
                    <span className="text-sm">{event.maxAttendees} max</span>
                  </div>
                  
                  <div className="flex items-center font-semibold text-gray-800">
                    <FiDollarSign className="mr-1" />
                    <span>{event.price === 0 ? 'Free' : event.price}</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;