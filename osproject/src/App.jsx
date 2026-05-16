import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import SchedulingVisualizer from './pages/SchedulingVisualizer';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/visualizer" element={<SchedulingVisualizer />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
