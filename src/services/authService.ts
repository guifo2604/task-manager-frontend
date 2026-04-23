import { api } from './api';
import type { User, LoginResponse } from '../types';

// Tipagem para os dados de login baseada no seu LoginRequest.java
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<User>('/auth', data);
    return response.data;
  }
};