import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CloudCog, 
  Server, 
  ExternalLink, 
  Loader2, 
  Hexagon, 
  ArrowLeft 
} from 'lucide-react';
import axios from 'axios';

export default function IamLogin() {
  const navigate = useNavigate();
  
  // Decoupled Component State
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [iamStatus, setIamStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'
  
  // Mock Data (Replace with your global context or query params if needed)
  const currentWorkspace = "velzion-init-workspace";
// Replace the old cfnLink variable with this:
  const cfnLink = "https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=https://velzion-public-templates-12345.s3.us-east-1.amazonaws.com/velzion-trust.yaml&stackName=Velzion-Integration";

  // Your Axios Integration Handler goes here
  const handleSaveIntegration = async (e) => {
    e.preventDefault();
    setIamStatus('saving');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/bind_iam/`, { arn: iamRoleArn }, { withCredentials: true });
      
      localStorage.setItem('velzion_iam_connected', 'true');
      setIamStatus('success');
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Binding failed", error);
      setIamStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      position: 'relative',
      zIndex: 10
    }}>
      
      {/* Back Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '850px', marginBottom: '2rem' }}
      >
        <button onClick={() => navigate(-1)} style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 500,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-pure)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} /> Return to Velzion
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel spotlight-card" 
        style={{ padding: '3.5rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '850px' }}
      >
        {/* Header */}
        <h2 style={{ 
          marginTop: 0, 
          color: 'var(--text-pure)', 
          fontSize: '2.25rem', 
          marginBottom: '1rem', 
          fontWeight: 800, 
          letterSpacing: '-0.02em', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem' 
        }}>
          <Shield size={36} style={{ color: 'var(--zg-purple-core)', filter: 'drop-shadow(0 0 12px var(--zg-purple-glow))' }} /> 
          Security & IAM Bindings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.7', maxWidth: '700px' }}>
          Grant the Velzion Engine secure, temporary access to provision environments in your AWS account using a keyless AssumeRole architecture.
        </p>

        {/* ARCHITECTURE DIAGRAM */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'var(--bg-glass)', 
          padding: '2rem 3rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px dashed var(--zg-purple-border)', 
          marginBottom: '3rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(245, 203, 92, 0.1)', border: '2px solid var(--vz-gold-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <CloudCog size={32} style={{ color: 'var(--vz-gold-core)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)' }}>Velzion Engine</p>
          </div>
          
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--vz-gold-core), var(--zg-purple-core))', margin: '0 24px', position: 'relative' }}>
            <motion.div 
              animate={{ x: ['0%', '100%'] }} 
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} 
              style={{ position: 'absolute', top: '-4px', left: 0, width: '10px', height: '10px', background: 'var(--text-pure)', borderRadius: '50%', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} 
            />
            <p style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
              AssumeRole (STS)
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(157, 78, 221, 0.1)', border: '2px solid var(--zg-purple-core)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Server size={32} style={{ color: 'var(--zg-purple-core)' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)' }}>Your AWS VPC</p>
          </div>
        </div>

        {/* STEP 1 */}
        <div style={{ backgroundColor: 'var(--bg-glass)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--vz-gold-core)' }}></div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-pure)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700 }}>
            <span style={{ background: 'var(--vz-gold-glow)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>STEP 1</span> 
            Deploy Trust Policy
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '700px' }}>
            Launch our verified CloudFormation template. This provisions a secure <code style={{ color: 'var(--vz-gold-core)', background: 'rgba(245, 203, 92, 0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>VelzionExecutionRole</code> with strict least-privilege access tied exclusively to your repository infrastructure.
          </p>
          <a href={cfnLink} target="_blank" rel="noreferrer" style={{ background: 'var(--text-pure)', color: 'var(--bg-void)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', transition: 'all var(--transition-fast)' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Launch AWS CloudFormation <ExternalLink size={16} />
          </a>
        </div>

        {/* STEP 2 */}
        <div style={{ backgroundColor: 'var(--bg-glass)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: 'var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--zg-purple-core)' }}></div>
          <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-pure)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700 }}>
            <span style={{ background: 'var(--zg-purple-glow)', color: 'var(--zg-purple-core)', border: '1px solid var(--zg-purple-border)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>STEP 2</span> 
            Bind Credentials
          </h4>
          
          <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: 'var(--border-subtle)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Targeting Workspace:</span>
              <span style={{ color: 'var(--text-pure)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hexagon size={16} style={{ color: 'var(--vz-gold-core)' }} /> {currentWorkspace}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assumed AWS Role ARN (Output from Step 1)</label>
              <input 
                type="text" 
                value={iamRoleArn} 
                onChange={(e) => setIamRoleArn(e.target.value)} 
                placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" 
                required 
                style={{ 
                  background: 'var(--bg-void)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: 'var(--text-pure)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-sm)', 
                  outline: 'none', 
                  width: '100%', 
                  fontSize: '1rem', 
                  fontFamily: 'monospace', 
                  transition: 'all var(--transition-fast)' 
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--zg-purple-core)'; e.target.style.boxShadow = '0 0 15px var(--zg-purple-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={iamStatus === 'saving'} 
              style={{ 
                background: 'var(--zg-purple-core)', 
                color: 'var(--text-pure)', 
                padding: '1rem 2rem', 
                borderRadius: 'var(--radius-sm)', 
                width: 'fit-content', 
                fontSize: '1rem', 
                fontWeight: 700, 
                border: 'none', 
                cursor: iamStatus === 'saving' ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                opacity: iamStatus === 'saving' ? 0.7 : 1, 
                transition: 'all var(--transition-fast)' 
              }}
            >
              {iamStatus === 'saving' ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Establishing Trust Link...</>
              ) : (
                <><Shield size={18} /> Secure Integration</>
              )}
            </button>
          </form>

          {/* Status Messages */}
          <AnimatePresence>
            {iamStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                <Shield size={20} /> Cryptographic handshake complete. Engine is authorized.
              </motion.div>
            )}
            {iamStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                <Server size={20} /> Binding failed. Validate the ARN syntax and ensure the CFN stack deployed successfully.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}