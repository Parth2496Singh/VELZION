import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Database, 
  Activity, 
  DollarSign, 
  Globe,
  ArrowDownRight,
  ShieldCheck,
  ChevronDown,
  Info,
  Server
} from 'lucide-react';

// --- MOCK TELEMETRY DATA ---
const monthlyData = [
  { week: 'W1', compute: 450, network: 120, traffic: 40 },
  { week: 'W2', compute: 520, network: 140, traffic: 60 },
  { week: 'W3', compute: 480, network: 130, traffic: 50 },
  { week: 'W4', compute: 850, network: 210, traffic: 100 }, // Traffic spike
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function VelzardFinOps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDetailedAudit, setShowDetailedAudit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Calculate Totals
  const totalCompute = monthlyData.reduce((acc, curr) => acc + curr.compute, 0);
  const totalNetwork = monthlyData.reduce((acc, curr) => acc + curr.network, 0);
  const totalCost = totalCompute + totalNetwork;
  
  // Simulated Savings from Reserved Instances & Auto-scaling
  const unoptimizedCost = totalCost * 1.45; 
  const totalSaved = Math.round(unoptimizedCost - totalCost);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <style>{`
        .tooltip-container { position: relative; display: inline-flex; align-items: center; gap: 8px; cursor: help; }
        .tooltip-icon { color: var(--text-muted); display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0;}
        .tooltip-container:hover .tooltip-icon { color: var(--vz-gold-core); }
        .tooltip-text { 
          visibility: hidden; width: 280px; background: var(--bg-surface); backdrop-filter: blur(8px); 
          color: var(--text-pure); text-align: left; border-radius: var(--radius-sm); padding: 14px; 
          font-size: 0.85rem; font-weight: 500; line-height: 1.5; position: absolute; z-index: 100; 
          bottom: 130%; left: 50%; transform: translateX(-50%); opacity: 0; transition: opacity 0.3s; 
          border: var(--border-subtle); box-shadow: var(--shadow-void); 
        }
        .tooltip-container:hover .tooltip-text { visibility: visible; opacity: 1; }
      `}</style>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--vz-gold-glow)', borderRadius: 'var(--radius-sm)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)' }}>
              <TrendingUp size={20} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-pure)' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-pure)' }}>
            <DollarSign size={20} style={{ color: 'var(--vz-gold-core)' }} />
            {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </motion.div>

      {/* KPI Matrix */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}
      >
        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--vz-gold-core)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Compute Elasticity</p>
            <div style={{ backgroundColor: 'var(--vz-gold-glow)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--vz-gold-core)' }}><Activity size={16} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)' }}>${totalCompute}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--vz-gold-core)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            Optimized via AWS Auto-Scaling
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Network Egress</p>
            <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#38bdf8' }}><Globe size={16} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)' }}>${totalNetwork}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Global CDN & Load Balancing
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Capital Saved</p>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: '#10b981' }}><DollarSign size={16} /></div>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)' }}>${totalSaved}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            <ArrowDownRight size={14} /> RI & Scaling efficiencies
          </p>
        </motion.div>
      </motion.div>

      {/* Main Framer Motion Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel" 
        style={{ padding: '2.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-pure)' }}>Traffic vs. Compute Expenditure</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Demonstrating Velzard's elastic scale in response to real-world load.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-pure)', fontWeight: 600 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--vz-gold-core)' }} /> Compute Cost
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--bg-surface)', border: '1px dashed #38bdf8' }} /> Network Traffic
            </div>
          </div>
        </div>

        {/* Custom CSS/Motion Chart Area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem', position: 'relative', paddingBottom: '1rem' }}>
          
          {/* Chart Background Grid Lines */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, pointerEvents: 'none' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-subtle)', width: '100%', height: '1px' }} />
            ))}
          </div>

          {/* Render Data Bars */}
          {monthlyData.map((data, index) => {
            const maxVal = 1000; // Peak cost for scale
            const computeHeight = (data.compute / maxVal) * 100;
            const trafficHeight = (data.traffic / 100) * 100; // scaled arbitrarily for visual effect

            return (
              <div key={data.week} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 1, flex: 1, maxWidth: '80px' }}>
                <div style={{ position: 'relative', width: '100%', height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  
                  {/* Traffic Overlay Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={isLoaded ? { height: `${trafficHeight}%` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
                    style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px dashed #38bdf8', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', zIndex: 2 }}
                  />

                  {/* Compute Foreground Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={isLoaded ? { height: `${computeHeight}%` } : { height: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + (index * 0.05), ease: [0.25, 1, 0.5, 1] }}
                    style={{ position: 'absolute', bottom: 0, width: '60%', background: 'linear-gradient(180deg, var(--vz-gold-core) 0%, rgba(245, 203, 92, 0.2) 100%)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', border: '1px solid var(--vz-gold-border)', borderBottom: 'none', zIndex: 1 }}
                  />
                </div>
                
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{data.week}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* --- DETAILED FINOPS AUDIT --- */}
      <button 
        onClick={() => setShowDetailedAudit(!showDetailedAudit)}
        style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', background: showDetailedAudit ? 'var(--bg-void)' : 'transparent', border: '1px dashed var(--border-subtle)', color: showDetailedAudit ? 'var(--text-pure)' : 'var(--text-muted)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, transition: 'all var(--transition-fast)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
      >
        {showDetailedAudit ? 'Hide Comprehensive Billing Ledger' : 'View Comprehensive Billing Ledger'}
        <ChevronDown size={18} style={{ transform: showDetailedAudit ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-smooth)' }} />
      </button>
      
      <AnimatePresence>
        {showDetailedAudit && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ background: 'var(--bg-void)', borderRadius: 'var(--radius-sm)', border: 'var(--border-subtle)', marginTop: '1.5rem', padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Service Component</th>
                    <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Provisioning Strategy</th>
                    <th style={{ padding: '1rem', borderBottom: 'var(--border-subtle)', color: 'var(--text-pure)', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>30-Day Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Core Compute (ECS/EKS)</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Elastic Auto-Scaling</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${totalCompute.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Global Edge & CDN</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Application Load Balancer</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>${totalNetwork.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Persistent Storage (RDS)</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>Multi-AZ Provisioned IOPS</td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-pure)', textAlign: 'right', fontFamily: 'monospace' }}>$240.00</td>
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-pure)', fontWeight: 700 }}>Total Velzard Run Rate</td>
                    <td style={{ padding: '1rem' }}></td>
                    <td style={{ padding: '1rem', color: 'var(--vz-gold-core)', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800 }}>${(totalCost + 240).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* ARCHITECTURE EVOLUTION CARDS               */}
      {/* ========================================== */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--text-pure)', fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>High-Availability Economics</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>How Velzard secures Tier-1 uptime while aggressively optimizing cloud waste.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--vz-gold-core)' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: '1px solid var(--vz-gold-border)', color: 'var(--vz-gold-core)' }}><Activity size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.25rem' }}>Elastic Scale-to-Zero</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>During low-traffic periods, Velzard automatically spins down redundant nodes. You only pay for peak compute when your application actually requires it.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981' }}><Database size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.25rem' }}>Reserved Instance Pooling</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Velzard intelligently maps your baseline production traffic to 1-year Reserved Instances under the hood, instantly securing up to 40% compute discounts.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #38bdf8' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-void)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}><ShieldCheck size={24} /></div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-pure)', fontSize: '1.25rem' }}>Multi-AZ Resilience</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>By distributing workloads across isolated data centers, we eliminate single points of failure. Uptime is mathematically guaranteed, protecting your revenue.</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}