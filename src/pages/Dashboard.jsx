import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiMapPin, FiDollarSign, FiArrowUp, FiArrowDown, FiBarChart2 } from 'react-icons/fi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeVenues: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalEvents: 256,
        activeVenues: 42,
        totalUsers: 1845,
        totalRevenue: 125680
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Revenue data for line chart
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12500, 18200, 21500, 25600, 28900, 32100, 38500, 42300, 45800, 52100, 58900, 65400],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Attendance data for bar chart
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance',
        data: [320, 450, 380, 560, 720, 980, 840],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  // Popular venues data for doughnut chart
  const venuesData = {
    labels: ['Gelora Bung Karno', 'Jakarta Convention Center', 'Sentul International Circuit', 'Ancol Beach', 'Other'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

  // Recent transactions data
  const recentTransactions = [
    {
      id: 'TX-12345',
      customer: 'John Doe',
      event: 'JKT 48 11th Anniversary Concert',
      amount: '$120',
      status: 'Completed',
      date: '2023-12-01'
    },
    {
      id: 'TX-12346',
      customer: 'Jane Smith',
      event: 'Coldplay Concert',
      amount: '$220',
      status: 'Completed',
      date: '2023-12-02'
    },
    {
      id: 'TX-12347',
      customer: 'Robert Johnson',
      event: 'Blackpink World Tour',
      amount: '$200',
      status: 'Pending',
      date: '2023-12-03'
    },
    {
      id: 'TX-12348',
      customer: 'Emily Davis',
      event: 'Green Day World Tour',
      amount: '$123',
      status: 'Completed',
      date: '2023-12-04'
    },
    {
      id: 'TX-12349',
      customer: 'Michael Brown',
      event: 'Bring Me The Horizon World Tour',
      amount: '$144',
      status: 'Failed',
      date: '2023-12-05'
    }
  ];

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.totalEvents}</p>
              )}
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FiCalendar className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          {!isLoading && (
            <div className="flex items-center mt-4">
              <FiArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">12% increase</span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>

        {/* Active Venues */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Venues</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.activeVenues}</p>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiMapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {!isLoading && (
            <div className="flex items-center mt-4">
              <FiArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">8% increase</span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">{stats.totalUsers}</p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {!isLoading && (
            <div className="flex items-center mt-4">
              <FiArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-medium">24% increase</span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
              )}
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiDollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          {!isLoading && (
            <div className="flex items-center mt-4">
              <FiArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500 font-medium">3% decrease</span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
            <select className="border border-gray-300 rounded-md text-sm px-3 py-1.5">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <div className="h-64">
              <Line data={revenueData} options={lineOptions} />
            </div>
          )}
        </div>

        {/* Popular Venues Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Popular Venues</h3>
            <select className="border border-gray-300 rounded-md text-sm px-3 py-1.5">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={venuesData} options={doughnutOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Attendance Chart and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Event Attendance</h3>
            <select className="border border-gray-300 rounded-md text-sm px-3 py-1.5">
              <option>This Week</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <div className="h-64">
              <Bar data={attendanceData} options={barOptions} />
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.id}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.customer}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.event}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {transaction.amount}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <FiCalendar className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Create Event</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FiMapPin className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Venue</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <FiUsers className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Invite Users</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <FiBarChart2 className="h-6 w-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;