export type TaskStatus = 'ToDo' | 'InProgress' | 'Completed' | 'Overdue';

export interface User {
    idUser: number;
    username: string;
    email: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface Task {
    id: number;
    title: string;
    caption: string;
    content: string;
    status: TaskStatus;
    dataInicial: string;
    dataFinal: string;
}