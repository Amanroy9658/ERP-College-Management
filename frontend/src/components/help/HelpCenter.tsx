'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  User,
  Settings,
  CreditCard,
  Home,
  ClipboardList,
  Library,
  GraduationCap,
  FileText,
  Download,
  Upload,
  Bell,
  Shield,
  Lock
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to ERP System',
        content: 'Learn the basics of navigating and using the ERP Student Management System.',
        tags: ['introduction', 'basics', 'navigation'],
        difficulty: 'beginner'
      },
      {
        id: 'first-login',
        title: 'First Time Login',
        content: 'Step-by-step guide for your first login and account setup.',
        tags: ['login', 'setup', 'account'],
        difficulty: 'beginner'
      },
      {
        id: 'dashboard-overview',
        title: 'Understanding Your Dashboard',
        content: 'Learn about the different sections and features available on your dashboard.',
        tags: ['dashboard', 'overview', 'features'],
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: User,
    articles: [
      {
        id: 'profile-setup',
        title: 'Setting Up Your Profile',
        content: 'Complete guide to setting up and managing your user profile.',
        tags: ['profile', 'settings', 'personal'],
        difficulty: 'beginner'
      },
      {
        id: 'role-permissions',
        title: 'Understanding Roles & Permissions',
        content: 'Learn about different user roles and what permissions each role has.',
        tags: ['roles', 'permissions', 'access'],
        difficulty: 'intermediate'
      },
      {
        id: 'password-security',
        title: 'Password & Security',
        content: 'Best practices for password management and account security.',
        tags: ['security', 'password', 'safety'],
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'academic',
    title: 'Academic Management',
    icon: GraduationCap,
    articles: [
      {
        id: 'student-registration',
        title: 'Student Registration Process',
        content: 'Complete guide for students to register and complete their profile.',
        tags: ['registration', 'student', 'enrollment'],
        difficulty: 'beginner'
      },
      {
        id: 'course-management',
        title: 'Course Management',
        content: 'How to manage courses, subjects, and academic programs.',
        tags: ['courses', 'subjects', 'academic'],
        difficulty: 'intermediate'
      },
      {
        id: 'exam-system',
        title: 'Examination System',
        content: 'Guide to exam registration, hall tickets, and result viewing.',
        tags: ['exams', 'results', 'registration'],
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Management',
    icon: CreditCard,
    articles: [
      {
        id: 'fee-payment',
        title: 'Fee Payment Process',
        content: 'Step-by-step guide for making online fee payments.',
        tags: ['fees', 'payment', 'online'],
        difficulty: 'beginner'
      },
      {
        id: 'receipt-download',
        title: 'Downloading Receipts',
        content: 'How to download and manage your payment receipts.',
        tags: ['receipts', 'download', 'records'],
        difficulty: 'beginner'
      },
      {
        id: 'fee-structure',
        title: 'Understanding Fee Structure',
        content: 'Learn about different types of fees and payment schedules.',
        tags: ['fees', 'structure', 'schedule'],
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'hostel',
    title: 'Hostel Management',
    icon: Home,
    articles: [
      {
        id: 'hostel-application',
        title: 'Hostel Application Process',
        content: 'Complete guide to applying for hostel accommodation.',
        tags: ['hostel', 'application', 'accommodation'],
        difficulty: 'beginner'
      },
      {
        id: 'room-allocation',
        title: 'Room Allocation & Management',
        content: 'Understanding room allocation and hostel rules.',
        tags: ['room', 'allocation', 'rules'],
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'library',
    title: 'Library System',
    icon: Library,
    articles: [
      {
        id: 'book-search',
        title: 'Searching for Books',
        content: 'How to search and find books in the library system.',
        tags: ['books', 'search', 'library'],
        difficulty: 'beginner'
      },
      {
        id: 'book-issue',
        title: 'Issuing & Returning Books',
        content: 'Complete process for issuing and returning library books.',
        tags: ['issue', 'return', 'books'],
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Settings,
    articles: [
      {
        id: 'browser-requirements',
        title: 'Browser Requirements',
        content: 'Supported browsers and system requirements.',
        tags: ['browser', 'requirements', 'technical'],
        difficulty: 'beginner'
      },
      {
        id: 'troubleshooting',
        title: 'Common Issues & Solutions',
        content: 'Solutions to common technical problems and errors.',
        tags: ['troubleshooting', 'errors', 'solutions'],
        difficulty: 'intermediate'
      },
      {
        id: 'mobile-access',
        title: 'Mobile Access',
        content: 'How to access the system from mobile devices.',
        tags: ['mobile', 'access', 'devices'],
        difficulty: 'beginner'
      }
    ]
  }
];

const quickLinks = [
  { title: 'How to Pay Fees', icon: CreditCard, url: '/help/fee-payment' },
  { title: 'Download Hall Ticket', icon: Download, url: '/help/hall-ticket' },
  { title: 'Apply for Hostel', icon: Home, url: '/help/hostel-application' },
  { title: 'Search Books', icon: Library, url: '/help/book-search' },
  { title: 'Update Profile', icon: User, url: '/help/profile-setup' },
  { title: 'Contact Support', icon: MessageCircle, url: '/help/contact' }
];

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filteredSections = helpSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Help Center</h2>
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

          <div className="flex h-[calc(90vh-120px)]">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Links */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    {quickLinks.map((link, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center space-x-3 p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.title}</span>
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Help Sections */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Help Topics</h3>
                  <div className="space-y-1">
                    {filteredSections.map((section) => (
                      <div key={section.id}>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <section.icon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-900">{section.title}</span>
                            <span className="text-xs text-gray-500">({section.articles.length})</span>
                          </div>
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedSections.has(section.id) && (
                          <div className="ml-6 space-y-1">
                            {section.articles.map((article) => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="w-full text-left p-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span>{article.title}</span>
                                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(article.difficulty)}`}>
                                    {article.difficulty}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedArticle ? (
                <div className="p-6">
                  <div className="mb-6">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium mb-4"
                    >
                      ← Back to Help Topics
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(selectedArticle.difficulty)}`}>
                        {selectedArticle.difficulty}
                      </span>
                      <div className="flex items-center space-x-2">
                        {selectedArticle.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
                    
                    {/* Detailed content would go here */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-900 mb-2">Step-by-Step Guide</h3>
                      <ol className="list-decimal list-inside space-y-2 text-blue-800">
                        <li>Navigate to the relevant section in your dashboard</li>
                        <li>Follow the on-screen instructions</li>
                        <li>Complete all required fields</li>
                        <li>Submit your request or save your changes</li>
                      </ol>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-lg font-medium text-yellow-900 mb-2">Important Notes</h3>
                      <ul className="list-disc list-inside space-y-1 text-yellow-800">
                        <li>Make sure you have all required documents ready</li>
                        <li>Double-check all information before submitting</li>
                        <li>Contact support if you encounter any issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="text-center">
                    <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Help Center</h3>
                    <p className="text-gray-600 mb-6">
                      Select a topic from the sidebar to get started, or use the search to find specific information.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {quickLinks.map((link, index) => (
                        <button
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                        >
                          <link.icon className="h-6 w-6 text-purple-600 mb-2" />
                          <h4 className="font-medium text-gray-900">{link.title}</h4>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Live Chat</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Call Support</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email Support</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Need more help? Contact our support team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
