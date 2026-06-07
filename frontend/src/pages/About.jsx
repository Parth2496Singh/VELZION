import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GitPullRequest, GitBranch, Terminal, Database, Cloud, 
  Server, Zap, ArrowRight, ArrowDown, Shield, 
  Workflow, Cpu, Network, Mail, Lock, Layout, Hexagon
} from 'lucide-react';

// --- REUSABLE FLOW NODE CARD ---
const NodeCard = ({ icon: Icon, title, desc, color = "cyan", className = "" }) => {
  return (
    <div className={`vz-node vz-node-${color} ${className}`}>
      <div className="vz-node-hover-glare"></div>
      <Icon size={24} className="vz-node-icon" />
      <h4 className="vz-node-title">{title}</h4>
      <p className="vz-node-desc">{desc}</p>
    </div>
  );
};

// --- SECTION HEADER ---
const SectionHeader = ({ title, subtitle, number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ duration: 0.5 }}
    className="vz-section-header"
  >
    <div className="vz-sh-top">
      <span className="vz-sh-badge">System Layer 0{number}</span>
      <div className="vz-sh-line"></div>
    </div>
    <h2 className="vz-sh-title">{title}</h2>
    <p className="vz-sh-subtitle">{subtitle}</p>
  </motion.div>
);

// --- EXPLANATION BLOCK ---
const ExplanationBlock = ({ title, children, color = "cyan" }) => {
  const colorMap = {
    cyan: "#00e5ff",
    amber: "#ffaa00",
    purple: "#a855f7",
    emerald: "#10b981"
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: 0.2, duration: 0.5 }}
      className="vz-explanation-block"
      style={{ borderLeftColor: colorMap[color] }}
    >
      <h4 className="vz-explanation-title" style={{ color: colorMap[color] }}>{title}</h4>
      <div className="vz-explanation-text">{children}</div>
    </motion.div>
  );
};

