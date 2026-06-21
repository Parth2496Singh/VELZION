import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Server, Shield, Terminal, Hexagon, Moon, Sun, CheckCircle2 } from 'lucide-react';

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
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isLightMode]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '2rem'
    }}>
      
      {/* Navbar */}
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
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-pure)' }}>
            VELZION
          </span>
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="https://github.com/Parth2496Singh/VELZION" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <button onClick={() => setIsLightMode(!isLightMode)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <Link to="/docs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color var(--transition-fast)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            Documentation
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
          maxWidth: '1200px',
          margin: '0 auto',
          zIndex: 10,
          paddingTop: '4rem',
          paddingBottom: '4rem'
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
          fontSize: 'clamp(3rem, 6vw, 5.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          color: 'var(--text-pure)'
        }}>
          Uncompromising Cloud.<br />
          <span style={{ color: 'var(--text-muted)' }}>Engineered for </span>
          <span className="text-gradient-velzard">Scale.</span>
        </motion.h1>

        <motion.p variants={itemVariants} style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '650px',
          lineHeight: 1.6,
          marginBottom: '3.5rem'
        }}>
          Velzion delivers ephemeral preview environments and high-availability production clusters on a single, unified BYOC Obsidian Canvas. Zero proprietary lock-in.
        </motion.p>

        {/* Engine Feature Cards with Navigation Buttons */}
        <motion.div variants={containerVariants} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginBottom: '5rem'
        }}>
          
          {/* Zegion Engine Card */}
          <motion.div variants={itemVariants} className="glass-panel" style={{
            padding: '2.5rem',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(157, 78, 221, 0.1)', border: '1px solid var(--zg-purple-border)', color: 'var(--zg-purple-core)', marginBottom: '1.5rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }} className="text-gradient-zegion">Zegion Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Deploy ephemeral, isolated preview environments in milliseconds. Powered by n8n workflow automation and cheap AWS Spot Instances for absolute maximum FinOps ROI.
              </p>
            </div>
            <Link to="/zegion" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--zg-purple-core)', color: '#fff', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 1,
              transition: 'background 0.2s', textDecoration: 'none'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#7b2cbf'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--zg-purple-core)'}>
              Enter Zegion <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Velzard Engine Card */}
          <motion.div variants={itemVariants} className="glass-panel" style={{
            padding: '2.5rem',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 203, 92, 0.1)', border: '1px solid var(--vz-gold-border)', color: 'var(--vz-gold-core)', marginBottom: '1.5rem' }}>
                <Server size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }} className="text-gradient-velzard">Velzard Engine</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Granular infrastructure configuration. Select exact EC2 instances, EBS storage volumes, and deploy 24/7 highly available production clusters natively in your VPC.
              </p>
            </div>
            <Link to="/velzard" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--vz-gold-core)', color: '#000', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 1,
              transition: 'background 0.2s', textDecoration: 'none'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#d4af37'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--vz-gold-core)'}>
              Enter Velzard <ArrowRight size={18} />
            </Link>
          </motion.div>

        </motion.div>

        {/* Detailed Features Section */}
        <motion.div variants={itemVariants} style={{ width: '100%', textAlign: 'left', marginTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: 'var(--text-pure)' }}>Enterprise Architecture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <Shield size={24} style={{ color: 'var(--vz-gold-core)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>Keyless AssumeRole</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Never share your AWS root keys. Velzion uses dynamic STS AssumeRole via CloudFormation trusts for absolute security.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <Terminal size={24} style={{ color: 'var(--zg-purple-core)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>CNCF Buildpacks</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Zero Dockerfile configuration needed. The system auto-detects your repository language and compiles OCI containers.</p>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <CheckCircle2 size={24} style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>Live OTLP Telemetry</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>Stream live CPU and RAM resource utilization matrices directly from your EC2 instances into the React dashboard.</p>
            </div>

          </div>
        </motion.div>

      </motion.main>
      
      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '2rem 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        borderTop: 'var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem'
      }}>
        <span>&copy; {new Date().getFullYear()} Velzion Platform. Open Source BYOC.</span>
        <a href="https://github.com/Parth2496Singh/VELZION" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>GitHub Repository</a>
      </footer>

    </div>
  );
}