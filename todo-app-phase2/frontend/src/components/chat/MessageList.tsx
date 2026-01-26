'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';
import { ToolCallDisplay } from '../../hooks/useChat';

// Helper to format tool call names for display
const formatToolCallName = (name: string): string => {
  const toolNameMap: Record<string, string> = {
    create_task: 'Creating task',
    list_tasks: 'Listing tasks',
    get_task: 'Getting task details',
    complete_task: 'Completing task',
    update_task: 'Updating task',
    delete_task: 'Deleting task',
    search_tasks: 'Searching tasks',
  };
  return toolNameMap[name] || name.replace(/_/g, ' ');
};

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  isThinking?: boolean;
  activeToolCalls?: ToolCallDisplay[];
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading = false,
  isStreaming = false,
  isThinking = false,
  activeToolCalls = [],
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4 sm:p-8 overflow-auto">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-4 sm:p-6 mb-3 sm:mb-4">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">Start a conversation</h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-sm px-2">
          Ask me to help with your tasks. I can create, update, search, and manage your to-do items.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 justify-center px-2">
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 text-[10px] sm:text-xs rounded-full">
            "Create a task for tomorrow"
          </span>
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 text-[10px] sm:text-xs rounded-full">
            "Show my high priority tasks"
          </span>
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-600 text-[10px] sm:text-xs rounded-full">
            "Mark task #3 as complete"
          </span>
        </div>
      </div>
    );
  }

  // Find the last assistant message for streaming indicator
  const lastAssistantIndex = messages.map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i !== -1).pop();

  return (
    <div className="h-full overflow-y-auto p-2 sm:p-4 space-y-1">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={isStreaming && index === lastAssistantIndex}
        />
      ))}

      {/* Thinking indicator */}
      {isThinking && (
        <div className="flex justify-start mb-4">
          <div className="flex items-end gap-2">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active tool calls visualization */}
      {activeToolCalls.length > 0 && (
        <div className="flex justify-start mb-4">
          <div className="flex items-end gap-2">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <div className="space-y-1.5">
                {activeToolCalls.map((toolCall, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {toolCall.status === 'executing' ? (
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : toolCall.status === 'success' ? (
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs sm:text-sm text-blue-700">
                      {formatToolCallName(toolCall.name)}
                      {toolCall.status === 'executing' && '...'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="flex items-end gap-2">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
