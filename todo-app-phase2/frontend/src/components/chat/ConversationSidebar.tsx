'use client';

import React from 'react';
import { Conversation } from '../../types';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId?: number;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile/Tablet overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed xl:relative inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out xl:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewConversation}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
              title="New conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={1.5} />
                  <path d="M12 8V5" strokeWidth={1.5} strokeLinecap="round" />
                  <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                  <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="13" r="1.5" fill="currentColor" />
                  <path d="M9 17h6" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeConversationId === conversation.id
                      ? 'bg-green-50 border border-green-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeConversationId === conversation.id
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gray-100'
                  }`}>
                    <svg
                      className={`w-5 h-5 ${
                        activeConversationId === conversation.id ? 'text-white' : 'text-gray-500'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={1.5} />
                      <path d="M12 8V5" strokeWidth={1.5} strokeLinecap="round" />
                      <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
                      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
                      <path d="M9 17h6" strokeWidth={1.5} strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${
                      activeConversationId === conversation.id ? 'text-green-700' : 'text-gray-800'
                    }`}>
                      {conversation.title || 'New conversation'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(conversation.updated_at)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    title="Delete conversation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationSidebar;
