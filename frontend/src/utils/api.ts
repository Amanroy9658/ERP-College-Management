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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
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
