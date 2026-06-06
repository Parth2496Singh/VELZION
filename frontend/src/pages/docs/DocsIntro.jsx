import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Terminal, Zap, Server, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DocsIntro() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
    >
      
      {/* ---------------- HEADER ---------------- */}
      <motion.header variants={itemVariants} style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          <BookOpen size={16} /> Velzion Documentation
        </div>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', letterSpacing: '-0.02em' }}>
          Introduction to Velzion
        </h1>
        <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '700px' }}>
          Welcome to the official documentation for Velzion, the uncompromising cloud control plane. 
          Learn how to orchestrate ephemeral preview environments and high-availability production clusters from a single Obsidian Canvas.
        </p>
      </motion.header>

      {/* ---------------- PHILOSOPHY & ENGINES ---------------- */}
      <motion.section variants={itemVariants}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Layers size={20} style={{ color: 'var(--text-muted)' }} /> Core Architecture
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Zegion Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--zg-purple-core)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} style={{ color: 'var(--zg-purple-core)' }} /> Zegion: Ephemeral Engine
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Zegion intercepts GitHub webhooks to provision fully-isolated, temporary AWS environments for every Pull Request. It utilizes a strict Time-To-Live (TTL) and intelligent auto-hibernation to guarantee zero cloud waste, reducing standard CI/CD staging costs by up to 80%.
            </p>
          </div>

          {/* Velzard Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--vz-gold-core)' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--vz-gold-core)' }} /> Velzard: Production Engine
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Velzard is the bedrock for persistent workloads. It orchestrates multi-region, high-availability clusters with automated failover, load balancing, and auto-scaling logic. It maps traffic to Reserved Instances to secure enterprise-grade reliability at optimized pricing.
            </p>
          </div>

          {/* Security Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#10b981' }} /> Keyless IAM Bindings
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Velzion never stores long-lived AWS Access Keys. Both engines rely entirely on short-lived, keyless STS AssumeRole architecture. You deploy a strict least-privilege CloudFormation stack in your account, and we handshake cryptographically via OIDC.
            </p>
          </div>

        </div>
      </motion.section>

      {/* ---------------- NEXT STEPS / NAVIGATION ---------------- */}
      <motion.section variants={itemVariants} style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '1.5rem' }}>
          Explore the Guides
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <Link to="/docs/instance-guide" className="glass-panel" style={{ 
            padding: '1.5rem', 
            textDecoration: 'none', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
          >
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-void)', borderRadius: 'var(--radius-sm)', width: 'fit-content', color: 'var(--text-pure)', border: '1px solid var(--border-subtle)' }}>
              <Terminal size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-pure)' }}>Instance Guide</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Deep dive into the underlying compute architecture, EC2 scaling parameters, and network topology.
              </p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)' }}>
              Read Guide <ArrowRight size={14} />
            </div>
          </Link>

          <Link to="/docs/user-guide" className="glass-panel" style={{ 
            padding: '1.5rem', 
            textDecoration: 'none', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
          >
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-void)', borderRadius: 'var(--radius-sm)', width: 'fit-content', color: 'var(--text-pure)', border: '1px solid var(--border-subtle)' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-pure)' }}>User Guide</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Learn how to navigate the Obsidian Canvas, interpret FinOps telemetry, and manage workspace permissions.
              </p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)' }}>
              Read Guide <ArrowRight size={14} />
            </div>
          </Link>

        </div>
      </motion.section>

    </motion.div>
  );
}