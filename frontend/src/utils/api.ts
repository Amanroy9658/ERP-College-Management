const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error response, but handle cases where it's not JSON
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON (like "Offline - ..."), use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        // If response is not JSON, return a generic success response
        return {
          status: 'success',
          message: 'Request completed',
          data: await response.text()
        };
      }
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle specific error cases
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          status: 'error',
          message: 'Cannot connect to server. Please check if the backend is running.',
        };
      }
      
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        return {
          status: 'error',
          message: 'Server returned invalid response. Please check if the backend is running.',
        };
      }
      
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Auth API functions
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
  
  getProfile: () =>
    apiClient.get('/auth/me'),
};

// Admin API functions
export const adminApi = {
  getPendingApprovals: (params?: any) =>
    apiClient.get('/admin/pending-approvals', params),
  
  approveUser: (userId: string, action: 'approve' | 'reject', data?: any) =>
    apiClient.post(`/admin/approve-user/${userId}`, { action, ...data }),
  
  getUsers: (params?: any) =>
    apiClient.get('/admin/users', params),
  
  getDashboardStats: () =>
    apiClient.get('/admin/dashboard-stats'),
};

// Student API functions
export const studentApi = {
  getStudents: (params?: any) =>
    apiClient.get('/students', params),
  
  getStudent: (id: string) =>
    apiClient.get(`/students/${id}`),
  
  updateStudent: (id: string, data: any) =>
    apiClient.put(`/students/${id}`, data),
};

// Dashboard API functions
export const dashboardApi = {
  getStats: () =>
    apiClient.get('/dashboard/stats'),
  
  getActivities: () =>
    apiClient.get('/dashboard/activities'),
  
  getNotifications: () =>
    apiClient.get('/dashboard/notifications'),
};

// Fee Management API functions
export const feeApi = {
  getFees: (params?: any) =>
    apiClient.get('/fees', params),
  
  getFee: (id: string) =>
    apiClient.get(`/fees/${id}`),
  
  createFee: (data: any) =>
    apiClient.post('/fees', data),
  
  recordPayment: (id: string, data: any) =>
    apiClient.post(`/fees/${id}/payment`, data),
  
  getFeeStats: () =>
    apiClient.get('/fees/stats/overview'),
  
  getOverdueFees: () =>
    apiClient.get('/fees/overdue'),
  
  getStudentFees: (studentId: string, params?: any) =>
    apiClient.get(`/fees/student/${studentId}`, params),
};

// Hostel Management API functions
export const hostelApi = {
  getHostels: (params?: any) =>
    apiClient.get('/hostels', params),
  
  getHostel: (id: string) =>
    apiClient.get(`/hostels/${id}`),
  
  createHostel: (data: any) =>
    apiClient.post('/hostels', data),
  
  updateHostel: (id: string, data: any) =>
    apiClient.put(`/hostels/${id}`, data),
  
  getRooms: (hostelId: string, params?: any) =>
    apiClient.get(`/hostels/${hostelId}/rooms`, params),
  
  createRoom: (hostelId: string, data: any) =>
    apiClient.post(`/hostels/${hostelId}/rooms`, data),
  
  getAllocations: (params?: any) =>
    apiClient.get('/hostels/allocations', params),
  
  createAllocation: (data: any) =>
    apiClient.post('/hostels/allocations', data),
  
  updateAllocation: (id: string, data: any) =>
    apiClient.put(`/hostels/allocations/${id}`, data),
};

// Library Management API functions
export const libraryApi = {
  getBooks: (params?: any) =>
    apiClient.get('/library/books', params),
  
  getBook: (id: string) =>
    apiClient.get(`/library/books/${id}`),
  
  createBook: (data: any) =>
    apiClient.post('/library/books', data),
  
  updateBook: (id: string, data: any) =>
    apiClient.put(`/library/books/${id}`, data),
  
  getIssueRecords: (params?: any) =>
    apiClient.get('/library/issues', params),
  
  issueBook: (data: any) =>
    apiClient.post('/library/issues', data),
  
  returnBook: (id: string, data: any) =>
    apiClient.put(`/library/issues/${id}/return`, data),
  
  renewBook: (id: string, data: any) =>
    apiClient.put(`/library/issues/${id}/renew`, data),
  
  getLibraryStats: () =>
    apiClient.get('/library/stats'),
};

// Examination Management API functions
export const examinationApi = {
  getSubjects: (params?: any) =>
    apiClient.get('/examinations/subjects', params),
  
  createSubject: (data: any) =>
    apiClient.post('/examinations/subjects', data),
  
  updateSubject: (id: string, data: any) =>
    apiClient.put(`/examinations/subjects/${id}`, data),
  
  getExams: (params?: any) =>
    apiClient.get('/examinations/exams', params),
  
  createExam: (data: any) =>
    apiClient.post('/examinations/exams', data),
  
  updateExam: (id: string, data: any) =>
    apiClient.put(`/examinations/exams/${id}`, data),
  
  getResults: (params?: any) =>
    apiClient.get('/examinations/results', params),
  
  createResult: (data: any) =>
    apiClient.post('/examinations/results', data),
  
  updateResult: (id: string, data: any) =>
    apiClient.put(`/examinations/results/${id}`, data),
  
  getExamStats: () =>
    apiClient.get('/examinations/stats'),
};
