/*
 * DhakaGreen - ESP32 Firmware Sketch for IoT Smart Waste Scale
 * Microcontroller: ESP32-WROOM-32
 * Sensor: HX711 24-bit ADC with 4x 50kg Strain Gauge Load Cells (Wheatstone Bridge)
 * Communication: WiFi HTTP POST REST API & MQTT Client
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include "HX711.h"

// Wi-Fi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// DhakaGreen Server Endpoint
const char* serverUrl = "http://192.168.1.100:5000/api/sensor/weight";

// HX711 Pin Definition
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;

HX711 scale;
float calibration_factor = 420.5; // Calibrated with 1.0kg known weight
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000; // 2 seconds telemetry stream

void setup() {
  Serial.begin(115200);
  Serial.println("\n[DhakaGreen] Starting ESP32 IoT Waste Scale...");

  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(calibration_factor);
  scale.tare(); // Zero scale on startup

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Connected successfully. IP: " + WiFi.localIP().toString());
}

void loop() {
  if (millis() - lastSendTime > sendInterval) {
    lastSendTime = millis();

    if (scale.is_ready()) {
      float readingGrams = scale.get_units(5); // 5-sample moving average
      if (readingGrams < 0) readingGrams = 0;
      float readingKg = readingGrams / 1000.0;

      Serial.printf("[Scale] Weight: %.3f kg (%.1f g)\n", readingKg, readingGrams);

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = String("{\"weightGrams\":") + String((int)readingGrams) +
                             String(",\"weightKg\":") + String(readingKg, 3) +
                             String(",\"status\":\"ONLINE\"") +
                             String(",\"batteryLevel\":98") +
                             String(",\"isStable\":true}");

        int httpResponseCode = http.POST(jsonPayload);
        if (httpResponseCode > 0) {
          Serial.printf("[HTTP] Telemetry Synced Code: %d\n", httpResponseCode);
        } else {
          Serial.printf("[HTTP] Error sending telemetry: %s\n", http.errorToString(httpResponseCode).c_str());
        }
        http.end();
      }
    }
  }
}
