'use client';

import { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FilePdf, 
  Calendar,
  Users,
  BookOpen,
  CreditCard,
  Home,
  ClipboardList,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  formats: string[];
  category: string;
}

const exportOptions: ExportOption[] = [
  {
    id: 'students',
    name: 'Student Data',
    description: 'Export student information, enrollment details, and academic records',
    icon: Users,
    formats: ['PDF', 'Excel', 'CSV'],
    category: 'Academic'
  },
  {
    id: 'fees',
    name: 'Fee Records',
    description: 'Export fee collection data, payment history, and outstanding dues',
    icon: CreditCard,
    formats: ['PDF', 'Excel', 'CSV'],
    category: 'Financial'
  },
  {
    id: 'hostels',
    name: 'Hostel Data',
    description: 'Export hostel allocations, room occupancy, and accommodation details',
    icon: Home,
    formats: ['PDF', 'Excel', 'CSV'],
    category: 'Administrative'
  },
  {
    id: 'examinations',
    name: 'Exam Records',
    description: 'Export exam schedules, results, and grade reports',
    icon: ClipboardList,
    formats: ['PDF', 'Excel', 'CSV'],
    category: 'Academic'
  },
  {
    id: 'library',
    name: 'Library Data',
    description: 'Export book records, issue history, and library statistics',
    icon: BookOpen,
    formats: ['PDF', 'Excel', 'CSV'],
    category: 'Administrative'
  },
  {
    id: 'reports',
    name: 'Analytics Report',
    description: 'Export comprehensive analytics and dashboard reports',
    icon: FileText,
    formats: ['PDF', 'Excel'],
    category: 'Analytics'
  }
];

interface ExportManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportManager({ isOpen, onClose }: ExportManagerProps) {
  const [selectedOption, setSelectedOption] = useState<ExportOption | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    if (!selectedOption || !selectedFormat) return;

    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would call the backend API
      const exportData = {
        type: selectedOption.id,
        format: selectedFormat,
        dateRange,
        filters
      };

      console.log('Exporting data:', exportData);

      // Simulate successful export
      setExportStatus('success');
      
      // Reset form after successful export
      setTimeout(() => {
        setSelectedOption(null);
        setSelectedFormat('');
        setDateRange({ startDate: '', endDate: '' });
        setFilters({});
        setExportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FilePdf className="h-4 w-4 text-red-500" />;
      case 'Excel':
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case 'CSV':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Download className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {!selectedOption ? (
              // Step 1: Select Export Type
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Data to Export</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <Icon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              {option.formats.map((format) => (
                                <span
                                  key={format}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                                >
                                  {getFormatIcon(format)}
                                  <span className="ml-1">{format}</span>
                                </span>
                              ))}
                            </div>
                            <span className="inline-block mt-2 text-xs text-purple-600 font-medium">
                              {option.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Step 2: Configure Export
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <button
                    onClick={() => setSelectedOption(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2">
                    <selectedOption.icon className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-medium text-gray-900">{selectedOption.name}</h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Format Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Export Format
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedOption.formats.map((format) => (
                        <button
                          key={format}
                          onClick={() => setSelectedFormat(format)}
                          className={`p-3 border rounded-lg text-center transition-all ${
                            selectedFormat === format
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            {getFormatIcon(format)}
                            <span className="font-medium">{format}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Date Range (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Filters (Optional)
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Department</label>
                        <select
                          value={filters.department || ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">All Departments</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Status</label>
                        <select
                          value={filters.status || ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Export Status */}
                  {exportStatus === 'success' && (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">Export completed successfully!</span>
                    </div>
                  )}

                  {exportStatus === 'error' && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">Export failed. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {selectedOption && (
              <button
                onClick={handleExport}
                disabled={!selectedFormat || isExporting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export {selectedFormat}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
