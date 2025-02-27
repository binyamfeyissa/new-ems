import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VenueForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [venue, setVenue] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: [],
    newAmenity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue({ ...venue, [name]: value });
  };

  const handleAddAmenity = () => {
    if (venue.newAmenity && !venue.amenities.includes(venue.newAmenity)) {
      setVenue({
        ...venue,
        amenities: [...venue.amenities, venue.newAmenity],
        newAmenity: '',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      toast.success('Venue updated successfully');
    } else {
      toast.success('Venue created successfully');
    }
    navigate('/venues');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{isEdit ? 'Edit Venue' : 'Add New Venue'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Venue Name</label>
          <input
            type="text"
            name="name"
            value={venue.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={venue.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={venue.capacity}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="newAmenity"
              value={venue.newAmenity}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="button" onClick={handleAddAmenity} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {venue.amenities.map((amenity, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            {isEdit ? 'Update Venue' : 'Create Venue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenueForm;