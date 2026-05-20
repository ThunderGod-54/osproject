import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SVG3D } from '3dsvg';
import { Cpu, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

const TEAM = [
  { name: 'Rishabh Kinnal', role: 'Algorithm Design & Visualization', initials: 'RK', color: '#3b82f6' },
  { name: 'Rishab Chavdar', role: 'Simulation Engine & Logic', initials: 'RC', color: '#10b981' },
  { name: 'Samarth Madiwal', role: 'UI/UX & Frontend Architecture', initials: 'SM', color: '#f59e0b' },
];

const DEMO_BLOCKS = [
  { label: 'P1', color: '#3b82f6', width: 18 },
  { label: 'P2', color: '#10b981', width: 12 },
  { label: 'P3', color: '#f59e0b', width: 22 },
  { label: 'P1', color: '#3b82f6', width: 10 },
  { label: 'P4', color: '#8b5cf6', width: 16 },
  { label: 'P2', color: '#10b981', width: 14 },
  { label: 'P3', color: '#f59e0b', width: 8 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const heroRef = useRef(null);
  const [ganttProgress, setGanttProgress] = useState(0);

  // Gantt animation loop
  useEffect(() => {
    let frame;
    let start = null;
    const duration = 3000;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = ((ts - start) % duration) / duration;
      setGanttProgress(p);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Parallax on hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const totalWidth = DEMO_BLOCKS.reduce((s, b) => s + b.width, 0);
  const revealWidth = ganttProgress * totalWidth;

  return (
    <div className="landing">
      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-grid-bg" />
        <div className="hero-glow" />

        <nav className="landing-nav">
          <span className="nav-brand">
            <span className="nav-brand-dot" />
            <Cpu size={16} strokeWidth={2.5} style={{ color: '#3b82f6' }} />
            OS Scheduler
          </span>
          <div className="nav-links-row">
            <ThemeToggle position="inline" />
            <button className="btn-launch" onClick={() => navigate('/home')}>
              Launch App <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse" />
            Operating Systems Project · 2026
          </div>

          <h1 className="hero-title">
            CPU Scheduling
            <br />
            {isDark
              ? <SVG3D
    text="Visualizer"
    font="Righteous"
    smoothness={0.6}
    animate="none"
    color='#FF0000'
    zoom={1.8}
    width="100%"
    height={200}
  />
              : <SVG3D
    text="Visualizer"
    font="Righteous"
    smoothness={0.6}
    animate="none"
    color='#FF0000'
    zoom={1.8}
    width="100%"
    height={200}
  />
            }
          </h1>

          <p className="hero-subtitle">
            Watch scheduling algorithms come alive — step through process queues,
            Gantt charts, and real-time statistics in an interactive simulation.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Start Visualizing <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
            </button>
          </div>

          {/* Mini Gantt preview */}
          <div className="hero-gantt-preview">
            <div className="gantt-preview-label">LIVE PREVIEW</div>
            <div className="gantt-preview-track">
              {(() => {
                let acc = 0;
                return DEMO_BLOCKS.map((b, i) => {
                  const start = acc;
                  acc += b.width;
                  const visible = Math.max(0, Math.min(b.width, revealWidth - start));
                  const pct = (b.width / totalWidth) * 100;
                  return (
                    <div
                      key={i}
                      className="gantt-preview-block"
                      style={{ width: `${pct}%`, background: b.color }}
                    >
                      <div
                        className="gantt-preview-fill"
                        style={{ width: `${(visible / b.width) * 100}%`, background: b.color }}
                      />
                      <span className="gantt-preview-text">{b.label}</span>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="gantt-preview-ticks">
              {[0, 20, 40, 60, 80, 100].map(t => (
                <span key={t} style={{ left: `${t}%` }}>{Math.round(t * totalWidth / 100)}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="team-section" id="team" style={{ borderTop: '1px solid var(--border-color)', paddingBottom: '6rem' }}>
        <div className="section-header">
          <div className="section-tag">THE TEAM</div>
          <h2 className="section-title">Built by three, for everyone</h2>
        </div>
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <div className="team-card" key={i} style={{ '--member-color': m.color, animationDelay: `${i * 120}ms` }}>
              <div className="team-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <h3 className="team-name">{m.name}</h3>
              <p className="team-role">{m.role}</p>
              <div className="team-card-glow" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}