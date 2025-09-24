// Export utilities for generating reports and downloading data

export interface ExportOptions {
  filename?: string;
  format: 'csv' | 'pdf' | 'excel';
  data: any[];
  columns?: string[];
  title?: string;
}

export class ExportService {
  static exportToCSV(data: any[], filename: string = 'export.csv', columns?: string[]) {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = columns || Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  static exportToExcel(data: any[], filename: string = 'export.xlsx', columns?: string[]) {
    // For Excel export, we'll use a simple CSV format that Excel can open
    // In a real application, you'd use a library like xlsx
    this.exportToCSV(data, filename.replace('.xlsx', '.csv'), columns);
  }

  static exportToPDF(data: any[], filename: string = 'export.pdf', title?: string) {
    // Simple PDF generation using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate PDF');
      return;
    }

    const html = this.generatePDFHTML(data, title);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  static generatePDFHTML(data: any[], title?: string): string {
    const headers = Object.keys(data[0] || {});
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || 'Export Report'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #9333EA; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #9333EA; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .footer { margin-top: 30px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <h1>${title || 'Export Report'}</h1>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => 
                `<tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  static exportStudentReport(students: any[]) {
    const columns = ['Student ID', 'Name', 'Email', 'Course', 'Semester', 'Status'];
    const data = students.map(student => ({
      'Student ID': student.studentId || student.id,
      'Name': `${student.firstName} ${student.lastName}`,
      'Email': student.email,
      'Course': student.course || 'N/A',
      'Semester': student.semester || 'N/A',
      'Status': student.status || 'Active'
    }));

    this.exportToCSV(data, `students-report-${new Date().toISOString().split('T')[0]}.csv`, columns);
  }

  static exportFeeReport(fees: any[]) {
    const columns = ['Student ID', 'Student Name', 'Fee Type', 'Amount', 'Due Date', 'Status', 'Payment Date'];
    const data = fees.map(fee => ({
      'Student ID': fee.studentId,
      'Student Name': fee.studentName,
      'Fee Type': fee.feeType,
      'Amount': fee.amount,
      'Due Date': fee.dueDate,
      'Status': fee.status,
      'Payment Date': fee.paymentDate || 'N/A'
    }));

    this.exportToCSV(data, `fees-report-${new Date().toISOString().split('T')[0]}.csv`, columns);
  }

  static exportBookReport(books: any[]) {
    const columns = ['Title', 'Author', 'ISBN', 'Category', 'Total Copies', 'Available Copies', 'Status'];
    const data = books.map(book => ({
      'Title': book.title,
      'Author': book.author,
      'ISBN': book.isbn,
      'Category': book.category,
      'Total Copies': book.totalCopies,
      'Available Copies': book.availableCopies,
      'Status': book.available ? 'Available' : 'Not Available'
    }));

    this.exportToCSV(data, `books-report-${new Date().toISOString().split('T')[0]}.csv`, columns);
  }

  static exportHostelReport(hostels: any[]) {
    const columns = ['Hostel Name', 'Type', 'Total Rooms', 'Occupied Rooms', 'Available Rooms', 'Monthly Rent'];
    const data = hostels.map(hostel => ({
      'Hostel Name': hostel.name,
      'Type': hostel.type,
      'Total Rooms': hostel.totalRooms,
      'Occupied Rooms': hostel.occupiedRooms,
      'Available Rooms': hostel.availableRooms,
      'Monthly Rent': hostel.monthlyRent
    }));

    this.exportToCSV(data, `hostels-report-${new Date().toISOString().split('T')[0]}.csv`, columns);
  }
}
