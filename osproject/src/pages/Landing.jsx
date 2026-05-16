import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  BarChart2,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  Target,
  Cpu,
  ArrowRight,
  ChevronRight,
  Clock,
  ListOrdered,
  RotateCcw,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Landing.css';

const TEAM = [
  { name: 'Rishabh Kinnal', role: 'Algorithm Design & Visualization', initials: 'RK', color: '#3b82f6' },
  { name: 'Rishab Chavdar', role: 'Simulation Engine & Logic', initials: 'RC', color: '#10b981' },
  { name: 'Samarth Madiwal', role: 'UI/UX & Frontend Architecture', initials: 'SM', color: '#f59e0b' },
];

const ALGORITHMS = [
  { name: 'FCFS', full: 'First Come First Serve', color: '#3b82f6', desc: 'Non-preemptive, processes run in arrival order.', icon: ListOrdered },
  { name: 'RR', full: 'Round Robin', color: '#8b5cf6', desc: 'Time-sliced fairness with configurable quantum.', icon: RotateCcw },
  { name: 'SJF', full: 'Shortest Job First', color: '#10b981', desc: 'Minimizes average waiting time by picking shortest burst.', icon: Clock },
];

// Animated Gantt preview blocks
const DEMO_BLOCKS = [
  { label: 'P1', color: '#3b82f6', width: 18 },
  { label: 'P2', color: '#10b981', width: 12 },
  { label: 'P3', color: '#f59e0b', width: 22 },
  { label: 'P1', color: '#3b82f6', width: 10 },
  { label: 'P4', color: '#8b5cf6', width: 16 },
  { label: 'P2', color: '#10b981', width: 14 },
  { label: 'P3', color: '#f59e0b', width: 8 },
];

function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeAlgo, setActiveAlgo] = useState(0);
  const [ganttProgress, setGanttProgress] = useState(0);

  const stat1 = useCountUp(3, 999, statsVisible);
  const stat2 = useCountUp(99, 1600, statsVisible);
  const stat3 = useCountUp(12, 1400, statsVisible);

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

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

  // Algo carousel auto-rotate
  useEffect(() => {
    const id = setInterval(() => setActiveAlgo(a => (a + 1) % ALGORITHMS.length), 2800);
    return () => clearInterval(id);
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
            <a href="#features" className="nav-link">Features</a>
            <a href="#algorithms" className="nav-link">Algorithms</a>
            <a href="#team" className="nav-link">Team</a>
            <ThemeToggle position="inline" />
            <button className="btn-launch" onClick={() => navigate('/home')}>
              Launch App <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse" />
            Operating Systems Project · 2025
          </div>

          <h1 className="hero-title">
            CPU Scheduling
            <br />
            <span className="hero-title-accent">Visualizer</span>
          </h1>

          <p className="hero-subtitle">
            Watch scheduling algorithms come alive — step through process queues,
            Gantt charts, and real-time statistics in an interactive simulation.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Start Visualizing <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
            </button>
            <a href="#algorithms" className="btn-ghost">
              Explore Algorithms <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
            </a>
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

      {/* ── STATS ── */}
      <section className="stats-section" ref={statsRef} id="features">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#3b82f6' }}>{stat1}</div>
            <div className="stat-label">Scheduling Algorithms</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#10b981' }}>{stat2}%</div>
            <div className="stat-label">Simulation Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#f59e0b' }}>{stat3}+</div>
            <div className="stat-label">Metrics Tracked</div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">FEATURES</div>
          <h2 className="section-title">Everything you need to understand scheduling</h2>
        </div>
        <div className="features-grid">
          {[
            { icon: <Zap size={22} />, color: '#f59e0b', title: 'Real-time Simulation', desc: 'Watch processes move through the ready queue and CPU tick by tick with adjustable speed.' },
            { icon: <BarChart2 size={22} />, color: '#3b82f6', title: 'Gantt Chart', desc: 'Visual timeline of process execution with color-coded blocks and precise time markers.' },
            { icon: <TrendingUp size={22} />, color: '#10b981', title: 'Statistics Table', desc: 'Arrival, burst, completion, turnaround, and waiting times computed automatically.' },
            { icon: <RefreshCw size={22} />, color: '#8b5cf6', title: 'Multiple Algorithms', desc: 'Switch between FCFS, SJF, SRTF, Round Robin, and Priority without losing your process set.' },
            { icon: <SlidersHorizontal size={22} />, color: '#ef4444', title: 'Custom Processes', desc: 'Add any number of processes with custom arrival times, burst times, and priorities.' },
            { icon: <Target size={22} />, color: '#06b6d4', title: 'Step-by-step Mode', desc: 'Pause, rewind, and step through each scheduling decision to understand the logic.' },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALGORITHMS ── */}
      <section className="algo-section" id="algorithms">
        <div className="section-header">
          <div className="section-tag">ALGORITHMS</div>
          <h2 className="section-title">Three scheduling strategies, one visualizer</h2>
        </div>
        <div className="algo-layout">
          <div className="algo-tabs">
            {ALGORITHMS.map((a, i) => (
              <button
                key={i}
                className={`algo-tab ${i === activeAlgo ? 'active' : ''}`}
                style={{ '--tab-color': a.color }}
                onClick={() => setActiveAlgo(i)}
              >
                <span className="algo-tab-icon" style={{ color: i === activeAlgo ? a.color : '#6b7280' }}>
                  <a.icon size={15} />
                </span>
                <span className="algo-tab-name">{a.name}</span>
                <span className="algo-tab-full">{a.full}</span>
              </button>
            ))}
          </div>
          <div className="algo-detail" style={{ '--detail-color': ALGORITHMS[activeAlgo].color }}>
            <div className="algo-detail-badge">{ALGORITHMS[activeAlgo].name}</div>
            <h3 className="algo-detail-title">{ALGORITHMS[activeAlgo].full}</h3>
            <p className="algo-detail-desc">{ALGORITHMS[activeAlgo].desc}</p>
            <div className="algo-demo-bar">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="algo-demo-block"
                  style={{
                    background: ALGORITHMS[activeAlgo].color,
                    width: `${[22, 14, 30, 18, 16][i]}%`,
                    opacity: 0.6 + i * 0.08,
                    animationDelay: `${i * 120}ms`,
                  }}
                >
                  P{i + 1}
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/home')}>
              Try {ALGORITHMS[activeAlgo].name} <ArrowRight size={15} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="team-section" id="team">
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

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2 className="cta-title">Ready to visualize scheduling?</h2>
        <p className="cta-sub">Load your processes, pick an algorithm, and watch the simulation run.</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/home')}>
          Open Visualizer <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} />
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <span className="footer-brand">OS Scheduler</span>
        <span className="footer-copy">© 2025 · Rishabh Kinnal · Rishab Chavdar · Samarth Madiwal</span>
      </footer>
    </div>
  );
}
