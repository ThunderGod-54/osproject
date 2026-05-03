import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadyQueue({ queue }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Ready Queue</span>
        <div className="badge-items">{queue.length} items</div>
      </div>
      
      <div className="card-body">
        <div className="queue-list">
          <AnimatePresence>
            {queue.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}
              >
                Queue is empty
              </motion.div>
            )}
            
            {queue.map((p, i) => (
              <motion.div
                key={`${p.id}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
                className="queue-item"
              >
                <div className="queue-process">
                  <div className={`process-box ${p.id.toLowerCase()}`} style={{ color: p.color }}>
                    {p.id}
                  </div>
                  <div className="queue-stats">
                    Arrival: <span>{p.at} ms</span>
                  </div>
                </div>
                
                <div className="queue-rem">
                  REMAINING BT
                  <span>{p.remainingBt !== undefined ? p.remainingBt : p.bt} ms</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
