'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  BookOpen,
  Building2,
  Library,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  GraduationCap,
  Calendar,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface NavigationProps {
  userRole: string;
  userName: string;
  userEmail: string;
}

export default function Navigation({ userRole, userName, userEmail }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Settings className="h-5 w-5" />;
      case 'student':
        return <GraduationCap className="h-5 w-5" />;
      case 'teacher':
        return <Users className="h-5 w-5" />;
      case 'librarian':
        return <Library className="h-5 w-5" />;
      case 'warden':
        return <Building2 className="h-5 w-5" />;
      case 'accountant':
        return <CreditCard className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-600';
      case 'student':
        return 'bg-purple-100 text-purple-600';
      case 'teacher':
        return 'bg-purple-100 text-purple-600';
      case 'librarian':
        return 'bg-purple-100 text-purple-600';
      case 'warden':
        return 'bg-purple-100 text-purple-600';
      case 'accountant':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  const getNavigationItems = (role: string) => {
    const baseItems = [
      { name: 'Dashboard', href: `/${role}/dashboard`, icon: BarChart3 },
      { name: 'Profile', href: `/${role}/profile`, icon: User },
      { name: 'Settings', href: `/${role}/settings`, icon: Settings }
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'System Settings', href: '/admin/settings', icon: Settings },
          { name: 'Reports', href: '/admin/reports', icon: FileText }
        ];
      
      case 'student':
        return [
          ...baseItems,
          { name: 'Exams', href: '/student/exams', icon: Calendar },
          { name: 'Fees', href: '/student/fees', icon: CreditCard },
          { name: 'Hostel', href: '/student/hostel', icon: Building2 },
          { name: 'Library', href: '/student/library', icon: Library },
          { name: 'Forms', href: '/student/forms', icon: FileText }
        ];
      
      case 'teacher':
        return [
          ...baseItems,
          { name: 'Classes', href: '/teacher/classes', icon: BookOpen },
          { name: 'Students', href: '/teacher/students', icon: Users },
          { name: 'Exams', href: '/teacher/exams', icon: Calendar },
          { name: 'Schedule', href: '/teacher/schedule', icon: Calendar }
        ];
      
      case 'librarian':
        return [
          ...baseItems,
          { name: 'Books', href: '/librarian/books', icon: BookOpen },
          { name: 'Issues', href: '/librarian/issues', icon: Users },
          { name: 'Students', href: '/librarian/students', icon: GraduationCap },
          { name: 'Reports', href: '/librarian/reports', icon: FileText }
        ];
      
      case 'warden':
        return [
          ...baseItems,
          { name: 'Hostels', href: '/warden/hostels', icon: Building2 },
          { name: 'Rooms', href: '/warden/rooms', icon: Home },
          { name: 'Students', href: '/warden/students', icon: Users },
          { name: 'Maintenance', href: '/warden/maintenance', icon: Settings }
        ];
      
      case 'accountant':
        return [
          ...baseItems,
          { name: 'Fees', href: '/accountant/fees', icon: CreditCard },
          { name: 'Payments', href: '/accountant/payments', icon: CreditCard },
          { name: 'Reports', href: '/accountant/reports', icon: FileText },
          { name: 'Analytics', href: '/accountant/analytics', icon: BarChart3 }
        ];
      
      default:
        return baseItems;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navigationItems = getNavigationItems(userRole);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">College ERP</h1>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-purple-600">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}