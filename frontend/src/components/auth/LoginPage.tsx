'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../../utils/api';
import { useAuth } from './AuthProvider';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Shield,
  Library,
  Home,
  ArrowRight
} from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      const success = await login(formData.email, formData.password);
      
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.message && err.message.includes('pending')) {
        setError('Your account is pending approval. Please wait for admin approval.');
      } else if (err.message && err.message.includes('rejected')) {
        setError('Your account has been rejected. Please contact admin for more information.');
      } else if (err.message && err.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    admin: Shield,
    student: GraduationCap,
    teacher: User,
    staff: Building2,
    librarian: Library,
    warden: Home
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-3 text-lg text-gray-600 font-medium">
            Sign in to your ERP account
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 animate-slide-up" onSubmit={handleSubmit}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 hover:shadow-3xl transition-all duration-300">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="text-center animate-fade-in-delay">
          <p className="text-lg text-gray-600 font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/register')}
                className="font-semibold text-purple-600 hover:text-purple-700 transition-all duration-200"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Role Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-slide-up-delay">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Available Roles</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(roleIcons).map(([role, Icon], index) => (
              <div key={role} className="flex items-center space-x-3 text-sm text-gray-600 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 hover:scale-105">
                  <div className="p-2 bg-purple-100 rounded-lg">
                  <Icon className="h-4 w-4 text-purple-600" />
                </div>
                <span className="capitalize font-medium">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
