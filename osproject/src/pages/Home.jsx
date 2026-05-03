import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Activity, List, LayoutDashboard } from 'lucide-react';

export default function Home() {
  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent-blue)', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
          OS PROJECT HUB
        </h1>
        <p style={{ color: 'var(--text-darker)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          A comprehensive suite of operating system simulation and visualization tools.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <Link to="/visualizer" className="card" style={{ textDecoration: 'none', transition: 'transform 0.2s', cursor: 'pointer' }} 
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-header" style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Cpu size={24} color="var(--accent-blue)" />
              <span className="card-title" style={{ fontSize: '1.2rem' }}>CPU Scheduling</span>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--text-darker)', fontSize: '0.9rem' }}>
                Visualize and simulate various CPU scheduling algorithms like FCFS, SJF, and Round Robin in real-time.
              </p>
            </div>
          </Link>

          <div className="card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            <div className="card-header" style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Activity size={24} color="var(--accent-red)" />
              <span className="card-title" style={{ fontSize: '1.2rem' }}>Memory Management</span>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--text-darker)', fontSize: '0.9rem' }}>
                Coming soon: Visualizing Paging, Segmentation, and Page Replacement algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
