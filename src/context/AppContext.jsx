import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard | detection | weight | records | analytics | settings
  
  // Settings & Configuration
  const [settings, setSettings] = useState({
    currency: '₹',
    categories: [
      { id: 'rice', name: 'Rice', costPerKg: 45, color: '#f59e0b', description: 'Leftover cooked rice, biryani, fried rice' },
      { id: 'vegetables', name: 'Vegetables', costPerKg: 35, color: '#10b981', description: 'Cooked curries, chopped peels, salads' },
      { id: 'fruits', name: 'Fruits', costPerKg: 60, color: '#ec4899', description: 'Fruit rinds, leftover slices, damaged fruits' },
      { id: 'bread', name: 'Bread', costPerKg: 50, color: '#8b5cf6', description: 'Roti, naan, toast, bakery leftovers' },
      { id: 'meat', name: 'Meat', costPerKg: 180, color: '#ef4444', description: 'Chicken, fish, beef trimmings, bones with meat' },
      { id: 'other', name: 'Other food waste', costPerKg: 30, color: '#6b7280', description: 'Mixed gravies, sauces, tea leaves, unidentified' }
    ],
    iotSettings: {
      sensorMode: 'simulated',
      sensorIp: '192.168.1.120',
      port: 8080,
      tareOffset: 0,
      calibrationFactor: 420.5
    },
    kitchenProfile: {
      facilityName: 'Central Cafeteria - Kitchen A',
      managerName: 'Kitchen Manager',
      dailyWasteTargetKg: 15.0
    }
  });

  // Sensor state
  const [sensorData, setSensorData] = useState({
    weightGrams: 1450,
    weightKg: 1.45,
    tareOffset: 0,
    isStable: true,
    status: 'ONLINE',
    hardware: 'ESP32 + HX711 Load Cell (Channel A)',
    lastReadingTime: new Date().toISOString(),
    batteryLevel: 98,
    rssi: -58
  });

  // Waste records list
  const [wasteRecords, setWasteRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch settings & initial data
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn('Backend not responding yet, using local settings state');
    }
  };

  const fetchRecords = async (query = '') => {
    try {
      const res = await fetch(`/api/waste-records${query ? `?${query}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setWasteRecords(data.records);
      }
    } catch (err) {
      console.warn('Using local records state');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.warn('Using local analytics state');
    }
  };

  const fetchSensor = async () => {
    try {
      const res = await fetch('/api/sensor/weight');
      if (res.ok) {
        const data = await res.json();
        setSensorData(data);
      }
    } catch (err) {
      // Local fallback simulation
      setSensorData(prev => ({
        ...prev,
        weightGrams: Math.max(0, prev.weightGrams + Math.round((Math.random() - 0.5) * 4)),
        weightKg: +(prev.weightGrams / 1000).toFixed(3)
      }));
    }
  };

  // Poll sensor periodically
  useEffect(() => {
    fetchSettings();
    fetchRecords();
    fetchAnalytics();

    const interval = setInterval(() => {
      fetchSensor();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Notification helper
  const addNotification = (title, message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [{ id, title, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Tare action
  const tareSensor = async () => {
    try {
      const res = await fetch('/api/sensor/tare', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSensorData(data.reading);
        addNotification('Scale Tared', 'Weight calibrated to 0.000 kg', 'success');
      }
    } catch (err) {
      setSensorData(prev => ({ ...prev, weightGrams: 0, weightKg: 0 }));
      addNotification('Scale Tared', 'Calibrated to 0 kg (offline)', 'success');
    }
  };

  // Simulate new weight
  const simulateNewWeight = async (customKg = null) => {
    try {
      const payload = customKg !== null ? { weightKg: customKg } : {};
      const res = await fetch('/api/sensor/simulate-weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setSensorData(data.reading);
        addNotification('Weight Updated', `New plate placed: ${data.reading.weightKg} kg`, 'info');
      }
    } catch (err) {
      const mockWeight = customKg || +(0.5 + Math.random() * 2.5).toFixed(3);
      setSensorData(prev => ({
        ...prev,
        weightKg: mockWeight,
        weightGrams: Math.round(mockWeight * 1000)
      }));
    }
  };

  // Add new waste record
  const saveWasteRecord = async (recordData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/waste-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      const data = await res.json();
      if (data.success) {
        addNotification('Record Logged', `Logged ${recordData.category} (${recordData.weight} kg) - ${settings.currency}${recordData.estimatedCost}`, 'success');
        await fetchRecords();
        await fetchAnalytics();
        return { success: true, record: data.record };
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      addNotification('Error', err.message || 'Failed to save waste record', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        addNotification('Settings Saved', 'Category costs and IoT preferences updated', 'success');
        await fetchAnalytics();
      }
    } catch (err) {
      setSettings(newSettings);
      addNotification('Settings Saved', 'Local settings applied', 'success');
    }
  };

  // Delete record
  const deleteRecord = async (id) => {
    try {
      const res = await fetch(`/api/waste-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addNotification('Record Deleted', `Waste record ${id} removed`, 'info');
        await fetchRecords();
        await fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      settings,
      updateSettings,
      sensorData,
      tareSensor,
      simulateNewWeight,
      wasteRecords,
      fetchRecords,
      analytics,
      fetchAnalytics,
      saveWasteRecord,
      deleteRecord,
      notifications,
      addNotification,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
