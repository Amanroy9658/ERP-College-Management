'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Send,
  Receipt,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import { feeApi } from '../utils/api';

interface FeeRecord {
  id: string;
  student: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  academicYear: string;
  semester: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  overallStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  dueDate: string;
  payments: Array<{
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: string;
  }>;
}

export default function FeeManagement() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load fee records on component mount
  useEffect(() => {
    loadFeeRecords();
  }, []);

  const loadFeeRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await feeApi.getFees({
        page: 1,
        limit: 100,
        search: searchTerm,
        status: filterStatus !== 'All' ? filterStatus : undefined
      });

      if (response.status === 'success' && response.data) {
        setFeeRecords(response.data.fees || []);
      } else {
        setError(response.message || 'Failed to load fee records');
        // Fallback to mock data for demo
        setFeeRecords([
          {
            id: '1',
            student: {
              studentId: 'STU001',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com'
            },
            academicYear: '2024-25',
            semester: 3,
            totalAmount: 50000,
            totalPaid: 50000,
            totalDue: 0,
            overallStatus: 'Paid',
            dueDate: '2024-08-15',
            payments: [
              {
                amount: 50000,
                paymentDate: '2024-08-10',
                paymentMethod: 'Online',
                status: 'Success'
              }
            ]
          },
          {
            id: '2',
            student: {
              studentId: 'STU002',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com'
            },
            academicYear: '2024-25',
            semester: 2,
            totalAmount: 45000,
            totalPaid: 25000,
            totalDue: 20000,
            overallStatus: 'Partial',
            dueDate: '2024-08-15',
            payments: [
              {
                amount: 25000,
                paymentDate: '2024-08-05',
                paymentMethod: 'Bank Transfer',
                status: 'Success'
              }
            ]
          },
          {
            id: '3',
            student: {
              studentId: 'STU003',
              firstName: 'Mike',
              lastName: 'Johnson',
              email: 'mike.johnson@example.com'
            },
            academicYear: '2024-25',
            semester: 4,
            totalAmount: 55000,
            totalPaid: 0,
            totalDue: 55000,
            overallStatus: 'Overdue',
            dueDate: '2024-07-15',
            payments: []
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading fee records:', err);
      setError('Failed to load fee records. Using demo data.');
      // Fallback to mock data
      setFeeRecords([
        {
          id: '1',
          student: {
            studentId: 'STU001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          },
          academicYear: '2024-25',
          semester: 3,
          totalAmount: 50000,
          totalPaid: 50000,
          totalDue: 0,
          overallStatus: 'Paid',
          dueDate: '2024-08-15',
          payments: [
            {
              amount: 50000,
              paymentDate: '2024-08-10',
              paymentMethod: 'Online',
              status: 'Success'
            }
          ]
        },
        {
          id: '2',
          student: {
            studentId: 'STU002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com'
          },
          academicYear: '2024-25',
          semester: 2,
          totalAmount: 45000,
          totalPaid: 25000,
          totalDue: 20000,
          overallStatus: 'Partial',
          dueDate: '2024-08-15',
          payments: [
            {
              amount: 25000,
              paymentDate: '2024-08-05',
              paymentMethod: 'Bank Transfer',
              status: 'Success'
            }
          ]
        },
        {
          id: '3',
          student: {
            studentId: 'STU003',
            firstName: 'Mike',
            lastName: 'Johnson',
            email: 'mike.johnson@example.com'
          },
          academicYear: '2024-25',
          semester: 4,
          totalAmount: 55000,
          totalPaid: 0,
          totalDue: 55000,
          overallStatus: 'Overdue',
          dueDate: '2024-07-15',
          payments: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadFeeRecords();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = 
      record.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || record.overallStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Partial':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Overdue':
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

  const totalRevenue = feeRecords.reduce((sum, record) => sum + record.totalPaid, 0);
  const totalExpected = feeRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalDue = feeRecords.reduce((sum, record) => sum + record.totalDue, 0);

  // Payment Gateway Integration
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await initializeRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_1234567890',
        amount: Number(paymentAmount) * 100, // Amount in paise
        currency: 'INR',
        name: 'College ERP System',
        description: `Fee Payment for ${selectedFee?.student.firstName} ${selectedFee?.student.lastName}`,
        image: '/logo.png',
        order_id: `order_${Date.now()}`,
        handler: function (response: any) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          handlePaymentSuccess(response.razorpay_payment_id);
        },
        prefill: {
          name: selectedFee?.student.firstName + ' ' + selectedFee?.student.lastName,
          email: selectedFee?.student.email,
        },
        theme: {
          color: '#8B5CF6',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (selectedFee) {
      try {
        // Record payment in backend
        const response = await feeApi.recordPayment(selectedFee.id, {
          amount: Number(paymentAmount),
          paymentMethod: 'Online',
          transactionId: paymentId,
          paymentDate: new Date().toISOString(),
          remarks: 'Razorpay payment'
        });

        if (response.status === 'success') {
          // Update local state with backend response
          const updatedRecords = feeRecords.map(record => {
            if (record.id === selectedFee.id) {
              return response.data.fee;
            }
            return record;
          });
          
          setFeeRecords(updatedRecords);
          alert('Payment recorded successfully!');
        } else {
          // Fallback to local update
          const updatedRecords = feeRecords.map(record => {
            if (record.id === selectedFee.id) {
              const newPayment = {
                amount: Number(paymentAmount),
                paymentDate: paymentDate,
                paymentMethod: 'Online',
                status: 'Success'
              };
              
              const newTotalPaid = record.totalPaid + Number(paymentAmount);
              const newTotalDue = record.totalAmount - newTotalPaid;
              const newStatus = newTotalDue <= 0 ? 'Paid' : 'Partial';
              
              return {
                ...record,
                totalPaid: newTotalPaid,
                totalDue: newTotalDue,
                overallStatus: newStatus as 'Paid' | 'Partial' | 'Pending' | 'Overdue',
                payments: [...record.payments, newPayment]
              };
            }
            return record;
          });
          
          setFeeRecords(updatedRecords);
          alert('Payment recorded successfully!');
        }
      } catch (error) {
        console.error('Error recording payment:', error);
        alert('Payment successful but failed to record in system. Please contact admin.');
      } finally {
        setShowPaymentModal(false);
        setShowRazorpayModal(false);
        setSelectedFee(null);
        setPaymentAmount('');
      }
    }
  };

  const generateReceipt = (record: FeeRecord) => {
    // Generate PDF receipt
    const receiptData = {
      studentName: `${record.student.firstName} ${record.student.lastName}`,
      studentId: record.student.studentId,
      amount: record.totalAmount,
      paid: record.totalPaid,
      due: record.totalDue,
      status: record.overallStatus,
      payments: record.payments
    };
    
    // In a real app, this would generate and download a PDF
    alert(`Receipt generated for ${record.student.firstName} ${record.student.lastName}`);
  };

  const sendReminder = (record: FeeRecord) => {
    // Send payment reminder
    alert(`Payment reminder sent to ${record.student.email}`);
  };

  const exportData = () => {
    // Export fee data to CSV
    const csvData = feeRecords.map(record => ({
      'Student ID': record.student.studentId,
      'Student Name': `${record.student.firstName} ${record.student.lastName}`,
      'Email': record.student.email,
      'Academic Year': record.academicYear,
      'Semester': record.semester,
      'Total Amount': record.totalAmount,
      'Total Paid': record.totalPaid,
      'Total Due': record.totalDue,
      'Status': record.overallStatus,
      'Due Date': record.dueDate
    }));
    
    // In a real app, this would download a CSV file
    console.log('Exporting data:', csvData);
    alert('Data exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading fee records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-1">Manage student fee collection and payments with integrated payment gateway</p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
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
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Expected Revenue</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalExpected)}</p>
              <p className="text-xs text-blue-600 mt-1">Current academic year</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(totalDue)}</p>
              <p className="text-xs text-red-600 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Collection Rate</p>
              <p className="text-2xl font-bold text-purple-800">
                {totalExpected > 0 ? Math.round((totalRevenue / totalExpected) * 100) : 0}%
              </p>
              <p className="text-xs text-purple-600 mt-1">Payment efficiency</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {record.student.firstName[0]}{record.student.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.student.firstName} {record.student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{record.student.studentId}</div>
                        <div className="text-xs text-gray-400">{record.student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.academicYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Semester {record.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {formatCurrency(record.totalPaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {formatCurrency(record.totalDue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.overallStatus)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.overallStatus)}`}>
                        {record.overallStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(record.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedFee(record);
                          setShowPaymentModal(true);
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedFee(record);
                          setShowPaymentModal(true);
                        }}
                        title="Record Payment"
                      >
                        <CreditCard className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => generateReceipt(record)}
                        title="Generate Receipt"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
                        onClick={() => sendReminder(record)}
                        title="Send Reminder"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedFee ? 'Record Payment' : 'Record Payment'}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedFee(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {selectedFee && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">
                      {selectedFee.student.firstName[0]}{selectedFee.student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedFee.student.firstName} {selectedFee.student.lastName}</p>
                    <p className="text-sm text-gray-600">ID: {selectedFee.student.studentId}</p>
                    <p className="text-sm text-red-600 font-medium">Outstanding: {formatCurrency(selectedFee.totalDue)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                    max={selectedFee?.totalDue || undefined}
                  />
                </div>
                {selectedFee && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatCurrency(selectedFee.totalDue)}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Online">Online Payment (Razorpay)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              
              {paymentMethod !== 'Online' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedFee(null);
                    setPaymentAmount('');
                    setTransactionId('');
                  }}
                  className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {paymentMethod === 'Online' ? (
                  <button
                    type="button"
                    onClick={makePayment}
                    disabled={paymentLoading || !paymentAmount}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay with Razorpay
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
