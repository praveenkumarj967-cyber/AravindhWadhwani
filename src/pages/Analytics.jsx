import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  Scale, 
  PieChart as PieIcon, 
  Calendar, 
  Download, 
  Sparkles,
  Leaf,
  Droplet,
  Flame,
  ArrowUpRight,
  ArrowDownRight
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
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';

export default function Analytics() {
  const { analytics, settings } = useApp();
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | 'all'

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
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Kitchen Food-Waste Analytics &amp; Ecological Impact
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            In-depth category performance, cost breakdown, and environmental footprint metrics.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {['7d', '30d', 'all'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                timeRange === t 
                  ? 'bg-white text-emerald-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t === 'all' ? 'All Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Sustainability Impact Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carbon Footprint */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">GHG Footprint</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-200 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold text-emerald-400">
              {kpis.co2EquivalentKg}
            </span>
            <span className="text-xs text-emerald-200 font-sans">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">
            Global standard: ~2.5 kg CO₂ emitted per 1 kg food waste in landfill
          </p>
        </div>

        {/* Virtual Water Footprint */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300">Embedded Water Lost</span>
            <div className="w-8 h-8 rounded-lg bg-blue-800/80 text-blue-200 flex items-center justify-center">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold text-blue-300">
              {kpis.waterSavedLiters.toLocaleString()}
            </span>
            <span className="text-xs text-blue-200 font-sans">Liters</span>
          </div>
          <p className="text-[11px] text-blue-300/80 mt-1">
            Agricultural irrigation water wasted across discarded food production
          </p>
        </div>

        {/* Total Cost Value Burned */}
        <div className="bg-gradient-to-br from-rose-900 to-pink-950 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Direct Financial Loss</span>
            <div className="w-8 h-8 rounded-lg bg-rose-800/80 text-rose-200 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-extrabold text-rose-300">
              {settings.currency}{kpis.totalCost.toLocaleString()}
            </span>
            <span className="text-xs text-rose-200 font-sans">cost</span>
          </div>
          <p className="text-[11px] text-rose-300/80 mt-1">
            Reclaimable through smart production batching &amp; portion control
          </p>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category-wise Waste vs Cost Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Category Waste (kg) vs Cost ({settings.currency})</h3>
              <p className="text-xs text-slate-400">Compare weight volume against financial impact</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} margin={{ top: 20, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#10b981" fontSize={11} tickLine={false} unit="kg" />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} tickLine={false} unit={settings.currency} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="weight" name="Waste (kg)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="cost" name={`Cost (${settings.currency})`} fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cost Distribution Percentage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Financial Loss Share by Category</h3>
              <p className="text-xs text-slate-400">Which waste stream is driving the highest financial drain</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="cost"
                  nameKey="category"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`${settings.currency}${value}`, 'Loss']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table Breakdown below Pie */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {categoryBreakdown.map((cat, i) => (
              <div key={cat.category} className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  {cat.category}
                </span>
                <div className="flex gap-4 font-mono font-medium">
                  <span className="text-slate-500">{cat.weight} kg</span>
                  <span className="text-rose-600 font-bold">{settings.currency}{cat.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kitchen Efficiency Insights Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Managerial Action Plan &amp; Reduction Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <h4 className="font-bold text-emerald-900 mb-1">1. Rice &amp; Carbohydrate Batching</h4>
            <p className="text-slate-600 leading-relaxed">
              Rice accounts for high bulk weight waste in commercial cafeterias. Transitioning from 1 large 20kg batch to 3 staggered 7kg cook-cycles reduces end-of-buffet cold leftovers by up to 34%.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
            <h4 className="font-bold text-rose-900 mb-1">2. High-Value Protein Trimmings (Meat)</h4>
            <p className="text-slate-600 leading-relaxed">
              While meat has lower weight volume than rice, its {settings.currency}180/kg cost means meat waste drives the largest monetary bleed. Use standardized bone trimming templates and stock broth re-utilization.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <h4 className="font-bold text-blue-900 mb-1">3. Vegetable Prep Waste Peeling Standards</h4>
            <p className="text-slate-600 leading-relaxed">
              Staff peeling techniques vary significantly. Training prep cooks on Y-peelers rather than paring knives preserves ~12% more edible carrot and potato flesh.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
            <h4 className="font-bold text-amber-900 mb-1">4. Real-Time Feedback to Head Chef</h4>
            <p className="text-slate-600 leading-relaxed">
              Keep the DhakaGreen tablet stationed next to the dish-wash return area so kitchen crew see immediate daily cost totals after every lunch shift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
