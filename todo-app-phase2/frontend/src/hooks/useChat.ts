/**
 * Custom hook for managing chat conversations with AI assistant
 * Handles conversation CRUD and message sending via the backend API
 * Supports both synchronous and streaming message sending
 */
import { useState, useCallback, useRef } from 'react';
import { apiClient, Conversation, Message, ChatResponse, StreamEvent } from '../lib/api';
import { useAuth } from './useAuth';

export interface ToolCallDisplay {
  name: string;
  status: 'executing' | 'success' | 'error';
  parameters?: Record<string, any>;
  result?: any;
}

interface UseChatReturn {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  sendingMessage: boolean;
  isStreaming: boolean;
  isThinking: boolean;
  streamingContent: string;
  activeToolCalls: ToolCallDisplay[];
  error: string | null;
  canRetry: boolean;
  fetchConversations: () => Promise<void>;
  selectConversation: (conversation: Conversation) => Promise<void>;
  createConversation: (title?: string) => Promise<Conversation | null>;
  deleteConversation: (conversationId: number) => Promise<boolean>;
  sendMessage: (content: string, conversation?: Conversation) => Promise<Message | null>;
  sendMessageStream: (content: string, conversation?: Conversation) => void;
  cancelStream: () => void;
  retryLastMessage: () => void;
  clearError: () => void;
}

