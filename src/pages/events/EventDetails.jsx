import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BulkTicketImport from '../../components/tickets/BulkTicketImport';
import TicketGenerator from '../../components/tickets/TicketGenerator';
import TicketDesigner from '../../components/tickets/TicketDesigner';

const demoEvent = {
  id: '1',
  title: 'Demo Event',
  description: 'This is a demo event description.',
  date: '2025-02-28',
  location: 'Demo Venue',
  attendees: [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', ticketType: 'VIP' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', ticketType: 'VVIP' },
  ],
};

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching event details with demo data
    setTimeout(() => {
      setEvent(demoEvent);
      setAttendees(demoEvent.attendees);
      setLoading(false);
    }, 1000);
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="event-details">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <div className="bulk-ticket-import">
        <BulkTicketImport eventId={eventId} />
      </div>
      <div className="ticket-generator">
        <TicketGenerator event={event} tickets={attendees} />
      </div>
      <div className="ticket-designer">
        <TicketDesigner event={event} />
      </div>
    </div>
  );
};

export default EventDetails;