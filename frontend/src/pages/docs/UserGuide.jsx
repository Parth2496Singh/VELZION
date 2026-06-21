import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Server, ShieldCheck, ArrowRight, GitBranch, BarChart3, CloudCog, Activity } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function UserGuide() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <header>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem' }}>Velzion User Guide</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Master the Obsidian Canvas and maximize your cloud ROI.</p>
      </header>

      {/* --- WHY VELZION --- */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-pure)' }}>Why Velzion over Vercel/Railway/Render?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem' }}>Native Infrastructure Control</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Unlike abstracted PaaS providers, Velzion gives you direct access to your AWS VPC. You aren't trapped in a proprietary runtime; you own your terraform state, security groups, and compute lifecycle.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem' }}>Aggressive Cost Culling</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>While competitors charge per-instance/24-hour cycles, Zegion's Strict TTL and hibernating Spot instances ensure you pay only for active testing minutes.</p>
          </div>
        </div>
      </section>

      {/* --- GETTING STARTED --- */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-pure)' }}>Getting Started</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-void)', borderRadius: 'var(--radius-sm)' }}><ShieldCheck size={24} color="var(--zg-purple-core)" /></div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.25rem' }}>1. The Secure Handshake</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authenticate via GitHub OAuth. Velzion uses your identity to map repository access. Our system never requests AWS root keys—we utilize keyless AssumeRole architecture for all operations.</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-void)', borderRadius: 'var(--radius-sm)' }}><GitBranch size={24} color="var(--vz-gold-core)" /></div>
            <div>
              <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.25rem' }}>2. Initialize a Workspace</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Navigate to Zegion or Velzard and select a repository. Once mapped, the control plane will begin listening for your infrastructure contracts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD FEATURES --- */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-pure)' }}>Command Plane Features</h2>
        <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Fleet Telemetry', icon: Activity, desc: 'Real-time CPU/RAM matrix.' },
            { title: 'FinOps ROI', icon: BarChart3, desc: 'Track your spot savings.' },
            { title: 'Dragon Scales', icon: CloudCog, desc: 'Container topology monitoring.' }
          ].map(feature => (
            <motion.div variants={itemVariants} key={feature.title} className="glass-panel" style={{ padding: '1.25rem' }}>
              <feature.icon size={20} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <h4 style={{ color: 'var(--text-pure)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{feature.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </motion.div>
  );
}