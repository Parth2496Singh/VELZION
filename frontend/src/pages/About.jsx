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

      {/* Purple Aurora */}
<div
  style={{
    position: 'fixed',
    top: '10%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background:
      'radial-gradient(circle, rgba(157,78,221,0.18), transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: -2
  }}
/>

{/* Gold Aurora */}
<div
  style={{
    position: 'fixed',
    bottom: '10%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background:
      'radial-gradient(circle, rgba(245,203,92,0.15), transparent 70%)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: -2
  }}
/>
      
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

        <motion.div
  variants={itemVariants}
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
    gap: '1rem',
    marginBottom: '4rem'
  }}
>
  <div className="glass-panel" style={{ padding: '1.5rem' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '.5rem' }}>
      &lt;4s
    </h2>
    <p style={{ color: 'var(--text-muted)' }}>
      Preview Environment Creation
    </p>
  </div>

  <div className="glass-panel" style={{ padding: '1.5rem' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '.5rem' }}>
      99.95%
    </h2>
    <p style={{ color: 'var(--text-muted)' }}>
      Production Availability
    </p>
  </div>

  <div className="glass-panel" style={{ padding: '1.5rem' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '.5rem' }}>
      40%
    </h2>
    <p style={{ color: 'var(--text-muted)' }}>
      Reduced Infrastructure Waste
    </p>
  </div>
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

        <motion.div
  variants={itemVariants}
  style={{
    marginTop: '5rem'
  }}
>
  <h2
    style={{
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '2rem'
    }}
  >
    Leadership
  </h2>

  <motion.div
    whileHover={{
      y: -6,
      scale: 1.01
    }}
    className="glass-panel"
    style={{
      padding: '2.5rem',
      background:
        'linear-gradient(145deg, rgba(157,78,221,0.08), rgba(245,203,92,0.08))'
    }}
  >
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background:
            'linear-gradient(135deg,var(--zg-purple-core),var(--vz-gold-core))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 800
        }}
      >
        P
      </div>

      <div>
        <h3
          style={{
            fontSize: '1.5rem',
            marginBottom: '.5rem'
          }}
        >
          Parth Singh Kushwaha
        </h3>

        <p
          style={{
            color: 'var(--vz-gold-core)',
            marginBottom: '1rem'
          }}
        >
          Team Lead • Cloud & DevOps Engineer
        </p>

        <p
          style={{
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '650px'
          }}
        >
          Leading the cloud architecture, deployment automation,
          infrastructure reliability, and operational strategy
          that powers the Velzion ecosystem.
        </p>
      </div>
    </div>
  </motion.div>
</motion.div>

{/* Team Section */}
<motion.div
  variants={itemVariants}
  style={{
    marginTop: '5rem'
  }}
>
  <h2
    style={{
      fontSize: '2rem',
      fontWeight: 700,
      marginBottom: '2rem'
    }}
  >
    Core Team
  </h2>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem'
    }}
  >
    {/* Tanishq Nigam */}
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-panel"
      style={{ padding: '2rem' }}
    >
      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        Tanishq Nigam
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Frontend Developer
      </p>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Builds high-performance UI systems and contributes to the Obsidian Canvas design system.
      </p>
    </motion.div>

    {/* Gunjit Verma */}
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-panel"
      style={{ padding: '2rem' }}
    >
      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        Gunjit Verma
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Backend Developer
      </p>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Engineers scalable APIs, authentication flows, and cloud orchestration logic powering Velzion services.
      </p>
    </motion.div>

    {/* Shreyash Rawat */}
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-panel"
      style={{ padding: '2rem' }}
    >
      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        Shreyash Rawat
      </h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        AI/ML Engineer
      </p>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Works on intelligent automation, predictive scaling systems, and future AI-driven cloud optimization.
      </p>
    </motion.div>

  </div>
</motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '4rem' }}>
          <h4
  style={{
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '1rem'
  }}
>
  Build. Preview. Deploy.
</h4>

<p
  style={{
    color: 'var(--text-muted)',
    marginBottom: '2rem'
  }}
>
  All from a single platform.
</p>
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
