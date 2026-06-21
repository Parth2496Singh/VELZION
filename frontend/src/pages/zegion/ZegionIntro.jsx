import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, GitPullRequest, ShieldAlert, Cpu, ArrowRight, Sparkles } from 'lucide-react';

const springCrisp = { type: "spring", stiffness: 450, damping: 32, mass: 0.8 };
const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

export default function ZegionIntro() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 75%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={springPage} style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--zg-purple-border)', backgroundColor: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          <Sparkles size={14} strokeWidth={1.5} /> Ephemeral Provisioning Engine
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          Spawning isolated worlds <br />
          <span className="text-gradient-zegion">at the speed of a git push.</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '650px' }}>
          Zegion intercepts your version control lifecycles to build, compile, and broadcast secure, fully-isolated staging environments for every pull request—spinning down compute to zero the exact microsecond you merge.
        </p>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', marginBottom: '1.25rem', border: '1px solid var(--zg-purple-border)' }}>
            <GitPullRequest size={20} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.2rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>PR-Driven Lifecycles</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Zero manual configuration. Opening a pull request compiles your precise Terraform topologies and maps full external DNS addresses automatically.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', marginBottom: '1.25rem', border: '1px solid var(--zg-purple-border)' }}>
            <Cpu size={20} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.2rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>Sub-4s Hot Reloads</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Leveraging localized micro-clusters and pre-primed image caches to skip tedious dependency installation phases completely.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', marginBottom: '1.25rem', border: '1px solid var(--zg-purple-border)' }}>
            <ShieldAlert size={20} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.2rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>Cryptographic Isolation</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Every instance runs inside its own network namespace with locked metadata access points and temporary AWS Security Group definitions.
          </p>
        </motion.div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, ...springPage }} className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--zg-purple-core)' }} />
        
        <div>
          <h3 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-pure)' }}>Initialize Environment Fleet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '500px', lineHeight: 1.5 }}>
            Enter the dashboard control plane to synchronize your repositories, deploy trust links, and inspect running clusters.
          </p>
        </div>

        <Link to="/zegion/dashboard" style={{ display: 'flex', alignItems: 'center', padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-pure)', gap: '0.75rem', fontWeight: 600, fontSize: '0.95rem', backgroundColor: 'var(--bg-layer-2)', border: '1px solid var(--zg-purple-border)', textDecoration: 'none', transition: 'all var(--transition-fast)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--zg-purple-glow)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-layer-2)'; }}>
          Launch Controller <ArrowRight size={16} strokeWidth={1.5} style={{ color: 'var(--zg-purple-core)' }} />
        </Link>
      </motion.section>
    </div>
  );
}