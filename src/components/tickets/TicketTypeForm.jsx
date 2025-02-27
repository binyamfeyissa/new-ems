import { useState } from 'react';
import { FiPlus, FiX, FiDollarSign, FiUsers, FiInfo, FiTag, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TicketTypeForm = ({ onSave, initialData = null }) => {
  const [ticketType, setTicketType] = useState(initialData || {
    name: '',
    price: '',
    maxCapacity: '',
    description: '',
    perks: ['']
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketType({
      ...ticketType,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePerkChange = (index, value) => {
    const updatedPerks = [...ticketType.perks];
    updatedPerks[index] = value;
    
    setTicketType({
      ...ticketType,
      perks: updatedPerks
    });
  };

  const addPerk = () => {
    setTicketType({
      ...ticketType,
      perks: [...ticketType.perks, '']
    });
  };

  const removePerk = (index) => {
    const updatedPerks = [...ticketType.perks];
    updatedPerks.splice(index, 1);
    
    setTicketType({
      ...ticketType,
      perks: updatedPerks
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!ticketType.name.trim()) newErrors.name = 'Ticket type name is required';
    if (!ticketType.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(ticketType.price)) || Number(ticketType.price) < 0) {
      newErrors.price = 'Price must be a valid number';
    }
    
    if (!ticketType.maxCapacity.trim()) {
      newErrors.maxCapacity = 'Maximum capacity is required';
    } else if (isNaN(Number(ticketType.maxCapacity)) || !Number.isInteger(Number(ticketType.maxCapacity)) || Number(ticketType.maxCapacity) <= 0) {
      newErrors.maxCapacity = 'Maximum capacity must be a positive integer';
    }
    
    // Filter out empty perks
    const filteredPerks = ticketType.perks.filter(perk => perk.trim() !== '');
    setTicketType({
      ...ticketType,
      perks: filteredPerks.length > 0 ? filteredPerks : ['']
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Filter out empty perks before saving
      const dataToSave = {
        ...ticketType,
        perks: ticketType.perks.filter(perk => perk.trim() !== '')
      };
      
      onSave(dataToSave);
      toast.success(`Ticket type ${initialData ? 'updated' : 'created'} successfully!`);
    } else {
      toast.error('Please fix the errors in the form');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {initialData ? 'Edit Ticket Type' : 'Create New Ticket Type'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ticket Type Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Type Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTag className="text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={ticketType.name}
              onChange={handleChange}
              className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="VIP, VVIP, General Admission, etc."
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        {/* Price and Max Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-gray-400" />
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={ticketType.price}
                onChange={handleChange}
                className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Capacity *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="text-gray-400" />
              </div>
              <input
                type="text"
                id="maxCapacity"
                name="maxCapacity"
                value={ticketType.maxCapacity}
                onChange={handleChange}
                className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.maxCapacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter maximum number of tickets"
              />
            </div>
            {errors.maxCapacity && <p className="mt-1 text-sm text-red-600">{errors.maxCapacity}</p>}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <FiInfo className="text-gray-400" />
            </div>
            <textarea
              id="description"
              name="description"
              value={ticketType.description}
              onChange={handleChange}
              rows="3"
              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the ticket type and what it includes"
            ></textarea>
          </div>
        </div>
        
        {/* Special Privileges/Perks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Privileges/Perks
          </label>
          <div className="space-y-3">
            {ticketType.perks.map((perk, index) => (
              <div key={index} className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiList className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={perk}
                  onChange={(e) => handlePerkChange(index, e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter a special privilege or perk"
                />
                <button
                  type="button"
                  onClick={() => removePerk(index)}
                  className="absolute right-2 text-red-500 hover:text-red-700"
                  disabled={ticketType.perks.length === 1 && index === 0}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addPerk}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <FiPlus className="h-5 w-5 mr-1" />
              Add Perk
            </button>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {initialData ? 'Update Ticket Type' : 'Create Ticket Type'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketTypeForm;