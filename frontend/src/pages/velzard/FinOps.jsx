import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Globe,
  ArrowDownRight,
  Server
} from 'lucide-react';

const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

export default function VelzardFinOps() {
  const totalCompute = 0;
  const totalNetwork = 0;
  const totalCost = 0;
  const totalSaved = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={springPage} className="glass-panel" style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--vz-gold-glow)', borderRadius: 'var(--radius-sm)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)' }}>
              <TrendingUp size={20} strokeWidth={1.5} />
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 800, color: 'var(--text-pure)' }}>
              Production FinOps Intelligence
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            High-availability cost modeling and real-time auto-scaling telemetry.
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Current 30-Day Run Rate
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-pure)', fontFamily: 'var(--font-mono)' }}>
            <DollarSign size={24} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
            {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--vz-gold-core)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Compute Elasticity</p>
            <div style={{ backgroundColor: 'var(--vz-gold-glow)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--vz-gold-core)' }}><Activity size={16} strokeWidth={1.5} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>${totalCompute}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            Awaiting Data
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Network Egress</p>
            <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#38bdf8' }}><Globe size={16} strokeWidth={1.5} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>${totalNetwork}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Awaiting Data
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Capital Saved</p>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#10b981' }}><DollarSign size={16} strokeWidth={1.5} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>${totalSaved}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            <ArrowDownRight size={14} strokeWidth={1.5} /> Awaiting Data
          </p>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, ...springPage }} className="glass-panel" style={{ padding: '4rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Server size={48} strokeWidth={1.5} style={{ opacity: 0.3, margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>No financial data generated yet. Ignite a cluster to begin telemetry.</p>
      </motion.div>

    </div>
  );
}