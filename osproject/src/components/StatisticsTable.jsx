import React from 'react';
import { Download } from 'lucide-react';

export default function StatisticsTable({ stats }) {
  const avgWt = stats.length > 0 ? (stats.reduce((acc, curr) => acc + curr.wt, 0) / stats.length).toFixed(2) : '0.00';
  const avgTat = stats.length > 0 ? (stats.reduce((acc, curr) => acc + curr.tat, 0) / stats.length).toFixed(2) : '0.00';

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Process Statistics</span>
        <button className="btn-export">
          <Download size={14} /> EXPORT CSV
        </button>
      </div>
      
      <div className="card-body" style={{ padding: '0' }}>
        <div className="table-responsive">
          <table className="stats-table">
            <thead>
              <tr>
                <th>PROCESS ID</th>
                <th>ARRIVAL TIME (AT)</th>
                <th>BURST TIME (BT)</th>
                <th>COMPLETION TIME (CT)</th>
                <th>TURNAROUND TIME (TAT)</th>
                <th>WAITING TIME (WT)</th>
              </tr>
            </thead>
            <tbody>
              {stats.length > 0 ? stats.map((stat) => (
                <tr key={stat.id} className={`row-${stat.id.toLowerCase()}`}>
                  <td>
                    <div className="process-dot" style={{ backgroundColor: stat.color }}></div>
                    {stat.id}
                  </td>
                  <td>{stat.at}</td>
                  <td>{stat.bt}</td>
                  <td>{stat.ct}</td>
                  <td>{stat.tat}</td>
                  <td>{stat.wt}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Waiting for simulation data...
                  </td>
                </tr>
              )}
              
              <tr className="row-averages">
                <td>AVERAGES</td>
                <td style={{ color: 'var(--text-darker)' }}>-</td>
                <td style={{ color: 'var(--text-darker)' }}>-</td>
                <td style={{ color: 'var(--text-darker)' }}>-</td>
                <td>{avgTat}</td>
                <td>{avgWt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
