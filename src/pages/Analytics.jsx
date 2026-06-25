import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Info,
  Plus,
  Briefcase
} from 'lucide-react';

export default function Analytics() {
  const { deals, contacts } = useSyncrix();
  const navigate = useNavigate();
  const [activeQuarter, setActiveQuarter] = useState('All');

  const hasNoData = deals.length === 0 || deals.every(d => Number(d.value) === 0);

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

  // Generate target forecasting dynamically based on user deals
  const generateDynamicMonthlyTargets = () => {
    // Collect all valid dates from deals
    const dealDates = deals
      .filter(d => d.expectedCloseDate)
      .map(d => new Date(d.expectedCloseDate));

    let startYear, startMonth, endYear, endMonth;

    if (dealDates.length > 0) {
      // Find the min and max dates
      const minDate = new Date(Math.min(...dealDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dealDates.map(d => d.getTime())));
      
      startYear = minDate.getFullYear();
      startMonth = minDate.getMonth();
      endYear = maxDate.getFullYear();
      endMonth = maxDate.getMonth();
    } else {
      // If no deals have dates, use a default 6-month window (Jan to Jun of the current year)
      const currentYear = new Date().getFullYear();
      startYear = currentYear;
      startMonth = 0; // Jan
      endYear = currentYear;
      endMonth = 5; // Jun
    }

    // Ensure we cover a range of at least 3 months for display quality
    let monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
    if (monthsDiff < 2) {
      // Pad to have at least 3 months
      const midVal = startYear * 12 + startMonth;
      const newStartVal = midVal - 1;
      const newEndVal = midVal + 1;
      startYear = Math.floor(newStartVal / 12);
      startMonth = newStartVal % 12;
      endYear = Math.floor(newEndVal / 12);
      endMonth = newEndVal % 12;
    }

    const monthList = [];
    let currYear = startYear;
    let currMonth = startMonth;

    while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
      const monthName = new Date(currYear, currMonth, 1).toLocaleString('default', { month: 'short' });
      monthList.push({
        month: monthName,
        year: currYear,
        monthIdx: currMonth,
        Revenue: 0,
        GrowthPlan: 0,
        growth: 'Baseline'
      });

      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;
        currYear++;
      }
    }

    // Sum won deals revenue grouped by month
    monthList.forEach(mObj => {
      const wonDealsInMonth = deals.filter(d => {
        if (d.stage !== 'Won') return false;
        if (!d.expectedCloseDate) return false;
        const dDate = new Date(d.expectedCloseDate);
        return dDate.getFullYear() === mObj.year && dDate.getMonth() === mObj.monthIdx;
      });
      mObj.Revenue = wonDealsInMonth.reduce((sum, d) => sum + Number(d.value || 0), 0);
    });

    // Calculate dynamic growth percentage month-over-month
    monthList.forEach((mObj, idx) => {
      if (idx === 0) {
        mObj.growth = 'Baseline';
      } else {
        const prevRev = monthList[idx - 1].Revenue;
        const currRev = mObj.Revenue;
        if (prevRev === 0) {
          mObj.growth = currRev > 0 ? '+100%' : '0%';
        } else {
          const change = ((currRev - prevRev) / prevRev) * 100;
          mObj.growth = (change >= 0 ? '+' : '') + Math.round(change) + '%';
        }
      }
    });

    // Determine baseline for the GrowthPlan
    let baseline = monthList[0].Revenue;
    if (baseline === 0) {
      // Find the first month with non-zero revenue
      const firstNonZero = monthList.find(m => m.Revenue > 0);
      if (firstNonZero) {
        baseline = firstNonZero.Revenue;
      } else {
        // Fallback: 50% of the largest deal value in the pipeline, or default to $1,000
        const maxDealVal = Math.max(...deals.map(d => Number(d.value || 0)), 0);
        baseline = maxDealVal > 0 ? Math.round(maxDealVal * 0.5) : 1000;
      }
    }

    // Apply steady 10% month-over-month growth plan
    monthList.forEach((mObj, idx) => {
      mObj.GrowthPlan = Math.round(baseline * Math.pow(1.10, idx));
    });

    return monthList;
  };

  const monthlyTargets = generateDynamicMonthlyTargets();

  const maxChartVal = Math.max(...monthlyTargets.map(t => Math.max(t.GrowthPlan, t.Revenue))) || 10000;

  // Modern Line Graph state and math calculations
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const chartHeight = 220;
  const chartWidth = 500;
  const paddingLeft = 50;
  const paddingTop = 25;
  const paddingBottom = 35;
  const paddingRight = 20;

  const yMaxVal = maxChartVal * 1.15; // 15% breathing room

  const chartPoints = monthlyTargets.map((item, idx) => {
    const x = paddingLeft + (idx / (monthlyTargets.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const yTarget = paddingTop + (1 - item.GrowthPlan / yMaxVal) * (chartHeight - paddingTop - paddingBottom);
    const yRevenue = paddingTop + (1 - item.Revenue / yMaxVal) * (chartHeight - paddingTop - paddingBottom);
    return { x, yTarget, yRevenue, ...item };
  });

  const getBezierPath = (pts, key) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0][key]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.35;
      const cp1y = p0[key];
      const cp2x = p1.x - (p1.x - p0.x) * 0.35;
      const cp2y = p1[key];
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1[key]}`;
    }
    return d;
  };

  const getAreaPath = (pts, key, yBaseline) => {
    const linePath = getBezierPath(pts, key);
    if (!linePath) return '';
    return `${linePath} L ${pts[pts.length - 1].x} ${yBaseline} L ${pts[0].x} ${yBaseline} Z`;
  };

  const formatYLabel = (val) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  // 4 Grid divisions
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const value = Math.round(yMaxVal * ratio);
    const y = paddingTop + (1 - ratio) * (chartHeight - paddingTop - paddingBottom);
    return { value, y };
  });

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
        <div className="bg-white p-6 shadow-stat space-y-1 transition-all duration-300" style={{ borderRadius: '24px' }}>
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
        <div className="bg-white p-6 shadow-stat space-y-1 transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary font-sans">Deal Success Index</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            {successRate}%
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-[#429c5c] font-semibold">
            <span>{wonDeals.length} won / {lostDeals.length} lost</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 shadow-stat space-y-1 transition-all duration-300" style={{ borderRadius: '24px' }}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-secondary">Total Client Assets</p>
          <h3 className="text-2xl font-display font-black text-accent-dark">
            {contacts.length} Contacts
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
            <span>{clientCount} active project clients</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 shadow-stat space-y-1 transition-all duration-300" style={{ borderRadius: '24px' }}>
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
        <div className="lg:col-span-2 bg-white p-6 shadow-panel space-y-5 transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div className="flex items-center justify-between pb-2 border-b border-gray-50">
            <div>
              <h3 className="font-display text-base font-extrabold text-accent-dark">
                Revenue Growth vs Growth Plan
              </h3>
              <p className="text-xs text-gray-400 font-medium">Tracking actual closed revenues in comparison to targets</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-slate-400 border-t border-dashed"></span>
                <span>Growth Plan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-4 bg-[#10B981] rounded-full"></span>
                <span>Revenue Growth</span>
              </div>
            </div>
          </div>

          <div className="relative pt-2">
            {hasNoData ? (
              <div 
                className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-4"
                style={{ minHeight: `${chartHeight}px` }}
              >
                <div className="p-3 bg-white shadow-md rounded-xl text-gray-400">
                  <Briefcase size={28} className="stroke-[1.5]" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h4 className="font-display text-base font-extrabold text-accent-dark">
                    No Pipeline Data to Map
                  </h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Revenue analytics and target projection tracking require active deals. Once you create your first pipeline item, your growth curves will populate here dynamically.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/deals')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-[#20512f] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  <span>Add New Deal</span>
                </button>
              </div>
            ) : (
              <>
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  className="w-full h-auto overflow-visible select-none"
                >
                  <defs>
                    {/* Revenue gradient fill */}
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
                    </linearGradient>
                    {/* Target gradient fill */}
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines (Ultra-faint, horizontal only) */}
                  <g className="grid-lines">
                    {gridLines.map((grid, idx) => (
                      <g key={idx}>
                        <line 
                          x1={paddingLeft} 
                          y1={grid.y} 
                          x2={chartWidth - paddingRight} 
                          y2={grid.y} 
                          stroke="#F1F5F9" 
                          strokeWidth="1"
                        />
                        <text 
                          x={paddingLeft - 8} 
                          y={grid.y + 3.5} 
                          textAnchor="end"
                          className="text-[9px] font-bold text-slate-400 font-sans"
                        >
                          {formatYLabel(grid.value)}
                        </text>
                      </g>
                    ))}
                  </g>

                  {/* X Axis Labels */}
                  <g className="x-axis-labels">
                    {chartPoints.map((pt, idx) => (
                      <text 
                        key={idx} 
                        x={pt.x} 
                        y={chartHeight - 8} 
                        textAnchor="middle" 
                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                      >
                        {pt.month}
                      </text>
                    ))}
                  </g>

                  {/* Area Fills */}
                  <path
                    d={getAreaPath(chartPoints, 'yTarget', chartHeight - paddingBottom)} 
                    fill="url(#targetGrad)"
                  />
                  <path
                    d={getAreaPath(chartPoints, 'yRevenue', chartHeight - paddingBottom)} 
                    fill="url(#revenueGrad)" 
                  />

                  {/* Curves */}
                  {/* Target (Growth Plan) Line - Dashed contrasting slate */}
                  <path 
                    d={getBezierPath(chartPoints, 'yTarget')} 
                    fill="none" 
                    stroke="#94A3B8" 
                    strokeWidth="1.75" 
                    strokeDasharray="4 4" 
                  />
                  {/* Revenue (Actual Growth) Line - Vibrant, premium Emerald */}
                  <path 
                    d={getBezierPath(chartPoints, 'yRevenue')} 
                    fill="none" 
                    stroke="#10B981" 
                    strokeWidth="3.25" 
                    strokeLinecap="round" 
                  />

                  {/* Hover Indicator Vertical Dashed Line */}
                  {hoveredIdx !== null && (
                    <line 
                      x1={chartPoints[hoveredIdx].x} 
                      y1={paddingTop} 
                      x2={chartPoints[hoveredIdx].x} 
                      y2={chartHeight - paddingBottom} 
                      stroke="rgba(16, 185, 129, 0.15)" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                    />
                  )}

                  {/* Static Data Points */}
                  <g className="data-dots">
                    {chartPoints.map((pt, idx) => (
                      <g key={idx}>
                        <circle 
                          cx={pt.x} 
                          cy={pt.yTarget}
                          r={hoveredIdx === idx ? 4.5 : 2.5}
                          fill={hoveredIdx === idx ? "#64748B" : "#CBD5E1"} 
                          className="transition-all duration-150"
                        />
                        <circle 
                          cx={pt.x} 
                          cy={pt.yRevenue} 
                          r={hoveredIdx === idx ? 5.5 : 3.5} 
                          fill={hoveredIdx === idx ? "#10B981" : "#34D399"} 
                          className="transition-all duration-150"
                        />
                      </g>
                    ))}
                  </g>

                  {/* Focus circles on hover */}
                  {hoveredIdx !== null && (
                    <g className="hover-focus pointer-events-none">
                      <circle 
                        cx={chartPoints[hoveredIdx].x} 
                        cy={chartPoints[hoveredIdx].yTarget} 
                        r={6.5} 
                        fill="#FFFFFF" 
                        stroke="#64748B" 
                        strokeWidth="2" 
                      />
                      <circle 
                        cx={chartPoints[hoveredIdx].x} 
                        cy={chartPoints[hoveredIdx].yRevenue} 
                        r={7.5} 
                        fill="#FFFFFF" 
                        stroke="#10B981" 
                        strokeWidth="3.5" 
                      />
                    </g>
                  )}

                  {/* Invisible Hover Interaction Zones */}
                  <g className="hover-zones">
                    {(() => {
                      const zoneWidth = (chartWidth - paddingLeft - paddingRight) / (chartPoints.length - 1);
                      return chartPoints.map((pt, idx) => {
                        let xStart = pt.x - zoneWidth / 2;
                        let w = zoneWidth;
                        if (idx === 0) {
                          xStart = paddingLeft;
                          w = zoneWidth / 2;
                        } else if (idx === chartPoints.length - 1) {
                          w = zoneWidth / 2;
                        }
                        return (
                          <rect
                            key={idx}
                            x={xStart}
                            y={0}
                            width={w}
                            height={chartHeight}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                          />
                        );
                      });
                    })()}
                  </g>
                </svg>

                {/* Frosted Glass Floating Tooltip */}
                {hoveredIdx !== null && (
                  <div 
                    className="absolute z-35 pointer-events-none bg-white/75 backdrop-blur-md border border-white/35 shadow-xl rounded-2xl p-3 text-left transition-all duration-200 ease-out min-w-[155px]"
                    style={{
                      left: `${(chartPoints[hoveredIdx].x / chartWidth) * 100}%`,
                      top: `${(Math.min(chartPoints[hoveredIdx].yTarget, chartPoints[hoveredIdx].yRevenue) / chartHeight) * 100}%`,
                      transform: 'translate(-50%, -100%) translateY(-15px)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-gray-150/40 pb-1.5 mb-1.5">
                      <span className="text-[10px] font-bold text-accent-dark uppercase tracking-widest">
                        {chartPoints[hoveredIdx].month} Progress
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        chartPoints[hoveredIdx].Revenue >= chartPoints[hoveredIdx].GrowthPlan 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {chartPoints[hoveredIdx].growth}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full"></span>
                          Target:
                        </span>
                        <strong className="text-accent-dark">${chartPoints[hoveredIdx].GrowthPlan.toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 bg-[#10B981] rounded-full"></span>
                          Revenue:
                        </span>
                        <strong className="text-[#10B981]">${chartPoints[hoveredIdx].Revenue.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Client Expansion Breakdown (Span 1) */}
        <div className="bg-white p-6 shadow-panel flex flex-col justify-between transition-all duration-300" style={{ borderRadius: '32px' }}>
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
