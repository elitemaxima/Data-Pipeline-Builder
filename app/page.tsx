"use client";

import React, { useState, useCallback } from "react";
import { CSVUpload } from "../components/CSVUpload";
import { StreamLogs, LogEntry } from "../components/StreamLogs";
import PipelineManager from "../components/PipelineManager";
import KafkaLogs from "../components/KafkaLogs";

interface CSVData {
  [key: string]: string;
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [activeTab, setActiveTab] = useState<"csv" | "pipeline" | "kafka">(
    "pipeline"
  );

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      message,
      type,
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleDataUploaded = useCallback(
    (data: CSVData[]) => {
      setCsvData(data);
      addLog(
        `Data loaded: ${data.length} rows with ${
          Object.keys(data[0] || {}).length
        } columns`,
        "success"
      );
    },
    [addLog]
  );

  const tabs = [
    { id: "pipeline", name: "Pipeline Management", icon: "⚙️" },
    { id: "csv", name: "CSV Upload", icon: "📊" },
    { id: "kafka", name: "Kafka Logs", icon: "🔗" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAxUlEQVR4AWLwySwEtF/GNhCDQBCswUW4C7qgDndCK18CRVDIpaT8BvvSBs5sluBBmnjmjOQTS/m/gB2Ac4ICAoRbnkAFHQzQ3ZN/fnISLvkBLhHbAxJoKwN0eiWcd+8P4N0XENMCOGG6Iav89QBOlyipoCkqnhWQKRoPiCefvYJhD5CfSvcHyPQrA7LIvQGySseqgAvE9ACcQzhBoryBMSVAZBlcpBDd428SKueEFHmI24XhDtC7ddMB5YsDwg3lbb+MdsAXgpwpRTasO3oAAAAASUVORK5CYII="
                  alt="Logo"
                  className="w-5 h-5"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Data Pipeline Builder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {logs.length} logs • {csvData.length} rows loaded
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            <PipelineManager />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pipeline Status
                </h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm">
                    Monitor your pipeline execution status and manage pipeline
                    runs.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500 text-sm">
                    Create sample pipelines and execute them to see real-time
                    processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "csv" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)]">
            {/* Left Column - CSV Upload */}
            <div className="space-y-6">
              <CSVUpload onDataUploaded={handleDataUploaded} onLog={addLog} />
            </div>

            {/* Right Column - Stream Logs */}
            <div className="h-full">
              <StreamLogs logs={logs} onClearLogs={clearLogs} />
            </div>
          </div>
        )}

        {activeTab === "kafka" && (
          <div className="space-y-8">
            <KafkaLogs />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kafka Integration
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                This component connects to your backend's WebSocket endpoint to
                stream real-time logs from Kafka. Make sure your backend is
                running and Kafka is properly configured.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Backend Requirements:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• FastAPI backend running on port 8000</li>
                  <li>• WebSocket endpoint at /ws/logs</li>
                  <li>• Kafka events being published</li>
                  <li>• CORS enabled for localhost:3000</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
