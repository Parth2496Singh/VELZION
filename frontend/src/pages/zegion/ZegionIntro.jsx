import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  GitPullRequest, 
  Cpu, 
  ArrowRight, 
  TrendingDown, 
  Clock, 
  Database,
  TerminalSquare,
  ShieldCheck,
  ServerCrash
} from 'lucide-react';

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const glassCardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

// ----------------------------------------------------------------------
// 🌌 PARALLAX IMAGE BACKGROUND
// Uses the user's reference image with a slow, immersive pan
// ----------------------------------------------------------------------
const DeepSpaceParallax = () => {
  const { scrollY } = useScroll();
  const yPos = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Replace '/nebula-bg.png' with the actual path to your downloaded reference image.
        Assuming it's placed in the 'public' folder.
      */}
      <motion.div 
        style={{ 
          position: 'absolute', 
          top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
          backgroundImage: 'url(/nebula-bg.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          opacity: 0.4,
          y: yPos
        }} 
      />
      {/* Vignette overlay to ensure text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, #030303 80%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #030303 0%, transparent 20%, transparent 80%, #030303 100%)' }} />
    </div>
  );
};

// ----------------------------------------------------------------------
// 🧊 CSS 3D HARDWARE-ACCELERATED OBJECT
// Zero WebGL bloat. Pure GPU-accelerated CSS transforms.
// ----------------------------------------------------------------------
const FloatingDataConstruct = () => {
  return (
    <div style={{ position: 'absolute', right: '5%', top: '10%', width: '400px', height: '400px', perspective: '1000px', pointerEvents: 'none', zIndex: 0 }}>
      <motion.div
        animate={{ rotateY: 360, rotateX: [10, -10, 10], y: [-15, 15, -15] }}
        transition={{ rotateY: { duration: 25, repeat: Infinity, ease: "linear" }, rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Construct Rings */}
        {[0, 45, 90, 135].map((angle, i) => (
          <div key={i} style={{ 
            position: 'absolute', 
            width: '280px', height: '280px', 
            border: '1px solid rgba(217, 70, 239, 0.4)', 
            borderRadius: '50%', 
            transform: `rotateY(${angle}deg)`,
            boxShadow: 'inset 0 0 20px rgba(217, 70, 239, 0.1)'
          }} />
        ))}
        
        {/* Core Data Cube */}
        <motion.div 
          animate={{ rotateX: -360, rotateY: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ width: '80px', height: '80px', background: 'rgba(217, 70, 239, 0.1)', border: '1px solid #e879f9', transformStyle: 'preserve-3d', boxShadow: '0 0 30px #e879f9' }}
        >
           {/* Abstract inner geometry */}
           <div style={{ position: 'absolute', inset: '10px', border: '1px dashed #e879f9', transform: 'translateZ(40px)' }} />
           <div style={{ position: 'absolute', inset: '10px', border: '1px dashed #e879f9', transform: 'translateZ(-40px)' }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ----------------------------------------------------------------------
// ⚡ MAIN INTRO COMPONENT
// ----------------------------------------------------------------------
export default function ZegionIntro() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', position: 'relative', paddingBottom: '4rem', minHeight: '100%' }}>
      
      <DeepSpaceParallax />
      <FloatingDataConstruct />

      {/* --- 1. HERO SECTION --- */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '800px', marginTop: '2rem' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(217, 70, 239, 0.1)', border: '1px solid rgba(217, 70, 239, 0.3)', color: '#e879f9', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
          <Database size={14} /> Bring Your Own Cloud (BYOC)
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-pure)' }}>
          The frictionless PaaS experience, <br />
          <span style={{ color: '#e879f9', textShadow: '0 0 25px rgba(217, 70, 239, 0.4)' }}>
            running securely on your AWS.
          </span>
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, maxWidth: '700px', fontWeight: 500, marginBottom: '2.5rem' }}>
          Modern cloud development forces a brutal tradeoff: pay exponential PaaS markups for a great developer experience, or suffer severe operational friction managing raw AWS infrastructure. <strong>Velzion eliminates this tradeoff.</strong> We host the orchestration brain; your AWS account hosts the compute.
        </p>

        {/* Hard ROI Metrics */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', color: '#34d399' }}>
              <TrendingDown size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-pure)' }}>~70%</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Compute Reduction</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(217, 70, 239, 0.1)', borderRadius: 'var(--radius-sm)', color: '#e879f9' }}>
              <Clock size={24} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-pure)' }}>73%</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Less Server Uptime</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- 2. ARCHITECTURE DEEP DIVE --- */}
      <motion.section variants={staggerContainer} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.5rem' }}>The Ephemeral Lifecycle</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}>How the Zegion engine orchestrates event-driven, self-destructing preview environments using enterprise-grade automation.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <motion.div variants={glassCardVariant} style={{ padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.5)', color: 'var(--text-pure)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <GitPullRequest size={20} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>01</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.75rem' }}>Event Ingestion</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              A Pull Request is opened. Our Django Monolith API intercepts the webhook and routes the event directly into the asynchronous <strong>n8n workflow</strong> layer.
            </p>
          </motion.div>

          <motion.div variants={glassCardVariant} style={{ padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #e879f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(217, 70, 239, 0.1)', color: '#e879f9', border: '1px solid rgba(217, 70, 239, 0.3)' }}>
                <Cpu size={20} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>02</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.75rem' }}>Spot Provisioning</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Terraform is triggered to provision highly-discounted <strong>AWS EC2 Spot Instances</strong> within your isolated VPC, instantly slashing infrastructure costs by 70%.
            </p>
          </motion.div>

          <motion.div variants={glassCardVariant} style={{ padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #34d399' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                <TerminalSquare size={20} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>03</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.75rem' }}>Zero-Config Build</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              The engine utilizes <strong>CNCF Buildpacks</strong> to auto-detect your language and compile the container. A live preview URL is automatically posted to the PR.
            </p>
          </motion.div>

          <motion.div variants={glassCardVariant} style={{ padding: '2.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', borderTop: '2px solid #f87171' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                <ServerCrash size={20} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>04</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.75rem' }}>Auto-Destruction</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              When the Pull Request is merged or closed, Zegion executes a teardown sequence. Infrastructure is annihilated, ensuring <strong>zero-dollar idle costs</strong>.
            </p>
          </motion.div>

        </div>
      </motion.section>

      {/* --- 3. PLATFORM FEASIBILITY & DATA PLANE --- */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
        <div style={{ background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '3.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem' }}>Decoupled Data & Control</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Velzion is built for enterprise feasibility. Our control plane scales independently, keeping our internal server costs near-zero while securely delegating heavy compute to your AWS account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.02)' }}>
                <ShieldCheck size={20} style={{ color: '#e879f9' }} /> 
                <span style={{ color: 'var(--text-pure)', fontWeight: 600 }}>100% Data Residency in your VPC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.02)' }}>
                <Database size={20} style={{ color: '#e879f9' }} /> 
                <span style={{ color: 'var(--text-pure)', fontWeight: 600 }}>Strict Database Isolation per PR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.02)' }}>
                <Cpu size={20} style={{ color: '#e879f9' }} /> 
                <span style={{ color: 'var(--text-pure)', fontWeight: 600 }}>Deterministic Reproducible Environments</span>
              </div>
            </div>
          </div>
          
          {/* CTA Box */}
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '3rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(217, 70, 239, 0.3)', textAlign: 'center', boxShadow: 'inset 0 0 30px rgba(217, 70, 239, 0.1), 0 20px 40px rgba(0,0,0,0.6)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-pure)' }}>Ready to deploy?</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Configure your AWS IAM bindings and launch the orchestration engine.</p>
            <Link to="/zegion/dashboard" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '1.15rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-pure)', gap: '0.75rem', fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, var(--zg-purple-core) 0%, #d946ef 100%)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px rgba(217, 70, 239, 0.3)' }}>
                Launch Zegion Dashboard <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}