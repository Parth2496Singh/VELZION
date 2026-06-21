import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Layers, Zap, Server, ArrowRight } from 'lucide-react';

const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

export default function About() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={springPage} style={{ maxWidth: '800px', width: '100%', margin: '0 auto', marginBottom: '4rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', transition: 'color var(--transition-fast)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <Hexagon size={24} strokeWidth={1.5} />
          <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}>VELZION</span>
        </Link>
      </motion.div>

      <motion.main variants={containerVariants} initial="hidden" animate="show" style={{ maxWidth: '800px', width: '100%', margin: '0 auto', flex: 1 }}>
        <motion.div variants={itemVariants} style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--text-pure)' }}>
            The architecture of <br />
            <span style={{ color: 'var(--text-muted)' }}>tomorrow's cloud.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '650px', margin: 0 }}>
            Velzion was born from a simple realization: modern engineering teams are forced to glue together fragmented tools for preview environments and production hosting. We built a unified platform to solve this.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--bg-layer-2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-void)', borderRadius: 'var(--radius-md)', color: 'var(--text-pure)', border: '1px solid var(--border-subtle)' }}>
                <Layers size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-pure)' }}>The Obsidian Canvas</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Our base infrastructure layer. It provides the dark, frosted glassmorphism interface and the underlying unified API that seamlessly connects our two execution engines. It is designed to be frictionless, fast, and entirely devoid of bloat.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-layer-2)' }}>
            <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--zg-purple-glow)', border: '1px solid var(--zg-purple-border)', borderRadius: 'var(--radius-md)', color: 'var(--zg-purple-core)' }}>
                <Zap size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-gradient-zegion" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Zegion Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Built for the development lifecycle. Zegion spins up ephemeral, fully-isolated preview environments for every pull request in under 4 seconds. When the PR merges, the environment evaporates, saving compute costs.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', background: 'var(--bg-layer-2)' }}>
            <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--vz-gold-glow)', border: '1px solid var(--vz-gold-border)', borderRadius: 'var(--radius-md)', color: 'var(--vz-gold-core)' }}>
                <Server size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-gradient-velzard" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>Velzard Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  The bedrock of your production workloads. Velzard provides multi-region, high-availability clusters with automated failover, autoscaling, and advanced FinOps telemetry baked natively into the dashboard.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '4rem' }}>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-pure)' }}>Ready to deploy?</h4>
          <Link to="/login" className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 2rem', borderRadius: 'var(--radius-pill)', gap: '0.75rem', color: 'var(--text-pure)', fontSize: '1rem', fontWeight: 700, transition: 'all var(--transition-fast)', textDecoration: 'none', background: 'var(--text-pure)', border: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
            <span style={{ color: 'var(--bg-void)' }}>Access Velzion Console</span> <ArrowRight size={18} strokeWidth={1.5} style={{ color: 'var(--bg-void)' }} />
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}