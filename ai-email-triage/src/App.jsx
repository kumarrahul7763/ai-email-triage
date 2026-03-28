import { useState } from 'react';
import EmailInput from './components/EmailInput';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Dashboard from './components/Dashboard';
import Inbox from './components/Inbox';

/**
 * Main App Component
 * Smart Email Triage System - Classify and prioritize emails
 */
function App() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('classify');

  /**
   * Handle single email classification result
   */
  const handleSingleResult = (result) => {
    setResults(prev => [result, ...prev]);
    setSuccess('Email classified successfully!');
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  /**
   * Handle bulk upload results
   */
  const handleBulkResults = (data) => {
    setResults(prev => [...data.results, ...prev]);
    setSuccess(`${data.total} emails classified successfully!`);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  /**
   * Handle inbox email classification
   */
  const handleInboxClassify = (result) => {
    setResults(prev => [result, ...prev]);
    setSuccess('Email classified successfully!');
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  /**
   * Handle errors
   */
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setSuccess(null);
    setTimeout(() => setError(null), 5000);
  };

  /**
   * Clear all results
   */
  const handleClearResults = () => {
    setResults([]);
    setSuccess('Results cleared');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Smart Email Triage</h1>
                <p className="text-sm text-gray-500 font-medium">AI-Powered Email Classification</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('classify')}
                className={`nav-link ${activeTab === 'classify' ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Classify
                </div>
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`nav-link ${activeTab === 'inbox' ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Inbox
                </div>
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`nav-link ${activeTab === 'dashboard' ? 'nav-link-active' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </div>
              </button>
            </div>

            {/* Stats badge */}
            {results.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 shadow-sm">
                  <span className="text-sm font-semibold text-indigo-700">
                    {results.length} emails processed
                  </span>
                </div>
                <button
                  onClick={handleClearResults}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Clear results"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Alert messages */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl flex items-center gap-4 animate-slide-up shadow-lg shadow-red-500/10">
            <div className="p-2 bg-red-100 rounded-xl">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-red-700 font-medium flex-1">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-4 animate-slide-up shadow-lg shadow-emerald-500/10">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-emerald-700 font-medium flex-1">{success}</span>
          </div>
        )}

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === 'classify' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Input methods */}
              <div className="space-y-8">
                <EmailInput 
                  onResult={handleSingleResult} 
                  onError={handleError} 
                />
                <FileUpload 
                  onResults={handleBulkResults} 
                  onError={handleError} 
                />
              </div>

              {/* Right column - Results */}
              <div>
                {results.length > 0 ? (
                  <ResultsTable results={results} />
                ) : (
                  <div className="card-gradient text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center animate-float">
                      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Start by analyzing an email or uploading a CSV file to see classification results here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Inbox 
                onClassify={handleInboxClassify} 
                onError={handleError} 
              />
              <div>
                {results.length > 0 ? (
                  <ResultsTable results={results} title="Recent Classifications" />
                ) : (
                  <div className="card-gradient text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center animate-float">
                      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Click an email in the inbox to classify it and see results here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard results={results} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Smart Email Triage</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered email classification system that automatically categorizes, prioritizes, and routes emails to the right departments.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30">Finance</span>
                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">Technical</span>
                <span className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">Spam</span>
                <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">Support</span>
              </div>
            </div>

            {/* Priority Levels */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Priority Levels</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">High</span>
                <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">Medium</span>
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30">Low</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Smart Email Triage System. Built with ❤️ for hackathons.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Powered by AI
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure & Reliable
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
