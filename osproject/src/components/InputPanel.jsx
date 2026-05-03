import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6b7280'];

export default function InputPanel({ 
  processes, setProcesses, algorithm, setAlgorithm, 
  timeQuantum, setTimeQuantum
}) {
  const [newAt, setNewAt] = useState('0');
  const [newBt, setNewBt] = useState('0');

  const handleAddProcess = () => {
    const at = parseInt(newAt);
    const bt = parseInt(newBt);
    if (isNaN(at) || isNaN(bt) || bt <= 0) return;

    const newId = `P${processes.length + 1}`;
    const newColor = COLORS[processes.length % COLORS.length];
    setProcesses([
      ...processes, 
      { id: newId, at, bt, color: newColor }
    ]);
    setNewAt('0');
    setNewBt('0');
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Algorithm Settings</span>
      </div>
      
      <div className="card-body">
        <div className="form-group">
          <label className="form-label">Active Algorithm</label>
          <div className="custom-select-wrapper">
            <select 
              className="custom-select" 
              value={algorithm} 
              onChange={e => setAlgorithm(e.target.value)}
            >
              <option value="FCFS">First Come First Serve (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="RR">Round Robin (RR)</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {algorithm === 'RR' && (
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <div className="slider-container">
              <label className="form-label" style={{ margin: 0 }}>Time Quantum (q)</label>
              <span className="slider-val">{timeQuantum} ms</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={timeQuantum}
              onChange={e => setTimeQuantum(parseInt(e.target.value))}
            />
          </div>
        )}

        <div className="form-group" style={{ marginTop: algorithm === 'RR' ? '0' : '2.5rem' }}>
          <label className="form-label">Add Process</label>
          <div className="add-process-row">
            <div className="input-box">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-darker)', display: 'block', marginBottom: '0.2rem' }}>AT</span>
              <input 
                type="number" 
                value={newAt}
                onChange={e => setNewAt(e.target.value)}
              />
            </div>
            <div className="input-box">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-darker)', display: 'block', marginBottom: '0.2rem' }}>BT</span>
              <input 
                type="number" 
                value={newBt}
                onChange={e => setNewBt(e.target.value)}
              />
            </div>
            <button className="btn-add" onClick={handleAddProcess}>
              <Plus size={14} /> ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
