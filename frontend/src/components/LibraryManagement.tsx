'use client';

import { useState, useEffect } from 'react';
import { libraryApi } from '../utils/api';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  QrCode,
  Scan,
  BarChart3,
  TrendingUp,
  Users,
  BookMarked
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  status: 'Available' | 'Issued' | 'Maintenance' | 'Lost';
  addedDate: string;
  coverImage?: string;
}

interface IssueRecord {
  id: string;
  book: Book;
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Active' | 'Returned' | 'Overdue' | 'Lost';
  fine: number;
  renewed: boolean;
}

export default function LibraryManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueRecord | null>(null);
  const [activeTab, setActiveTab] = useState('books');

  // Load data on component mount
  useEffect(() => {
    loadBooks();
    loadIssueRecords();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await libraryApi.getBooks({
        search: searchTerm,
        category: filterCategory !== 'All' ? filterCategory : undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined
      });
      
      if (response.status === 'success') {
        setBooks(response.data.books);
      }
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const loadIssueRecords = async () => {
    try {
      const response = await libraryApi.getIssueRecords();
      
      if (response.status === 'success') {
        setIssueRecords(response.data.issues);
      }
    } catch (err) {
      console.error('Error loading issue records:', err);
    }
  };

  // Reload data when filters change
  useEffect(() => {
    loadBooks();
  }, [searchTerm, filterCategory, filterStatus]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || book.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Issued':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Returned':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBooks = books.length;
  const totalIssued = issueRecords.filter(record => record.status === 'Active').length;
  const totalOverdue = issueRecords.filter(record => record.status === 'Overdue').length;
  const totalFine = issueRecords.reduce((sum, record) => sum + record.fine, 0);

  const issueBook = (book: Book) => {
    setSelectedBook(book);
    setShowIssueModal(true);
  };

  const returnBook = (issue: IssueRecord) => {
    setSelectedIssue(issue);
    setShowReturnModal(true);
  };

  const renewBook = (issue: IssueRecord) => {
    const updatedRecords = issueRecords.map(record => {
      if (record.id === issue.id) {
        const newDueDate = new Date(issue.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14); // Extend by 14 days
        
        return {
          ...record,
          dueDate: newDueDate.toISOString().split('T')[0],
          renewed: true
        };
      }
      return record;
    });
    setIssueRecords(updatedRecords);
    alert('Book renewed successfully for 14 more days!');
  };

  const generateQRCode = (book: Book) => {
    // In a real app, this would generate a QR code
    alert(`QR Code generated for: ${book.title}`);
  };

  const exportData = () => {
    const csvData = books.map(book => ({
      'Title': book.title,
      'Author': book.author,
      'ISBN': book.isbn,
      'Category': book.category,
      'Publisher': book.publisher,
      'Publication Year': book.publicationYear,
      'Total Copies': book.totalCopies,
      'Available Copies': book.availableCopies,
      'Location': book.location,
      'Status': book.status
    }));
    
    console.log('Exporting library data:', csvData);
    alert('Library data exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-1">Manage books, issue/return, and track library operations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button
            onClick={() => setShowAddBookModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Books</p>
              <p className="text-2xl font-bold text-blue-800">{totalBooks}</p>
              <p className="text-xs text-blue-600 mt-1">In library collection</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Books Issued</p>
              <p className="text-2xl font-bold text-green-800">{totalIssued}</p>
              <p className="text-xs text-green-600 mt-1">Currently with students</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue Books</p>
              <p className="text-2xl font-bold text-red-800">{totalOverdue}</p>
              <p className="text-xs text-red-600 mt-1">Need attention</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Fine</p>
              <p className="text-2xl font-bold text-purple-800">₹{totalFine}</p>
              <p className="text-xs text-purple-600 mt-1">Outstanding amount</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Books
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'issues'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookMarked className="h-4 w-4 inline mr-2" />
              Issue Records
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'books' && (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="All">All Categories</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Issued">Issued</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Books Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Copies
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
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
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">by {book.author}</div>
                            <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium">{book.availableCopies}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-600">{book.totalCopies}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(book.status)}`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              onClick={() => issueBook(book)}
                              title="Issue Book"
                              disabled={book.availableCopies === 0}
                            >
                              <BookMarked className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                              onClick={() => generateQRCode(book)}
                              title="Generate QR Code"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'issues' && (
            <>
              {/* Issue Records Table */}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fine
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {issueRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {record.student.firstName[0]}{record.student.lastName[0]}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.student.firstName} {record.student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{record.student.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{record.book.title}</div>
                          <div className="text-sm text-gray-500">by {record.book.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {new Date(record.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIssueStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{record.fine}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {record.status === 'Active' && (
                              <>
                                <button 
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                                  onClick={() => returnBook(record)}
                                  title="Return Book"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button 
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                  onClick={() => renewBook(record)}
                                  title="Renew Book"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button 
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
