/**
 * ExplanationCard Component
 * Displays AI classification explanation in a clean, modern card format
 */
const ExplanationCard = ({ explanation, category, priority, confidence }) => {
  if (!explanation) return null;

  /**
   * Get color scheme based on category
   */
  const getCategoryColors = () => {
    const colors = {
      Finance: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-800'
      },
      Technical: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      },
      Spam: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      },
      Support: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800'
      }
    };
    return colors[category] || colors.Support;
  };

  /**
   * Get priority color scheme
   */
  const getPriorityColors = () => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.Low;
  };

  const categoryColors = getCategoryColors();

  return (
    <div className={`card-gradient animate-fade-in ${categoryColors.bg} ${categoryColors.border} border-2`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`p-3 rounded-xl ${categoryColors.bg} ${categoryColors.border} border`}>
          <svg className={`w-7 h-7 ${categoryColors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">AI Classification Explanation</h2>
          <p className="text-sm text-gray-500 mt-1">Understanding why this classification was made</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mb-5">
        <span className={`badge ${categoryColors.badge}`}>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {category}
        </span>
        <span className={`badge ${getPriorityColors()}`}>
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {priority} Priority
        </span>
        {confidence !== undefined && (
          <span className="badge bg-gray-100 text-gray-800">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {confidence}% Confidence
          </span>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Why this classification?</h3>
            <p className="text-gray-600 leading-relaxed">{explanation}</p>
          </div>
        </div>
      </div>

      {/* Keywords breakdown */}
      <div className="mt-5 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          How it works
        </h3>
        <p className="text-sm text-indigo-700 leading-relaxed">
          The AI analyzes your email content for specific keywords and patterns. It looks for category-specific terms 
          (like "invoice" for Finance or "bug" for Technical) and priority indicators (like "urgent" or "asap") 
          to determine the most appropriate classification and routing.
        </p>
      </div>
    </div>
  );
};

export default ExplanationCard;
