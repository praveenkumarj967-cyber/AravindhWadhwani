import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import WasteDetection from './pages/WasteDetection';
import WeightMonitoring from './pages/WeightMonitoring';
import WasteRecords from './pages/WasteRecords';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function MainContent() {
  const { currentPage } = useApp();

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'detection' && <WasteDetection />}
        {currentPage === 'weight' && <WeightMonitoring />}
        {currentPage === 'records' && <WasteRecords />}
        {currentPage === 'analytics' && <Analytics />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen w-full bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}
