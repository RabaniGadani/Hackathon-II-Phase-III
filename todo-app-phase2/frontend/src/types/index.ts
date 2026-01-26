/**
 * Type definitions for the Todo App
 * Contains all TypeScript interfaces and types used across the application
 */

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  status: TaskStatus;
  due_date?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string;
  category?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string;
  category?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface FilterOptions {
  status?: 'all' | 'pending' | 'completed';
  taskStatus?: TaskStatus | 'all';
  priority?: Priority | 'all';
  category?: string;
  sort?: 'date' | 'title' | 'priority' | 'due_date';
  order?: 'asc' | 'desc';
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string;
  category?: string;
}

// Chat Types
export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  token_count?: number;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface ChatRequest {
  message: string;
  conversation_id?: number;
}

export interface ChatResponse {
  conversation_id: number;
  message: Message;
  tool_calls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  name: string;
  status: 'success' | 'error';
  result?: any;
}