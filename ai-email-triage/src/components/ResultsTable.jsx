/**
 * ResultsTable Component
 * Displays classification results in a table format with colored badges
 */
const ResultsTable = ({ results, title = "Classification Results" }) => {
  if (!results || results.length === 0) {
    return null;
  }

  /**
   * Get badge class based on category
   */
  const getCategoryBadge = (category) => {
    const badges = {
      Finance: 'badge-finance',
      Technical: 'badge-technical',
      Spam: 'badge-spam',
      Support: 'badge-support',
    };
    return badges[category] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Get badge class based on priority
   */
  const getPriorityBadge = (priority) => {
    const badges = {
      High: 'badge-high',
      Medium: 'badge-medium',
      Low: 'badge-low',
    };
    return badges[priority] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Truncate text to specified length
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card-gradient animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-1">{results.length} email{results.length !== 1 ? 's' : ''} classified</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left py-4 px-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Email Content</th>
                <th className="text-left py-4 px-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Department</th>
                <th className="text-left py-4 px-5 text-sm font-bold text-gray-700 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((result, index) => (
                <tr 
                  key={result.id || index} 
                  className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                >
                  <td className="py-4 px-5">
                    <div className="max-w-md">
                      <p className="text-sm text-gray-900 font-medium">
                        {truncateText(result.originalEmail || result.text || 'N/A')}
                      </p>
                      {result.reply && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          <span className="font-semibold text-indigo-600">Reply:</span> {truncateText(result.reply, 80)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`badge ${getCategoryBadge(result.category)}`}>
                      {result.category}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`badge ${getPriorityBadge(result.priority)}`}>
                      {result.priority}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm text-gray-600 font-medium">{result.department}</span>
                  </td>
                  <td className="py-4 px-5">
                    {result.confidence !== undefined ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 min-w-[40px]">{result.confidence}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            <p className="text-3xl font-bold gradient-text">{results.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Emails</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-600">
              {results.filter(r => r.category === 'Finance').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Finance</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">
              {results.filter(r => r.category === 'Technical').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Technical</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600">
              {results.filter(r => r.priority === 'High').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">High Priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
