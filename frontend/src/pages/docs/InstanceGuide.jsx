import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, Zap, ShieldCheck } from 'lucide-react';

const instanceData = {
  velzard: [
    { name: 't3.micro', cost: '$0.0104', vcpu: 2, ram: '1 GiB', net: 'Up to 5 Gbps', usage: 'Tiny microservices, internal tools' },
    { name: 't3.small', cost: '$0.0208', vcpu: 2, ram: '2 GiB', net: 'Up to 5 Gbps', usage: 'Small web apps, basic API proxies' },
    { name: 'c7i-flex.large', cost: '$0.08479', vcpu: 2, ram: '4 GiB', net: '12.5 Gbps', usage: 'Compute-intensive tasks, data processing' },
    { name: 'm7i-flex.large', cost: '$0.09576', vcpu: 2, ram: '8 GiB', net: '12.5 Gbps', usage: 'Memory-heavy apps, 3-tier monoliths' },
  ],
  zegion: [
    { name: 't3.micro', cost: '$0.0039', vcpu: 2, ram: '1 GiB', net: 'Up to 5 Gbps', usage: 'Ephemeral preview of frontend/light services' },
    { name: 't3.small', cost: '$0.0081', vcpu: 2, ram: '2 GiB', net: 'Up to 5 Gbps', usage: 'Heavy preview environments, integration tests' },
  ]
};

const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

export default function InstanceGuide() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <motion.header variants={itemVariants}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Instance Guide</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Select the correct compute profile for your architectural pattern.</p>
      </motion.header>

      {/* Velzard Production Tier */}
      <motion.section variants={itemVariants}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--vz-gold-core)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>
          <Server size={24} strokeWidth={1.5} /> Velzard Production Tier (On-Demand)
        </h2>
        <div className="glass-panel" style={{ overflowX: 'auto', background: 'var(--bg-layer-2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-layer-1)' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Instance</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Hourly</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>vCPU/RAM</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Networking</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {instanceData.velzard.map((i, index) => (
                <tr key={i.name} style={{ borderBottom: index === instanceData.velzard.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-pure)' }}>{i.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--vz-gold-core)', fontFamily: 'var(--font-mono)' }}>{i.cost}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.vcpu} vCPU / {i.ram}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.net}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Zegion Ephemeral Tier */}
      <motion.section variants={itemVariants}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--zg-purple-core)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', fontWeight: 800 }}>
          <Zap size={24} strokeWidth={1.5} /> Zegion Ephemeral Tier (Spot-Optimized)
        </h2>
        <div className="glass-panel" style={{ overflowX: 'auto', background: 'var(--bg-layer-2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-layer-1)' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Instance</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Spot Hourly</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Specs</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-pure)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Recommended For</th>
              </tr>
            </thead>
            <tbody>
              {instanceData.zegion.map((i, index) => (
                <tr key={i.name} style={{ borderBottom: index === instanceData.zegion.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-pure)' }}>{i.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--zg-purple-core)', fontFamily: 'var(--font-mono)' }}>{i.cost}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.vcpu} vCPU / {i.ram}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Architectural Guidance */}
      <motion.section variants={itemVariants} className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-layer-2)' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: '1.5rem', color: 'var(--text-pure)', fontWeight: 800 }}>Architectural Guidance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>Microservices</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>Deploy multiple t3.micro/small instances. Distribute service logic across separate containers to avoid noisy neighbor syndrome.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>3-Tier Web Applications</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>Use m7i-flex.large for the App tier to ensure ample headroom for request buffering, and c7i-flex.large for compute-heavy processing nodes.</p>
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
}