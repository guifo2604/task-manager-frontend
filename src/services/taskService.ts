import { api } from './api';
import type { Task, TaskRequest } from '../types';

export const taskService = {
  
  getByUser: async (userId: number) => {
    const response = await api.get<Task[]>(`/tasks/user/${userId}`);
    return response.data;
  },


  create: async (userId: number, data: TaskRequest) => {
    const response = await api.post<Task>(`/tasks/${userId}`, data);
    return response.data;
  },


  update: async (taskId: number, userId: number, data: TaskRequest) => {
    const response = await api.put<Task>(`/tasks/${taskId}/user/${userId}`, data);
    return response.data;
  },


  delete: async (taskId: number, userId: number) => {
    await api.delete(`/tasks/${taskId}/user/${userId}`);
  }
};