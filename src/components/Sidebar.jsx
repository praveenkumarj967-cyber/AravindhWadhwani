import React from 'react';
import { 
  LayoutDashboard, 
  ScanLine, 
  Scale, 
  FileText, 
  BarChart3, 
  Settings, 
  Leaf, 
  ChevronRight,
  Wifi,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentPage, setCurrentPage, sensorData } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'detection', label: 'Waste Detection', icon: ScanLine, badge: 'AI' },
    { id: 'weight', label: 'Weight Monitoring', icon: Scale, badge: sensorData.status === 'ONLINE' ? 'Live' : null },
    { id: 'records', label: 'Waste Records', icon: FileText, badge: null },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings & Costs', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-emerald-950 text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-xl z-20">
      {/* Brand Logo & Name */}
      <div>
        <div className="p-5 border-b border-emerald-800/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1">
              DhakaGreen
              <span className="text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-900 border border-emerald-700">AI</span>
            </h1>
            <p className="text-[11px] text-emerald-300 font-medium">Food-Waste Monitor</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 font-semibold'
                    : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-emerald-800/80 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* IoT Scale Live Status Pill in Sidebar */}
      <div className="p-4 border-t border-emerald-900/80 bg-emerald-950/60">
        <div className="bg-emerald-900/40 border border-emerald-800/70 rounded-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5"></span>
              <span className="font-semibold text-emerald-200">ESP32 Load Cell</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">CH-A</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-gray-300 text-[11px]">Current Scale:</span>
            <span className="font-mono text-base font-bold text-white tracking-wide">
              {sensorData.weightKg.toFixed(3)} <span className="text-xs font-normal text-emerald-300">kg</span>
            </span>
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 flex justify-between items-center">
            <span>Simulated Sensor</span>
            <span className="text-emerald-300">HX711 Active</span>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-emerald-400/70 text-center">
          DhakaGreen v1.0 • College Innovation
        </div>
      </div>
    </aside>
  );
}
