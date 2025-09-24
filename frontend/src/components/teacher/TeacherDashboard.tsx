'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar,
  BookOpen,
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
  PieChart
} from 'lucide-react';
import { dashboardApi } from '../../utils/api';

interface TeacherInfo {
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  qualification: string;
  joinDate: string;
}

interface ClassInfo {
  id: string;
  courseName: string;
  courseCode: string;
  semester: number;
  subject: string;
  schedule: string;
  room: string;
  studentsCount: number;
  nextClass: string;
}

interface StudentInfo {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: number;
  attendance: number;
  lastSeen: string;
}

interface ExamInfo {
  id: string;
  examName: string;
  subject: string;
  date: string;
  time: string;
  venue: string;
  studentsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [exams, setExams] = useState<ExamInfo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockTeacherInfo: TeacherInfo = {
        teacherId: 'TCH001',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@college.edu',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        qualification: 'Ph.D. in Computer Science',
        joinDate: '2020-08-15'
      };

      const mockClasses: ClassInfo[] = [
        {
          id: '1',
          courseName: 'Data Structures',
          courseCode: 'CS201',
          semester: 3,
          subject: 'Data Structures and Algorithms',
          schedule: 'Mon, Wed, Fri 10:00-11:00',
          room: 'CS-101',
          studentsCount: 45,
          nextClass: '2024-01-15 10:00'
        },
        {
          id: '2',
          courseName: 'Database Systems',
          courseCode: 'CS301',
          semester: 5,
          subject: 'Database Management Systems',
          schedule: 'Tue, Thu 14:00-15:30',
          room: 'CS-102',
          studentsCount: 38,
          nextClass: '2024-01-16 14:00'
        }
      ];

      const mockStudents: StudentInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          name: 'John Doe',
          course: 'Computer Science',
          semester: 3,
          attendance: 85,
          lastSeen: '2024-01-14'
        },
        {
          id: '2',
          studentId: 'STU002',
          name: 'Jane Smith',
          course: 'Computer Science',
          semester: 3,
          attendance: 92,
          lastSeen: '2024-01-14'
        }
      ];

      const mockExams: ExamInfo[] = [
        {
          id: '1',
          examName: 'Midterm Exam',
          subject: 'Data Structures',
          date: '2024-02-15',
          time: '10:00-12:00',
          venue: 'Main Hall',
          studentsCount: 45,
          status: 'upcoming'
        },
        {
          id: '2',
          examName: 'Assignment Submission',
          subject: 'Database Systems',
          date: '2024-01-20',
          time: '23:59',
          venue: 'Online',
          studentsCount: 38,
          status: 'upcoming'
        }
      ];

      setTeacherInfo(mockTeacherInfo);
      setClasses(mockClasses);
      setStudents(mockStudents);
      setExams(mockExams);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingClasses = classes.filter(cls => new Date(cls.nextClass) > new Date());
  const upcomingExams = exams.filter(exam => exam.status === 'upcoming');

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
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {teacherInfo?.firstName}!</p>
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
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Courses</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingExams.length}</p>
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
                { id: 'classes', name: 'My Classes', icon: BookOpen },
                { id: 'students', name: 'Students', icon: Users },
                { id: 'exams', name: 'Exams', icon: FileText },
                { id: 'schedule', name: 'Schedule', icon: Calendar }
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
                  {/* Upcoming Classes */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
                    <div className="space-y-3">
                      {upcomingClasses.slice(0, 3).map((cls) => (
                        <div key={cls.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{cls.courseName}</h4>
                              <p className="text-sm text-gray-600">{cls.subject}</p>
                              <p className="text-sm text-gray-500">{cls.schedule}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-purple-600">{cls.room}</p>
                              <p className="text-sm text-gray-500">{cls.studentsCount} students</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Students */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Students</h3>
                    <div className="space-y-3">
                      {students.slice(0, 3).map((student) => (
                        <div key={student.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{student.name}</h4>
                              <p className="text-sm text-gray-600">{student.course} - Sem {student.semester}</p>
                              <p className="text-sm text-gray-500">Last seen: {student.lastSeen}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-purple-600">{student.attendance}%</p>
                              <p className="text-sm text-gray-500">Attendance</p>
                            </div>
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
                      <Upload className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Upload Materials</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Create Assignment</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Schedule Exam</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.map((cls) => (
                    <div key={cls.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{cls.courseName}</h3>
                          <p className="text-sm text-gray-600">{cls.courseCode}</p>
                          <p className="text-sm text-gray-500">{cls.subject}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          Sem {cls.semester}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {cls.schedule}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          {cls.room}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {cls.studentsCount} students
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

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
                  </div>
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
                            Attendance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Seen
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
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
                              <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-purple-600 h-2 rounded-full" 
                                    style={{ width: `${student.attendance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{student.attendance}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.lastSeen}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-purple-600 hover:text-purple-900">
                                View Profile
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

            {/* Exams Tab */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exams.map((exam) => (
                    <div key={exam.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exam.examName}</h3>
                          <p className="text-sm text-gray-600">{exam.subject}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          exam.status === 'upcoming' ? 'bg-purple-100 text-purple-800' :
                          exam.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {exam.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {exam.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-2" />
                          {exam.venue}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {exam.studentsCount} students
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                          Manage Exam
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center">
                        <div className="font-medium text-gray-900 mb-2">{day}</div>
                        <div className="space-y-2">
                          {classes.filter(cls => cls.schedule.includes(day)).map((cls) => (
                            <div key={cls.id} className="bg-purple-100 text-purple-800 text-xs p-2 rounded">
                              <div className="font-medium">{cls.courseCode}</div>
                              <div>{cls.room}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
