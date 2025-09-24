'use client';

import { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Users,
  Bed,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Hostel {
  id: string;
  hostelName: string;
  hostelCode: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    wardenName: string;
  };
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
}

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  roomType: 'Single' | 'Double' | 'Triple' | 'Quad';
  capacity: number;
  currentOccupancy: number;
  monthlyRent: number;
  status: 'Available' | 'Occupied' | 'Under Maintenance' | 'Reserved';
}

interface Allocation {
  id: string;
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  hostel: {
    hostelName: string;
    hostelCode: string;
  };
  room: {
    roomNumber: string;
    floor: number;
    roomType: string;
  };
  allocationDate: string;
  checkInDate: string;
  monthlyRent: number;
  allocationStatus: 'Active' | 'Terminated' | 'Transferred' | 'Suspended';
}

export default function HostelManagement() {
  const [activeTab, setActiveTab] = useState<'hostels' | 'rooms' | 'allocations'>('hostels');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [hostels] = useState<Hostel[]>([
    {
      id: '1',
      hostelName: 'Boys Hostel A',
      hostelCode: 'BHA001',
      address: {
        street: '123 University Road',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      contactInfo: {
        phone: '+91 9876543210',
        email: 'boyshostel@university.edu',
        wardenName: 'Mr. Rajesh Kumar'
      },
      totalRooms: 50,
      occupiedRooms: 45,
      availableRooms: 5,
      status: 'Active'
    },
    {
      id: '2',
      hostelName: 'Girls Hostel B',
      hostelCode: 'GHB001',
      address: {
        street: '456 Campus Avenue',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      contactInfo: {
        phone: '+91 9876543211',
        email: 'girlshostel@university.edu',
        wardenName: 'Mrs. Priya Sharma'
      },
      totalRooms: 40,
      occupiedRooms: 38,
      availableRooms: 2,
      status: 'Active'
    }
  ]);

  const [rooms] = useState<Room[]>([
    {
      id: '1',
      roomNumber: '101',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      currentOccupancy: 2,
      monthlyRent: 8000,
      status: 'Occupied'
    },
    {
      id: '2',
      roomNumber: '102',
      floor: 1,
      roomType: 'Single',
      capacity: 1,
      currentOccupancy: 0,
      monthlyRent: 12000,
      status: 'Available'
    },
    {
      id: '3',
      roomNumber: '201',
      floor: 2,
      roomType: 'Triple',
      capacity: 3,
      currentOccupancy: 3,
      monthlyRent: 6000,
      status: 'Occupied'
    }
  ]);

  const [allocations] = useState<Allocation[]>([
    {
      id: '1',
      student: {
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      hostel: {
        hostelName: 'Boys Hostel A',
        hostelCode: 'BHA001'
      },
      room: {
        roomNumber: '101',
        floor: 1,
        roomType: 'Double'
      },
      allocationDate: '2024-08-15',
      checkInDate: '2024-08-20',
      monthlyRent: 8000,
      allocationStatus: 'Active'
    },
    {
      id: '2',
      student: {
        studentId: 'STU002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      },
      hostel: {
        hostelName: 'Girls Hostel B',
        hostelCode: 'GHB001'
      },
      room: {
        roomNumber: '201',
        floor: 2,
        roomType: 'Single'
      },
      allocationDate: '2024-08-10',
      checkInDate: '2024-08-15',
      monthlyRent: 12000,
      allocationStatus: 'Active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Occupied':
        return 'bg-blue-100 text-blue-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Occupied':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'Under Maintenance':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Terminated':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalHostels = hostels.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'Occupied').length;
  const availableRooms = rooms.filter(room => room.status === 'Available').length;
  const activeAllocations = allocations.filter(allocation => allocation.allocationStatus === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
          <p className="text-gray-600 mt-1">Manage hostel facilities, room allocation, and student accommodations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hostel
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Hostels</p>
              <p className="text-2xl font-bold text-blue-800">{totalHostels}</p>
              <p className="text-xs text-blue-600 mt-1">Active facilities</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Rooms</p>
              <p className="text-2xl font-bold text-green-800">{totalRooms}</p>
              <p className="text-xs text-green-600 mt-1">Across all hostels</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Bed className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Occupied Rooms</p>
              <p className="text-2xl font-bold text-purple-800">{occupiedRooms}</p>
              <p className="text-xs text-purple-600 mt-1">Currently in use</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Available Rooms</p>
              <p className="text-2xl font-bold text-orange-800">{availableRooms}</p>
              <p className="text-xs text-orange-600 mt-1">Ready for allocation</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('hostels')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hostels'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Hostels
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rooms'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bed className="h-4 w-4 inline mr-2" />
              Rooms
            </button>
            <button
              onClick={() => setActiveTab('allocations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'allocations'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Allocations
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Hostels Tab */}
          {activeTab === 'hostels' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hostel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hostels.map((hostel) => (
                    <tr key={hostel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-8 w-8 text-blue-600" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{hostel.hostelName}</div>
                            <div className="text-sm text-gray-500">{hostel.hostelCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hostel.address.street}</div>
                        <div className="text-sm text-gray-500">{hostel.address.city}, {hostel.address.state}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hostel.contactInfo.wardenName}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {hostel.contactInfo.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hostel.totalRooms} total</div>
                        <div className="text-sm text-gray-500">{hostel.occupiedRooms} occupied, {hostel.availableRooms} available</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(hostel.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hostel.status)}`}>
                            {hostel.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupancy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Bed className="h-6 w-6 text-green-600" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">Room {room.roomNumber}</div>
                            <div className="text-sm text-gray-500">Floor {room.floor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.roomType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.capacity} students
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {room.currentOccupancy}/{room.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(room.monthlyRent)}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(room.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                            {room.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Allocations Tab */}
          {activeTab === 'allocations' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hostel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocations.map((allocation) => (
                    <tr key={allocation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {allocation.student.firstName[0]}{allocation.student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {allocation.student.firstName} {allocation.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{allocation.student.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{allocation.hostel.hostelName}</div>
                        <div className="text-sm text-gray-500">{allocation.hostel.hostelCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Room {allocation.room.roomNumber}</div>
                        <div className="text-sm text-gray-500">Floor {allocation.room.floor} - {allocation.room.roomType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(allocation.monthlyRent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(allocation.checkInDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(allocation.allocationStatus)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(allocation.allocationStatus)}`}>
                            {allocation.allocationStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
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
      </div>

      {/* Add Hostel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Hostel</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warden Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Hostel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

