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

export default function InstanceGuide() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <header>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem' }}>Instance Guide</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Select the correct compute profile for your architectural pattern.</p>
      </header>

      {/* Velzard Production Tier */}
      <section>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--vz-gold-core)' }}>
          <Server size={24} /> Velzard Production Tier (On-Demand)
        </h2>
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Instance</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Hourly</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>vCPU/RAM</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Networking</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {instanceData.velzard.map(i => (
                <tr key={i.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-pure)' }}>{i.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--vz-gold-core)', fontFamily: 'monospace' }}>{i.cost}</td>
                  <td style={{ padding: '1rem' }}>{i.vcpu} vCPU / {i.ram}</td>
                  <td style={{ padding: '1rem' }}>{i.net}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Zegion Ephemeral Tier */}
      <section>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--zg-purple-core)' }}>
          <Zap size={24} /> Zegion Ephemeral Tier (Spot-Optimized)
        </h2>
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Instance</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Spot Hourly</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Specs</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>Recommended For</th>
              </tr>
            </thead>
            <tbody>
              {instanceData.zegion.map(i => (
                <tr key={i.name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-pure)' }}>{i.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--zg-purple-core)', fontFamily: 'monospace' }}>{i.cost}</td>
                  <td style={{ padding: '1rem' }}>{i.vcpu} vCPU / {i.ram}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{i.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Architectural Guidance */}
      <section className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Architectural Guidance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem' }}>Microservices</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Deploy multiple t3.micro/small instances. Distribute service logic across separate containers to avoid noisy neighbor syndrome.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-pure)', marginBottom: '0.5rem' }}>3-Tier Web Applications</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Use m7i-flex.large for the App tier to ensure ample headroom for request buffering, and c7i-flex.large for compute-heavy processing nodes.</p>
          </div>
        </div>
      </section>

    </motion.div>
  );
}