import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Terminal, FileText, ArrowLeft } from 'lucide-react';

export default function DocsLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/docs', label: 'Introduction', icon: BookOpen },
    { path: '/docs/instance-guide', label: 'Instance Guide', icon: Terminal },
    { path: '/docs/user-guide', label: 'User Guide', icon: FileText },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: 'var(--bg-void)', 
      color: 'var(--text-pure)' 
    }}>
      
      {/* Integrated Documentation Sidebar */}
      <aside className="glass-panel" style={{ 
        width: '280px', 
        borderLeft: 'none', 
        borderTop: 'none', 
        borderBottom: 'none', 
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <Link to="/" className="flex-center" style={{ 
            color: 'var(--text-muted)', 
            gap: '0.5rem', 
            justifyContent: 'flex-start',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Back to Velzion</span>
          </Link>
        </div>

        <h3 style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em', 
          color: 'var(--text-muted)', 
          marginBottom: '1rem',
          paddingLeft: '0.5rem'
        }}>
          Documentation
        </h3>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || 
                            (path === '/docs' && location.pathname === '/docs/');
            
            return (
              <Link key={path} to={path} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--bg-glass-hover)' : 'transparent',
                color: isActive ? 'var(--text-pure)' : 'var(--text-muted)',
                border: isActive ? 'var(--border-subtle)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-pure)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
              }}
              >
                <Icon size={18} style={{ 
                  color: isActive ? 'var(--text-pure)' : 'var(--text-muted)' 
                }} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Reading Canvas */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        position: 'relative' 
      }}>
        
        {/* Subtle Reading Glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '20vh',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '4rem 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}