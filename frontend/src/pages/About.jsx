import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Layers, Zap, Server, ArrowRight } from 'lucide-react';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '4rem 2rem',
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* Navigation Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '800px', width: '100%', margin: '0 auto', marginBottom: '4rem' }}
      >
        <Link to="/" className="flex-center" style={{ 
          display: 'inline-flex',
          gap: '0.75rem', 
          color: 'var(--text-muted)',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Hexagon size={24} />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            VELZION
          </span>
        </Link>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          flex: 1
        }}
      >
        {/* Intro */}
        <motion.div variants={itemVariants} style={{ marginBottom: '4rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            The architecture of <br />
            <span style={{ color: 'var(--text-muted)' }}>tomorrow's cloud.</span>
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-muted)', 
            lineHeight: 1.7,
            maxWidth: '650px'
          }}>
            Velzion was born from a simple realization: modern engineering teams are forced to glue together fragmented tools for preview environments and production hosting. We built a unified platform to solve this.
          </p>
        </motion.div>

        {/* The Three Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Pillar 1: Obsidian Canvas */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-glass-hover)', borderRadius: 'var(--radius-md)', color: 'var(--text-pure)' }}>
                <Layers size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>The Obsidian Canvas</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Our base infrastructure layer. It provides the dark, frosted glassmorphism interface and the underlying unified API that seamlessly connects our two execution engines. It is designed to be frictionless, fast, and entirely devoid of bloat.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillar 2: Zegion */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(157, 78, 221, 0.1)', border: '1px solid var(--zg-purple-border)', borderRadius: 'var(--radius-md)', color: 'var(--zg-purple-core)' }}>
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-gradient-zegion" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Zegion Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Built for the development lifecycle. Zegion spins up ephemeral, fully-isolated preview environments for every pull request in under 4 seconds. When the PR merges, the environment evaporates, saving compute costs.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillar 3: Velzard */}
          <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', right: '-10%', transform: 'translateY(-50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 203, 92, 0.1)', border: '1px solid var(--vz-gold-border)', borderRadius: 'var(--radius-md)', color: 'var(--vz-gold-core)' }}>
                <Server size={24} />
              </div>
              <div>
                <h3 className="text-gradient-velzard" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Velzard Engine</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  The bedrock of your production workloads. Velzard provides multi-region, high-availability clusters with automated failover, autoscaling, and advanced FinOps telemetry baked natively into the dashboard.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '4rem' }}>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ready to deploy?</h4>
          <Link to="/login" className="glass-panel flex-center" style={{ 
            display: 'inline-flex',
            padding: '0.75rem 2rem', 
            borderRadius: 'var(--radius-pill)',
            gap: '0.75rem',
            color: 'var(--text-pure)',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all var(--transition-fast)'
          }}>
            Access Velzion Console <ArrowRight size={18} />
          </Link>
        </motion.div>

      </motion.main>
    </div>
  );
}