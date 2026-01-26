'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { MessageList, ChatInput, ConversationSidebar } from '../../components/chat';

const ChatPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sendingMessage,
    isStreaming,
    isThinking,
    activeToolCalls,
    error,
    canRetry,
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    sendMessageStream,
    cancelStream,
    retryLastMessage,
    clearError,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load conversations on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  const handleSendMessage = async (content: string) => {
    // If no active conversation, create one first
    if (!activeConversation) {
      const newConv = await createConversation('New conversation');
      if (newConv) {
        // Pass the new conversation directly to avoid stale closure issue
        sendMessageStream(content, newConv);
      }
    } else {
      sendMessageStream(content);
    }
  };

  const handleNewConversation = async () => {
    await createConversation('New conversation');
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (id: number) => {
    const success = await deleteConversation(id);
    if (success) {
      toast.success('Conversation deleted successfully');
    } else {
      toast.error('Failed to delete conversation');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-14rem)] mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-13rem)] md:h-[calc(100vh-14rem)] flex flex-col mt-8 sm:mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-2 sm:px-4 md:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Chat with AI to manage your tasks</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="xl:hidden inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Chats</span>
          </button>
          <button
            onClick={handleNewConversation}
            className="inline-flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-2 sm:mb-4 mx-2 sm:mx-4 md:mx-0 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <span className="text-red-800 text-xs sm:text-sm">{error}</span>
          <div className="flex items-center gap-2">
            {canRetry && (
              <button
                onClick={retryLastMessage}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            )}
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mx-1 sm:mx-0">
        {/* Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={(conv) => {
            selectConversation(conv);
            setSidebarOpen(false);
          }}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {/* Chat header */}
          {activeConversation && (
            <div className="flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium text-sm sm:text-base text-gray-800 truncate">
                {activeConversation.title || 'New conversation'}
              </h2>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <MessageList
              messages={messages}
              isLoading={sendingMessage && !isStreaming}
              isStreaming={isStreaming}
              isThinking={isThinking}
              activeToolCalls={activeToolCalls}
            />
          </div>

          {/* Input */}
          <div className="flex-shrink-0">
            <ChatInput
              onSendMessage={handleSendMessage}
              onCancel={cancelStream}
              disabled={sendingMessage || isStreaming}
              isStreaming={isStreaming}
              placeholder={
                isStreaming
                  ? 'AI is responding...'
                  : activeConversation
                    ? 'Ask me to help with your tasks...'
                    : 'Start a new conversation...'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
