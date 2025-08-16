import AxiosClient from "./AxiosClient";

// Types for authentication
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface RefreshTokenRequest {
  token: string;
}

export interface ValidateTokenRequest {
  token: string;
}

// Authentication API functions
export const Login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Sending login request:', { username, password: '***' });
    const response = await AxiosClient.post<AuthResponse>('/api/auth/login', {
      username,
      password
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(error.response.data?.message || `Login failed: ${error.response.status}`);
    }
    throw error;
  }
};

export const Register = async (username: string, password: string, confirmPassword: string, role: string = 'User'): Promise<AuthResponse> => {
  try {
    console.log('Sending registration request:', { username, password: '***', confirmPassword: '***', role });
    const response = await AxiosClient.post<AuthResponse>('/api/auth/register', {
      username,
      password,
      confirmPassword,
      role
    });
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(error.response.data?.message || `Registration failed: ${error.response.status}`);
    }
    throw error;
  }
};

export const Logout = async (): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  const response = await AxiosClient.post('/api/auth/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const GetCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await AxiosClient.get('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const ValidateToken = async (token: string): Promise<{ isValid: boolean }> => {
  const response = await AxiosClient.post('/api/auth/validate', { token });
  return response.data;
};

export const RefreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await AxiosClient.post<AuthResponse>('/api/auth/refresh', { token });
  return response.data;
};

// Helper functions for token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
  AxiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Dispatch custom event to notify components of login
  window.dispatchEvent(new CustomEvent('userLoggedIn'));
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  delete AxiosClient.defaults.headers.common['Authorization'];

  // Dispatch custom event to notify components of logout
  window.dispatchEvent(new CustomEvent('userLoggedOut'));
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return !!token;
};