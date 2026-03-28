import { useState } from 'react';
import { analyzeEmail } from '../services/api';

// Dummy email data
const DUMMY_EMAILS = [
  {
    id: 1,
    from: 'finance@company.com',
    subject: 'Urgent: Q4 Invoice Payment Due',
    preview: 'Please review the attached invoice for Q4 2024. Payment is due immediately...',
    text: 'Urgent: Please review the attached invoice for Q4 2024. Payment is due immediately. The total amount is $15,000. Please process this payment by end of business today.',
    date: '2024-03-15',
    read: false,
  },
  {
    id: 2,
    from: 'support@tech.com',
    subject: 'Bug Report: Login Page Error',
    preview: 'We have identified a critical bug in the login system...',
    text: 'Bug report: The login page throws a 500 error when users try to authenticate. This is affecting all users. Please investigate and fix this issue as soon as possible.',
    date: '2024-03-15',
    read: false,
  },
  {
    id: 3,
    from: 'winner@lottery.com',
    subject: 'Congratulations! You Won $1,000,000',
    preview: 'You have been selected as the winner of our monthly lottery...',
    text: 'Congratulations! You have won a $1,000,000 prize in our international lottery. Click here to claim your prize now! This is a limited time offer.',
    date: '2024-03-14',
    read: true,
  },
  {
    id: 4,
    from: 'hr@company.com',
    subject: 'Password Reset Request',
    preview: 'We received a request to reset your password...',
    text: 'We received a request to reset your password. If you did not make this request, please contact support immediately. Click the link below to reset your password.',
    date: '2024-03-14',
    read: true,
  },
  {
    id: 5,
    from: 'devops@company.com',
    subject: 'Server Deployment Scheduled',
    preview: 'The production server deployment is scheduled for tomorrow...',
    text: 'The server deployment is scheduled for tomorrow at 2 AM UTC. Please ensure all tests pass before the deployment. Expected downtime: 15 minutes.',
    date: '2024-03-13',
    read: true,
  },
  {
    id: 6,
    from: 'newsletter@marketing.com',
    subject: 'Weekly Newsletter: Productivity Tips',
    preview: 'This week we share tips for improving your productivity...',
    text: 'Weekly newsletter: Tips for improving your productivity this month. Learn how to manage your time better and achieve more with less effort.',
    date: '2024-03-12',
    read: true,
  },
  {
    id: 7,
    from: 'dba@company.com',
    subject: 'Critical: Database Backup Failed',
    preview: 'The automated database backup failed last night...',
    text: 'Critical: Database backup failed last night. Need immediate attention. The backup job failed at 3 AM. Please investigate and run a manual backup.',
    date: '2024-03-11',
    read: false,
  },
  {
    id: 8,
    from: 'orders@shop.com',
    subject: 'Order Confirmation #12345',
    preview: 'Thank you for your purchase. Your order has been shipped...',
    text: 'Thank you for your purchase. Your order #12345 has been shipped and will arrive in 3-5 business days. Track your package using the link below.',
    date: '2024-03-10',
    read: true,
  },
];

/**
 * Inbox Component
 * Displays a list of dummy emails that can be clicked to auto-classify
 */
const Inbox = ({ onClassify, onError }) => {
  const [emails, setEmails] = useState(DUMMY_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);

  /**
   * Handle email click - auto-classify the email
   */
  const handleEmailClick = async (email) => {
    setSelectedEmail(email.id);
    setIsClassifying(true);

    try {
      const result = await analyzeEmail(email.text);
      onClassify?.({
        ...result.data,
        originalEmail: email.text,
        subject: email.subject,
        from: email.from,
      });

      // Mark email as read
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsClassifying(false);
      setSelectedEmail(null);
    }
  };

  /**
   * Get category color based on subject keywords
   */
  const getCategoryHint = (subject) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('invoice') || lowerSubject.includes('payment')) {
      return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200';
    }
    if (lowerSubject.includes('bug') || lowerSubject.includes('server') || lowerSubject.includes('database')) {
      return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200';
    }
    if (lowerSubject.includes('winner') || lowerSubject.includes('lottery') || lowerSubject.includes('congratulations')) {
      return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
    }
    return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
  };

  /**
   * Get category icon based on subject keywords
   */
  const getCategoryIcon = (subject) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('invoice') || lowerSubject.includes('payment')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (lowerSubject.includes('bug') || lowerSubject.includes('server') || lowerSubject.includes('database')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    if (lowerSubject.includes('winner') || lowerSubject.includes('lottery') || lowerSubject.includes('congratulations')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  };

  return (
    <div className="card-gradient animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
          <div className="relative p-3 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inbox</h2>
          <p className="text-gray-500 mt-1">Click an email to auto-classify it</p>
        </div>
      </div>

      {/* Email list */}
      <div className="space-y-3">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailClick(email)}
            className={`
              group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden
              ${selectedEmail === email.id 
                ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg shadow-indigo-500/10 scale-[1.02]' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 hover:shadow-md'
              }
              ${!email.read ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : ''}
            `}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {!email.read && (
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></span>
                  )}
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {email.from}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{email.date}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 truncate">
                  {email.subject}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {email.preview}
                </p>
              </div>

              {/* Category hint badge */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryHint(email.subject)}`}>
                {getCategoryIcon(email.subject)}
                <span>
                  {email.subject.toLowerCase().includes('invoice') ? 'Finance' :
                   email.subject.toLowerCase().includes('bug') ? 'Technical' :
                   email.subject.toLowerCase().includes('winner') ? 'Spam' : 'Support'}
                </span>
              </div>
            </div>

            {/* Loading indicator */}
            {selectedEmail === email.id && isClassifying && (
              <div className="relative z-10 mt-4 flex items-center gap-3 text-indigo-600">
                <div className="w-5 h-5 spinner"></div>
                <span className="text-sm font-semibold">Classifying...</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
        <h3 className="text-sm font-bold text-violet-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works
        </h3>
        <p className="text-sm text-violet-700 leading-relaxed">
          Click on any email in the inbox to automatically classify it. The system will analyze the content and provide category, priority, and department information instantly.
        </p>
      </div>
    </div>
  );
};

export default Inbox;
