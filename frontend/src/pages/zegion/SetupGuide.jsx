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

const springCrisp = { type: "spring", stiffness: 450, damping: 32, mass: 0.8 };
const springPage = { type: "spring", stiffness: 280, damping: 28 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

const steps = [
  {
    id: 'repo',
    title: 'Connect Repository',
    icon: GitBranch,
    description: 'Link your GitHub or GitLab repository to the Velzion control plane. We will automatically install the Zegion Webhook to listen for Pull Request events.',
    code: null
  },
  {
    id: 'config',
    title: 'Define Infrastructure',
    icon: FileCode2,
    description: 'Add a zegion.yml file to the root of your repository. This declarative file tells the engine exactly how to compile your preview environment.',
    code: `version: "2.0"\nengine: zegion\nbuild:\n  command: "npm run build"\n  output_dir: "dist"\ninfrastructure:\n  instance_type: "t4g.small" # Graviton preferred\n  isolation: true\n  auto_sleep: 3600 # seconds of inactivity`
  },
  {
    id: 'secrets',
    title: 'Inject Secure Vaults',
    icon: Key,
    description: 'Navigate to the IAM Bindings tab in your Zegion Dashboard to map your AWS AssumeRole ARN. Set any environment variables required for the build phase.',
    code: null
  },
  {
    id: 'deploy',
    title: 'Trigger First Preview',
    icon: Rocket,
    description: 'Open a new Pull Request. Zegion will intercept the webhook, compile the Terraform state, and attach an ephemeral DNS endpoint to your PR comments.',
    code: null
  }
];

export default function SetupGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={springPage} className="glass-panel" style={{ padding: '2rem 3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--zg-purple-glow)', border: '1px solid var(--zg-purple-border)', borderRadius: 'var(--radius-md)', color: 'var(--zg-purple-core)' }}>
          <Terminal size={32} strokeWidth={1.5} />
        </div>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-pure)', letterSpacing: '-0.02em' }}>
            Zegion Setup Guide
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>
            Configure your application to utilize ephemeral preview environments. Follow these phases to initialize the orchestration engine.
          </p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const StepIcon = isCompleted ? CheckCircle2 : step.icon;

            return (
              <motion.button variants={itemVariants} key={step.id} onClick={() => setActiveStep(index)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', width: '100%', textAlign: 'left', borderRadius: 'var(--radius-sm)', backgroundColor: isActive ? 'var(--zg-purple-glow)' : 'transparent', border: `1px solid ${isActive ? 'var(--zg-purple-border)' : 'transparent'}`, color: isActive ? 'var(--text-pure)' : isCompleted ? 'var(--text-muted)' : 'var(--text-muted)', transition: 'all var(--transition-fast)' }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-layer-2)'; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {isActive && <motion.div layoutId="activeStepPillZegion" transition={springCrisp} style={{ position: 'absolute', inset: 0, background: 'var(--zg-purple-glow)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--zg-purple-border)', zIndex: 0 }} />}
                <StepIcon size={18} strokeWidth={1.5} style={{ color: isActive ? 'var(--zg-purple-core)' : isCompleted ? '#10b981' : 'inherit', zIndex: 1 }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600, zIndex: 1 }}>{step.title}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="show" className="glass-panel" style={{ padding: '3rem', minHeight: '400px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, var(--zg-purple-glow) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
          
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={springCrisp} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--zg-purple-core)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Phase 0{activeStep + 1}
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1rem' }}>
                {steps[activeStep].title}
              </h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {steps[activeStep].description}
              </p>

              {steps[activeStep].code && (
                <div style={{ position: 'relative', marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-layer-2)', padding: '0.5rem 1rem', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', borderBottom: 'none' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>zegion.yml</span>
                    <button onClick={() => handleCopy(steps[activeStep].code)} style={{ color: copied ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, transition: 'color var(--transition-fast)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      {copied ? <CheckCircle2 size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, backgroundColor: 'var(--bg-void)', padding: '1.5rem', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-pure)', whiteSpace: 'pre-wrap' }}>
                      {steps[activeStep].code.split('\n').map((line, i) => {
                        const isComment = line.includes('#');
                        return (
                          <div key={i} style={{ color: isComment ? 'var(--text-muted)' : 'inherit' }}>
                            {line}
                          </div>
                        );
                      })}
                    </code>
                  </pre>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: 'var(--border-subtle)' }}>
                <button onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} disabled={activeStep === 0} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, opacity: activeStep === 0 ? 0.3 : 1, cursor: activeStep === 0 ? 'not-allowed' : 'pointer', transition: 'color var(--transition-fast)' }} onMouseEnter={(e) => { if (activeStep !== 0) e.currentTarget.style.color = 'var(--text-pure)'; }} onMouseLeave={(e) => { if (activeStep !== 0) e.currentTarget.style.color = 'var(--text-muted)'; }}>
                  Previous Phase
                </button>
                
                {activeStep < steps.length - 1 ? (
                  <button onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-pure)', border: 'none', color: 'var(--bg-void)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 700, transition: 'opacity var(--transition-fast)', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    Next Phase <ArrowRight size={16} strokeWidth={1.5} />
                  </button>
                ) : (
                  <Link to="/zegion/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--zg-purple-core)', color: 'var(--text-pure)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 700, transition: 'opacity var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    Launch Dashboard <Rocket size={16} strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}