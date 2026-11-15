import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { 
    currentPage, 
    setCurrentPage, 
    notifications, 
    settings, 
    sensorData,
    fetchRecords,
    fetchAnalytics
  } = useApp();

  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRecords(), fetchAnalytics()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'dashboard': return 'Kitchen Waste Overview';
      case 'detection': return 'AI Vision Food-Waste Identification';
      case 'weight': return 'IoT Smart Weight Monitoring (ESP32 / HX711)';
      case 'records': return 'Historical Waste Audit Log';
      case 'analytics': return 'Food Waste Analytics & Sustainability Insights';
      case 'settings': return 'Cost Matrix & Hardware Configuration';
      default: return 'DhakaGreen Platform';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>DhakaGreen</span>
          <span>/</span>
          <span className="capitalize font-medium text-emerald-700">{currentPage}</span>
        </div>
        <h2 className="text-base font-bold text-slate-800 leading-tight">
          {getPageTitle()}
        </h2>
      </div>

      {/* Action controls & user profile */}
      <div className="flex items-center gap-4">
        {/* Quick Log Button */}
        {currentPage !== 'detection' && (
          <button
            onClick={() => setCurrentPage('detection')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Scan New Waste</span>
          </button>
        )}

        {/* Sync / Refresh */}
        <button
          onClick={handleManualRefresh}
          title="Refresh Data"
          className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* IoT Scale Live Badge */}
        <div 
          onClick={() => setCurrentPage('weight')}
          className="cursor-pointer flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
          title="View ESP32 Weight Sensor"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-medium text-slate-700">
            {sensorData.weightKg.toFixed(2)} kg
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
            Scale Live
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-30">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">System Activity</span>
                <span className="text-[10px] text-slate-400">{notifications.length} active</span>
              </div>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No recent alerts</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 text-xs border border-slate-100">
                      <div className="font-semibold text-slate-700">{n.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs">
            KM
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">
              {settings.kitchenProfile?.managerName || 'Kitchen Manager'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {settings.kitchenProfile?.facilityName || 'Cafeteria A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
