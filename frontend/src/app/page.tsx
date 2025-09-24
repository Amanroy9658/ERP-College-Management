'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard';
import { 
  GraduationCap, 
  Users, 
  Building2, 
  BookOpen, 
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) {
    return <Dashboard onBack={() => setShowDemo(false)} />;
  }

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Complete student lifecycle management from admission to graduation'
    },
    {
      icon: Building2,
      title: 'Hostel Management',
      description: 'Efficient hostel allocation and room management system'
    },
    {
      icon: BookOpen,
      title: 'Examination System',
      description: 'Comprehensive exam scheduling and result management'
    },
    {
      icon: Shield,
      title: 'Role-based Access',
      description: 'Secure access control for different user roles'
    }
  ];

  const roles = [
    { name: 'Student', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
    { name: 'Teacher', icon: Users, color: 'bg-green-100 text-green-600' },
    { name: 'Admin', icon: Shield, color: 'bg-purple-100 text-purple-600' },
    { name: 'Staff', icon: Building2, color: 'bg-orange-100 text-orange-600' },
    { name: 'Librarian', icon: BookOpen, color: 'bg-red-100 text-red-600' },
    { name: 'Warden', icon: Building2, color: 'bg-indigo-100 text-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">College ERP</span>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in-delay">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-all duration-200 hover:scale-105"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-8 animate-fade-in">
            Complete ERP Solution for
                <span className="text-purple-600"> Educational Institutions</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-10 max-w-4xl mx-auto font-medium animate-slide-up">
            Streamline your college operations with our comprehensive ERP system. 
            Manage students, faculty, examinations, hostels, and more from a single platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up-delay">
            <button
              onClick={() => router.push('/register')}
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            <button
              onClick={() => setShowDemo(true)}
                  className="px-10 py-5 bg-green-600 text-white rounded-2xl hover:bg-green-700 flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              <Play className="mr-3 h-6 w-6" />
              Live Demo
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-10 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Everything You Need to Manage Your College
            </h2>
            <p className="text-xl text-gray-600 font-medium animate-slide-up">
              Our ERP system provides all the tools you need to run an efficient educational institution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-10 w-10 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Everyone
            </h2>
            <p className="text-lg text-gray-600">
              Our system supports multiple user roles with tailored dashboards and features
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {role.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our ERP System?
              </h2>
              <div className="space-y-4">
                {[
                  'Unified data management across all departments',
                  'Real-time monitoring and analytics',
                  'Role-based access control and security',
                  'Mobile-responsive design for accessibility',
                  'Affordable pricing for educational institutions',
                  '24/7 technical support and maintenance'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-purple-100 mb-6">
                Join hundreds of educational institutions already using our ERP system
              </p>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 font-medium animate-slide-up">
              Trusted by educational institutions across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Rajesh Kumar',
                role: 'Principal, ABC College',
                content: 'This ERP system has revolutionized our college management. Everything is now streamlined and efficient.',
                rating: 5,
                color: 'from-purple-500 to-purple-600'
              },
              {
                name: 'Prof. Priya Sharma',
                role: 'Head of Department',
                content: 'The role-based access and real-time monitoring features are exactly what we needed for our institution.',
                rating: 5,
                color: 'from-blue-500 to-blue-600'
              },
              {
                name: 'Mr. Amit Singh',
                role: 'Administrative Officer',
                content: 'Implementation was smooth and the support team is excellent. Highly recommended for any educational institution.',
                rating: 5,
                color: 'from-green-500 to-green-600'
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white/95 backdrop-blur-none rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-slide-up border border-white/20" 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>

                {/* Profile Section */}
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${testimonial.color} rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                      <span className="text-2xl font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 font-medium">{testimonial.role}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300" 
                          style={{ transitionDelay: `${i * 0.1}s` }}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 font-medium">5.0</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="relative">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 italic group-hover:text-gray-800 transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Decorative Line */}
                  <div className={`w-16 h-1 bg-gradient-to-r ${testimonial.color} rounded-full group-hover:w-24 transition-all duration-300`}></div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 text-center animate-fade-in">
            <div className="inline-flex items-center space-x-8 bg-white/90 backdrop-blur-none rounded-2xl px-8 py-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Showcase Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
              Empowering Students & Educators
            </h2>
            <p className="text-xl text-gray-600 font-medium animate-slide-up">
              See how our ERP system transforms the educational experience for students and staff
            </p>
          </div>

          {/* Animated Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Student Image 1 */}
            <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-700 animate-slide-in-left">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
              <img 
                src="/student.jpg" 
                alt="Student using the ERP system" 
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700 image-hover-effect"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                <h3 className="text-3xl font-bold mb-3">Student Life</h3>
                <p className="text-lg text-purple-100 mb-4">Seamless academic journey with our comprehensive student management system</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Exam Schedules</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Fee Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm">Hostel Info</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-6 left-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Student Image 2 */}
            <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-700 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent z-10"></div>
              <img 
                src="/student2.jpg" 
                alt="Happy student success story" 
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700 image-hover-effect"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
                <h3 className="text-3xl font-bold mb-3">Success Stories</h3>
                <p className="text-lg text-green-100 mb-4">Real students achieving their academic goals with our platform</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-sm">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">10K+ Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm">100% Success</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-6 right-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
            {[
              { number: '10K+', label: 'Active Students', color: 'text-purple-600' },
              { number: '500+', label: 'Educational Institutions', color: 'text-green-600' },
              { number: '99.9%', label: 'Uptime', color: 'text-blue-600' },
              { number: '24/7', label: 'Support', color: 'text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className={stat.color}>{stat.number}</span>
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">College ERP</span>
              </div>
              <p className="text-gray-400">
                Complete ERP solution for educational institutions
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Student Management</li>
                <li>Fee Collection</li>
                <li>Hostel Management</li>
                <li>Examination System</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>Training</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 College ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
