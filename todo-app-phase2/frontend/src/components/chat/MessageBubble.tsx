'use client';

import React, { useMemo } from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

interface ParsedTask {
  id?: number;
  title: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  completed?: boolean;
}

// Priority badge component
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const colors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border ${colors[priority as keyof typeof colors] || colors.medium}`}>
      {priority}
    </span>
  );
};

// Status indicator component
const StatusIndicator: React.FC<{ status: string; completed?: boolean }> = ({ status, completed }) => {
  if (completed || status === 'done') {
    return (
      <span className="flex items-center text-green-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="flex items-center text-yellow-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex items-center text-gray-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>
    </span>
  );
};

// Task card component
const TaskCard: React.FC<{ task: ParsedTask }> = ({ task }) => {
  return (
    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
      <StatusIndicator status={task.status || 'todo'} completed={task.completed} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {task.priority && <PriorityBadge priority={task.priority} />}
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.id && (
            <span className="text-xs text-gray-400">#{task.id}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Parse content for task lists (AI might format them in various ways)
  const { textParts, tasks } = useMemo(() => {
    const content = message.content;
    const parsedTasks: ParsedTask[] = [];

    // Pattern 1: Bullet points with task info (- Task: title, Priority: high, etc.)
    const bulletPattern = /^[-*]\s+(?:Task:\s*)?(.+?)(?:,\s*Priority:\s*(low|medium|high))?(?:,\s*Status:\s*(todo|in_progress|done))?(?:,\s*Due:\s*([^\n,]+))?$/gim;

    // Pattern 2: Numbered lists (1. Buy groceries - high priority)
    const numberedPattern = /^\d+\.\s+(.+?)(?:\s*[-–]\s*(low|medium|high)\s*priority)?$/gim;

    // Pattern 3: Simple task mentions with ID (#123: Task title)
    const idPattern = /#(\d+):\s*(.+?)(?:\s*\((low|medium|high)\))?$/gim;

    let match;

    // Try bullet pattern
    while ((match = bulletPattern.exec(content)) !== null) {
      parsedTasks.push({
        title: match[1].trim(),
        priority: match[2]?.toLowerCase() as ParsedTask['priority'],
        status: match[3]?.toLowerCase() as ParsedTask['status'],
        dueDate: match[4]?.trim(),
      });
    }

    // Try numbered pattern if no bullet matches
    if (parsedTasks.length === 0) {
      while ((match = numberedPattern.exec(content)) !== null) {
        parsedTasks.push({
          title: match[1].trim(),
          priority: match[2]?.toLowerCase() as ParsedTask['priority'],
        });
      }
    }

    // Try ID pattern
    while ((match = idPattern.exec(content)) !== null) {
      parsedTasks.push({
        id: parseInt(match[1]),
        title: match[2].trim(),
        priority: match[3]?.toLowerCase() as ParsedTask['priority'],
      });
    }

    // If we found tasks, split text from task list
    let textContent = content;
    if (parsedTasks.length > 0) {
      // Find where task list starts and get text before it
      const lines = content.split('\n');
      const textLines: string[] = [];
      let foundTaskList = false;

      for (const line of lines) {
        const isBullet = /^[-*]\s+/.test(line);
        const isNumbered = /^\d+\.\s+/.test(line);
        const isTaskId = /#\d+:/.test(line);

        if (isBullet || isNumbered || isTaskId) {
          foundTaskList = true;
        } else if (!foundTaskList || line.trim() === '') {
          if (!foundTaskList) {
            textLines.push(line);
          }
        }
      }

      textContent = textLines.join('\n').trim();
    }

    return { textParts: textContent, tasks: parsedTasks };
  }, [message.content]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
      <div className={`flex items-end gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-green-400 to-emerald-500'
            : 'bg-gradient-to-br from-gray-600 to-gray-700'
        }`}>
          {isUser ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-md'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
          }`}>
            {/* Text content */}
            {(textParts || tasks.length === 0) && (
              <p className="text-xs sm:text-sm whitespace-pre-wrap">
                {textParts || message.content}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-0.5 bg-gray-600 animate-pulse" />
                )}
              </p>
            )}

            {/* Task list */}
            {tasks.length > 0 && !isUser && (
              <div className={`${textParts ? 'mt-3 pt-3 border-t border-gray-100' : ''} space-y-2`}>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </div>
                {tasks.map((task, index) => (
                  <TaskCard key={task.id || index} task={task} />
                ))}
              </div>
            )}
          </div>
          <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 px-1">
            {formatTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
