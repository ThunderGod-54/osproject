import { useNavigate } from 'react-router-dom';
import { ListOrdered, RotateCcw, Clock, ArrowRight, ChevronLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

const ALGOS = [
  {
    key: 'FCFS',
    label: 'Visualize FCFS',
    full: 'First Come First Serve',
    icon: ListOrdered,
    color: '#3b82f6',
    shadow: 'rgba(59,130,246,0.25)',
    desc: 'Processes are executed in the order they arrive. Simple, non-preemptive, and easy to understand.',
    tags: ['Non-preemptive', 'Arrival order', 'Simple'],
  },
  {
    key: 'RR',
    label: 'Visualize RR',
    full: 'Round Robin',
    icon: RotateCcw,
    color: '#8b5cf6',
    shadow: 'rgba(139,92,246,0.25)',
    desc: 'Each process gets a fixed time slice (quantum) in rotation. Fair and widely used in time-sharing systems.',
    tags: ['Preemptive', 'Time quantum', 'Fair'],
  },
  {
    key: 'SJF',
    label: 'Visualize SJF',
    full: 'Shortest Job First',
    icon: Clock,
    color: '#10b981',
    shadow: 'rgba(16,185,129,0.25)',
    desc: 'The process with the shortest burst time runs next. Minimizes average waiting time across all processes.',
    tags: ['Non-preemptive', 'Burst time', 'Optimal avg wait'],
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Back button */}
      <button className="home-back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={14} /> Back
      </button>

      {/* Header */}
      <div className="home-header">
        <div className="home-tag">CPU SCHEDULING</div>
        <h1 className="home-title">Choose an Algorithm</h1>
        <p className="home-subtitle">
          Select a scheduling algorithm to open the interactive visualizer.
        </p>
      </div>

      {/* Cards */}
      <div className="home-cards">
        {ALGOS.map(({ key, label, full, icon: Icon, color, shadow, desc, tags }) => (
          <div
            key={key}
            className="home-card"
            onClick={() => navigate(`/visualizer?algo=${key}`)}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${shadow}`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            {/* Icon box */}
            <div className="home-card__icon" style={{
              background: `rgba(${hexToRgb(color)}, 0.12)`,
              border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
              color,
            }}>
              <Icon size={22} />
            </div>

            {/* Text */}
            <div>
              <div className="home-card__key" style={{ color }}>{key}</div>
              <h3 className="home-card__title">{full}</h3>
              <p className="home-card__desc">{desc}</p>
            </div>

            {/* Tags */}
            <div className="home-card__tags">
              {tags.map(t => (
                <span key={t} className="home-card__tag">{t}</span>
              ))}
            </div>

            {/* CTA row */}
            <div className="home-card__cta">
              <span style={{ color }}>{label}</span>
              <ArrowRight size={16} color={color} />
            </div>
          </div>
        ))}
      </div>

      <ThemeToggle position="fixed" />
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
