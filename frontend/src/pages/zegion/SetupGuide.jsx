import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  GitBranch, 
  Key, 
  Rocket, 
  CheckCircle2, 
  Copy,
  FileCode2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// DATA: Setup Steps
// ----------------------------------------------------------------------
const steps = [
  {
    id: 'repo',
    title: 'Connect Repository',
    icon: GitBranch,
    description: 'Link your GitHub or GitLab repository to the Velzion control plane. We will automatically install the webhook required to listen for Pull Request events.',
    code: null
  },
  {
    id: 'config',
    title: 'Define Infrastructure',
    icon: FileCode2,
    description: 'Add a zegion.yml file to the root of your repository. This declarative file tells the engine exactly how to provision and compile your ephemeral environment.',
    code: `version: "2.0"
engine: zegion
build:
  command: "npm run build"
  output_dir: "dist"
infrastructure:
  instance_type: "t4g.small" # Graviton preferred
  isolation: true
  auto_sleep: 3600 # seconds of inactivity`
  },
  {
    id: 'secrets',
    title: 'Configure IAM Bindings',
    icon: Key,
    description: 'Navigate to the IAM Bindings tab in your Dashboard to map your AWS AssumeRole ARN. This grants secure, temporary access to provision resources in your VPC.',
    code: null
  },
  {
    id: 'deploy',
    title: 'Trigger Deployment',
    icon: Rocket,
    description: 'Open a new Pull Request. The orchestration engine will intercept the webhook, compile the Terraform state, and attach an isolated DNS endpoint to your PR comments.',
    code: null
  }
];

// ----------------------------------------------------------------------
// FRAMER MOTION: Abstract Ambient Background
// ----------------------------------------------------------------------
const AmbientGlowBackground = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#030303' }} />
    <motion.div 
      animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(157, 78, 221, 0.15) 0%, transparent 60%)', filter: 'blur(80px)' }}
    />
    <motion.div 
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 70%)', filter: 'blur(100px)' }}
    />
  </div>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function SetupGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%', paddingBottom: '4rem' }}>
      <AmbientGlowBackground />

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(217, 70, 239, 0.1)', border: '1px solid rgba(217, 70, 239, 0.3)', borderRadius: 'var(--radius-md)', color: '#e879f9', boxShadow: 'inset 0 0 15px rgba(217, 70, 239, 0.1)' }}>
            <Terminal size={32} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-pure)' }}>
              Configuration Guide
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '700px' }}>
              Follow these steps to initialize the orchestration engine and enable automated ephemeral environments for your application.
            </p>
          </div>
        </motion.div>

        {/* Interactive Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Step Navigation Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: '0 0 1rem 0', paddingLeft: '0.5rem' }}>Deployment Pipeline</h3>
            
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const StepIcon = isCompleted ? CheckCircle2 : step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem 1rem',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'rgba(217, 70, 239, 0.1)' : 'transparent',
                    border: '1px solid transparent',
                    color: isActive ? 'var(--text-pure)' : isCompleted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease-in-out',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isCompleted ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)';
                    }
                  }}
                >
                  {/* Neon Active Indicator */}
                  {isActive && (
                    <motion.div layoutId="activeStepIndicator" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#e879f9', boxShadow: '0 0 15px #e879f9' }} />
                  )}
                  
                  <StepIcon size={20} style={{ color: isActive ? '#e879f9' : isCompleted ? '#34d399' : 'inherit', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: isActive ? 700 : 600 }}>{step.title}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Step Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ padding: '3.5rem', minHeight: '500px', position: 'relative', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#e879f9', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', background: 'rgba(217, 70, 239, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(217, 70, 239, 0.2)' }}>
                  Step 0{activeStep + 1}
                </div>
                
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem' }}>
                  {steps[activeStep].title}
                </h2>
                
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  {steps[activeStep].description}
                </p>

                {/* Simulated IDE Terminal */}
                {steps[activeStep].code && (
                  <div style={{ position: 'relative', marginTop: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f111a', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', marginLeft: '1rem' }}>zegion.yml</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(steps[activeStep].code)}
                        style={{ color: copied ? '#34d399' : 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy Code'}
                      </button>
                    </div>
                    <pre style={{ margin: 0, backgroundColor: '#050608', padding: '1.5rem', overflowX: 'auto' }}>
                      <code style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {steps[activeStep].code.split('\n').map((line, i) => {
                          const isComment = line.includes('#');
                          const isKey = line.includes(':');
                          
                          // Basic Syntax Highlighting rules
                          let formattedLine = line;
                          if (isComment) {
                            return <div key={i} style={{ color: '#64748b' }}>{line}</div>;
                          } else if (isKey) {
                            const [key, value] = line.split(':');
                            return (
                              <div key={i}>
                                <span style={{ color: '#e879f9' }}>{key}</span>:
                                <span style={{ color: value?.includes('"') ? '#34d399' : '#60a5fa' }}>{value}</span>
                              </div>
                            );
                          }
                          return <div key={i} style={{ color: '#e2e8f0' }}>{line}</div>;
                        })}
                      </code>
                    </pre>
                  </div>
                )}

                {/* Navigation Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-pure)', fontSize: '0.95rem', fontWeight: 600, opacity: activeStep === 0 ? 0.3 : 1, cursor: activeStep === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { if (activeStep !== 0) e.currentTarget.style.color = '#e879f9'; }}
                    onMouseLeave={(e) => { if (activeStep !== 0) e.currentTarget.style.color = 'var(--text-pure)'; }}
                  >
                    Back
                  </button>
                  
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-pure)', color: '#030303', padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(255,255,255,0.1)'; }}
                    >
                      Next Step <ArrowRight size={18} />
                    </button>
                  ) : (
                    <Link
                      to="/zegion/dashboard"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--zg-purple-core) 0%, #d946ef 100%)', color: 'var(--text-pure)', padding: '0.85rem 1.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(217,70,239,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px rgba(217,70,239,0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(217,70,239,0.3)'; }}
                    >
                      Complete Setup <Rocket size={18} />
                    </Link>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}