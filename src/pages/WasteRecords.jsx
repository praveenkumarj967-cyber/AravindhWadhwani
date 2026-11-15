import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Plus, 
  Calendar, 
  Layers, 
  IndianRupee, 
  Scale, 
  Eye, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WasteRecords() {
  const { wasteRecords, settings, deleteRecord, setCurrentPage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState('All');
  const [activeModalRecord, setActiveModalRecord] = useState(null);

  // Filter records
  const filteredRecords = wasteRecords.filter((rec) => {
    const matchesSearch = 
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategoryFilter === 'All' || 
      rec.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    const matchesMethod = 
      selectedMethodFilter === 'All' || 
      rec.detectionMethod === selectedMethodFilter;

    return matchesSearch && matchesCategory && matchesMethod;
  });

  // Export records as CSV
  const exportToCSV = () => {
    const headers = ['Record ID', 'Category', 'Weight (kg)', 'Estimated Cost', 'Confidence', 'Detection Method', 'Date Time', 'Notes'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.category,
      r.weight,
      r.estimatedCost,
      `${Math.round(r.confidence * 100)}%`,
      r.detectionMethod,
      r.timestamp,
      `"${r.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dhakagreen_waste_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Kitchen Waste Records &amp; Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete historical database of all weighed, classified, and audited food-waste entries.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setCurrentPage('detection')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Waste Entry
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {settings.categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Detection Method Filter */}
        <div>
          <select
            value={selectedMethodFilter}
            onChange={(e) => setSelectedMethodFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Detection Methods</option>
            <option value="AI Camera">AI Camera</option>
            <option value="AI Image Upload">AI Image Upload</option>
            <option value="Manual & Scale">Manual &amp; Scale</option>
            <option value="Manual Entry">Manual Entry</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Weight (kg)</th>
                <th className="py-3 px-4">Rate (kg)</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-slate-400">
                    No matching waste records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {r.id}
                      {r.isSampleData && (
                        <span className="ml-1 text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-sans">
                          demo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {r.category}
                    </td>
                    <td className="py-3 px-4">
                      {r.imageUrl ? (
                        <img 
                          src={r.imageUrl} 
                          alt={r.category} 
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 cursor-pointer"
                          onClick={() => setActiveModalRecord(r)}
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {r.weight.toFixed(2)} kg
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {settings.currency}{r.costPerKg || 40}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      {settings.currency}{r.estimatedCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {Math.round(r.confidence * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {r.detectionMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveModalRecord(r)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteRecord(r.id)}
                          title="Delete Record"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-slate-800">Waste Record: {activeModalRecord.id}</h3>
              </div>
              <button 
                onClick={() => setActiveModalRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {activeModalRecord.imageUrl && (
                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <img 
                    src={activeModalRecord.imageUrl} 
                    alt={activeModalRecord.category} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{activeModalRecord.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block">Measured Weight</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">{activeModalRecord.weight.toFixed(2)} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <span className="text-rose-600 block">Estimated Cost</span>
                  <span className="font-bold text-rose-700 text-sm mt-0.5 block font-mono">{settings.currency}{activeModalRecord.estimatedCost.toFixed(2)}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-emerald-700 block">AI Confidence</span>
                  <span className="font-bold text-emerald-800 text-sm mt-0.5 block font-mono">{Math.round(activeModalRecord.confidence * 100)}%</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div><span className="font-semibold text-slate-700">Detection Method:</span> {activeModalRecord.detectionMethod}</div>
                <div><span className="font-semibold text-slate-700">Timestamp:</span> {new Date(activeModalRecord.timestamp).toLocaleString()}</div>
                <div><span className="font-semibold text-slate-700">Kitchen Notes:</span> {activeModalRecord.notes || 'None logged.'}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
