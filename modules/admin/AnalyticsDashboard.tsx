import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Users, Eye, LogIn, AlertCircle, Clock, Globe, Shield } from 'lucide-react';
import api from '../../lib/api';

const COLORS = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/admin/stats');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;

  const { overview, dailyEngagement, deviceBreakdown, recentLogins } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Analytics</h1>
          <p className="text-gray-500">Real-time platform engagement and activity metrics</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Clock size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-gray-700">Live Updates Active</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Unique Visitors" 
          value={overview.uniqueVisitors} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Eye className="text-green-600" />} 
          label="Page Views" 
          value={overview.totalPageViews} 
          color="bg-green-50"
        />
        <StatCard 
          icon={<LogIn className="text-orange-600" />} 
          label="Success Logins" 
          value={overview.totalLogins} 
          color="bg-orange-50"
        />
        <StatCard 
          icon={<AlertCircle className="text-red-600" />} 
          label="Failed Attempts" 
          value={overview.failedLogins} 
          color="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" />
            7-Day Engagement Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyEngagement}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} activeDot={{r: 6}} name="Page Views" />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} name="Unique Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Shield size={20} className="text-purple-500" />
            Browser Distribution
          </h3>
          <div className="h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {deviceBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {deviceBreakdown.map((entry: any, index: number) => (
                <div key={entry._id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                  <span className="text-sm font-semibold text-gray-600">{entry._id || 'Other'}</span>
                  <span className="text-xs text-gray-400">({entry.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Login Activity</h3>
          <button className="text-orange-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLogins.map((login: any) => (
                <tr key={login._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-700">{login.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      login.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {login.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(login.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {login.ipAddress || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4 hover:scale-[1.02] transition-transform">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value.toLocaleString()}</p>
    </div>
  </div>
);

export default AnalyticsDashboard;
