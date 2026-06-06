import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import Sidebar from '../ui/Sidebar';
import TopNavbar from '../ui/TopNavbar';

export default function AppLayout() {
  const location = useLocation();

  // Dynamically determine the engine theme context based on the active route
  const isVelzard = location.pathname.includes('/velzard');
  const activeGlow = isVelzard ? 'var(--vz-gold-glow)' : 'var(--zg-purple-glow)';

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: 'var(--bg-void)', 
      color: 'var(--text-pure)', 
      overflow: 'hidden' 
    }}>
      
      {/* Persistent Application Sidebar 
        (Needs to be built next to prevent Vite import errors)
      */}
      <Sidebar />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        overflow: 'hidden'
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
          opacity: 0.15, 
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
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ 
                duration: 0.3, 
                ease: [0.25, 1, 0.5, 1] 
              }}
              style={{ 
                height: '100%', 
                width: '100%', 
                maxWidth: '1600px', 
                margin: '0 auto' 
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