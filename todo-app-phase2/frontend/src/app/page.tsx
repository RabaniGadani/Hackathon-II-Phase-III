/**
 * Homepage/Dashboard for the Todo App
 * Modern landing page with hero section and features
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left side - Text content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Boost your productivity today
                </div>

                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                  <span className="block">Organize your</span>
                  <span className="block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mt-2">
                    work & life
                  </span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  The simplest way to keep track of your tasks, projects, and goals. Stay focused, get organized, and achieve more every day.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  {isAuthenticated ? (
                    <Link
                      href="/tasks"
                      className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Go to My Tasks
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href="/signup"
                      className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Start Free Today
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href={isAuthenticated ? "/tasks" : "/login"}
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  >
                    {isAuthenticated ? 'View Dashboard' : 'Sign In'}
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-500 mt-1">Active Users</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-500 mt-1">Tasks Done</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-gray-900">99%</div>
                    <div className="text-sm text-gray-500 mt-1">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Right side - Task Preview Card */}
              <div className="mt-16 lg:mt-0 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Floating task cards */}
                  <div className="absolute -top-4 -left-4 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-through text-gray-400">Review project proposal</p>
                        <p className="text-sm text-gray-400 mt-1">Completed</p>
                      </div>
                    </div>
                  </div>

                  {/* Main task card */}
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Today's Tasks</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        3 of 5 done
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Design new landing page</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">High</span>
                            <span className="text-xs text-gray-500">Due today</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Team standup meeting</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Medium</span>
                            <span className="text-xs text-gray-500">10:00 AM</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-400 line-through">Send weekly report</p>
                          <p className="text-xs text-green-600 mt-1">Completed at 9:30 AM</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add new task
                    </button>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Task completed!</p>
                        <p className="text-xs text-gray-500">Great job!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Bento Grid */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Built for productivity
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your tasks and achieve your goals.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large card */}
            <div className="md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 lg:p-10 text-white">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Smart Task Management</h3>
                <p className="text-green-100 text-lg leading-relaxed max-w-lg">
                  Create, organize, and prioritize tasks effortlessly. Our intuitive interface helps you focus on what matters most.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">Drag & Drop</span>
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">Priority Levels</span>
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">Due Dates</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mt-16 -mr-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Sync</h3>
                <p className="text-gray-600">
                  Real-time synchronization across all your devices. Your tasks are always up to date.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mt-16 -mr-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Categories & Tags</h3>
                <p className="text-gray-600">
                  Organize tasks with custom categories and tags for better workflow management.
                </p>
              </div>
            </div>

            {/* Feature 4 - Dark card */}
            <div className="group relative overflow-hidden rounded-3xl bg-gray-900 p-8 text-white hover:bg-gray-800 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-gray-700 to-transparent rounded-full -mt-24 -mr-24"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-gray-400">
                  Bank-level encryption keeps your data safe. Your privacy is our priority.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Reminders</h3>
                <p className="text-gray-600">
                  Never miss a deadline with intelligent notifications and reminders.
                </p>
              </div>
            </div>

            {/* Feature 6 - Wide card */}
            <div className="md:col-span-2 lg:col-span-1 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mb-24 -mr-24 blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-5">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
                <p className="text-indigo-100">
                  Track your productivity with beautiful charts and insights. See your accomplishments grow.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom feature highlight */}
          <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Ready to boost your productivity?
                </h3>
                <p className="text-gray-600 text-lg max-w-xl">
                  Join thousands of users who have transformed the way they work. Start organizing your tasks today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={isAuthenticated ? "/tasks" : "/signup"}
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Get Started Free
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-green-100">
            Join thousands of users who are already boosting their productivity.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={isAuthenticated ? "/tasks" : "/signup"}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-green-600 bg-white hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {isAuthenticated ? 'Go to Tasks' : 'Create Free Account'}
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;