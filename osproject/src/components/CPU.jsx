import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CPU({ currentProcess }) {
  const isExecuting = currentProcess && currentProcess.id !== 'Idle';
  const processColor = isExecuting ? currentProcess.color : 'var(--border-light)';
  
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">CPU Core 0</span>
        <div className="badge-live">
          <div className="badge-dot"></div>
          LIVE
        </div>
      </div>
      
      <div className="card-body" style={{ padding: 0 }}>
        <div className="cpu-container">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentProcess ? currentProcess.id : 'empty'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="cpu-ring-outer"
              style={{ 
                borderColor: processColor,
                boxShadow: isExecuting ? `0 0 20px ${processColor}33` : 'none'
              }}
            >
              <div className="cpu-ring-inner" style={{ borderColor: isExecuting ? `${processColor}80` : 'var(--border-color)' }}>
                {isExecuting ? (
                  <>
                    <span className="cpu-exec-label">EXECUTING</span>
                    <span className="cpu-process-id" style={{ color: processColor }}>
                      {currentProcess.id}
                    </span>
                  </>
                ) : (
                  <span className="cpu-exec-label" style={{ color: 'var(--text-muted)' }}>IDLE</span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="cpu-load">
            Load: <span>{isExecuting ? '84.2%' : '0.0%'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
