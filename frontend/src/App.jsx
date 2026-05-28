import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import FinOpsCalculator from './FinOpsCalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Default Home Page */}
        <Route path="/" element={<Dashboard />} />
        
        {/* The Calculator Page */}
        <Route path="/finopscalculator" element={<FinOpsCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;