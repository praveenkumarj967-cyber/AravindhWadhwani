import React from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight,
  Clock,
  Layers,
  Leaf,
  Droplet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { analytics, wasteRecords, settings, setCurrentPage, sensorData } = useApp();

  const kpis = analytics?.kpis || {
    totalWasteKg: 0,
    totalCost: 0,
    entryCount: 0,
    mostWastedCategory: 'None',
    averageDailyWasteKg: 0,
    co2EquivalentKg: 0,
    waterSavedLiters: 0
  };

  const categoryBreakdown = analytics?.categoryBreakdown || [];
  const dailyTrends = analytics?.dailyTrends || [];
  const insights = analytics?.insights || [];

  const COLORS = ['#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for Simulation / College Project Transparency */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              DhakaGreen Kitchen Monitor Active
              <span className="text-[10px] bg-emerald-200/80 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Simulated ESP32 &amp; Vision Ready
              </span>
            </h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Live automated waste logging with real-time financial loss tracking &amp; actionable portion suggestions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentPage('detection')}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            Log New Waste
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Waste */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Waste</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">
              {kpis.totalWasteKg}
            </span>
            <span className="text-xs font-medium text-slate-500">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Across {kpis.entryCount} recorded batches</span>
          </div>
        </div>

        {/* KPI 2: Total Financial Loss */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estimated Cost</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-rose-600 font-mono tracking-tight">
              {settings.currency}{kpis.totalCost.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Based on active category rates
          </div>
        </div>

        {/* KPI 3: Waste Entries */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Waste Events</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">
              {kpis.entryCount}
            </span>
            <span className="text-xs font-medium text-slate-500">entries</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-medium">
            AI &amp; Manual audit records
          </div>
        </div>

        {/* KPI 4: Most Wasted Food Category */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Most Wasted</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-amber-600 truncate">
              {kpis.mostWastedCategory}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            High priority for portioning
          </div>
        </div>

        {/* KPI 5: Daily Average Waste */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily Average</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">
              {kpis.averageDailyWasteKg}
            </span>
            <span className="text-xs font-medium text-slate-500">kg/day</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Target: &lt;{settings.kitchenProfile?.dailyWasteTargetKg || 15} kg/day
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Daily Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Daily Food-Waste Trends (kg)</h3>
              <p className="text-xs text-slate-400">Total discarded weight measured day-by-day</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#10b981" stop-opacity={0.3}/>
                    <stop offset="95%" stop-color="#10b981" stop-opacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`${value} kg`, 'Waste Weight']}
                />
                <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Category Breakdown Pie */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Category Distribution</h3>
              <p className="text-xs text-slate-400">Weight breakdown by food type</p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="weight"
                  nameKey="category"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value, name) => [`${value} kg`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Mini Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {categoryBreakdown.slice(0, 4).map((cat, idx) => (
              <div key={cat.category} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 truncate">{cat.category}:</span>
                <span className="font-mono font-semibold text-slate-800">{cat.weight}kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Insights Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">AI Kitchen Insights &amp; Reduction Recommendations</h3>
          </div>
          <span className="text-[11px] text-slate-400">Calculated from stored logs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-xl border text-xs flex flex-col justify-between ${
                ins.type === 'danger' 
                  ? 'bg-rose-50/50 border-rose-200 text-rose-950' 
                  : ins.type === 'warning'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 mb-1.5 text-slate-800">
                  <span className={`w-2 h-2 rounded-full ${
                    ins.type === 'danger' ? 'bg-rose-500' : ins.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  {ins.title}
                </div>
                <p className="text-slate-600 leading-relaxed mb-3">
                  {ins.message}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/50 text-slate-700 font-medium">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Recommended Action:</span>
                {ins.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Waste Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Waste Activity</h3>
            <p className="text-xs text-slate-400">Latest logged food items and sensor readings</p>
          </div>
          <button 
            onClick={() => setCurrentPage('records')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All Records
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Measured Weight</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Detection Method</th>
                <th className="py-3 px-4">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wasteRecords.slice(0, 6).map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-600">{rec.id}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {rec.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">{rec.weight.toFixed(2)} kg</td>
                  <td className="py-3 px-4 font-mono font-semibold text-rose-600">{settings.currency}{rec.estimatedCost.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{rec.detectionMethod}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {new Date(rec.timestamp).toLocaleDateString()} {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
