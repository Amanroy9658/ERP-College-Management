'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  BookOpen,
  GraduationCap,
  CreditCard,
  Home,
  FileText,
  HelpCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: BookOpen, label: 'Library Help', query: 'How do I search for books in the library?' },
  { icon: GraduationCap, label: 'Academic Info', query: 'What are my upcoming exams?' },
  { icon: CreditCard, label: 'Fee Payment', query: 'How do I pay my fees online?' },
  { icon: Home, label: 'Hostel Info', query: 'How do I apply for hostel accommodation?' },
  { icon: FileText, label: 'Documents', query: 'How do I upload my documents?' },
  { icon: HelpCircle, label: 'General Help', query: 'What can you help me with?' }
];

const predefinedResponses = {
  'library': {
    search: 'To search for books in the library:\n1. Go to Library Management section\n2. Use the search bar to enter book title, author, or ISBN\n3. Filter by category if needed\n4. Click on a book to view details or issue it',
    issue: 'To issue a book:\n1. Find the book you want\n2. Click the "Issue Book" button\n3. Select your student ID\n4. Choose due date\n5. Confirm the issue',
    return: 'To return a book:\n1. Go to Issue Records tab\n2. Find your active issue\n3. Click "Return Book"\n4. The system will calculate any fines if overdue'
  },
  'fees': {
    payment: 'To pay fees online:\n1. Go to Fee Management section\n2. Find your pending fees\n3. Click "Pay Now" button\n4. Choose payment method (Razorpay)\n5. Complete the payment process\n6. Download receipt',
    receipt: 'To download fee receipt:\n1. Go to Fee Management\n2. Find your paid fees\n3. Click "Generate Receipt"\n4. Download the PDF receipt'
  },
  'hostel': {
    apply: 'To apply for hostel:\n1. Go to Hostel Management section\n2. View available hostels and rooms\n3. Click "Apply for Hostel"\n4. Fill the application form\n5. Submit for approval',
    allocation: 'To check hostel allocation:\n1. Go to Hostel Management\n2. Check "My Allocation" tab\n3. View your assigned room and hostel details'
  },
  'exams': {
    register: 'To register for exams:\n1. Go to Examination Management\n2. Click "Register for Exam"\n3. Select the exam you want to register for\n4. Confirm your registration\n5. Download hall ticket when available',
    results: 'To view exam results:\n1. Go to Examination Management\n2. Click "Results" tab\n3. Select the exam\n4. View your marks and grades\n5. Download transcript if needed'
  },
  'documents': {
    upload: 'To upload documents:\n1. Go to Student Dashboard\n2. Click "Documents" section\n3. Select document type\n4. Upload the file\n5. Submit for verification',
    status: 'To check document status:\n1. Go to Documents section\n2. View the status of each document\n3. Green checkmark means verified\n4. Red X means rejected - upload again'
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your ERP assistant. How can I help you today?',
      timestamp: new Date(),
      suggestions: ['Library help', 'Fee payment', 'Hostel application', 'Exam registration']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Library related queries
    if (message.includes('library') || message.includes('book')) {
      if (message.includes('search')) return predefinedResponses.library.search;
      if (message.includes('issue')) return predefinedResponses.library.issue;
      if (message.includes('return')) return predefinedResponses.library.return;
      return 'For library help, I can assist you with:\n• Searching for books\n• Issuing books\n• Returning books\n• Checking due dates\n\nWhat specific library task do you need help with?';
    }
    
    // Fee related queries
    if (message.includes('fee') || message.includes('payment') || message.includes('pay')) {
      if (message.includes('pay')) return predefinedResponses.fees.payment;
      if (message.includes('receipt')) return predefinedResponses.fees.receipt;
      return 'For fee management, I can help you with:\n• Making online payments\n• Downloading receipts\n• Checking fee status\n• Understanding fee structure\n\nWhat would you like to know about fees?';
    }
    
    // Hostel related queries
    if (message.includes('hostel') || message.includes('room') || message.includes('accommodation')) {
      if (message.includes('apply')) return predefinedResponses.hostel.apply;
      if (message.includes('allocation')) return predefinedResponses.hostel.allocation;
      return 'For hostel management, I can help you with:\n• Applying for hostel\n• Checking room allocation\n• Understanding hostel rules\n• Contacting warden\n\nWhat hostel-related question do you have?';
    }
    
    // Exam related queries
    if (message.includes('exam') || message.includes('result') || message.includes('hall ticket')) {
      if (message.includes('register')) return predefinedResponses.exams.register;
      if (message.includes('result')) return predefinedResponses.exams.results;
      return 'For examination management, I can help you with:\n• Registering for exams\n• Downloading hall tickets\n• Viewing results\n• Understanding exam schedule\n\nWhat exam-related help do you need?';
    }
    
    // Document related queries
    if (message.includes('document') || message.includes('upload') || message.includes('file')) {
      if (message.includes('upload')) return predefinedResponses.documents.upload;
      if (message.includes('status')) return predefinedResponses.documents.status;
      return 'For document management, I can help you with:\n• Uploading documents\n• Checking verification status\n• Understanding document requirements\n• Resolving upload issues\n\nWhat document help do you need?';
    }
    
    // General help
    if (message.includes('help') || message.includes('what can you do')) {
      return 'I can help you with:\n\n📚 **Library Management**\n• Search and issue books\n• Check due dates and fines\n\n💰 **Fee Management**\n• Make online payments\n• Download receipts\n\n🏠 **Hostel Management**\n• Apply for accommodation\n• Check room allocation\n\n📝 **Examination**\n• Register for exams\n• View results and hall tickets\n\n📄 **Documents**\n• Upload and verify documents\n• Check status\n\nJust ask me about any of these topics!';
    }
    
    // Default response
    return 'I understand you\'re asking about: "' + userMessage + '"\n\nI can help you with:\n• Library operations\n• Fee payments\n• Hostel applications\n• Exam registrations\n• Document uploads\n\nCould you be more specific about which area you need help with?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (query: string) => {
    setInputValue(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 z-40 group"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Need Help?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">ERP Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="flex items-center space-x-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="truncate">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the ERP system..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
