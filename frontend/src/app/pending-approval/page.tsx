'use client';

import { useAuth } from '../../components/auth/AuthProvider';
import { Clock, Mail, Phone, User, GraduationCap } from 'lucide-react';

export default function PendingApprovalPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg mb-6">
            <Clock className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h2>
          <p className="text-lg text-gray-600">
            Your account is currently under review by the administrator.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-medium text-purple-600">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>

            {/* Status */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800 font-medium">
                  Status: {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{user.email}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• An administrator will review your application</li>
                <li>• You'll receive an email notification once approved</li>
                <li>• You can then access your dashboard</li>
                <li>• This process usually takes 1-2 business days</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Back to Login
              </button>
              <button
                onClick={() => window.location.href = '/register'}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Register Another Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@collegeerp.com" className="text-purple-600 hover:text-purple-700">
              support@collegeerp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
