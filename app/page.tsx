'use client';

import React, { useState, useCallback } from 'react';
import { CSVUpload } from '../components/CSVUpload';
import { StreamLogs, LogEntry } from '../components/StreamLogs';

interface CSVData {
  [key: string]: string;
}

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [csvData, setCsvData] = useState<CSVData[]>([]);

  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      message,
      type,
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleDataUploaded = useCallback((data: CSVData[]) => {
    setCsvData(data);
    addLog(`Data loaded: ${data.length} rows with ${Object.keys(data[0] || {}).length} columns`, 'success');
  }, [addLog]);

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
              <h1 className="text-xl font-bold text-gray-900">Data Pipeline Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {logs.length} logs • {csvData.length} rows loaded
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Column - CSV Upload */}
          <div className="space-y-6">
            <CSVUpload 
              onDataUploaded={handleDataUploaded}
              onLog={addLog}
            />
            
          </div>

          {/* Right Column - Stream Logs */}
          <div className="h-full">
            <StreamLogs 
              logs={logs}
              onClearLogs={clearLogs}
            />
          </div>
        </div>

      
      </main>

    </div>
  );
}
