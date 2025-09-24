'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar,
  BookOpen,
  Home,
  Utensils,
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
  Library
} from 'lucide-react';
import { dashboardApi } from '../../utils/api';

interface StudentInfo {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  semester: number;
  academicYear: string;
  admissionDate: string;
}

interface ExamInfo {
  id: string;
  examName: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface HostelInfo {
  hostelName: string;
  roomNumber: string;
  floor: number;
  monthlyRent: number;
  status: 'active' | 'pending' | 'none';
}

interface MessInfo {
  mealPlan: string;
  monthlyFee: number;
  nextPaymentDate: string;
  status: 'active' | 'pending' | 'none';
}

interface FormInfo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  googleFormUrl: string;
}

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [messInfo, setMessInfo] = useState<MessInfo | null>(null);
  const [forms, setForms] = useState<FormInfo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStudentInfo: StudentInfo = {
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        course: 'Computer Science',
        semester: 3,
        academicYear: '2024-25',
        admissionDate: '2023-08-15'
      };

      const mockExams: ExamInfo[] = [
        {
          id: '1',
          examName: 'Midterm Examination',
          subject: 'Data Structures',
          date: '2024-02-15',
          time: '10:00 AM',
          venue: 'Main Hall',
          status: 'upcoming'
        },
        {
          id: '2',
          examName: 'Final Examination',
          subject: 'Database Management',
          date: '2024-03-20',
          time: '2:00 PM',
          venue: 'Computer Lab',
          status: 'upcoming'
        },
        {
          id: '3',
          examName: 'Practical Examination',
          subject: 'Programming',
          date: '2024-01-25',
          time: '9:00 AM',
          venue: 'Lab 1',
          status: 'completed'
        }
      ];

      const mockHostelInfo: HostelInfo = {
        hostelName: 'Boys Hostel A',
        roomNumber: '101',
        floor: 1,
        monthlyRent: 8000,
        status: 'active'
      };

      const mockMessInfo: MessInfo = {
        mealPlan: 'Full Board',
        monthlyFee: 5000,
        nextPaymentDate: '2024-02-01',
        status: 'active'
      };

      const mockForms: FormInfo[] = [
        {
          id: '1',
          title: 'Semester Registration Form',
          description: 'Complete your semester registration for 2024-25',
          dueDate: '2024-02-10',
          status: 'pending',
          googleFormUrl: 'https://forms.gle/example1'
        },
        {
          id: '2',
          title: 'Hostel Application Form',
          description: 'Apply for hostel accommodation for next semester',
          dueDate: '2024-02-15',
          status: 'submitted',
          googleFormUrl: 'https://forms.gle/example2'
        },
        {
          id: '3',
          title: 'Mess Preference Form',
          description: 'Select your meal preferences for the semester',
          dueDate: '2024-01-30',
          status: 'overdue',
          googleFormUrl: 'https://forms.gle/example3'
        },
        {
          id: '4',
          title: 'Library Membership Form',
          description: 'Register for library membership and borrowing privileges',
          dueDate: '2024-02-20',
          status: 'pending',
          googleFormUrl: 'https://forms.gle/example4'
        }
      ];

      setStudentInfo(mockStudentInfo);
      setExams(mockExams);
      setHostelInfo(mockHostelInfo);
      setMessInfo(mockMessInfo);
      setForms(mockForms);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'active':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'ongoing':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
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

  const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
  const pendingForms = forms.filter(form => form.status === 'pending');
  const overdueForms = forms.filter(form => form.status === 'overdue');

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
              <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
              <p className="text-gray-600 mt-1">Welcome back, {studentInfo?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Student ID: {studentInfo?.studentId}
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Forms</p>
                <p className="text-2xl font-bold text-gray-900">{pendingForms.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Forms</p>
                <p className="text-2xl font-bold text-gray-900">{overdueForms.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-2xl font-bold text-gray-900">{studentInfo?.semester}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'exams', label: 'Examinations', icon: BookOpen },
                { id: 'hostel', label: 'Hostel', icon: Home },
                { id: 'mess', label: 'Mess', icon: Utensils },
                { id: 'forms', label: 'Forms', icon: FileText },
                { id: 'library', label: 'Library', icon: Library }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{studentInfo?.firstName} {studentInfo?.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student ID:</span>
                        <span className="font-medium">{studentInfo?.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Course:</span>
                        <span className="font-medium">{studentInfo?.course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Semester:</span>
                        <span className="font-medium">{studentInfo?.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Academic Year:</span>
                        <span className="font-medium">{studentInfo?.academicYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Download className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">Download ID Card</span>
                      </button>
                      <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Pay Fees</span>
                      </button>
                      <button className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium">Contact Support</span>
                      </button>
                      <button className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Settings className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="text-sm font-medium">Settings</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Hostel Application Form submitted</span>
                      <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Midterm Examination scheduled</span>
                      <span className="text-xs text-gray-500 ml-auto">5 days ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-sm">Mess Preference Form overdue</span>
                      <span className="text-xs text-gray-500 ml-auto">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Examination Schedule</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download Schedule
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Venue
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
                      {exams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{exam.examName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{exam.subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(exam.date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{exam.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{exam.venue}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(exam.status)}
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                                {exam.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hostel Tab */}
            {activeTab === 'hostel' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Hostel Information</h3>
                
                {hostelInfo ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Current Allocation</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hostel:</span>
                            <span className="font-medium">{hostelInfo.hostelName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room:</span>
                            <span className="font-medium">{hostelInfo.roomNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Floor:</span>
                            <span className="font-medium">{hostelInfo.floor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rent:</span>
                            <span className="font-medium">{formatCurrency(hostelInfo.monthlyRent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hostelInfo.status)}`}>
                              {hostelInfo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-center p-3 bg-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
                            <FileText className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Apply for Room Change</span>
                          </button>
                          <button className="w-full flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <CreditCard className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Pay Hostel Fee</span>
                          </button>
                          <button className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                            <MessageSquare className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm font-medium">Contact Warden</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Hostel Allocation</h4>
                    <p className="text-gray-600 mb-4">You don't have a hostel allocation yet.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Apply for Hostel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mess Tab */}
            {activeTab === 'mess' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Mess Information</h3>
                
                {messInfo ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Current Plan</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Meal Plan:</span>
                            <span className="font-medium">{messInfo.mealPlan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Fee:</span>
                            <span className="font-medium">{formatCurrency(messInfo.monthlyFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Payment:</span>
                            <span className="font-medium">{new Date(messInfo.nextPaymentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(messInfo.status)}`}>
                              {messInfo.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <FileText className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Change Meal Plan</span>
                          </button>
                          <button className="w-full flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <CreditCard className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Pay Mess Fee</span>
                          </button>
                          <button className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                            <MessageSquare className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm font-medium">Feedback</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Mess Plan</h4>
                    <p className="text-gray-600 mb-4">You don't have a mess plan yet.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Subscribe to Mess
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Forms & Applications</h3>
                  <div className="text-sm text-gray-500">
                    {pendingForms.length} pending, {overdueForms.length} overdue
                  </div>
                </div>

                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{form.title}</h4>
                            <div className="flex items-center">
                              {getStatusIcon(form.status)}
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(form.status)}`}>
                                {form.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{form.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(form.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {form.status === 'pending' || form.status === 'overdue' ? (
                            <button
                              onClick={() => window.open(form.googleFormUrl, '_blank')}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Fill Form
                            </button>
                          ) : (
                            <button
                              onClick={() => window.open(form.googleFormUrl, '_blank')}
                              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Form
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Library Tab */}
            {activeTab === 'library' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Library Services</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Library Account</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Membership Status:</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Books Borrowed:</span>
                        <span className="font-medium">3/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overdue Books:</span>
                        <span className="font-medium text-red-600">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fine Amount:</span>
                        <span className="font-medium text-red-600">₹50</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">Search Books</span>
                      </button>
                      <button className="w-full flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <Download className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Download E-Books</span>
                      </button>
                      <button className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <CreditCard className="h-4 w-4 text-purple-600 mr-2" />
                        <span className="text-sm font-medium">Pay Fine</span>
                      </button>
                    </div>
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
