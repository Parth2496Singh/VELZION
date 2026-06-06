import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-void)',
      color: 'var(--text-pure)',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 
        Ambient Engine Glows 
        These create the frosted, bleeding-edge aesthetic in the background 
        without requiring expensive WebGL or 3D canvases.
      */}
      <div style={{
        position: 'fixed',
        top: '-15%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 60%)',
        filter: 'blur(120px)',
        zIndex: 0,
        opacity: 0.6,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'fixed',
        bottom: '-15%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 60%)',
        filter: 'blur(120px)',
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: 'none'
      }} />

      {/* 
        Cinematic Route Transitions
        AnimatePresence manages the unmounting phase of the previous route
        while motion.main handles the physics of the entry/exit.
      */}
      <main style={{ 
        position: 'relative', 
        zIndex: 1, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 1, 0.5, 1] /* Maps perfectly to our --transition-smooth curve */
            }}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}