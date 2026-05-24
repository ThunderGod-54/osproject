import React from 'react';
import { motion } from 'framer-motion';

export default function GanttChart({ events, currentTime }) {
  const totalTime = events.length > 0 ? events[events.length - 1].end : 1;

  const uniqueProcesses = Array.from(
    new Map(
      events
        .filter((event) => event.processId !== 'Idle' && event.color)
        .map((event) => [event.processId, { processId: event.processId, color: event.color }]),
    ).values(),
  );

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Execution Timeline (Gantt Chart)</span>
        <div className="chart-legend">
          {uniqueProcesses.map(({ processId, color }) => (
            <div key={processId} className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: color }}></div>
              {processId}
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
              const pidClass = event.processId === 'Idle' ? 'idle' : '';
              const backgroundColor = event.processId === 'Idle' ? undefined : event.color;

              return (
                <motion.div
                  key={`${event.processId}-${index}`}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: `${displayWidthPercent}%`, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`gantt-block ${pidClass}`}
                  style={event.processId === 'Idle' ? undefined : { backgroundColor }}
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
