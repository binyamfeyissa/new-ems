import { useState, useRef } from 'react';
import { FiX, FiCalendar, FiClock, FiMapPin, FiTag, FiDollarSign, FiUsers, FiImage } from 'react-icons/fi';

const EventModal = ({ onClose, onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    location: '',
    amenities: ['Free Drinks', 'Indoor food'],
    ticketsAvailable: '',
    price: '',
    eventDate: '',
    eventTime: '',
    sellingPeriodStart: '',
    sellingPeriodEnd: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Add New Event</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Event Thumbnail */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Thumbnail
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <FiImage className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop media, or <span className="text-blue-500">Browse</span></p>
                </div>
              </div>

              {/* Event Gallery */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Gallery
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <FiImage className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop media, or <span className="text-blue-500">Browse</span></p>
                </div>
              </div>

              {/* Event Name */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="JKT 48 11th Anniversary Concert"
                />
              </div>

              {/* Descriptions */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descriptions
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Are you ready to fly again? JKT48 will soon be celebrating its 11th anniversary through the JKT48 11th Anniversary Concert: Flying High."
                ></textarea>
              </div>

              {/* Event Type */}
              <div className="mb-6">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Choose the event type from the drop down"
                  />
                </div>
              </div>

              {/* Event Location */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <FiMapPin className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Choose on the Map</p>
                </div>
              </div>

              {/* Event Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Amenities
                </label>
                <div className="space-y-3">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiTag className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={amenity}
                        readOnly
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="+"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location (text) */}
              <div className="mb-6">
                <label htmlFor="locationText" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="locationText"
                    name="locationText"
                    value="Gelora Bung Karno Stadium, Jakarta, Indonesia"
                    readOnly
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ticket Available & Price */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Available
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="ticketsAvailable"
                      name="ticketsAvailable"
                      value={formData.ticketsAvailable}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="200000"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$1M"
                    />
                  </div>
                </div>
              </div>

              {/* Event Date & Time */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date & Time
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dec 31, 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="eventTime"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="16:00 PM"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Selling Period */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Selling Period
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sellingPeriodStart" className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="sellingPeriodStart"
                        name="sellingPeriodStart"
                        value={formData.sellingPeriodStart}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sep 1, 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sellingPeriodEnd" className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="sellingPeriodEnd"
                        name="sellingPeriodEnd"
                        value={formData.sellingPeriodEnd}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dec 1, 2023"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;