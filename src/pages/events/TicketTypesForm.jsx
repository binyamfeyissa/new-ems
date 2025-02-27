import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TicketTypeForm from '../../components/tickets/TicketTypeForm';

const TicketTypesForm = () => {
  const { eventId, typeId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!typeId);
  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  
  // Fetch event and ticket type data if editing
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock event data
        const mockEvent = {
          id: eventId,
          title: 'JKT 48 11th Anniversary Concert',
        };
        
        setEvent(mockEvent);
        
        // If editing, fetch ticket type data
        if (typeId) {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock ticket type data
          const mockTicketType = {
            id: typeId,
            name: 'VIP',
            price: '250',
            maxCapacity: '1000',
            description: 'Best seats in the house with exclusive merchandise and meet & greet access.',
            perks: ['Front row seating', 'Exclusive merchandise', 'Meet & greet access', 'Priority entry']
          };
          
          setTicketType(mockTicketType);
        }
        
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to fetch data. Please try again later.');
        setIsLoading(false);
        navigate(`/events/${eventId}`);
      }
    };
    
    fetchData();
  }, [eventId, typeId, navigate]);
  
  const handleSave = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to event details
      navigate(`/events/${eventId}`);
    } catch (err) {
      toast.error('Failed to save ticket type. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          {typeId ? 'Edit Ticket Type' : 'Create Ticket Type'}
        </h1>
        <div className="text-sm text-gray-500">
          For event: <span className="font-medium">{event?.title}</span>
        </div>
      </div>
      
      <TicketTypeForm 
        onSave={handleSave}
        initialData={ticketType}
      />
    </div>
  );
};

export default TicketTypesForm;