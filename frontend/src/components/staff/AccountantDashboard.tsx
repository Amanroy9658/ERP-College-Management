'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard,
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
  Building2,
  Library,
  BarChart3,
  Search,
  Filter,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { dashboardApi } from '../../utils/api';

interface FeeInfo {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
  paymentMethod?: string;
}

interface PaymentInfo {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  feeType: string;
  transactionId: string;
}

interface FinancialSummary {
  totalRevenue: number;
  pendingFees: number;
  paidFees: number;
  overdueFees: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export default function AccountantDashboard() {
  const [fees, setFees] = useState<FeeInfo[]>([]);
  const [payments, setPayments] = useState<PaymentInfo[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAccountantData();
  }, []);

  const fetchAccountantData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockFees: FeeInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          feeType: 'Tuition Fee',
          amount: 50000,
          dueDate: '2024-01-15',
          status: 'paid',
          paymentDate: '2024-01-10',
          paymentMethod: 'Online Banking'
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          feeType: 'Hostel Fee',
          amount: 25000,
          dueDate: '2024-01-20',
          status: 'pending'
        },
        {
          id: '3',
          studentId: 'STU003',
          studentName: 'Mike Johnson',
          feeType: 'Library Fee',
          amount: 5000,
          dueDate: '2024-01-10',
          status: 'overdue'
        }
      ];

      const mockPayments: PaymentInfo[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          amount: 50000,
          paymentDate: '2024-01-10',
          paymentMethod: 'Online Banking',
          feeType: 'Tuition Fee',
          transactionId: 'TXN001'
        },
        {
          id: '2',
          studentId: 'STU004',
          studentName: 'Sarah Wilson',
          amount: 30000,
          paymentDate: '2024-01-12',
          paymentMethod: 'Credit Card',
          feeType: 'Tuition Fee',
          transactionId: 'TXN002'
        }
      ];

      const mockSummary: FinancialSummary = {
        totalRevenue: 1500000,
        pendingFees: 75000,
        paidFees: 1200000,
        overdueFees: 25000,
        monthlyRevenue: 125000,
        yearlyRevenue: 1500000
      };

      setFees(mockFees);
      setPayments(mockPayments);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error fetching accountant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingFees = fees.filter(fee => fee.status === 'pending');
  const paidFees = fees.filter(fee => fee.status === 'paid');
  const overdueFees = fees.filter(fee => fee.status === 'overdue');

  const filteredFees = fees.filter(fee =>
    fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.feeType.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-gray-600 mt-1">Manage fees, payments, and financial records</p>
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
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary?.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary?.pendingFees.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary?.paidFees.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹{summary?.overdueFees.toLocaleString()}</p>
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
                { id: 'fees', name: 'Fee Management', icon: CreditCard },
                { id: 'payments', name: 'Payments', icon: CheckCircle },
                { id: 'reports', name: 'Reports', icon: FileText },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp }
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
                  {/* Recent Payments */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                    <div className="space-y-3">
                      {payments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{payment.studentName}</h4>
                              <p className="text-sm text-gray-600">{payment.feeType}</p>
                              <p className="text-sm text-gray-500">{payment.paymentDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{payment.paymentMethod}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overdue Fees */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Fees</h3>
                    <div className="space-y-3">
                      {overdueFees.slice(0, 3).map((fee) => (
                        <div key={fee.id} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{fee.studentName}</h4>
                              <p className="text-sm text-gray-600">{fee.feeType}</p>
                              <p className="text-sm text-red-600">Due: {fee.dueDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-red-600">₹{fee.amount.toLocaleString()}</p>
                              <button className="text-purple-600 hover:text-purple-900 text-sm">
                                Send Reminder
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">₹{summary?.monthlyRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">₹{summary?.yearlyRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Yearly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{((summary?.paidFees || 0) / (summary?.totalRevenue || 1) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Collection Rate</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Plus className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Add Fee</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <CreditCard className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Process Payment</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Generate Receipt</span>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <Download className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-sm font-medium">Export Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Fee Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search fees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Add Fee
                    </button>
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
                            Fee Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
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
                        {filteredFees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">
                                      {fee.studentName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{fee.studentName}</div>
                                  <div className="text-sm text-gray-500">{fee.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{fee.feeType}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">₹{fee.amount.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {fee.dueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                                fee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {fee.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  View
                                </button>
                                {fee.status === 'pending' && (
                                  <button className="text-purple-600 hover:text-purple-900">
                                    Process Payment
                                  </button>
                                )}
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

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fee Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-600">
                                      {payment.studentName.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                                  <div className="text-sm text-gray-500">{payment.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{payment.feeType}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paymentDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{payment.transactionId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="text-purple-600 hover:text-purple-900">
                                  View Receipt
                                </button>
                                <button className="text-purple-600 hover:text-purple-900">
                                  <Download className="h-4 w-4" />
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

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                      <FileText className="h-6 w-6 text-purple-600 mb-2" />
                      <div className="font-medium">Monthly Revenue Report</div>
                      <div className="text-sm text-gray-600">Generate monthly financial summary</div>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                      <Users className="h-6 w-6 text-purple-600 mb-2" />
                      <div className="font-medium">Student Fee Report</div>
                      <div className="text-sm text-gray-600">Individual student fee status</div>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                      <AlertTriangle className="h-6 w-6 text-purple-600 mb-2" />
                      <div className="font-medium">Overdue Fees Report</div>
                      <div className="text-sm text-gray-600">List of all overdue payments</div>
                    </button>
                    <button className="p-4 border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                      <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
                      <div className="font-medium">Financial Analytics</div>
                      <div className="text-sm text-gray-600">Detailed financial analysis</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                        <p className="text-gray-600">Revenue chart will be displayed here</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                        <p className="text-gray-600">Payment method distribution</p>
                      </div>
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