export default function About() {
  return (
    <div className="vz-about-page">
      {/* ========================================= */}
      {/* 🎨 PURE CSS STYLESHEET                    */}
      {/* ========================================= */}
      <style>{`
        .vz-about-page { background-color: #030406; color: #ffffff; min-height: 100vh; font-family: 'Inter', system-ui, sans-serif; position: relative; overflow-x: hidden; padding-bottom: 100px; }

        /* Cosmic Backgrounds */
        .vz-bg-layer { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .vz-nebula-cyan { position: absolute; top: -10%; left: -10%; width: 50%; height: 50%; border-radius: 50%; background: rgba(0, 229, 255, 0.08); filter: blur(120px); }
        .vz-nebula-amber { position: absolute; bottom: 20%; right: -10%; width: 60%; height: 60%; border-radius: 50%; background: rgba(255, 170, 0, 0.05); filter: blur(150px); }
        .vz-nebula-purple { position: absolute; top: 40%; left: 40%; width: 40%; height: 40%; border-radius: 50%; background: rgba(168, 85, 247, 0.05); filter: blur(130px); }
        .vz-grid-overlay { position: absolute; inset: 0; opacity: 0.03; background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px; }

        /* Layout Helpers */
        .vz-container { max-width: 1200px; margin: 0 auto; padding: 100px 24px 24px 24px; position: relative; z-index: 10; }
        .vz-text-center { text-align: center; }
        .vz-mb-large { margin-bottom: 140px; }
        
        /* Typography */
        .vz-hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; letter-spacing: -0.05em; margin-bottom: 1.5rem; line-height: 1.1; }
        .vz-hero-subtitle { font-size: 1.125rem; color: #a1a1aa; max-width: 700px; margin: 0 auto; line-height: 1.6; }
        .vz-gradient-text { background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(to right, #00e5ff, #a855f7, #ffaa00); }
        
        /* Section Headers */
        .vz-section-header { margin-bottom: 3rem; }
        .vz-sh-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
        .vz-sh-badge { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(to right, #00e5ff, #a855f7); }
        .vz-sh-line { height: 1px; flex: 1; background: linear-gradient(to right, rgba(0,229,255,0.3), transparent); }
        .vz-sh-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 900; letter-spacing: -0.02em; margin: 0 0 0.75rem 0; }
        .vz-sh-subtitle { font-size: 1rem; color: #a1a1aa; max-width: 800px; line-height: 1.6; margin: 0; }

        /* Glassmorphism Panels */
        .vz-glass-panel { background: rgba(10, 12, 16, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); margin-bottom: 2rem; }
        
        /* Explanation Blocks */
        .vz-explanation-block { margin-top: 1rem; padding: 1.5rem 2rem; background: rgba(255,255,255,0.02); border-left: 3px solid #00e5ff; border-radius: 0 16px 16px 0; border-top: 1px solid rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.02); }
        .vz-explanation-title { font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 0.75rem 0; }
        .vz-explanation-text p { font-size: 0.95rem; line-height: 1.7; color: #d4d4d8; margin: 0; }
        .vz-explanation-text strong { color: #ffffff; font-weight: 600; }

        /* Data Flow Animations (The Magic) */
        @keyframes flowDown {
          0% { transform: translateY(-8px); opacity: 0.2; }
          50% { transform: translateY(8px); opacity: 1; filter: drop-shadow(0 0 10px currentColor); }
          100% { transform: translateY(-8px); opacity: 0.2; }
        }
        @keyframes flowRight {
          0% { transform: translateX(-8px); opacity: 0.2; }
          50% { transform: translateX(8px); opacity: 1; filter: drop-shadow(0 0 10px currentColor); }
          100% { transform: translateX(-8px); opacity: 0.2; }
        }
        .vz-flow-down { animation: flowDown 1.5s infinite ease-in-out; margin: 12px auto; display: block; }
        .vz-flow-right { animation: flowRight 1.5s infinite ease-in-out; margin: auto 12px; }

        /* Grids & Flex */
        .vz-grid-3 { display: grid; gap: 2rem; grid-template-columns: 1fr; }
        @media (min-width: 768px) { .vz-grid-3 { grid-template-columns: repeat(3, 1fr); } }
        .vz-grid-4 { display: grid; gap: 1rem; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .vz-grid-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .vz-grid-4 { grid-template-columns: repeat(4, 1fr); } }
        .vz-grid-5 { display: grid; gap: 1rem; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .vz-grid-5 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .vz-grid-5 { grid-template-columns: repeat(5, 1fr); } }

        .vz-flex-col { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; }
        .vz-flex-responsive { display: flex; flex-direction: column; gap: 1.5rem; align-items: stretch; }
        @media (min-width: 1024px) { .vz-flex-responsive { flex-direction: row; align-items: center; justify-content: space-between; } }
        .vz-flex-1 { flex: 1; width: 100%; }

        /* Specific Diagram Boxes */
        .vz-box-outline { position: relative; padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
        .vz-box-title { position: absolute; top: -10px; left: 20px; background: #030406; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 8px; border-radius: 4px; }
        
        /* Node Cards */
        .vz-node { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.3s ease; position: relative; overflow: hidden; width: 100%; }
        .vz-node:hover { transform: translateY(-3px) scale(1.02); }
        .vz-node-icon { margin-bottom: 12px; position: relative; z-index: 2; }
        .vz-node-title { font-size: 0.875rem; font-weight: 700; margin: 0 0 4px 0; position: relative; z-index: 2; color: #fff; }
        .vz-node-desc { font-size: 0.6875rem; opacity: 0.7; margin: 0; line-height: 1.5; position: relative; z-index: 2; }
        
        /* Node Colors */
        .vz-node-cyan { background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.3); color: #00e5ff; box-shadow: 0 0 20px rgba(0, 229, 255, 0.05); }
        .vz-node-purple { background: rgba(168, 85, 247, 0.05); border-color: rgba(168, 85, 247, 0.3); color: #a855f7; box-shadow: 0 0 20px rgba(168, 85, 247, 0.05); }
        .vz-node-amber { background: rgba(255, 170, 0, 0.05); border-color: rgba(255, 170, 0, 0.3); color: #ffaa00; box-shadow: 0 0 20px rgba(255, 170, 0, 0.05); }
        .vz-node-emerald { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3); color: #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.05); }
        .vz-node-zinc { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #d4d4d8; }

        .vz-split-box { display: flex; gap: 1rem; width: 100%; justify-content: center; margin: 1.5rem 0; }
        .vz-mini-card { padding: 16px; border-radius: 12px; text-align: center; width: 48%; }
        
        .vz-btn-return { display: inline-flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; text-decoration: none; transition: color 0.2s; }
        .vz-btn-return:hover { color: #00e5ff; }
      `}</style>

      {/* 🌌 CSS COSMIC BACKGROUND LAYER */}
      <div className="vz-bg-layer">
        <div className="vz-nebula-cyan"></div>
        <div className="vz-nebula-amber"></div>
        <div className="vz-nebula-purple"></div>
        <div className="vz-grid-overlay"></div>
      </div>

      <div className="vz-container">
        
        {/* HERO HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="vz-text-center" style={{ marginBottom: '100px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '50px', border: '1px solid rgba(255,170,0,0.3)', background: 'rgba(255,170,0,0.1)', color: '#ffaa00', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
            <Hexagon size={14} style={{ animation: 'spin 4s linear infinite' }} /> BYOC Infrastructure Core
          </div>
          <h1 className="vz-hero-title">
            The Architecture of <span className="vz-gradient-text">VELZION</span>
          </h1>
          <p className="vz-hero-subtitle">
            A deep-dive analysis into our decoupled High-Level and Low-Level internal developer mechanics. Control plane intelligence combined with sovereign data execution.
          </p>
        </motion.div>

        {/* ========================================================= */}
        {/* SYSTEM LAYER 1: SYSTEM ARCHITECTURE                       */}
        {/* ========================================================= */}
        <section className="vz-mb-large">
          <SectionHeader number={1} title="Enterprise GitOps Systems Architecture" subtitle="Mapping out the pipeline interaction between developer commits, React management consoles, and automated infrastructure engines." />
          
          <div className="vz-glass-panel">
            <div className="vz-grid-3">
              {/* Left Stack: Git Ingestion */}
              <div className="vz-flex-col">
                <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', color: '#71717a', textTransform: 'uppercase', marginBottom: '8px' }}>Source Control</div>
                <NodeCard icon={Terminal} title="Developer Workspace" desc="Pushes application manifests & configurations" color="zinc" />
                <ArrowDown size={24} className="vz-flow-down" style={{ color: '#00e5ff' }} />
                <NodeCard icon={GitBranch} title="Source Repository" desc="Fires real-time webhook payload events" color="zinc" />
                <ArrowDown size={24} className="vz-flow-down" style={{ color: '#00e5ff' }} />
                <NodeCard icon={GitPullRequest} title="CI Build Engine" desc="Compiles code artifacts & structural checks" color="zinc" />
              </div>

              {/* Center Stack: Control Plane Core */}
              <div className="vz-box-outline" style={{ borderColor: 'rgba(0, 229, 255, 0.3)', background: 'rgba(0, 229, 255, 0.05)' }}>
                <span className="vz-box-title" style={{ color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.3)' }}>Velzion Logic</span>
                <div className="vz-flex-col" style={{ paddingTop: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                    <NodeCard icon={Layout} title="React UI Portal" desc="Admin Console" color="cyan" />
                    <NodeCard icon={Server} title="Django Backend" desc="API Gateway" color="cyan" />
                  </div>
                  <NodeCard icon={Workflow} title="n8n Orchestration" desc="Manages payload queues & routing logic" color="purple" />
                  <NodeCard icon={Database} title="System Postgres" desc="Stores state, users & audit logs" color="zinc" />
                </div>
              </div>

              {/* Right Stack: Target Cloud Environment */}
              <div className="vz-box-outline" style={{ borderColor: 'rgba(255, 170, 0, 0.3)', background: 'rgba(255, 170, 0, 0.05)' }}>
                <span className="vz-box-title" style={{ color: '#ffaa00', border: '1px solid rgba(255, 170, 0, 0.3)' }}>Customer Cloud (BYOC)</span>
                <div className="vz-flex-col" style={{ paddingTop: '10px' }}>
                  <NodeCard icon={Cloud} title="Velzard Production Engine" desc="Deploys persistent scalable EKS nodes" color="amber" />
                  <ArrowDown size={24} className="vz-flow-down" style={{ color: '#ffaa00' }} />
                  <NodeCard icon={Zap} title="Zegion Preview Engine" desc="Spins up short-lived cost-effective Spot Instances" color="purple" />
                </div>
              </div>
            </div>
          </div>

          <ExplanationBlock title="Data Flow Analysis" color="cyan">
            <p>The Developer pushes code to the <strong>Source Repository</strong>, automatically triggering a webhook payload event. The <strong>n8n Orchestrator</strong> catches this event and validates the payload contract with the <strong>Django Backend</strong>. Once verified, the Orchestrator initiates Terraform provisioning, crossing the boundary into the customer's AWS account to spin up either a persistent <strong>Velzard Production Node</strong> or an ephemeral <strong>Zegion Spot Instance</strong>.</p>
          </ExplanationBlock>
        </section>

        {/* ========================================================= */}
        {/* SYSTEM LAYER 2: HIGH-LEVEL DESIGN (HLD Execution Flow)   */}
        {/* ========================================================= */}
        <section className="vz-mb-large">
          <SectionHeader number={2} title="High-Level Design (HLD): Microservice Routing" subtitle="The linear transactional sequence executing inside the microservices array during an active production or staging deployment." />
          
          <div className="vz-flex-col vz-glass-panel" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px' }}>
            <NodeCard icon={Terminal} title="Developer Request" desc="Triggers state build" color="zinc" />
            <ArrowDown size={24} className="vz-flow-down" style={{ color: '#00e5ff' }} />
            
            <NodeCard icon={Lock} title="Authentication Microservice" desc="Evaluates Auth credentials & issues safe JWT tokens" color="cyan" />
            <ArrowDown size={24} className="vz-flow-down" style={{ color: '#00e5ff' }} />
            
            <NodeCard icon={Database} title="Project Service" desc="Validates target repo access & isolates frameworks" color="cyan" />
            <ArrowDown size={24} className="vz-flow-down" style={{ color: '#00e5ff' }} />
            
            <NodeCard icon={Network} title="Deployment Pipeline Service" desc="Initializes execution queues & processes data payloads" color="cyan" />
            
            {/* Split Route */}
            <div className="vz-split-box">
              <div className="vz-mini-card" style={{ background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)' }}>
                <Server size={20} style={{ color: '#ffaa00', margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Velzard Router</div>
              </div>
              <div className="vz-mini-card" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <Zap size={20} style={{ color: '#a855f7', margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Zegion Router</div>
              </div>
            </div>

            <ArrowDown size={24} className="vz-flow-down" style={{ color: '#ffaa00' }} />
            <NodeCard icon={Cpu} title="Terraform Orchestrator" desc="Translates requests into structural cloud state maps" color="amber" />
            <ArrowDown size={24} className="vz-flow-down" style={{ color: '#10b981' }} />
            <NodeCard icon={Cloud} title="Sovereign AWS Cloud" desc="Final cluster infrastructure initialized successfully" color="emerald" />
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <ExplanationBlock title="Microservice Handoff" color="cyan">
              <p>Every deployment request enters the pipeline through the <strong>Authentication Service</strong>, checking the active JWT token. The request drops into the <strong>Project Service</strong> to ensure GitHub access is permitted, then reaches the <strong>Deployment Router</strong>. The router determines if this is a PR preview or a Main Branch push, splitting the traffic between the Zegion or Velzard logic trees before handing the final blueprint off to the <strong>Terraform Orchestrator</strong>.</p>
            </ExplanationBlock>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SYSTEM LAYER 3: LEVEL-0 DATA FLOW DIAGRAM (DFD)           */}
        {/* ========================================================= */}
        <section className="vz-mb-large">
          <SectionHeader number={3} title="Data Flow Diagram (DFD Level-0)" subtitle="Isolating how systemic access tokens, telemetry metadata, and server infrastructure interact across administrative boundaries." />
          
          <div className="vz-glass-panel" style={{ padding: '30px' }}>
            <div className="vz-grid-4">
              <div className="vz-node vz-node-cyan" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#00e5ff', textTransform: 'uppercase', marginBottom: '8px' }}>0.1 Core Engine</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Velzion Orchestrator</p>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Secure centralized relay mapping system configuration parameters.</p>
              </div>
              <div className="vz-node vz-node-purple" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#a855f7', textTransform: 'uppercase', marginBottom: '8px' }}>0.2 Code Provider</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>GitHub API Sync</p>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Passes validation webhooks, commit hashes, and cryptographic signatures.</p>
              </div>
              <div className="vz-node vz-node-amber" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#ffaa00', textTransform: 'uppercase', marginBottom: '8px' }}>0.3 Compute Target</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>AWS STS Token Hub</p>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Generates lease-based temporary credentials via AssumeRole policies.</p>
              </div>
              <div className="vz-node vz-node-emerald" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>0.4 Notification Relay</div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>Telemetry Alerting</p>
                <p style={{ fontSize: '11px', opacity: 0.7, margin: 0 }}>Dispatches environment health metrics and live logs to the viewport.</p>
              </div>
            </div>
          </div>

          <ExplanationBlock title="External Entity Interaction" color="purple">
            <p>The <strong>Velzion Orchestrator (0.1)</strong> acts as the central brain. It receives OAuth tokens and source code from the <strong>GitHub API (0.2)</strong>. To interact with the client's cloud, it passes an integration token to the <strong>AWS STS Hub (0.3)</strong>, which generates temporary, secure cryptographic keys utilizing `AssumeRole`. Once infrastructure is live, OTLP data is sent back out to the <strong>Notification Relay (0.4)</strong> for real-time dashboard updates.</p>
          </ExplanationBlock>
        </section>

        {/* ========================================================= */}
        {/* SYSTEM LAYER 4: LOW-LEVEL DESIGN (LLD Backend Caching)    */}
        {/* ========================================================= */}
        <section className="vz-mb-large">
          <SectionHeader number={4} title="Low-Level Design (LLD): Non-Blocking Task Broker" subtitle="Preventing main-thread request blockages during multi-minute cloud provisioning tasks via distributed asynchronous execution workers." />
          
          <div className="vz-glass-panel" style={{ padding: '30px' }}>
            <div className="vz-flex-responsive">
              <div className="vz-node vz-node-cyan vz-flex-1">
                <Server size={20} style={{ color: '#00e5ff', marginBottom: '12px' }} />
                <h4 className="vz-node-title">Django API Layer</h4>
                <p className="vz-node-desc">Intercepts raw client requests and saves metadata immediately.</p>
              </div>
              
              <ArrowRight size={24} className="vz-flow-right" style={{ color: '#00e5ff' }} />
              
              <div className="vz-node vz-node-purple vz-flex-1">
                <Database size={20} style={{ color: '#a855f7', marginBottom: '12px' }} />
                <h4 className="vz-node-title">Redis Task Broker</h4>
                <p className="vz-node-desc">Memory cache layer holding high-priority packets in queues.</p>
              </div>

              <ArrowRight size={24} className="vz-flow-right" style={{ color: '#a855f7' }} />

              <div className="vz-node vz-node-emerald vz-flex-1">
                <Cpu size={20} style={{ color: '#10b981', marginBottom: '12px' }} />
                <h4 className="vz-node-title">Celery Worker Engines</h4>
                <p className="vz-node-desc">Independent background workers executing heavy CLI operations.</p>
              </div>
            </div>
          </div>

          <ExplanationBlock title="Asynchronous Execution" color="emerald">
            <p>Terraform provisioning can take upwards of 5 minutes, which would cause an HTTP timeout if executed synchronously. The <strong>Django API Layer</strong> solves this by instantly accepting the request, logging the "Pending" state in Postgres, and dispatching a tiny data packet to the <strong>Redis Task Broker</strong>. Distributed <strong>Celery Workers</strong> actively listen to this Redis queue, pulling jobs off the stack and executing the heavy Terraform CLI commands in the background without blocking the main web server.</p>
          </ExplanationBlock>
        </section>

        {/* ========================================================= */}
        {/* SYSTEM LAYER 5: ZEGION PREVIEW ENVIRONMENT LIFECYCLE     */}
        {/* ========================================================= */}
        <section className="vz-mb-large" style={{ marginBottom: '60px' }}>
          <SectionHeader number={5} title="Zegion Ephemeral Environment Lifecycle" subtitle="Autonomous staging isolation loop that tracks code updates and forces automatic hardware teardown to preserve operational costs." />
          
          <div className="vz-glass-panel" style={{ padding: '30px' }}>
            <div className="vz-grid-5">
              <NodeCard icon={GitPullRequest} title="1. PR Creation" desc="Source Webhook fires automated signals" color="zinc" />
              <NodeCard icon={Workflow} title="2. Orchestration" desc="n8n engine parses metadata configurations" color="cyan" />
              <NodeCard icon={Cpu} title="3. IaC Apply" desc="Terraform reserves AWS Spot capacity" color="amber" />
              <NodeCard icon={Shield} title="4. Live Sandbox" desc="Preview URL auto-comments onto PR" color="emerald" />
              <NodeCard icon={Zap} title="5. Auto Cleanup" desc="Closing PR triggers infrastructure teardown" color="purple" />
            </div>
          </div>

          <ExplanationBlock title="The Lifecycle Engine" color="amber">
            <p>This flow represents Velzion's massive cost-saving advantage. When a <strong>PR is Created</strong>, the automation engine spins up a highly affordable, interruptible <strong>AWS Spot Instance</strong> instead of expensive persistent compute. The system generates a live <strong>Live Sandbox URL</strong> directly inside the GitHub conversation. Crucially, the moment the <strong>PR is Closed or Merged</strong>, the system triggers an immediate Terraform destroy command, entirely wiping the environment and halting cloud billing instantly.</p>
          </ExplanationBlock>
        </section>

        {/* FOOTER CTA */}
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
          <Link to="/" className="vz-btn-return">
            Return to Terminal Workspace <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
