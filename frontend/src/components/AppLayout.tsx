'use client';

import { useState } from 'react';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import StudentManagement from './StudentManagement';
import FeeManagement from './FeeManagement';
import HostelManagement from './HostelManagement';
import ExaminationManagement from './ExaminationManagement';

export default function AppLayout() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentManagement />;
      case 'fees':
        return <FeeManagement />;
      case 'hostels':
        return <HostelManagement />;
      case 'examinations':
        return <ExaminationManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeModule={activeModule} onModuleChange={setActiveModule} />
      
      {/* Main content */}
      <div className="lg:ml-64">
        <div className="p-6">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
