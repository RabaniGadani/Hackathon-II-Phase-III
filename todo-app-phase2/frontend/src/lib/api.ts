/**
 * API client utility for the Todo App
 * Handles all API calls with proper authentication and error handling
 */

import { ApiResponse, Task } from '../types';

export interface TaskCreateRequest {
  title: string;
  description?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  completed?: boolean;
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

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use the backend API URL from environment variables
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Internal method to make API requests
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Prepend base URL if the endpoint is an absolute URL
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('todo_app_token') : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    } as Record<string, string>;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized by redirecting to login
      if (response.status === 401) {
        // In a Next.js app, you'd typically redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        console.warn('Unauthorized access - session may be expired');
      }

      // For 204 No Content responses, don't try to parse JSON
      if (response.status === 204) {
        return {
          status: response.status,
        } as ApiResponse<T>;
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || `HTTP error! status: ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        error: error.message || 'Network error occurred',
        status: 0,
      };
    }
  }

  // Task methods - Updated to call backend API directly
  async getTasks(userId: number, status?: string, sort?: 'date' | 'title' | 'priority' | 'due_date', order?: 'asc' | 'desc'): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (sort) params.append('sort', sort);
    if (order) params.append('order', order);

    const queryString = params.toString();
    const endpoint = `/api/${userId}/tasks${queryString ? '?' + queryString : ''}`;

    return this.request<Task[]>(endpoint);
  }

  async getTaskById(userId: number, taskId: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
  }

  async createTask(userId: number, taskData: TaskCreateRequest): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(userId: number, taskId: number, taskData: TaskUpdateRequest): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(userId: number, taskId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(userId: number, taskId: number): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
  }

  // Chat/Conversation methods
  async getConversations(userId: number): Promise<ApiResponse<Conversation[]>> {
    return this.request<Conversation[]>(`/api/${userId}/conversations`);
  }

  async getConversation(userId: number, conversationId: number): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>(`/api/${userId}/conversations/${conversationId}`);
  }

  async createConversation(userId: number, title?: string): Promise<ApiResponse<Conversation>> {
    return this.request<Conversation>(`/api/${userId}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteConversation(userId: number, conversationId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/${userId}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }

  async sendMessage(userId: number, conversationId: number, message: string): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>(`/api/${userId}/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getMessages(userId: number, conversationId: number): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(`/api/${userId}/conversations/${conversationId}/messages`);
  }

  /**
   * Send a message and stream the AI response using Server-Sent Events
   * @param userId - User ID
   * @param conversationId - Conversation ID
   * @param message - Message content
   * @param onEvent - Callback function for each streaming event
   * @returns AbortController to cancel the stream if needed
   */
  streamMessage(
    userId: number,
    conversationId: number,
    message: string,
    onEvent: StreamCallback
  ): AbortController {
    const controller = new AbortController();
    const url = `${this.baseUrl}/api/${userId}/conversations/${conversationId}/messages/stream`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('todo_app_token') : null;

    // Start the streaming request
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          onEvent({
            type: 'error',
            message: errorData.detail || `HTTP error: ${response.status}`,
          });
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          onEvent({ type: 'error', message: 'Stream not available' });
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data) {
                try {
                  const event: StreamEvent = JSON.parse(data);
                  onEvent(event);
                } catch (e) {
                  console.error('Failed to parse SSE event:', data, e);
                }
              }
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6);
          if (data) {
            try {
              const event: StreamEvent = JSON.parse(data);
              onEvent(event);
            } catch (e) {
              console.error('Failed to parse final SSE event:', data, e);
            }
          }
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          onEvent({
            type: 'error',
            message: error.message || 'Failed to stream message',
          });
        }
      });

    return controller;
  }
}

// Types for chat
export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  token_count?: number;
  created_at: string;
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

// Streaming event types
export interface StreamEvent {
  type: 'start' | 'chunk' | 'tool_call' | 'done' | 'error';
  content?: string;
  message_id?: number;
  user_message_id?: number;
  name?: string;
  parameters?: Record<string, any>;
  result?: any;
  success?: boolean;
  status?: string;
  tool_calls?: ToolCallInfo[];
  message?: string;
}

export type StreamCallback = (event: StreamEvent) => void;

// Create singleton instance
export const apiClient = new ApiClient();

export default apiClient;