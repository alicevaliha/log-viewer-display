'use client';

import { useState, useEffect, useRef } from 'react';
import LogViewer from '../components/LogViewer';

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleToggleLog = () => {
    if (showLog) {
      setIsClosing(true);
      setTimeout(() => {
        setShowLog(false);
        setIsClosing(false);
      }, 800);
    } else {
      setShowLog(true);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Test log</h1>
        <p className="text-gray-500 text-sm mb-8">
          This is a test log to see how the log viewer display works.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Click on the buttons below to see the logs. and click on the button V to see the log viewer.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          <span className="font-bold">NB : </span>
          The log viewer is inspired by the Vercel included log viewer below. ^^ 
        </p>
        <div className="flex gap-3 mb-8">
          {[
            { label: 'Play', message: 'the candidate clicked on play', level: 'info', color: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' },
            { label: 'Stop', message: 'the candidate stopped', level: 'info', color: 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300' },
            { label: 'Pause', message: 'the candidate marked a pause', level: 'info', color: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' },
            { label: 'Action finished', message: 'the candidate finished the action', level: 'info', color: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' },
            { label: 'Error', message: 'an error occured on the page', level: 'error', color: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200' },
            { label: 'Render', message: 'this element finished rendering', level: 'debug', color: 'bg-blue-100 text-white border-blue-300 hover:bg-blue-200' },
          ].map((btn, i) => (
            <button
              key={i}
              className={`flex items-center gap-1 px-4 py-2 rounded-md border transition-all text-sm font-semibold shadow-sm ${btn.color}`}
              type="button"
              onClick={() => {
                setLogs(prev => ([
                  ...prev,
                  {
                    timestamp: new Date().toISOString(),
                    level: btn.level,
                    message: btn.message,
                    action: btn.label.toLowerCase(),
                  }
                ]).slice(-100));
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      {/* Conteneur relatif pour bouton et logger */}
      <div className="fixed left-6 bottom-24 z-50" style={{ minWidth: '48px' }}>
        <button
          onClick={handleToggleLog}
          className="w-12 h-12 rounded-full bg-black border border-gray-700 shadow-lg flex items-center justify-center text-white text-2xl font-bold transition-all duration-200 hover:bg-gray-900 hover:scale-110 hover:shadow-2xl"
          aria-label="Afficher les logs"
        >
          V
        </button>
        {/* Popover LogViewer positionné par rapport au bouton */}
        {(showLog || isClosing) && (
          <div
            ref={popoverRef}
            className={`absolute left-0 bottom-[60px] ${isClosing ? 'animate-fade-out-down' : 'animate-fade-in-up'}`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-[90vw] max-w-[420px] h-[250px] flex flex-col">
              <div className="flex justify-between items-center px-3 py-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-xs">Logs</span>
                <button
                  onClick={handleToggleLog}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-lg font-bold px-1"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-0 overflow-auto">
                <LogViewer logs={logs} />
              </div>
              {/* Mini-carte log en bas */}
              {logs.length > 0 && (
                <div className="flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-md mx-2 my-2 px-2 py-1 min-h-[36px] border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Event recorder</span>
                  <div className="flex items-center gap-2">
                    {/* Badge coloré selon le type */}
                    {(() => {
                      const last = logs[logs.length - 1];
                      let pillColor = 'bg-green-100 text-green-800 border-green-300';
                      if (last.action === 'play') pillColor = 'bg-green-100 text-green-800 border-green-300';
                      else if (last.action === 'stop') pillColor = 'bg-gray-100 text-gray-800 border-gray-300';
                      else if (last.action === 'pause') pillColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
                      else if (last.action === 'action finished') pillColor = 'bg-blue-100 text-blue-800 border-blue-300';
                      else if (last.action === 'error') pillColor = 'bg-red-100 text-red-700 border-red-300';
                      else if (last.action === 'render') pillColor = 'bg-blue-100 text-white border-blue-300';
                      return (
                        <span
                          className={`font-semibold text-[9px] px-1 py-0.5 rounded-full border ${pillColor}`}
                          style={{ minWidth: 48, textAlign: 'center' }}
                        >
                          {last.level.charAt(0).toUpperCase() + last.level.slice(1)}
                        </span>
                      );
                    })()}
                    <span className="truncate text-[10px] text-gray-800 dark:text-gray-100 font-mono flex-1">
                      {logs[logs.length - 1].message}
                    </span>
                    {/* Date formatée */}
                    <span className="text-[9px] text-gray-400 font-mono ml-2 flex-shrink-0">
                      {(() => {
                        const d = new Date(logs[logs.length - 1].timestamp);
                        return d.toLocaleString('en-US', {
                          weekday: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }).replace(',', '').replace(/(\d{2}):(\d{2}):\d{2}/, '$1:$2');
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
