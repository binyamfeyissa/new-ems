import React from 'react';
import { FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const EventTable = ({ events }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="w-12 py-3 text-left">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event ID
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket Selling Period
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket Available
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket Price
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="py-4 pl-4">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.id}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {event.title}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.sellingPeriod}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.ticketsAvailable}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {event.price}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded-full bg-gray-200 text-gray-600">
                    <FiMoreVertical className="h-4 w-4" />
                  </button>
                  <button className="p-1 rounded-md bg-blue-500 text-white">
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button className="p-1 rounded-md bg-red-500 text-white">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;