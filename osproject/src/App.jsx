import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SchedulingVisualizer from './pages/SchedulingVisualizer';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/visualizer" element={<SchedulingVisualizer />} />
    </Routes>
  );
}

export default App;
