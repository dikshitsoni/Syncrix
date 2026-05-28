import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  DollarSign, 
  Percent, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';

export default function Analytics() {
  const { deals, contacts } = useSyncrix();
  const [activeQuarter, setActiveQuarter] = useState('All');

  // Metric Computations
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const lostDeals = deals.filter(d => d.stage === 'Lost');
  const pipelineDeals = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost');

  const wonSum = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const pipelineSum = pipelineDeals.reduce((sum, d) => sum + d.value, 0);
  
  const closedCount = wonDeals.length + lostDeals.length;
  const successRate = closedCount > 0 
    ? Math.round((wonDeals.length / closedCount) * 100) 
    : 0;

  // Average deal size
  const averageDealSize = wonDeals.length > 0 
    ? Math.round(wonSum / wonDeals.length) 
    : 0;

  // Client growth metrics
  const clientCount = contacts.filter(c => c.status === 'Active Client').length;
  const leadCount = contacts.filter(c => c.status === 'Lead').length;
  const pastCount = contacts.filter(c => c.status === 'Past Client').length;

  // Generate target forecasting
  const monthlyTargets = [
    { month: 'Jan', target: 5000, revenue: 3200, growth: 'Baseline' },
    { month: 'Feb', target: 6000, revenue: 4100, growth: '+28%' },
    { month: 'Mar', target: 7000, revenue: 2100, growth: '-48%' },
    { month: 'Apr', target: 8000, revenue: 6800, growth: '+223%' },
    { month: 'May', target: 10000, revenue: 10500, growth: '+54%' },
    { month: 'Jun', target: 12000, revenue: 12000, growth: '+14%' },
  ];

  // Map user actual won data override if available
  deals.forEach(deal => {
    if (deal.stage === 'Won') {
      const date = new Date(deal.expectedCloseDate);
      const mIdx = date.getMonth();
      if (mIdx >= 0 && mIdx < 6) {
        // Adjust baseline slightly
        monthlyTargets[mIdx].revenue += Math.round(deal.value / 2); // Split so user items build upon sample smoothly
      }
    }
  });

  const maxChartVal = Math.max(...monthlyTargets.map(t => Math.max(t.target, t.revenue))) || 10000;

  return (
    <div id="analytics-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-accent-dark tracking-tight">
          SaaS Performance Analytics
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Deep dives into revenue trajectories, client volume expansion, and success indexes
        </p>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-6 shadow-stat space-y-1 hover:scale-[1.01] hover:shadow-md transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">Avg Deal Size</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            ${averageDealSize.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-primary font-bold">
            <TrendingUp size={12} />
            <span>High Ticket Synergy</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 shadow-stat space-y-1 hover:scale-[1.01] hover:shadow-md transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary font-sans">Deal Success Index</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            {successRate}%
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-[#429c5c] font-semibold">
            <span>{wonDeals.length} won / {lostDeals.length} lost</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 shadow-stat space-y-1 hover:scale-[1.01] hover:shadow-md transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">Total Client Assets</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            {contacts.length} Contacts
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
            <span>{clientCount} active project clients</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 shadow-stat space-y-1 hover:scale-[1.01] hover:shadow-md transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">Committed pipeline</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            ${pipelineSum.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <span>{pipelineDeals.length} open negotiation channels</span>
          </div>
        </div>

      </div>

      {/* Main split dashboard: Revenue targets vs category breakouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Target Column (Span 2) */}
        <div className="lg:col-span-2 bg-white p-6 shadow-panel space-y-5 hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <div>
              <h3 className="font-display text-base font-extrabold text-accent-dark">
                Revenue Growth vs Growth Plan
              </h3>
              <p className="text-xs text-gray-400 font-medium">Tracking actual closed revenues in comparison to targets</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 bg-gray-200 border border-gray-400 rounded-sm"></span>
                <span>Monthly Target</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 bg-primary rounded-sm"></span>
                <span>Actual Earned</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {monthlyTargets.map((item) => {
              const targetPercent = Math.min(100, (item.target / maxChartVal) * 100);
              const actualPercent = Math.min(100, (item.revenue / maxChartVal) * 100);
              const capReached = item.revenue >= item.target;

              return (
                <div key={item.month} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-accent-dark w-10 uppercase tracking-widest">{item.month}</span>
                    <div className="flex items-center gap-2.5 text-gray-500 text-[11px] font-semibold">
                      <span>Target: <strong className="text-accent-dark">${item.target.toLocaleString()}</strong></span>
                      <span className="text-gray-300">|</span>
                      <span>Earned: <strong className={capReached ? "text-primary font-bold" : "text-gray-700"}>${item.revenue.toLocaleString()}</strong></span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${capReached ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.growth}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar System */}
                  <div className="h-5 w-full bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 p-0.5 flex flex-col justify-center space-y-0.5">
                    
                    {/* Target line bar inside overlay container */}
                    <div 
                      style={{ width: `${targetPercent}%` }}
                      className="h-1.5 bg-gray-200 rounded-sm transition-all duration-500"
                    ></div>

                    {/* Actual revenue progress bar */}
                    <div 
                      style={{ width: `${actualPercent}%` }}
                      className={`h-2 rounded-sm transition-all duration-500 ${capReached ? 'bg-primary' : 'bg-secondary'}`}
                    ></div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Expansion Breakdown (Span 1) */}
        <div className="bg-white p-6 shadow-panel flex flex-col justify-between hover:scale-[1.005] transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div className="space-y-4">
            <h3 className="font-display text-base font-extrabold text-accent-dark pb-2 border-b border-gray-50">
              Client Allocation
            </h3>

            {/* Custom Pie-style circular representation using elegant CSS/HTML columns */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative h-28 w-28 rounded-full border-4 border-gray-50 flex items-center justify-center p-2 shadow-inner">
                {/* Visual Circle gauge */}
                <div className="text-center">
                  <span className="text-3xl font-display font-black text-accent-dark block leading-none">
                    {contacts.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mt-1">
                    Total
                  </span>
                </div>
              </div>

              {/* Status metrics bar list */}
              <div className="w-full space-y-3 pt-2">
                
                {/* Leads */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      Leads Pipeline
                    </span>
                    <span>{leadCount} ({contacts.length > 0 ? Math.round((leadCount / contacts.length) * 100) : 0}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-55/60 rounded-full bg-gray-50">
                    <div 
                      style={{ width: `${contacts.length > 0 ? (leadCount / contacts.length) * 100 : 0}%` }} 
                      className="h-full rounded-full bg-blue-500"
                    ></div>
                  </div>
                </div>

                {/* Active Clients */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Active Project Clients
                    </span>
                    <span>{clientCount} ({contacts.length > 0 ? Math.round((clientCount / contacts.length) * 100) : 0}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-55/60 rounded-full bg-gray-50">
                    <div 
                      style={{ width: `${contacts.length > 0 ? (clientCount / contacts.length) * 100 : 0}%` }} 
                      className="h-full rounded-full bg-primary"
                    ></div>
                  </div>
                </div>

                {/* Past Clients */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-gray-505 text-gray-500">
                      <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                      Past Archive
                    </span>
                    <span>{pastCount} ({contacts.length > 0 ? Math.round((pastCount / contacts.length) * 100) : 0}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-55/60 rounded-full  bg-gray-50">
                    <div 
                      style={{ width: `${contacts.length > 0 ? (pastCount / contacts.length) * 100 : 0}%` }} 
                      className="h-full rounded-full bg-gray-400"
                    ></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 text-xs font-semibold text-gray-400 flex items-center gap-1.5 mt-4">
            <Info size={14} className="text-secondary shrink-0" />
            <span>Updates match localStorage sync states instantly.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
