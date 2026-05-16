import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { runSchedulingAlgorithm } from "../lib/algorithms";
import InputPanel from "../components/InputPanel";
import ReadyQueue from "../components/ReadyQueue";
import CPU from "../components/CPU";
import GanttChart from "../components/GanttChart";
import StatisticsTable from "../components/StatisticsTable";
import {
  Play,
  Square,
  Pause,
  Search,
  Settings,
  Wifi,
  Bell,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

function SchedulingVisualizer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialAlgo = ['FCFS', 'RR', 'SJF'].includes(searchParams.get('algo'))
    ? searchParams.get('algo')
    : 'RR';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [processes, setProcesses] = useState([
    { id: "P1", at: 0, bt: 7, color: "#3b82f6" },
    { id: "P2", at: 1, bt: 7, color: "#10b981" },
    { id: "P3", at: 2, bt: 3, color: "#f59e0b" },
  ]);
  const [algorithm, setAlgorithm] = useState(initialAlgo);
  const [timeQuantum, setTimeQuantum] = useState(4);

  // Simulation State
  const [simulationState, setSimulationState] = useState("idle"); // idle, running, paused, finished
  const [currentTime, setCurrentTime] = useState(0);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [readyQueue, setReadyQueue] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(null);

  useEffect(() => {
    const result = runSchedulingAlgorithm(processes, algorithm, timeQuantum);
    setEvents(result.events);
    setStats(result.stats);
    if (simulationState === "idle") {
      setSimulationState("running");
      setCurrentTime(0);
    }
  }, [processes, algorithm, timeQuantum]);

  // Timer for simulation
  useEffect(() => {
    let timer;
    if (simulationState === "running") {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1;
          const maxTime = events.length > 0 ? events[events.length - 1].end : 0;
          if (nextTime >= maxTime) {
            setSimulationState("finished");
            return maxTime;
          }
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [simulationState, events]);

  // Update CPU and Ready Queue based on currentTime
  useEffect(() => {
    if (events.length === 0) return;

    const currEvent = events.find(
      (e) => e.start <= currentTime && currentTime < e.end,
    );

    if (currEvent) {
      if (currEvent.processId === "Idle") {
        setCurrentProcess({ id: "Idle" });
      } else {
        const p = processes.find((p) => p.id === currEvent.processId);
        setCurrentProcess(p);
      }
    } else if (currentTime >= events[events.length - 1].end) {
      setCurrentProcess(null);
    } else {
      setCurrentProcess({ id: "Idle" });
    }

    const remainingTimes = {};
    processes.forEach((p) => (remainingTimes[p.id] = p.bt));

    events.forEach((e) => {
      if (e.processId === "Idle") return;
      let execTime = 0;
      if (e.end <= currentTime) {
        execTime = e.end - e.start;
      } else if (e.start < currentTime) {
        execTime = currentTime - e.start;
      }
      if (execTime > 0) {
        remainingTimes[e.processId] -= execTime;
      }
    });

    const rq = processes.filter(
      (p) =>
        p.at <= currentTime &&
        remainingTimes[p.id] > 0 &&
        (!currEvent || currEvent.processId !== p.id),
    );

    if (algorithm === "SJF") {
      rq.sort((a, b) => a.bt - b.bt);
    } else {
      rq.sort((a, b) => a.at - b.at);
    }

    setReadyQueue(rq.map((p) => ({ ...p, remainingBt: remainingTimes[p.id] })));
  }, [currentTime, events, processes, algorithm]);

  const visibleStats = stats.filter((s) => s.ct <= currentTime);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarCollapsed ? ' sidebar--collapsed' : ''}`}>

        {/* Sidebar header: back button + collapse toggle */}
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <button
              className="sidebar-back-btn"
              onClick={() => navigate('/home')}
              title="Back to Home"
            >
              <ArrowLeft size={15} />
              Back to Home
            </button>
          )}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(c => !c)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Sidebar content — hidden when collapsed */}
        {!sidebarCollapsed && (
          <div
            style={{
              padding: "1.5rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              flex: 1,
            }}
          >
            <InputPanel
              processes={processes}
              setProcesses={setProcesses}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              timeQuantum={timeQuantum}
              setTimeQuantum={setTimeQuantum}
            />

            <div className="card">
              <div className="card-header">
                <span className="card-title">Simulation Controls</span>
              </div>
              <div
                className="card-body"
                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
              >
                {simulationState === "running" ? (
                  <button
                    className="btn-add"
                    onClick={() => setSimulationState("paused")}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    <Pause size={16} /> PAUSE
                  </button>
                ) : (
                  <button
                    className="btn-add"
                    onClick={() => setSimulationState("running")}
                    disabled={simulationState === "finished"}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      borderColor: "var(--accent-blue)",
                      color: "var(--accent-blue)",
                    }}
                  >
                    <Play size={16} /> PLAY
                  </button>
                )}
                <button
                  className="btn-add"
                  onClick={() => {
                    setSimulationState("idle");
                    setCurrentTime(0);
                  }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    borderColor: "var(--accent-red)",
                    color: "var(--accent-red)",
                  }}
                >
                  <Square size={16} /> RESET
                </button>
              </div>
            </div>
          </div>
        )}

        {/* When collapsed: show icon-only back button */}
        {sidebarCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem', gap: '0.75rem' }}>
            <button
              className="sidebar-icon-btn"
              onClick={() => navigate('/home')}
              title="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="brand-title">CPU SCHEDULING VISUALIZER_V2.0</div>

          <div className="viz-search-bar">
            <Search size={16} className="viz-search-icon" />
            <input
              type="text"
              placeholder="Search parameters..."
              className="viz-search-input"
            />
          </div>

          <div className="top-icons">
            <ThemeToggle position="inline" />
            <button className="icon-btn">
              <Settings size={18} />
            </button>
            <button className="icon-btn">
              <Wifi size={18} />
            </button>
            <button className="icon-btn">
              <Bell size={18} />
            </button>
            <div className="avatar"></div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          <div className="page-header">
            <div className="page-title"></div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              {simulationState === "running"
                ? "SIMULATING (LIVE)"
                : simulationState === "paused"
                  ? "SIMULATION PAUSED"
                  : simulationState === "finished"
                    ? "SIMULATION COMPLETE"
                    : "WEBSOCKET CONNECTED"}
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Top Row */}
            <div className="top-row">
              <CPU currentProcess={currentProcess} />
              <ReadyQueue queue={readyQueue} />
            </div>

            {/* Middle Row */}
            <GanttChart events={events} currentTime={currentTime} />

            {/* Bottom Row */}
            <StatisticsTable stats={visibleStats} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SchedulingVisualizer;
