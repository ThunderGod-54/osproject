import React from 'react';
import { motion } from 'framer-motion';

export default function GanttChart({ events, currentTime }) {
  const totalTime = events.length > 0 ? events[events.length - 1].end : 1;
  
  // Extract unique non-idle processes for legend
  const uniqueProcesses = Array.from(new Set(events.filter(e => e.processId !== 'Idle').map(e => e.processId)));
  
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Execution Timeline (Gantt Chart)</span>
        <div className="chart-legend">
          {uniqueProcesses.map(pid => (
            <div key={pid} className="legend-item">
              <div className={`legend-dot ${pid.toLowerCase()}`}></div>
              {pid}
            </div>
          ))}
        </div>
      </div>
      
      <div className="card-body">
        <div className="gantt-container">
          <div className="gantt-blocks">
            {events.map((event, index) => {
              const isVisible = currentTime > event.start;
              if (!isVisible) return null;
              
              const activeWidth = Math.min(event.end, currentTime) - event.start;
              const displayWidthPercent = (activeWidth / totalTime) * 100;
              const pidClass = event.processId === 'Idle' ? 'idle' : event.processId.toLowerCase();

              return (
                <motion.div
                  key={`${event.processId}-${index}`}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${displayWidthPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`gantt-block ${pidClass}`}
                >
                  {event.processId !== 'Idle' && activeWidth > 0 && event.processId}
                </motion.div>
              );
            })}
          </div>
          
          <div className="gantt-markers">
            <div className="gantt-marker" style={{ left: '0%' }}>0</div>
            {events.map((event, index) => {
              const isVisible = currentTime >= event.start;
              if (!isVisible) return null;
              
              const activeTime = Math.min(event.end, currentTime);
              const leftPercent = (activeTime / totalTime) * 100;
              
              if (activeTime === 0) return null;

              return (
                <div 
                  key={`marker-${index}`} 
                  className="gantt-marker" 
                  style={{ left: `${leftPercent}%` }}
                >
                  {activeTime}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
