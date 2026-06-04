import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import FinOpsCalculator from './pages/FinOpsCalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route sends users to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Main App Routes */}
        {/* The Blank Slate Workspace Selector */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        
        {/* The Scoped Project Workspace */}
        <Route path="/dashboard/:owner/:repo" element={<Dashboard />} />
        
        <Route path="/finopscalculator" element={<FinOpsCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;