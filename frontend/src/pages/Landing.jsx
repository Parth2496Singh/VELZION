import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Server, Shield, Terminal, Hexagon, Moon, Sun, CheckCircle2, ChevronRight, Activity, CloudCog } from 'lucide-react';

const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: springPage } };

// Floating Element Animation
const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};

export default function Landing() {
  const [isLightMode, setIsLightMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isLightMode]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* 🌌 Dynamic Bleeding Edge Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Animated Grid */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
          backgroundSize: '40px 40px', 
          perspective: '1000px', 
          transformOrigin: 'top',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 80%)' 
        }} />
        
        {/* Massive Ambient Orbs */}
        <motion.div 
          animate={{ x: [-50, 50, -50], y: [-20, 30, -20] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 60%)', filter: 'blur(100px)', opacity: 0.6 }} 
        />
        <motion.div 
          animate={{ x: [50, -50, 50], y: [20, -30, 20] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '40%', right: '-20%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 60%)', filter: 'blur(120px)', opacity: 0.4 }} 
        />
      </div>

      {/* Navbar */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={springPage} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem 2rem', zIndex: 10, backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Hexagon size={32} strokeWidth={1.5} style={{ color: 'var(--text-pure)' }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: -4, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-pure)' }}>VELZION</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/docs" style={{ color: 'var(--text-pure)', fontSize: '0.95rem', fontWeight: 600, transition: 'color var(--transition-fast)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--vz-gold-core)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-pure)'}>Documentation</Link>
          <a href="https://github.com/Parth2496Singh/VELZION" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-pure)', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--zg-purple-core)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-pure)'}>
            <svg style={{ width: '22px', height: '22px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          <Link to="/login" className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-pill)', gap: '0.5rem', color: 'var(--bg-void)', background: 'var(--text-pure)', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', border: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Access Console <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.main variants={containerVariants} initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '1200px', margin: '0 auto', zIndex: 10, padding: '6rem 2rem', position: 'relative' }}>
        
        {/* Floating Telemetry Element */}
        <motion.div animate={floatAnimation} style={{ position: 'absolute', top: '15%', left: '5%', padding: '1rem', background: 'var(--bg-layer-2)', border: '1px solid var(--zg-purple-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <Activity size={20} className="text-gradient-zegion" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview Latency</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-pure)' }}>2.4s</div>
          </div>
        </motion.div>

        <motion.div animate={{ ...floatAnimation.animate, y: [0, 15, 0] }} transition={floatAnimation.transition} style={{ position: 'absolute', top: '35%', right: '0%', padding: '1rem', background: 'var(--bg-layer-2)', border: '1px solid var(--vz-gold-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
          <CloudCog size={20} className="text-gradient-velzard" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Production Nodes</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-pure)' }}>14 Active</div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-layer-2)', marginBottom: '2.5rem', backdropFilter: 'blur(10px)' }}>
          <span style={{ display: 'flex', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 12px #10b981' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Velzion Platform v2.0 is Live</span>
        </motion.div>

        <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'var(--text-pure)', textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          Uncompromising.<br />
          <span style={{ background: 'linear-gradient(to right, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Engineered for </span>
          <span className="text-gradient-velzard">Scale.</span>
        </motion.h1>

        <motion.p variants={itemVariants} style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: 1.6, marginBottom: '4rem', fontWeight: 500 }}>
          Velzion delivers ephemeral preview environments and high-availability production clusters on a single, unified BYOC Obsidian Canvas. Zero proprietary lock-in. Absolute control.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '6rem' }}>
          <Link to="/zegion" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none', border: '1px solid var(--zg-purple-border)', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(157, 78, 221, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--zg-purple-glow)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <Zap size={20} strokeWidth={2.5} /> Explore Zegion
          </Link>
          <Link to="/velzard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', background: 'var(--vz-gold-glow)', color: 'var(--vz-gold-core)', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none', border: '1px solid var(--vz-gold-border)', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 203, 92, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--vz-gold-glow)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <Server size={20} strokeWidth={2.5} /> Explore Velzard
          </Link>
        </motion.div>

        {/* Premium Grid Section */}
        <motion.div variants={itemVariants} style={{ width: '100%', textAlign: 'left', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, var(--border-subtle))' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-pure)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enterprise Architecture</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, var(--border-subtle))' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-layer-2)', borderTop: '2px solid var(--vz-gold-core)' }}>
              <Shield size={28} strokeWidth={1.5} style={{ color: 'var(--vz-gold-core)', marginBottom: '1.5rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-pure)' }}>Keyless AssumeRole</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>Never share your AWS root keys. Velzion uses dynamic STS AssumeRole via CloudFormation trusts for absolute, cryptographically sealed security.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-layer-2)', borderTop: '2px solid var(--zg-purple-core)' }}>
              <Terminal size={28} strokeWidth={1.5} style={{ color: 'var(--zg-purple-core)', marginBottom: '1.5rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-pure)' }}>CNCF Buildpacks</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>Zero Dockerfile configuration needed. The pipeline automatically analyzes your repository heuristics and compiles heavily optimized OCI containers.</p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-layer-2)', borderTop: '2px solid #10b981' }}>
              <CheckCircle2 size={28} strokeWidth={1.5} style={{ color: '#10b981', marginBottom: '1.5rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-pure)' }}>Live OTLP Telemetry</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>Stream live CPU, Memory, and Network latency matrices directly from your edge nodes directly into the React control plane via WebSocket.</p>
            </div>
          </div>
        </motion.div>

      </motion.main>
      
      <footer style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', gap: '2rem', background: 'var(--bg-void)', position: 'relative', zIndex: 10 }}>
        <span>&copy; {new Date().getFullYear()} Velzion Platform. Open Source BYOC.</span>
        <a href="https://github.com/Parth2496Singh/VELZION" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-pure)', textDecoration: 'none', fontWeight: 600 }}>GitHub Repository</a>
      </footer>

    </div>
  );
}