export const useChat = (): UseChatReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCallDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<{ content: string; conversation: Conversation } | null>(null);
  const { user } = useAuth();
  const streamControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getConversations(Number(user.id));

      if (response.error) {
        setError(response.error);
      } else {
        setConversations(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveConversation(conversation);

    try {
      const response = await apiClient.getMessages(Number(user.id), conversation.id);

      if (response.error) {
        setError(response.error);
        setMessages([]);
      } else {
        setMessages(response.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createConversation = useCallback(async (title?: string): Promise<Conversation | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.createConversation(Number(user.id), title);

      if (response.error) {
        setError(response.error);
        return null;
      }

      if (response.data) {
        const newConversation = response.data;
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversation(newConversation);
        setMessages([]);
        return newConversation;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteConversation = useCallback(async (conversationId: number): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.deleteConversation(Number(user.id), conversationId);

      if (response.error) {
        setError(response.error);
        return false;
      }

      setConversations(prev => prev.filter(c => c.id !== conversationId));

      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, activeConversation]);

  const sendMessage = useCallback(async (content: string, conversation?: Conversation): Promise<Message | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    // Use provided conversation or fall back to activeConversation
    const targetConversation = conversation || activeConversation;

    if (!targetConversation) {
      setError('No active conversation');
      return null;
    }

    setSendingMessage(true);
    setError(null);

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: Date.now(),
      conversation_id: targetConversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await apiClient.sendMessage(
        Number(user.id),
        targetConversation.id,
        content
      );

      if (response.error) {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
        setError(response.error);
        return null;
      }

      if (response.data) {
        const { message: assistantMessage } = response.data;

        // Replace temp message with actual and add assistant response
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempUserMessage.id);
          return [...filtered, { ...tempUserMessage, id: assistantMessage.id - 1 }, assistantMessage];
        });

        // Update conversation title if it's new
        if (targetConversation.title === 'New conversation') {
          const updatedConversation = {
            ...targetConversation,
            title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
            updated_at: new Date().toISOString(),
          };
          setActiveConversation(updatedConversation);
          setConversations(prev =>
            prev.map(c => (c.id === targetConversation.id ? updatedConversation : c))
          );
        }

        return assistantMessage;
      }

      return null;
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [user, activeConversation]);

  const cancelStream = useCallback(() => {
    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, []);

  const sendMessageStream = useCallback((content: string, conversation?: Conversation) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const targetConversation = conversation || activeConversation;

    if (!targetConversation) {
      setError('No active conversation');
      return;
    }

    // Cancel any existing stream
    cancelStream();

    setSendingMessage(true);
    setIsStreaming(true);
    setIsThinking(true);
    setStreamingContent('');
    setActiveToolCalls([]);
    setError(null);
    setLastFailedMessage(null);

    // Optimistically add user message to UI
    const tempUserMessage: Message = {
      id: Date.now(),
      conversation_id: targetConversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    // Create a placeholder for the streaming assistant message
    const tempAssistantMessage: Message = {
      id: Date.now() + 1,
      conversation_id: targetConversation.id,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempAssistantMessage]);

    let accumulatedContent = '';
    let finalMessageId: number | null = null;
    let hasReceivedFirstChunk = false;

    const handleStreamEvent = (event: StreamEvent) => {
      switch (event.type) {
        case 'start':
          // Stream started, update user message ID if provided
          break;

        case 'chunk':
          // First chunk received - no longer thinking
          if (!hasReceivedFirstChunk) {
            hasReceivedFirstChunk = true;
            setIsThinking(false);
          }
          // Append content chunk
          if (event.content) {
            accumulatedContent += event.content;
            setStreamingContent(accumulatedContent);
            // Update the temporary assistant message with accumulated content
            setMessages(prev =>
              prev.map(m =>
                m.id === tempAssistantMessage.id
                  ? { ...m, content: accumulatedContent }
                  : m
              )
            );
          }
          break;

        case 'tool_call':
          // Tool call event - update tool calls display
          if (event.name) {
            const toolCall: ToolCallDisplay = {
              name: event.name,
              status: event.status === 'executing' ? 'executing' : (event.success ? 'success' : 'error'),
              parameters: event.parameters,
              result: event.result,
            };

            setActiveToolCalls(prev => {
              // Update existing tool call or add new one
              const existingIndex = prev.findIndex(tc => tc.name === event.name && tc.status === 'executing');
              if (existingIndex >= 0 && event.status !== 'executing') {
                // Update existing executing tool call with result
                const updated = [...prev];
                updated[existingIndex] = toolCall;
                return updated;
              } else if (event.status === 'executing') {
                // Add new executing tool call
                return [...prev, toolCall];
              }
              return prev;
            });
          }
          break;

        case 'done':
          // Stream complete
          finalMessageId = event.message_id || null;
          setIsStreaming(false);
          setIsThinking(false);
          setSendingMessage(false);
          setStreamingContent('');
          setActiveToolCalls([]);

          // Update the assistant message with the final ID
          setMessages(prev =>
            prev.map(m =>
              m.id === tempAssistantMessage.id
                ? { ...m, id: finalMessageId || m.id, content: accumulatedContent }
                : m
            )
          );

          // Update conversation title if it's new
          if (targetConversation.title === 'New conversation') {
            const updatedConversation = {
              ...targetConversation,
              title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
              updated_at: new Date().toISOString(),
            };
            setActiveConversation(updatedConversation);
            setConversations(prev =>
              prev.map(c => (c.id === targetConversation.id ? updatedConversation : c))
            );
          }
          break;

        case 'error':
          // Error occurred - store for retry
          setError(event.message || 'Failed to stream message');
          setLastFailedMessage({ content, conversation: targetConversation });
          setIsStreaming(false);
          setIsThinking(false);
          setSendingMessage(false);
          setStreamingContent('');
          setActiveToolCalls([]);

          // Remove the temporary messages on error
          setMessages(prev =>
            prev.filter(
              m => m.id !== tempUserMessage.id && m.id !== tempAssistantMessage.id
            )
          );
          break;
      }
    };

    // Start the stream
    streamControllerRef.current = apiClient.streamMessage(
      Number(user.id),
      targetConversation.id,
      content,
      handleStreamEvent
    );
  }, [user, activeConversation, cancelStream]);

  const retryLastMessage = useCallback(() => {
    if (lastFailedMessage) {
      clearError();
      sendMessageStream(lastFailedMessage.content, lastFailedMessage.conversation);
    }
  }, [lastFailedMessage, clearError, sendMessageStream]);

  const canRetry = lastFailedMessage !== null && error !== null;

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    sendingMessage,
    isStreaming,
    isThinking,
    streamingContent,
    activeToolCalls,
    error,
    canRetry,
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    sendMessage,
    sendMessageStream,
    cancelStream,
    retryLastMessage,
    clearError,
  };
};
