import { useState, useEffect } from 'react';
import { analyzeEmail, checkHealth } from '../services/api';

/**
 * EmailInput Component
 * Allows users to input email text and get classification results
 */
const EmailInput = ({ onResult, onError }) => {
  const [emailText, setEmailText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, running: false, error: null });

  // Check backend health on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const health = await checkHealth();
      setBackendStatus({
        checked: true,
        running: health.success,
        error: health.success ? null : health.error
      });
    };
    checkBackend();
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!emailText.trim()) {
      onError?.('Please enter email text to analyze');
      return;
    }

    // Check backend status before submitting
    if (!backendStatus.running) {
      onError?.('Backend server is not running. Please start the backend server first.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await analyzeEmail(emailText);
      onResult?.(result.data);
      setEmailText(''); // Clear input after successful analysis
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clear button click
   */
  const handleClear = () => {
    setEmailText('');
  };

  /**
   * Refresh backend status
   */
  const refreshStatus = async () => {
    const health = await checkHealth();
    setBackendStatus({
      checked: true,
      running: health.success,
      error: health.success ? null : health.error
    });
  };

  return (
    <div className="card-gradient animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
          <div className="relative p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Analyze Single Email</h2>
          <p className="text-gray-500 mt-1">Paste your email content to classify and prioritize</p>
        </div>
        
        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2">
          {backendStatus.checked && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              backendStatus.running 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                backendStatus.running ? 'bg-emerald-500' : 'bg-red-500'
              }`}></span>
              {backendStatus.running ? 'Backend Online' : 'Backend Offline'}
            </div>
          )}
          <button
            onClick={refreshStatus}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Refresh backend status"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backend offline warning */}
      {backendStatus.checked && !backendStatus.running && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-xl flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 mb-1">Backend Server Not Running</h3>
              <p className="text-sm text-red-700 mb-3">
                The backend server is not running. Please start it to enable email classification.
              </p>
              <div className="bg-white/80 rounded-lg p-3 text-xs font-mono text-red-800">
                <p className="font-bold mb-1">To start the backend:</p>
                <p>1. Open a terminal</p>
                <p>2. cd ai-email-triage/backend</p>
                <p>3. npm install</p>
                <p>4. npm start</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email-text" className="block text-sm font-semibold text-gray-700 mb-3">
            Email Content
          </label>
          <textarea
            id="email-text"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste your email content here...

Example: Urgent: Please review the attached invoice for Q4 2024. Payment is due immediately."
            className="input-field min-h-[220px] resize-y"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || !emailText.trim() || !backendStatus.running}
            className="btn-primary flex-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Email
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading || !emailText}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </form>

      {/* Quick tips */}
      <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Quick Tips
        </h3>
        <ul className="text-sm text-indigo-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">•</span>
            Include the full email content for better accuracy
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">•</span>
            Keywords like "urgent", "asap" increase priority
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-0.5">•</span>
            The system detects Finance, Technical, Spam, and Support categories
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmailInput;
