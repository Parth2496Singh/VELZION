import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import Sidebar from '../ui/Sidebar';
import TopNavbar from '../ui/TopNavbar';
import { useTelemetry } from '../../context/TelemetryContext';

export default function AppLayout() {
  const location = useLocation();
  const { mousePos, handleMouseMove } = useTelemetry();

  // Dynamically determine the engine theme context based on the active route
  const isVelzard = location.pathname.includes('/velzard');
  const activeGlow = isVelzard ? 'var(--vz-gold-glow)' : 'var(--zg-purple-glow)';

  // AuthGuard Routing
  const isAuthenticated = localStorage.getItem('velzion_user');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: 'var(--bg-void)', 
        color: 'var(--text-pure)', 
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Global Hardware-Accelerated Telemetry Pointer */}
      <motion.div
        animate={{ 
          x: mousePos.x - 200, 
          y: mousePos.y - 200,
          scale: isVelzard ? [0.95, 1.05, 0.95] : 1
        }}
        transition={{ 
          type: "spring", stiffness: 100, damping: 25, mass: 0.5,
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '400px', height: '400px',
          background: `radial-gradient(circle, ${activeGlow} 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          willChange: 'transform'
        }}
      />

      {/* Persistent Application Sidebar */}
      <Sidebar />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1
      }}>
        
        {/* Dynamic Engine Top Illumination */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '70vw', 
          height: '20vh', 
          background: `radial-gradient(ellipse, ${activeGlow} 0%, transparent 70%)`, 
          opacity: 0.4, 
          filter: 'blur(80px)', 
          pointerEvents: 'none', 
          zIndex: 0,
          transition: 'background var(--transition-smooth)'
        }} />

        {/* Persistent Top Navigation */}
        <TopNavbar />
        
        {/* Workspace Canvas Area */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          position: 'relative', 
          zIndex: 1, 
          padding: '2rem' 
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={{ 
                height: '100%', 
                width: '100%', 
                maxWidth: '1600px', 
                margin: '0 auto',
                willChange: 'transform, opacity'
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}