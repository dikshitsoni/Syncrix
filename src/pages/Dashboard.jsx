import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Activity, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { contacts, deals, activities, currentUser } = useSyncrix();
  const navigate = useNavigate();
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Statistics calculations
  const totalContacts = contacts.length;
  const totalDeals = deals.length;
  
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const lostDeals = deals.filter(d => d.stage === 'Lost');
  const activeDeals = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost');

  const totalWonCount = wonDeals.length;
  const totalLostCount = lostDeals.length;

  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalPieplineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);

  const totalClosedCount = totalWonCount + totalLostCount;
  const conversionRate = totalClosedCount > 0 
    ? Math.round((totalWonCount / totalClosedCount) * 100) 
    : 0;

  // Monthly breakdown for Chart (Jan - May)
  // We'll map the user's specific deals into appropriate months or use the default structure
  const monthlyData = [
    { month: 'Jan', revenue: 0, pipeline: 0 },
    { month: 'Feb', revenue: 0, pipeline: 0 },
    { month: 'Mar', revenue: 0, pipeline: 0 },
    { month: 'Apr', revenue: 0, pipeline: 0 },
    { month: 'May', revenue: 0, pipeline: 0 },
    { month: 'Jun', revenue: 0, pipeline: 0 },
  ];

  // Distribute mock or actual deals into months
  deals.forEach(deal => {
    const date = new Date(deal.expectedCloseDate);
    const monthIndex = date.getMonth(); // 0 = Jan, 5 = Jun
    if (monthIndex >= 0 && monthIndex < 6) {
      if (deal.stage === 'Won') {
        monthlyData[monthIndex].revenue += deal.value;
      } else if (deal.stage !== 'Lost') {
        monthlyData[monthIndex].pipeline += deal.value;
      }
    }
  });

  // Actual user data only to ensure new logins see a clean, empty dashboard
  const hasData = monthlyData.some(m => m.revenue > 0 || m.pipeline > 0);
  const chartData = monthlyData;

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue, d.pipeline))) || 10000;

  const formatCurrency = (val) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}k`;
    }
    return `$${val}`;
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'New Lead': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Proposal Sent': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'Negotiating': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Won': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Lost': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'auth': return <Clock size={16} className="text-blue-500" />;
      case 'contacts': return <Users size={16} className="text-primary" />;
      case 'deals': return <Briefcase size={16} className="text-secondary" />;
      case 'settings': return <TrendingUp size={16} className="text-purple-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div id="dashboard-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#253D2C] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Welcome back, <span className="font-semibold text-primary">{currentUser?.name || 'Freelancer'}</span>. Ready to sync some growth?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="dash-add-contact"
            onClick={() => navigate('/contacts')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-accent-dark bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
          >
            <Users size={16} />
            <span>Add Contact</span>
          </button>
          <button
            id="dash-add-deal"
            onClick={() => navigate('/deals')}
            className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary hover:bg-[#255a33] active:scale-95 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Grid containing 4 core stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Revenue Won */}
        <div className="bg-white p-6 rounded-3xl shadow-stat flex items-start justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-300">
          <div className="space-y-2 font-sans">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-accent-dark tracking-tight">
              ${totalWonValue.toLocaleString()}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Award size={12} />
              {totalWonCount} Deal{totalWonCount !== 1 ? 's' : ''} Won
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-primary rounded-xl shrink-0">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Metric 2: Open Pipeline */}
        <div className="bg-white p-6 rounded-3xl shadow-stat flex items-start justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-300">
          <div className="space-y-2 font-sans">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              Deals Pipeline
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-accent-dark tracking-tight">
              ${totalPieplineValue.toLocaleString()}
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Plus size={12} />
              {activeDeals.length} Deal{activeDeals.length !== 1 ? 's' : ''} Active
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Metric 3: Total Clients */}
        <div className="bg-white p-6 rounded-3xl shadow-stat flex items-start justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-300">
          <div className="space-y-2 font-sans">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              Total Contacts
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-accent-dark tracking-tight">
              {totalContacts}
            </h3>
            <div className="flex gap-2">
              <span className="text-[11px] text-gray-500 font-medium">
                {contacts.filter(c => c.status === 'Active Client').length} Clients
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[11px] text-gray-500 font-medium">
                {contacts.filter(c => c.status === 'Lead').length} Leads
              </span>
            </div>
          </div>
          <div className="p-3 bg-[#e8f6ed] text-[#429c5c] rounded-xl shrink-0">
            <Users size={22} />
          </div>
        </div>

        {/* Metric 4: Conversion Rate */}
        <div className="bg-white p-6 rounded-3xl shadow-stat flex items-start justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-300">
          <div className="space-y-2 font-sans">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">
              Conversion Rate
            </p>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-accent-dark tracking-tight">
              {conversionRate}%
            </h3>
            <span className="text-xs text-gray-500 font-medium block">
              Based on {totalClosedCount} closed deal{totalClosedCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <Percent size={22} />
          </div>
        </div>

      </div>

      {/* Bento Middle Splitter: Chart + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2-Span) */}
        <div className="lg:col-span-2 bg-white p-6 shadow-panel space-y-4 flex flex-col hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-accent-dark">
                Revenue & Pipeline Performance
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Comparing Won Revenue and Pipeline value across active months
              </p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="h-3 w-3 rounded-full bg-primary inline-block"></span>
                <span>Won Revenue</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="h-3 w-3 rounded-full bg-secondary inline-block"></span>
                <span>Active Pipeline</span>
              </div>
            </div>
          </div>

          {/* Inline SVG Chart / Custom Interactive Bars */}
          <div className="h-64 flex flex-col justify-between pt-4 relative">
            
            {/* Chart Grid Line backgrounds */}
            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between select-none pointer-events-none">
              <div className="border-b border-gray-100 w-full h-[1px]"></div>
              <div className="border-b border-gray-100 w-full h-[1px]"></div>
              <div className="border-b border-gray-100 w-full h-[1px]"></div>
              <div className="border-b border-gray-100 w-full h-[1px]"></div>
            </div>

            {/* If no data, show high contrast elegant blank state overlay over the flat bars */}
            {!hasData && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-2xl text-center p-6 select-none">
                <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-3 shadow-stat">
                  <TrendingUp size={24} />
                </div>
                <h4 className="font-display font-bold text-sm text-accent-dark">
                  No Pipeline Performance Data Yet
                </h4>
                <p className="text-[11px] text-gray-500 max-w-[280px] mt-1 leading-normal">
                  Add some active or won deals to track your revenue and pipelines in this interactive workspace chart.
                </p>
                <button
                  onClick={() => navigate('/deals')}
                  className="mt-3.5 px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-[#255a33] active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  Create Your First Deal
                </button>
              </div>
            )}

            {/* Custom Interactive Column Bar Representation */}
            <div className="flex-1 flex items-end justify-around pb-2 z-10">
              {chartData.map((d, index) => {
                const heightRev = `${Math.max(5, (d.revenue / maxVal) * 90)}%`;
                const heightPipe = `${Math.max(5, (d.pipeline / maxVal) * 90)}%`;
                const isHovered = hoveredMonth === index;

                return (
                  <div 
                    key={d.month} 
                    className="flex flex-col items-center group/month w-1/6"
                    onMouseEnter={() => setHoveredMonth(index)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div className="w-full flex justify-center gap-1.5 items-end h-48 relative">
                      
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: heightRev }}
                        className="w-4 sm:w-6 bg-primary rounded-t-md cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-300 relative"
                      ></div>

                      {/* Pipeline Bar */}
                      <div 
                        style={{ height: heightPipe }}
                        className="w-4 sm:w-6 bg-secondary rounded-t-md cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-300 relative"
                      ></div>

                      {/* Dynamic Floating Tooltip */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 bg-[#253D2C] text-white p-3 rounded-xl shadow-xl z-35 text-[11px] font-medium w-36 pointer-events-none">
                          <h4 className="font-bold mb-1 pb-1 border-b border-gray-700 text-center uppercase tracking-wider">{d.month} Summary</h4>
                          <div className="flex justify-between gap-2 mt-1">
                            <span className="text-gray-300 font-medium">Won Rev:</span>
                            <span className="font-bold text-white">${d.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-gray-300 font-medium">Pipeline:</span>
                            <span className="font-bold text-secondary">${d.pipeline.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                    </div>

                    <span className="text-xs font-semibold text-gray-500 mt-2.5 truncate uppercase tracking-wider">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Simple axis label container */}
            <div className="absolute left-0 bottom-9 text-[10px] text-gray-400 font-semibold px-1 py-0.5 bg-white/80 rounded">
              Max: {formatCurrency(maxVal)}
            </div>
          </div>
        </div>

        {/* Activity Feed Column (1-Span) */}
        <div className="bg-white p-6 shadow-panel flex flex-col justify-between hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-50">
              <h3 className="font-display text-base font-bold text-accent-dark">
                Recent Activity
              </h3>
              <Activity size={18} className="text-gray-400" />
            </div>

            <div className="mt-4 space-y-4">
              {activities.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
                  <Activity size={24} className="mb-2 text-gray-300" />
                  <p className="text-xs font-semibold">No recent activity</p>
                  <p className="text-[10px]">Your CRM logs will sync here</p>
                </div>
              ) : (
                activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex gap-3 hover:bg-gray-50/70 p-1.5 rounded-lg transition-transform duration-200">
                    <div className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 shrink-0">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[11px] font-bold text-accent-dark truncate">{act.title}</h4>
                        <span className="text-[9px] text-gray-400 font-semibold shrink-0 ml-1">{timeAgo(act.date)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed truncate">{act.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 mt-4">
            <button
              id="dash-view-deals-pipeline"
              onClick={() => navigate('/deals')}
              className="w-full text-center text-xs font-semibold text-primary hover:text-primary-dark tracking-wide p-1 hover:underline"
            >
              Configure Deal Stages & Pipeline →
            </button>
          </div>
        </div>

      </div>

      {/* Bottom recent deals card board */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-accent-dark">
              Active Deals Pipeline Snippet
            </h3>
            <p className="text-xs text-gray-400 font-medium">Quick overview of largest ongoing negotiations</p>
          </div>
          <button 
            id="dash-pipeline-detail"
            onClick={() => navigate('/deals')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Full Pipeline
            <ArrowUpRight size={14} />
          </button>
        </div>

        {activeDeals.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p className="text-xs font-bold">No active deals in pipeline</p>
            <p className="text-[10px]">Create an active deal to begin progress tracking</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase tracking-wider font-bold">
                  <th className="pb-3 select-none">Deal Name</th>
                  <th className="pb-3 select-none">Client</th>
                  <th className="pb-3 select-none">Value</th>
                  <th className="pb-3 select-none">Expected Close</th>
                  <th className="pb-3 select-none">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-accent-dark">
                {activeDeals.slice(0, 4).map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-55/20 transition-all duration-150">
                    <td className="py-3 font-semibold">{deal.title}</td>
                    <td className="py-3 text-gray-500">{deal.clientName}</td>
                    <td className="py-3 font-bold">${deal.value.toLocaleString()}</td>
                    <td className="py-3 text-gray-500">{deal.expectedCloseDate}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
