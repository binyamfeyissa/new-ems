import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        setUsers([
          { id: 1, name: 'User 1', role: 'Organizer' },
          { id: 2, name: 'User 2', role: 'Attendee' },
        ]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        setIsLoading(false);
        toast.error('Failed to fetch users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <Link to="/users/new" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <FiPlus className="h-5 w-5 mr-2" />
          Add New User
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/users/edit/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                      <FiEdit2 className="inline-block h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                      <FiTrash2 className="inline-block h-5 w-5" />
                    </button>
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

export default UsersList;