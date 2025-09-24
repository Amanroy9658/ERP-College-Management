'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { ExportService } from '../../utils/export';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  title?: string;
  exportType: 'students' | 'fees' | 'books' | 'hostels' | 'custom';
  columns?: string[];
  className?: string;
}

export default function ExportButton({
  data,
  filename,
  title,
  exportType,
  columns,
  className = ''
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);

    try {
      switch (exportType) {
        case 'students':
          ExportService.exportStudentReport(data);
          break;
        case 'fees':
          ExportService.exportFeeReport(data);
          break;
        case 'books':
          ExportService.exportBookReport(data);
          break;
        case 'hostels':
          ExportService.exportHostelReport(data);
          break;
        case 'custom':
          if (format === 'csv') {
            ExportService.exportToCSV(data, filename, columns);
          } else if (format === 'pdf') {
            ExportService.exportToPDF(data, filename, title);
          } else if (format === 'excel') {
            ExportService.exportToExcel(data, filename, columns);
          }
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="group">
        <button
          disabled={isExporting || data.length === 0}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-4 w-4 text-green-600" />
              <span>Export as CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <File className="h-4 w-4 text-red-600" />
              <span>Export as PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>Export as Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specific export buttons for common use cases
export function StudentExportButton({ data, className }: { data: any[]; className?: string }) {
  return (
    <ExportButton
      data={data}
      exportType="students"
      className={className}
    />
  );
}

export function FeeExportButton({ data, className }: { data: any[]; className?: string }) {
  return (
    <ExportButton
      data={data}
      exportType="fees"
      className={className}
    />
  );
}

export function BookExportButton({ data, className }: { data: any[]; className?: string }) {
  return (
    <ExportButton
      data={data}
      exportType="books"
      className={className}
    />
  );
}

export function HostelExportButton({ data, className }: { data: any[]; className?: string }) {
  return (
    <ExportButton
      data={data}
      exportType="hostels"
      className={className}
    />
  );
}
