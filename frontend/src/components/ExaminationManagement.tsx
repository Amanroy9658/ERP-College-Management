'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Calendar,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  course: {
    courseName: string;
    courseCode: string;
  };
  semester: number;
  credits: number;
  totalMarks: number;
  status: 'Active' | 'Inactive';
}

interface Exam {
  id: string;
  examName: string;
  examType: 'Midterm' | 'Final' | 'Internal' | 'Assignment' | 'Quiz' | 'Practical';
  academicYear: string;
  semester: number;
  course: {
    courseName: string;
    courseCode: string;
  };
  examDate: string;
  examDuration: number;
  venue: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
}

interface Result {
  id: string;
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  exam: {
    examName: string;
    examType: string;
  };
  subject: {
    subjectName: string;
    subjectCode: string;
  };
  totalMarks: {
    obtained: number;
    total: number;
  };
  grade: string;
  gradePoints: number;
  status: 'Pass' | 'Fail' | 'Incomplete' | 'Withdrawn' | 'Absent';
  resultDate: string;
}

export default function ExaminationManagement() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'exams' | 'results'>('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      subjectCode: 'CS101',
      subjectName: 'Programming Fundamentals',
      course: { courseName: 'Computer Science', courseCode: 'CS' },
      semester: 1,
      credits: 4,
      totalMarks: 100,
      status: 'Active'
    },
    {
      id: '2',
      subjectCode: 'CS102',
      subjectName: 'Data Structures',
      course: { courseName: 'Computer Science', courseCode: 'CS' },
      semester: 2,
      credits: 4,
      totalMarks: 100,
      status: 'Active'
    },
    {
      id: '3',
      subjectCode: 'BA101',
      subjectName: 'Business Management',
      course: { courseName: 'Business Administration', courseCode: 'BA' },
      semester: 1,
      credits: 3,
      totalMarks: 100,
      status: 'Active'
    }
  ]);

  const [exams] = useState<Exam[]>([
    {
      id: '1',
      examName: 'Midterm Examination - Semester 1',
      examType: 'Midterm',
      academicYear: '2024-25',
      semester: 1,
      course: { courseName: 'Computer Science', courseCode: 'CS' },
      examDate: '2024-10-15',
      examDuration: 180,
      venue: 'Main Hall',
      status: 'Scheduled'
    },
    {
      id: '2',
      examName: 'Final Examination - Semester 1',
      examType: 'Final',
      academicYear: '2024-25',
      semester: 1,
      course: { courseName: 'Computer Science', courseCode: 'CS' },
      examDate: '2024-12-20',
      examDuration: 180,
      venue: 'Main Hall',
      status: 'Scheduled'
    },
    {
      id: '3',
      examName: 'Practical Examination - Programming',
      examType: 'Practical',
      academicYear: '2024-25',
      semester: 1,
      course: { courseName: 'Computer Science', courseCode: 'CS' },
      examDate: '2024-11-10',
      examDuration: 120,
      venue: 'Computer Lab',
      status: 'Completed'
    }
  ]);

  const [results] = useState<Result[]>([
    {
      id: '1',
      student: {
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      },
      exam: {
        examName: 'Midterm Examination - Semester 1',
        examType: 'Midterm'
      },
      subject: {
        subjectName: 'Programming Fundamentals',
        subjectCode: 'CS101'
      },
      totalMarks: {
        obtained: 85,
        total: 100
      },
      grade: 'A',
      gradePoints: 9,
      status: 'Pass',
      resultDate: '2024-10-20'
    },
    {
      id: '2',
      student: {
        studentId: 'STU002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      },
      exam: {
        examName: 'Midterm Examination - Semester 1',
        examType: 'Midterm'
      },
      subject: {
        subjectName: 'Programming Fundamentals',
        subjectCode: 'CS101'
      },
      totalMarks: {
        obtained: 92,
        total: 100
      },
      grade: 'A+',
      gradePoints: 10,
      status: 'Pass',
      resultDate: '2024-10-20'
    },
    {
      id: '3',
      student: {
        studentId: 'STU003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com'
      },
      exam: {
        examName: 'Midterm Examination - Semester 1',
        examType: 'Midterm'
      },
      subject: {
        subjectName: 'Programming Fundamentals',
        subjectCode: 'CS101'
      },
      totalMarks: {
        obtained: 45,
        total: 100
      },
      grade: 'F',
      gradePoints: 0,
      status: 'Fail',
      resultDate: '2024-10-20'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Pass':
      case 'Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Fail':
        return 'bg-red-100 text-red-800';
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Pass':
      case 'Scheduled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Completed':
        return <Award className="h-4 w-4 text-blue-600" />;
      case 'Fail':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Ongoing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSubjects = subjects.length;
  const activeSubjects = subjects.filter(subject => subject.status === 'Active').length;
  const totalExams = exams.length;
  const scheduledExams = exams.filter(exam => exam.status === 'Scheduled').length;
  const completedExams = exams.filter(exam => exam.status === 'Completed').length;
  const totalResults = results.length;
  const passResults = results.filter(result => result.status === 'Pass').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Examination Management</h1>
          <p className="text-gray-600 mt-1">Manage subjects, exams, results, and academic assessments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab === 'subjects' ? 'Subject' : activeTab === 'exams' ? 'Exam' : 'Result'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Subjects</p>
              <p className="text-2xl font-bold text-blue-800">{totalSubjects}</p>
              <p className="text-xs text-blue-600 mt-1">{activeSubjects} active</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Exams</p>
              <p className="text-2xl font-bold text-green-800">{totalExams}</p>
              <p className="text-xs text-green-600 mt-1">{scheduledExams} scheduled</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Results</p>
              <p className="text-2xl font-bold text-purple-800">{totalResults}</p>
              <p className="text-xs text-purple-600 mt-1">{completedExams} completed</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pass Rate</p>
              <p className="text-2xl font-bold text-orange-800">
                {totalResults > 0 ? Math.round((passResults / totalResults) * 100) : 0}%
              </p>
              <p className="text-xs text-orange-600 mt-1">Academic performance</p>
            </div>
            <div className="p-3 bg-orange-200 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subjects'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exams'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Exams
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="h-4 w-4 inline mr-2" />
              Results
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

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Marks
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
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BookOpen className="h-6 w-6 text-blue-600" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{subject.subjectName}</div>
                            <div className="text-sm text-gray-500">{subject.subjectCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.course.courseName}</div>
                        <div className="text-sm text-gray-500">{subject.course.courseCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Semester {subject.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.totalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(subject.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subject.status)}`}>
                            {subject.status}
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

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                        <div className="flex items-center">
                          <Calendar className="h-6 w-6 text-green-600" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{exam.examName}</div>
                            <div className="text-sm text-gray-500">{exam.academicYear}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.examType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{exam.course.courseName}</div>
                        <div className="text-sm text-gray-500">Semester {exam.semester}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(exam.examDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.examDuration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exam.venue}
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

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {result.student.firstName[0]}{result.student.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {result.student.firstName} {result.student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{result.student.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.exam.examName}</div>
                        <div className="text-sm text-gray-500">{result.exam.examType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.subject.subjectName}</div>
                        <div className="text-sm text-gray-500">{result.subject.subjectCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.totalMarks.obtained}/{result.totalMarks.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                          {result.grade} ({result.gradePoints})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(result.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(result.resultDate).toLocaleDateString()}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Add New {activeTab === 'subjects' ? 'Subject' : activeTab === 'exams' ? 'Exam' : 'Result'}
            </h2>
            <form className="space-y-4">
              {activeTab === 'subjects' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select Course</option>
                      <option>Computer Science</option>
                      <option>Business Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select Semester</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              {activeTab === 'exams' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select Type</option>
                      <option>Midterm</option>
                      <option>Final</option>
                      <option>Internal</option>
                      <option>Assignment</option>
                      <option>Quiz</option>
                      <option>Practical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select Semester</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
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
                  Add {activeTab === 'subjects' ? 'Subject' : activeTab === 'exams' ? 'Exam' : 'Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
