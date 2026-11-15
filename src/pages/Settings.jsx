import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  IndianRupee, 
  Save, 
  RotateCcw, 
  Wifi, 
  Cpu, 
  Scale, 
  Sliders, 
  Check, 
  AlertCircle,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { settings, updateSettings, addNotification } = useApp();

  const [categories, setCategories] = useState(settings.categories);
  const [currency, setCurrency] = useState(settings.currency);
  const [facilityName, setFacilityName] = useState(settings.kitchenProfile?.facilityName || 'Central Cafeteria - Kitchen A');
  const [managerName, setManagerName] = useState(settings.kitchenProfile?.managerName || 'Kitchen Manager');
  const [dailyWasteTargetKg, setDailyWasteTargetKg] = useState(settings.kitchenProfile?.dailyWasteTargetKg || 15.0);
  const [sensorMode, setSensorMode] = useState(settings.iotSettings?.sensorMode || 'simulated');
  const [sensorIp, setSensorIp] = useState(settings.iotSettings?.sensorIp || '192.168.1.120');

  // Handle category cost update
  const handleCostChange = (id, newCost) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, costPerKg: parseFloat(newCost) || 0 } : c));
  };

  // Handle save
  const handleSaveAll = async () => {
    const newSettings = {
      ...settings,
      currency,
      categories,
      kitchenProfile: {
        ...settings.kitchenProfile,
        facilityName,
        managerName,
        dailyWasteTargetKg: parseFloat(dailyWasteTargetKg) || 15.0
      },
      iotSettings: {
        ...settings.iotSettings,
        sensorMode,
        sensorIp
      }
    };
    await updateSettings(newSettings);
  };

  // Reset to default sample costs
  const handleResetDefaults = () => {
    setCategories([
      { id: 'rice', name: 'Rice', costPerKg: 45, color: '#f59e0b', description: 'Leftover cooked rice, biryani, fried rice' },
      { id: 'vegetables', name: 'Vegetables', costPerKg: 35, color: '#10b981', description: 'Cooked curries, chopped peels, salads' },
      { id: 'fruits', name: 'Fruits', costPerKg: 60, color: '#ec4899', description: 'Fruit rinds, leftover slices, damaged fruits' },
      { id: 'bread', name: 'Bread', costPerKg: 50, color: '#8b5cf6', description: 'Roti, naan, toast, bakery leftovers' },
      { id: 'meat', name: 'Meat', costPerKg: 180, color: '#ef4444', description: 'Chicken, fish, beef trimmings, bones with meat' },
      { id: 'other', name: 'Other food waste', costPerKg: 30, color: '#6b7280', description: 'Mixed gravies, sauces, tea leaves, unidentified' }
    ]);
    addNotification('Defaults Restored', 'Standard food-cost benchmarks reloaded', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-600" />
            Kitchen Settings &amp; Cost Matrix Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure food-waste cost multipliers per kilogram, facility metadata, and ESP32 hardware connection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Category Cost Per Kilogram Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Category Cost-per-Kilogram Multipliers
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These rates directly calculate the financial loss in: <span className="font-mono font-semibold">Estimated Cost = Weight (kg) × Cost per kg</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Currency Symbol:</span>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-12 px-2 py-1 text-center font-bold font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">ID: {cat.id}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-500">{currency}</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={cat.costPerKg}
                  onChange={(e) => handleCostChange(cat.id, e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-500 font-medium">/ kg</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Facility & Kitchen Profile */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          Facility &amp; Operational Targets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kitchen / Cafeteria Name</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kitchen Manager Name</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Daily Waste Target (kg)</label>
            <input
              type="number"
              step="0.5"
              value={dailyWasteTargetKg}
              onChange={(e) => setDailyWasteTargetKg(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* IoT Hardware Integration Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          IoT Scale Connectivity (ESP32 + Load Cell)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Scale Sensor Operation Mode</label>
            <select
              value={sensorMode}
              onChange={(e) => setSensorMode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="simulated">Simulated Smart Scale (Demo / Presentation Mode)</option>
              <option value="esp32_live">Physical ESP32 REST / MQTT Stream (Live Hardware)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ESP32 Static IP / Host</label>
            <input
              type="text"
              value={sensorIp}
              onChange={(e) => setSensorIp(e.target.value)}
              placeholder="192.168.1.120"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Modular ESP32 Integration:</strong> Physical ESP32 microcontrollers can post live weigh readings directly to <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">POST /api/sensor/weight</code> with payload <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">{"{\"weightGrams\": 1450}"}</code>.
          </span>
        </div>
      </div>
    </div>
  );
}
