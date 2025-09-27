'use client';

import { useState, useEffect } from 'react';
import { 
  Home,
  Users,
  FileText,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  MessageSquare,
  Settings,
  User,
  GraduationCap,
  CreditCard,
  Building2,
  Library,
  BarChart3,
  Search,
  Filter,
  Plus,
  MapPin,
  Bed
} from 'lucide-react';
import { dashboardApi, authApi } from '../../utils/api';

interface HostelInfo {
  id: string;
  name: string;
  type: 'boys' | 'girls';
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  monthlyRent: number;
}

interface RoomInfo {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupied: number;
  available: number;
  status: 'available' | 'occupied' | 'maintenance';
}

interface StudentInfo {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: number;
  roomNumber: string;
  hostelName: string;
  checkInDate: string;
  monthlyRent: number;
  status: 'active' | 'pending' | 'left';
}

interface MaintenanceInfo {
  id: string;
  roomNumber: string;
  issue: string;
  reportedBy: string;
  reportedDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export default function WardenDashboard() {
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceInfo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWardenData();
  }, []);

  const fetchWardenData = async () => {
    try {
      // Fetch real user data
      const profileResponse = await authApi.getProfile();
      if (profileResponse.status === 'success' && profileResponse.data) {
        const user = profileResponse.data.user;
        console.log('Warden user data:', user);
      }

      // Mock data - replace with actual API calls
      const mockHostels: HostelInfo[] = [
        {
          id: '1',
          name: 'Boys Hostel A',
          type: 'boys',
          totalRooms: 50,
          occupiedRooms: 45,
          availableRooms: 5,
          monthlyRent: 5000
        },
        {
          id: '2',
          name: 'Girls Hostel B',
          type: 'girls',
          totalRooms: 40,
          occupiedRooms: 38,
          availableRooms: 2,
          monthlyRent: 5500
        }
      ];

      const mockRooms: RoomInfo[] = [
        {
          id: '1',
          roomNumber: 'A-101',
          floor: 1,
          capacity: 2,
          occupied: 2,
          available: 0,
          status: 'occupied'
        },
        {
          id: '2',
          roomNumber: 'A-102',
          floor: 1,
          capacity: 2,
          occupied: 1,
          available: 1,
          status: 'available'
        },
        {
          id: '3',
          roomNumber: 'A-103',
          floor: 1,
          capacity: 2,
          occupied: 0,
          available: 2,
          status: 'maintenance'
        }
      ];

      const mockStudents: StudentInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          name: 'John Doe',
          course: 'Computer Science',
          semester: 3,
          roomNumber: 'A-101',
          hostelName: 'Boys Hostel A',
          checkInDate: '2023-08-15',
          monthlyRent: 5000,
          status: 'active'
        },
        {
          id: '2',
          studentId: 'STU002',
          name: 'Jane Smith',
          course: 'Computer Science',
          semester: 3,
          roomNumber: 'B-201',
          hostelName: 'Girls Hostel B',
          checkInDate: '2023-08-20',
          monthlyRent: 5500,
          status: 'active'
        }
      ];

      const mockMaintenance: MaintenanceInfo[] = [
        {
          id: '1',
          roomNumber: 'A-103',
          issue: 'Broken fan',
          reportedBy: 'STU003',
          reportedDate: '2024-01-10',
          status: 'pending',
          priority: 'medium'
        },
        {
          id: '2',
          roomNumber: 'B-205',
          issue: 'Leaking tap',
          reportedBy: 'STU004',
          reportedDate: '2024-01-12',
          status: 'in-progress',
          priority: 'high'
        }
      ];

      setHostels(mockHostels);
      setRooms(mockRooms);
      setStudents(mockStudents);
      setMaintenance(mockMaintenance);
    } catch (error) {
      console.error('Error fetching warden data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
  const activeStudents = students.filter(student => student.status === 'active').length;
  const pendingMaintenance = maintenance.filter(item => item.status === 'pending').length;

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hostel Management</h1>
              <p className="text-gray-600 mt-1">Manage hostels, rooms, and student accommodations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{occupiedRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bed className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{availableRooms}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance Issues</p>
                <p className="text-2xl font-bold text-gray-900">{pendingMaintenance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'hostels', name: 'Hostels', icon: Home },
                { id: 'rooms', name: 'Rooms', icon: Bed },
                { id: 'students', name: 'Students', icon: Users },
                { id: 'maintenance', name: 'Maintenance', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hostel Status */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hostel Status</h3>
                    <div className="space-y-3">
                      {hostels.map((hostel) => (
                        <div key={hostel.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{hostel.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">{hostel.type} Hostel</p>
                              <p className="text-sm text-gray-500">₹{hostel.monthlyRent}/month</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-purple-600">{hostel.occupiedRooms}/{hostel.totalRooms}</p>
                              <p className="text-sm text-gray-500">Rooms Occupied</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Maintenance */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance</h3>
                    <div className="space-y-3">
                      {maintenance.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.issue}</h4>
                              <p className="text-sm text-gray-600">Room: {item.roomNumber}</p>
                              <p className="text-sm text-gray-500">Reported: {item.reportedDate}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              item.priority === 'high' ? 'bg-red-100 text-red-800' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Plus className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Allocate Room</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Check Out Student</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Settings className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Report Maintenance</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hostels Tab */}
            {activeTab === 'hostels' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hostels.map((hostel) => (
                    <div key={hostel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{hostel.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{hostel.type} Hostel</p>
                          <p className="text-sm text-gray-500">Monthly Rent: ₹{hostel.monthlyRent}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          hostel.availableRooms > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {hostel.availableRooms > 0 ? 'Available' : 'Full'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Rooms:</span>
                          <span className="font-medium">{hostel.totalRooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Occupied:</span>
                          <span className="font-medium">{hostel.occupiedRooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium">{hostel.availableRooms}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(hostel.occupiedRooms / hostel.totalRooms) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Room Status</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Room
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Floor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Occupied
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
                              <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{room.floor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{room.capacity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{room.occupied}/{room.capacity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                room.status === 'available' ? 'bg-green-100 text-green-800' :
                                room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {room.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-purple-600 hover:text-purple-900">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Student Accommodations</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Room
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-in Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Rent
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
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">
                                      {student.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.course}</div>
                              <div className="text-sm text-gray-500">Semester {student.semester}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.roomNumber}</div>
                              <div className="text-sm text-gray-500">{student.hostelName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.checkInDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{student.monthlyRent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'active' ? 'bg-green-100 text-green-800' :
                                student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  View
                                </button>
                                <button className="text-purple-600 hover:text-purple-900">
                                  Check Out
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Maintenance Issues</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Room
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Issue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reported By
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
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
                        {maintenance.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.roomNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.issue}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.reportedBy}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.reportedDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.priority === 'high' ? 'bg-red-100 text-red-800' :
                                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  Update
                                </button>
                                <button className="text-purple-600 hover:text-purple-900">
                                  Complete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
