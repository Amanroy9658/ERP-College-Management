'use client';

import { useState, useEffect } from 'react';
import { 
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
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { dashboardApi } from '../../utils/api';

interface BookInfo {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
}

interface IssueInfo {
  id: string;
  studentId: string;
  studentName: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  status: 'active' | 'overdue' | 'returned';
}

interface StudentInfo {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: number;
  booksIssued: number;
  fineAmount: number;
}

export default function LibrarianDashboard() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [issues, setIssues] = useState<IssueInfo[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLibrarianData();
  }, []);

  const fetchLibrarianData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockBooks: BookInfo[] = [
        {
          id: '1',
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen',
          isbn: '978-0262033848',
          category: 'Computer Science',
          available: true,
          totalCopies: 5,
          availableCopies: 3
        },
        {
          id: '2',
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz',
          isbn: '978-0073523323',
          category: 'Computer Science',
          available: true,
          totalCopies: 3,
          availableCopies: 2
        },
        {
          id: '3',
          title: 'Operating System Concepts',
          author: 'Abraham Silberschatz',
          isbn: '978-1118063330',
          category: 'Computer Science',
          available: false,
          totalCopies: 4,
          availableCopies: 0
        }
      ];

      const mockIssues: IssueInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          bookTitle: 'Introduction to Algorithms',
          issueDate: '2024-01-10',
          dueDate: '2024-01-24',
          status: 'active'
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          bookTitle: 'Database System Concepts',
          issueDate: '2024-01-05',
          dueDate: '2024-01-19',
          status: 'overdue'
        }
      ];

      const mockStudents: StudentInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          name: 'John Doe',
          course: 'Computer Science',
          semester: 3,
          booksIssued: 2,
          fineAmount: 0
        },
        {
          id: '2',
          studentId: 'STU002',
          name: 'Jane Smith',
          course: 'Computer Science',
          semester: 3,
          booksIssued: 1,
          fineAmount: 50
        }
      ];

      setBooks(mockBooks);
      setIssues(mockIssues);
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error fetching librarian data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeIssues = issues.filter(issue => issue.status === 'active');
  const overdueIssues = issues.filter(issue => issue.status === 'overdue');
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.available).length;

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
              <p className="text-gray-600 mt-1">Manage books, issues, and student records</p>
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
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Library className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Books</p>
                <p className="text-2xl font-bold text-gray-900">{availableBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Issues</p>
                <p className="text-2xl font-bold text-gray-900">{activeIssues.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{overdueIssues.length}</p>
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
                { id: 'books', name: 'Books', icon: BookOpen },
                { id: 'issues', name: 'Issues', icon: Users },
                { id: 'students', name: 'Students', icon: GraduationCap },
                { id: 'add-book', name: 'Add Book', icon: Plus }
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
                  {/* Recent Issues */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Issues</h3>
                    <div className="space-y-3">
                      {issues.slice(0, 3).map((issue) => (
                        <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{issue.bookTitle}</h4>
                              <p className="text-sm text-gray-600">{issue.studentName}</p>
                              <p className="text-sm text-gray-500">Due: {issue.dueDate}</p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              issue.status === 'active' ? 'bg-green-100 text-green-800' :
                              issue.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {issue.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overdue Books */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Books</h3>
                    <div className="space-y-3">
                      {overdueIssues.slice(0, 3).map((issue) => (
                        <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{issue.bookTitle}</h4>
                              <p className="text-sm text-gray-600">{issue.studentName}</p>
                              <p className="text-sm text-red-600">Overdue since: {issue.dueDate}</p>
                            </div>
                            <button className="text-purple-600 hover:text-purple-900 text-sm">
                              Send Reminder
                            </button>
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
                      <span className="text-sm font-medium">Add New Book</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Issue Book</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Return Book</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Generate Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Book Catalog</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Add Book
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                          <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                            {book.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Copies:</span>
                          <span className="font-medium">{book.totalCopies}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium">{book.availableCopies}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            book.available ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {book.available ? 'Available' : 'Not Available'}
                          </span>
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

            {/* Issues Tab */}
            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Book Issues</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Book
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Issue Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
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
                        {issues.map((issue) => (
                          <tr key={issue.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">
                                      {issue.studentName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{issue.studentName}</div>
                                  <div className="text-sm text-gray-500">{issue.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{issue.bookTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.issueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {issue.dueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                issue.status === 'active' ? 'bg-green-100 text-green-800' :
                                issue.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {issue.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  Return
                                </button>
                                <button className="text-purple-600 hover:text-purple-900">
                                  Renew
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

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Student Records</h3>
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
                            Books Issued
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fine Amount
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
                              <div className="text-sm font-medium text-gray-900">{student.booksIssued}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                student.fineAmount > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                ₹{student.fineAmount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-purple-600 hover:text-purple-900">
                                View History
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

            {/* Add Book Tab */}
            {activeTab === 'add-book' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Add New Book</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Book Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter book title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Author
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter author name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ISBN
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter ISBN"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>Computer Science</option>
                          <option>Mathematics</option>
                          <option>Physics</option>
                          <option>Chemistry</option>
                          <option>Literature</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Copies
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter number of copies"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Book
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
