import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

/**
 * Dashboard Component
 * Displays statistics and charts for email classification results
 */
const Dashboard = ({ results }) => {
  // Calculate statistics from results
  const stats = calculateStats(results);

  // Colors for charts
  const CATEGORY_COLORS = {
    Finance: '#10b981',
    Technical: '#3b82f6',
    Spam: '#ef4444',
    Support: '#f59e0b',
    'Promotional / Marketing': '#8b5cf6',
  };

  const PRIORITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Emails */}
        <div className="stat-card bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-medium">Total Emails</p>
                <p className="text-4xl font-bold text-white mt-1">{stats.total}</p>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* High Priority */}
        <div className="stat-card bg-gradient-to-br from-red-500 via-rose-500 to-pink-500">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-medium">High Priority</p>
                <p className="text-4xl font-bold text-white mt-1">{stats.highPriority}</p>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/40 rounded-full transition-all duration-500" 
                style={{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Spam Detected */}
        <div className="stat-card bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-medium">Spam Detected</p>
                <p className="text-4xl font-bold text-white mt-1">{stats.spam}</p>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/40 rounded-full transition-all duration-500" 
                style={{ width: `${stats.total > 0 ? (stats.spam / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="stat-card bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-medium">Avg Confidence</p>
                <p className="text-4xl font-bold text-white mt-1">{stats.avgConfidence}%</p>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/40 rounded-full transition-all duration-500" 
                style={{ width: `${stats.avgConfidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {stats.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution Pie Chart */}
          <div className="card-gradient">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Category Distribution</h3>
                <p className="text-sm text-gray-500">Emails by category type</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution Bar Chart */}
          <div className="card-gradient">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Priority Distribution</h3>
                <p className="text-sm text-gray-500">Emails by priority level</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Emails"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                  >
                    {stats.priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#6b7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* No data message */}
      {stats.total === 0 && (
        <div className="card-gradient text-center py-16">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center animate-float">
            <svg className="w-14 h-14 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Data Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">Start by analyzing emails to see beautiful statistics and charts here</p>
        </div>
      )}
    </div>
  );
};

/**
 * Calculate statistics from results
 */
const calculateStats = (results) => {
  if (!results || results.length === 0) {
    return {
      total: 0,
      highPriority: 0,
      spam: 0,
      avgConfidence: 0,
      categoryData: [],
      priorityData: [],
    };
  }

  const total = results.length;
  const highPriority = results.filter(r => r.priority === 'High').length;
  const spam = results.filter(r => r.category === 'Spam').length;
  
  // Calculate average confidence
  const confidenceSum = results.reduce((sum, r) => sum + (r.confidence || 0), 0);
  const avgConfidence = Math.round(confidenceSum / total);

  // Category distribution
  const categoryCounts = results.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Priority distribution
  const priorityCounts = results.reduce((acc, r) => {
    acc[r.priority] = (acc[r.priority] || 0) + 1;
    return acc;
  }, {});
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

  return {
    total,
    highPriority,
    spam,
    avgConfidence,
    categoryData,
    priorityData,
  };
};

export default Dashboard;
