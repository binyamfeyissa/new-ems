import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiDollarSign, FiUsers, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TicketTypesList = ({ eventId, ticketTypes = [], onDelete }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTypes(ticketTypes.map(type => type.id));
    } else {
      setSelectedTypes([]);
    }
  };
  
  const handleSelect = (id) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter(typeId => typeId !== id));
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  };
  
  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTypes.length} ticket types?`)) {
      selectedTypes.forEach(id => onDelete(id));
      setSelectedTypes([]);
      toast.success(`${selectedTypes.length} ticket types deleted successfully`);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Ticket Types</h2>
        <div className="flex space-x-2">
          {selectedTypes.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center"
            >
              <FiTrash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </button>
          )}
          <Link
            to={`/events/${eventId}/ticket-types/new`}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center"
          >
            <FiPlus className="h-4 w-4 mr-1" />
            Add Ticket Type
          </Link>
        </div>
      </div>
      
      {ticketTypes.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No ticket types have been created for this event yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 py-3 text-left pl-6">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={selectedTypes.length === ticketTypes.length}
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Special Perks
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ticketTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => handleSelect(type.id)}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiTag className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{type.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiDollarSign className="h-5 w-5 text-gray-400 mr-1" />
                      <span className="text-gray-900">{type.price}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex items-center">
                      <FiUsers className="h-5 w-5 text-gray-400 mr-1" />
                      <span>{type.maxCapacity}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-gray-500">
                    {type.sold || 0}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (type.maxCapacity - (type.sold || 0)) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {type.maxCapacity - (type.sold || 0)}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {type.perks && type.perks.length > 0 ? (
                        type.perks.slice(0, 2).map((perk, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {perk}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No perks</span>
                      )}
                      {type.perks && type.perks.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{type.perks.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link 
                        to={`/events/${eventId}/ticket-types/edit/${type.id}`}
                        className="p-1 rounded-md bg-blue-500 text-white"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete the "${type.name}" ticket type?`)) {
                            onDelete(type.id);
                            toast.success('Ticket type deleted successfully');
                          }
                        }}
                        className="p-1 rounded-md bg-red-500 text-white"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketTypesList;