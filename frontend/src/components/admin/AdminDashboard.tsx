'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  BookOpen,
  Library,
  Home
} from 'lucide-react';
import { adminApi, dashboardApi } from '../../utils/api';
import { UserRoleChart, RevenueChart } from '../charts/Charts';
import NotificationBell from '../notifications/NotificationBell';
import { StudentExportButton } from '../export/ExportButton';

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  studentInfo?: {
    course: { courseName: string; courseCode: string };
    semester: number;
    academicYear: string;
  };
  teacherInfo?: {
    department: string;
    designation: string;
    qualification: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  approvedUsers: number;
  rejectedUsers: number;
  usersByRole: Array<{ _id: string; count: number }>;
  recentRegistrations: PendingUser[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvingUser, setApprovingUser] = useState<string | null>(null);
  const [rejectingUser, setRejectingUser] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await adminApi.getDashboardStats();
      if (statsResponse.status === 'success') {
        setStats(statsResponse.data);
      }

      // Fetch pending users
      const pendingResponse = await adminApi.getPendingApprovals();
      if (pendingResponse.status === 'success') {
        setPendingUsers(pendingResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Fallback to mock data if API fails
      const mockStats: DashboardStats = {
        totalUsers: 1250,
        pendingApprovals: 45,
        approvedUsers: 1150,
        rejectedUsers: 55,
        usersByRole: [
          { _id: 'student', count: 1000 },
          { _id: 'teacher', count: 150 },
          { _id: 'staff', count: 50 },
          { _id: 'librarian', count: 10 },
          { _id: 'warden', count: 5 },
          { _id: 'accountant', count: 15 },
          { _id: 'registrar', count: 5 }
        ],
        recentRegistrations: []
      };

      const mockPendingUsers: PendingUser[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          role: 'student',
          status: 'pending',
          createdAt: '2024-01-15',
          studentInfo: {
            course: { courseName: 'Computer Science', courseCode: 'CS' },
            semester: 3,
            academicYear: '2024-25'
          }
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+91 9876543211',
          role: 'teacher',
          status: 'pending',
          createdAt: '2024-01-14',
          teacherInfo: {
            department: 'Computer Science',
            designation: 'Assistant Professor',
            qualification: 'M.Tech'
          }
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          phone: '+91 9876543212',
          role: 'staff',
          status: 'pending',
          createdAt: '2024-01-13'
        }
      ];

      setStats(mockStats);
      setPendingUsers(mockPendingUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      setApprovingUser(userId);
      const response = await adminApi.approveUser(userId, { action: 'approve' });
      
      if (response.status === 'success') {
        // Remove user from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        // Update stats
        if (stats) {
          setStats(prev => prev ? { ...prev, pendingApprovals: prev.pendingApprovals - 1, approvedUsers: prev.approvedUsers + 1 } : null);
        }
        alert('User approved successfully!');
      } else {
        alert('Failed to approve user: ' + response.message);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user. Please try again.');
    } finally {
      setApprovingUser(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      setRejectingUser(userId);
      const response = await adminApi.approveUser(userId, { 
        action: 'reject', 
        reason: rejectReason 
      });
      
      if (response.status === 'success') {
        // Remove user from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        // Update stats
        if (stats) {
          setStats(prev => prev ? { ...prev, pendingApprovals: prev.pendingApprovals - 1, rejectedUsers: prev.rejectedUsers + 1 } : null);
        }
        alert('User rejected successfully!');
        setRejectReason('');
      } else {
        alert('Failed to reject user: ' + response.message);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user. Please try again.');
    } finally {
      setRejectingUser(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-5 w-5 text-purple-600" />;
      case 'teacher':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'staff':
        return <Building2 className="h-5 w-5 text-purple-600" />;
      case 'librarian':
        return <Library className="h-5 w-5 text-purple-600" />;
      case 'warden':
        return <Home className="h-5 w-5 text-purple-600" />;
      default:
        return <Shield className="h-5 w-5 text-purple-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-purple-100 text-purple-800';
      case 'teacher':
        return 'bg-purple-100 text-purple-800';
      case 'staff':
        return 'bg-purple-100 text-purple-800';
      case 'librarian':
        return 'bg-purple-100 text-purple-800';
      case 'warden':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const handleApprove = async (userId: string, action: 'approve' | 'reject') => {
    try {
      const response = await adminApi.approveUser(userId, action);
      
      if (response.status === 'success') {
        // Update local state
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        setShowApprovalModal(false);
        setSelectedUser(null);
        
        // Refresh stats
        fetchDashboardData();
        
        // Show success message
        alert(`User ${action}d successfully!`);
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Error processing approval. Please try again.');
    }
  };

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'All' || user.role === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage user accounts and system settings</p>
            </div>
                <div className="flex items-center space-x-4">
                  <NotificationBell />
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
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.approvedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <XCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.rejectedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Users by Role Chart */}
          <UserRoleChart 
            data={stats?.usersByRole.map(role => ({
              name: role._id.charAt(0).toUpperCase() + role._id.slice(1),
              value: role.count
            })) || []} 
          />
          
          {/* Revenue Chart */}
          <RevenueChart 
            data={[
              { name: 'Jan', value: 120000 },
              { name: 'Feb', value: 135000 },
              { name: 'Mar', value: 150000 },
              { name: 'Apr', value: 145000 },
              { name: 'May', value: 160000 },
              { name: 'Jun', value: 175000 }
            ]} 
          />
        </div>

        {/* Users by Role Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stats?.usersByRole.map((roleData) => (
              <div key={roleData._id} className="text-center">
                <div className="flex justify-center mb-2">
                  {getRoleIcon(roleData._id)}
                </div>
                <div className="text-2xl font-bold text-gray-900">{roleData.count}</div>
                <div className="text-sm text-gray-500 capitalize">{roleData._id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="All">All Roles</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="librarian">Librarian</option>
                      <option value="warden">Warden</option>
                    </select>
                    <StudentExportButton data={pendingUsers} />
                  </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.studentInfo && (
                        <div className="text-sm text-gray-900">
                          <div>{user.studentInfo.course.courseName}</div>
                          <div className="text-gray-500">Semester {user.studentInfo.semester}</div>
                          <div className="text-gray-500">{user.studentInfo.academicYear}</div>
                        </div>
                      )}
                      {user.teacherInfo && (
                        <div className="text-sm text-gray-900">
                          <div>{user.teacherInfo.department}</div>
                          <div className="text-gray-500">{user.teacherInfo.designation}</div>
                          <div className="text-gray-500">{user.teacherInfo.qualification}</div>
                        </div>
                      )}
                      {!user.studentInfo && !user.teacherInfo && (
                        <div className="text-sm text-gray-500">No additional details</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowApprovalModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          disabled={approvingUser === user.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Approve User"
                        >
                          {approvingUser === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Please provide a reason for rejection:');
                            if (reason) {
                              setRejectReason(reason);
                              handleRejectUser(user.id);
                            }
                          }}
                          disabled={rejectingUser === user.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Reject User"
                        >
                          {rejectingUser === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Review User Application</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Role:</span>
                      <div className="flex items-center mt-1">
                        {getRoleIcon(selectedUser.role)}
                        <span className="ml-2 capitalize">{selectedUser.role}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <div className="mt-1">{selectedUser.phone}</div>
                    </div>
                    <div>
                      <span className="font-medium">Registration:</span>
                      <div className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {selectedUser.studentInfo && (
                    <div className="mt-4">
                      <span className="font-medium">Student Details:</span>
                      <div className="mt-1 text-sm">
                        <div>Course: {selectedUser.studentInfo.course.courseName}</div>
                        <div>Semester: {selectedUser.studentInfo.semester}</div>
                        <div>Academic Year: {selectedUser.studentInfo.academicYear}</div>
                      </div>
                    </div>
                  )}

                  {selectedUser.teacherInfo && (
                    <div className="mt-4">
                      <span className="font-medium">Teacher Details:</span>
                      <div className="mt-1 text-sm">
                        <div>Department: {selectedUser.teacherInfo.department}</div>
                        <div>Designation: {selectedUser.teacherInfo.designation}</div>
                        <div>Qualification: {selectedUser.teacherInfo.qualification}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApprove(selectedUser.id, 'reject')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedUser.id, 'approve')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
