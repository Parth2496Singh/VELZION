import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hexagon, 
  Zap, 
  Server, 
  LayoutDashboard, 
  TerminalSquare, 
  DollarSign, 
  BookOpen 
} from 'lucide-react';

// Reusable navigation item with Framer Motion active state physics
const NavItem = ({ to, icon: Icon, label, exact, activeColor, currentPath }) => {
  const isActive = exact 
    ? currentPath === to 
    : currentPath === to || currentPath.startsWith(`${to}/`);

  return (
    <Link to={to} style={{ display: 'block', marginBottom: '0.25rem' }}>
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          color: isActive ? 'var(--text-pure)' : 'var(--text-muted)',
          transition: 'color var(--transition-fast)',
          cursor: 'pointer',
          zIndex: 1
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-pure)'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {/* Cinematic Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="active-sidebar-tab"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'var(--bg-glass-hover)',
              border: 'var(--border-focus)',
              borderRadius: 'var(--radius-sm)',
              zIndex: -1
            }}
          />
        )}
        
        <Icon size={18} style={{ 
          color: isActive ? activeColor : 'inherit',
          transition: 'color var(--transition-fast)'
        }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  
  // Context Engine Detection
  const isVelzard = location.pathname.includes('/velzard');
  const activeColor = isVelzard ? 'var(--vz-gold-core)' : 'var(--zg-purple-core)';

  // Define Contextual Links
  const zegionLinks = [
    { path: '/zegion', label: 'Zegion Intro', icon: Zap, exact: true },
    { path: '/zegion/dashboard', label: 'Preview Dashboard', icon: LayoutDashboard },
    { path: '/zegion/setup-guide', label: 'Setup Guide', icon: TerminalSquare },
    { path: '/zegion/finops', label: 'FinOps', icon: DollarSign },
  ];

  const velzardLinks = [
    { path: '/velzard', label: 'Velzard Intro', icon: Server, exact: true },
    { path: '/velzard/dashboard', label: 'Production Clusters', icon: LayoutDashboard },
    { path: '/velzard/finops', label: 'FinOps', icon: DollarSign },
    { path: '/velzard/setup-guide', label: 'Setup Guide', icon: TerminalSquare },
  ];

  const activeLinks = isVelzard ? velzardLinks : zegionLinks;

  return (
    <aside className="glass-panel" style={{ 
      width: '260px', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      borderTop: 'none', 
      borderLeft: 'none', 
      borderBottom: 'none', 
      borderRadius: 0, 
      padding: '1.5rem',
      zIndex: 50,
      flexShrink: 0
    }}>
      
      {/* Brand Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem',
        paddingLeft: '0.5rem'
      }}>
        <Hexagon size={28} style={{ color: 'var(--text-pure)' }} />
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          letterSpacing: '0.05em' 
        }}>
          VELZION
        </span>
      </div>

      {/* Engine Switcher */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: 'var(--text-muted)', 
          marginBottom: '0.75rem',
          paddingLeft: '0.5rem'
        }}>
          Core Engines
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NavLink to="/zegion" style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: isActive ? '1px solid var(--zg-purple-border)' : 'var(--border-subtle)',
            backgroundColor: isActive ? 'var(--zg-purple-glow)' : 'transparent',
            color: isActive ? 'var(--zg-purple-core)' : 'var(--text-muted)',
            transition: 'all var(--transition-fast)'
          })}>
            <Zap size={18} />
          </NavLink>
          
          <NavLink to="/velzard" style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: isActive ? '1px solid var(--vz-gold-border)' : 'var(--border-subtle)',
            backgroundColor: isActive ? 'var(--vz-gold-glow)' : 'transparent',
            color: isActive ? 'var(--vz-gold-core)' : 'var(--text-muted)',
            transition: 'all var(--transition-fast)'
          })}>
            <Server size={18} />
          </NavLink>
        </div>
      </div>

      {/* Contextual Navigation */}
      <nav style={{ flex: 1 }}>
        <h4 style={{ 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: 'var(--text-muted)', 
          marginBottom: '0.75rem',
          paddingLeft: '0.5rem'
        }}>
          {isVelzard ? 'Velzard Workspace' : 'Zegion Workspace'}
        </h4>
        {activeLinks.map((link) => (
          <NavItem 
            key={link.path}
            to={link.path}
            icon={link.icon}
            label={link.label}
            exact={link.exact}
            activeColor={activeColor}
            currentPath={location.pathname}
          />
        ))}
      </nav>

      {/* Global Bottom Links */}
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: '1.5rem', 
        borderTop: 'var(--border-subtle)' 
      }}>
        <Link to="/docs" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          color: 'var(--text-muted)',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <BookOpen size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Documentation</span>
        </Link>
      </div>

    </aside>
  );
}