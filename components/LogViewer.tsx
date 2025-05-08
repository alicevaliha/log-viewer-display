import React, { useState, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warning' | 'debug';
  message: string;
  metadata?: Record<string, any>;
  action?: string;
}

interface LogViewerProps {
  logs: LogEntry[];
  autoScroll?: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ logs, autoScroll = true }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  React.useEffect(() => {
    if (autoScroll && logContainerRef.current && !isInteracting) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll, isInteracting]);

// Detect user interaction with scrollbar (hover or drag) for auto scroll
//   const handleMouseEnter = () => setIsInteracting(true);
//   const handleMouseLeave = () => setIsInteracting(false);
//   const handleMouseUp = () => setIsInteracting(false);
//   const handleMouseDown = () => setIsInteracting(true);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-400 font-bold';
      case 'debug':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '').replace(/(\d{2}):(\d{2}):\d{2}/, '$1:$2');
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden relative w-full" style={{ maxHeight: "100%" }}>
      <div className="p-4 bg-gray-900 border-b border-gray-800 rounded-t-lg">
        <h2 className="text-white text-xs font-mono">Logs</h2>
      </div>
      <div className="px-2 pt-3 pb-8">
        <div
          ref={logContainerRef}
          className="max-h-[80px] overflow-y-auto font-mono text-xs custom-scrollbar-dark"
        >
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800/50 px-3 py-2 rounded transition-all"
              >
                <span className="text-gray-500 mr-1">❯</span>
                <span className="flex-grow break-words whitespace-pre-line">
                  {log.message}
                </span>
                <span className={`${getLevelColor(log.level)} flex-shrink-0 min-w-[60px] text-center`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-gray-400 flex-shrink-0 min-w-[80px] text-right">
                  {formatDate(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 