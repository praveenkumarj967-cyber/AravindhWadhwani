# DhakaGreen – AI-Powered Food-Waste Tracking System

> **Tagline:** Measure Waste. Understand Impact. Build a Greener Kitchen.

DhakaGreen is a modern full-stack web application and IoT monitoring platform engineered for commercial kitchens, college cafeterias, hospital catering, and food-service establishments to monitor, classify, weigh, and minimize food waste.

---

## 🌟 Key Features

1. **AI-Based Food Waste Classification:**
   - Computer vision inference module supporting Rice, Vegetables, Fruits, Bread, Meat, and Other food waste.
   - Live camera capture and image upload support.
   - Shows predicted category, confidence percentage, latency, and architecture info (`MobileNetV3`).
   - Quick one-click test presets for innovation project demonstration.

2. **IoT Automatic Weight Measurement (ESP32 + HX711 Load Cell):**
   - High-precision digital scale display with live gram/kilogram conversion.
   - Tare / Zero calibration button.
   - Real-time simulation of plate and tray placements with micro-jitter drift.
   - ESP32 firmware sketch (`iot_esp32/esp32_hx711_scale.ino`) ready for live hardware deployment over Wi-Fi.

3. **Automatic Waste Logging & Cost Calculation:**
   - Evaluates financial loss formula: `Estimated Cost = Weight (kg) × Cost per kg`.
   - Category-specific configurable rates (e.g., Rice ₹45/kg, Meat ₹180/kg, Veg ₹35/kg).
   - Generates persistent audit logs stored in JSON / database with date, time, and detection method.

4. **Interactive Analytics Dashboard:**
   - KPIs: Total Food Waste (kg), Total Financial Loss (₹), Total Events, Most Wasted Category, Daily Average.
   - Interactive charts built with **Recharts**:
     - 7-day daily waste weight trend (Area Chart).
     - Category-wise waste volume distribution (Donut Pie Chart).
     - Category waste vs cost comparison (Dual-axis Bar Chart).
     - Percentage financial loss share.
   - Environmental Impact: GHG Carbon Footprint (kg CO₂e) and embedded water footprint (Liters).

5. **AI Kitchen Insights & Reduction Recommendations:**
   - Automatically generates targeted managerial actions based on stored logs.
   - Highlights top-wasted food streams, percentage shifts, and batching advice.

6. **Kitchen Settings & Hardware Management:**
   - Real-time modification of category cost multipliers.
   - Facility profiles and waste reduction targets.
   - Hardware sensor IP and mode toggle (Simulated vs Live ESP32).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend:** Node.js, Express.js, Multer, REST API
- **AI / Computer Vision:** Python connector, OpenCV / PyTorch MobileNetV3 architecture
- **Embedded / IoT:** ESP32 Microcontroller, HX711 24-bit ADC, Load Cells

---

## 🚀 Getting Started

### 1. Start Backend Server
```bash
npm run server
# Runs Express API on http://localhost:5000
```

### 2. Start Vite Frontend
```bash
npm run dev
# Runs Vite client on http://localhost:5173
```

### 3. Run Both Concurrently
```bash
npm start
```
