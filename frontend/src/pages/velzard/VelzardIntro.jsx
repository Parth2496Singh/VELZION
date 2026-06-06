import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Server, Activity, Globe, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

// Animation Variants for Tier-1 Orchestra Transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export default function VelzardIntro() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative' }}>
      
      {/* Cinematic Ambient Flare specific to Velzard */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--vz-gold-glow) 0%, transparent 75%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Header Block */}
      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--vz-gold-border)',
          backgroundColor: 'var(--vz-gold-glow)',
          color: 'var(--vz-gold-core)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem'
        }}>
          <Zap size={14} fill="var(--vz-gold-core)" /> High-Availability Production Engine
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          lineHeight: 1.15,
          marginBottom: '1.5rem'
        }}>
          Unyielding infrastructure.<br />
          <span className="text-gradient-velzard">Engineered for absolute scale.</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '650px' }}>
          Velzard is the bedrock of your production workloads. We provision multi-region, high-availability clusters with automated failover, load balancing, and advanced OTLP telemetry baked natively into the control plane.
        </p>
      </motion.section>

      {/* Core Architectural Pillars */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', position: 'relative', zIndex: 1 }}
      >
        {/* Feature 1 */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 203, 92, 0.1)', color: 'var(--vz-gold-core)', marginBottom: '1.25rem', border: '1px solid var(--vz-gold-border)' }}>
            <Globe size={20} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Global Edge Routing</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Traffic is intelligently routed to the healthiest nodes across multiple availability zones, ensuring zero-downtime deployments and sub-millisecond latency.
          </p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 203, 92, 0.1)', color: 'var(--vz-gold-core)', marginBottom: '1.25rem', border: '1px solid var(--vz-gold-border)' }}>
            <Activity size={20} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Elastic Auto-Scaling</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Velzard monitors your CPU and Memory matrix in real-time, automatically injecting raw compute from the AWS matrix the moment traffic spikes.
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 203, 92, 0.1)', color: 'var(--vz-gold-core)', marginBottom: '1.25rem', border: '1px solid var(--vz-gold-border)' }}>
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fortified Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Production clusters are air-gapped within their own VPCs. Database connections are heavily encrypted and routed strictly through internal networks.
          </p>
        </motion.div>
      </motion.section>

      {/* Deployment Navigation Canvas */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass-panel"
        style={{ 
          padding: '3rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: '2rem',
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--vz-gold-core)' }} />
        
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ignite Production Storm</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '500px', lineHeight: 1.5 }}>
            Enter the Velzard control plane to generate architectural contracts, bind domains, and monitor live OTLP hardware telemetry.
          </p>
        </div>

        <Link to="/velzard/dashboard" className="glass-panel flex-center" style={{
          padding: '0.85rem 1.75rem',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-pure)',
          gap: '0.75rem',
          fontWeight: 600,
          fontSize: '0.95rem',
          backgroundColor: 'var(--bg-glass-hover)',
          border: '1px solid var(--vz-gold-border)',
          transition: 'all var(--transition-fast)'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--vz-gold-glow)';
            e.currentTarget.style.borderColor = 'var(--vz-gold-core)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
            e.currentTarget.style.borderColor = 'var(--vz-gold-border)';
        }}
        >
          Access Production Core <ArrowRight size={16} style={{ color: 'var(--vz-gold-core)' }} />
        </Link>
      </motion.section>

    </div>
  );
}