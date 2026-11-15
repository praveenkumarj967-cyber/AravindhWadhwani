import React, { useState } from 'react';
import { 
  Scale, 
  RotateCcw, 
  Wifi, 
  Cpu, 
  Activity, 
  Sliders, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WeightMonitoring() {
  const { sensorData, tareSensor, simulateNewWeight, settings, setCurrentPage } = useApp();
  const [customWeightInput, setCustomWeightInput] = useState('');

  const handleSimulateCustom = () => {
    if (customWeightInput !== '') {
      simulateNewWeight(parseFloat(customWeightInput));
      setCustomWeightInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            IoT Load Cell Weight Station (ESP32 + HX711)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interface for connected kitchen waste scales, tare controls, and sensor telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Status: {sensorData.status}
          </span>
        </div>
      </div>

      {/* Main Digital Scale Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scale Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Scale Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-mono font-bold text-slate-300">ESP32-HX711 SCALE TERMINAL</span>
                <p className="text-[10px] text-slate-500">Channel A • Differential 24-Bit ADC</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-emerald-400" /> -58 dBm
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> 98%
              </span>
            </div>
          </div>

          {/* Giant Digital Weight Readout */}
          <div className="my-10 text-center relative z-10">
            <div className="inline-block relative">
              <div className="font-mono text-7xl sm:text-8xl font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                {sensorData.weightKg.toFixed(3)}
              </div>
              <span className="absolute -bottom-4 right-0 font-sans font-bold text-lg text-emerald-200">
                KILOGRAMS
              </span>
            </div>

            <div className="mt-8 flex justify-center items-center gap-6 text-sm font-mono text-slate-400">
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-xs">GRAMS: </span>
                <span className="text-white font-bold">{sensorData.weightGrams} g</span>
              </div>
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-xs">STABILITY: </span>
                <span className={sensorData.isStable ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {sensorData.isStable ? 'STABLE' : 'DRIFTING'}
                </span>
              </div>
              <div className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-xs">TARE: </span>
                <span className="text-white font-bold">{sensorData.tareOffset} g</span>
              </div>
            </div>
          </div>

          {/* Scale Primary Controls (Tare, Zero, Log) */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-3 items-center justify-between relative z-10">
            <button
              onClick={tareSensor}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 shadow flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              Tare / Zero Scale
            </button>

            <button
              onClick={() => setCurrentPage('detection')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/50 flex items-center gap-2 transition-colors"
            >
              <span>Transfer to AI Waste Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Controls & Simulation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Simulation Studio */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                IoT Hardware Simulator
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Prototype Mode
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Simulate real dish and tray placements on the physical load cell without needing hardware connected right now.
            </p>

            {/* Quick dish weight presets */}
            <div>
              <span className="text-xs font-semibold text-slate-600 block mb-2">Simulate Food Waste Placements:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Plate Scraping (0.45 kg)', val: 0.450 },
                  { label: 'Cooked Rice Tray (2.50 kg)', val: 2.500 },
                  { label: 'Veg Trim Bucket (1.85 kg)', val: 1.850 },
                  { label: 'Bakery Batch (0.90 kg)', val: 0.900 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => simulateNewWeight(preset.val)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-xs font-medium text-slate-700 text-left transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom weight simulation input */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Enter Custom Simulated Load (kg):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 3.25"
                  value={customWeightInput}
                  onChange={(e) => setCustomWeightInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSimulateCustom}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply Load
                </button>
              </div>
            </div>

            {/* Random jitter trigger */}
            <button
              onClick={() => simulateNewWeight()}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Generate Random Plate Waste (0.35 - 3.2 kg)
            </button>
          </div>

          {/* Hardware & Microcontroller Architecture Specs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Embedded Specifications
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Microcontroller</span>
                <span className="font-mono font-semibold text-slate-800">ESP32-WROOM-32</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Weight Sensor</span>
                <span className="font-mono font-semibold text-slate-800">4x Half-Bridge Load Cells</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>ADC Amplifier</span>
                <span className="font-mono font-semibold text-slate-800">HX711 24-Bit ADC</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Transmission Protocol</span>
                <span className="font-mono font-semibold text-emerald-700">REST API / MQTT JSON</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Max Capacity</span>
                <span className="font-mono font-semibold text-slate-800">20.000 kg (±5g resolution)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
