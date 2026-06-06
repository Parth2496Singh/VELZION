import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Server, Shield, Terminal, Hexagon } from 'lucide-react';

// Framer Motion Variants for Staggered Animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '2rem'
    }}>
      
      {/* Minimal Public Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '1rem 0',
          zIndex: 10
        }}
      >
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <Hexagon size={28} style={{ color: 'var(--text-pure)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            VELZION
          </span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/docs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            Documentation
          </Link>
          <Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            About
          </Link>
          <Link to="/login" className="glass-panel flex-center" style={{ 
            padding: '0.5rem 1.25rem', 
            borderRadius: 'var(--radius-pill)',
            gap: '0.5rem',
            color: 'var(--text-pure)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            Access Console <ArrowRight size={16} />
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          zIndex: 10,
          paddingTop: '4rem'
        }}
      >
        <motion.div variants={itemVariants} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-pill)',
          border: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-glass)',
          marginBottom: '2rem'
        }}>
          <span style={{ display: 'flex', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: 'var(--vz-gold-core)', boxShadow: '0 0 10px var(--vz-gold-core)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Velzion Platform v2.0 is Live
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem'
        }}>
          Uncompromising Cloud.<br />
          <span style={{ color: 'var(--text-muted)' }}>Engineered for </span>
          <span className="text-gradient-velzard">Scale.</span>
        </motion.h1>

        <motion.p variants={itemVariants} style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginBottom: '3.5rem'
        }}>
          Velzion delivers ephemeral preview environments and high-availability production clusters on a single, unified Obsidian Canvas.
        </motion.p>

        {/* Engine Feature Cards */}
        <motion.div variants={containerVariants} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          
          {/* Zegion Engine Card */}
          <motion.div variants={itemVariants} className="glass-panel" style={{
            padding: '2rem',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default'
          }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(157, 78, 221, 0.1)', border: '1px solid var(--zg-purple-border)', color: 'var(--zg-purple-core)', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }} className="text-gradient-zegion">Zegion Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Deploy ephemeral, isolated preview environments in milliseconds. Perfect for PR reviews and staging branches.
              </p>
            </div>
          </motion.div>

          {/* Velzard Engine Card */}
          <motion.div variants={itemVariants} className="glass-panel" style={{
            padding: '2rem',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default'
          }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 203, 92, 0.1)', border: '1px solid var(--vz-gold-border)', color: 'var(--vz-gold-core)', marginBottom: '1.5rem' }}>
                <Server size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }} className="text-gradient-velzard">Velzard Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                High-availability production clusters designed for zero-downtime, infinite scaling, and absolute reliability.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </motion.main>
    </div>
  );
}