'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { usePathname } from 'next/navigation';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const {
    activeConversation,
    messages,
    sendingMessage,
    error,
    createConversation,
    sendMessage,
    clearError,
  } = useChat();

  // Don't show on the chat page itself
  if (pathname === '/chat') {
    return null;
  }

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  const handleSendMessage = async (content: string) => {
    if (!activeConversation) {
      const newConv = await createConversation('Quick Chat');
      if (newConv) {
        await sendMessage(content, newConv);
      }
    } else {
      await sendMessage(content);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/50'
        }`}
        title={isOpen ? 'Close chat' : 'Open AI Assistant'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {/* Robot/Agent head */}
            <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={1.5} />
            {/* Antenna */}
            <path d="M12 8V5" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            {/* Eyes */}
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            {/* Mouth */}
            <path d="M9 17h6" strokeWidth={1.5} strokeLinecap="round" />
            {/* Ears */}
            <path d="M4 12H2" strokeWidth={1.5} strokeLinecap="round" />
            <path d="M22 12h-2" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                <p className="text-white/80 text-xs">Ask me anything about tasks</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-3 py-2 bg-red-50 border-b border-red-100 flex items-center justify-between">
              <span className="text-red-700 text-xs">{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} isLoading={sendingMessage} />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={sendingMessage}
            placeholder="Ask about your tasks..."
          />
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
