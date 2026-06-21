import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, XCircle, Key, ShieldCheck, Database } from 'lucide-react';

// --- AXIOS CONFIGURATION (Preserved exactly) ---
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth`;

// ----------------------------------------------------------------------
// 🌌 FRAMER MOTION COMPONENT: Cryptographic Handshake Node
// ----------------------------------------------------------------------
const DecryptionCore = ({ statusStep }) => {
  // Dynamic styling based on auth state
  const isProcessing = statusStep === 'processing';
  const color = statusStep === 'success' ? '#10b981' : statusStep === 'error' ? '#ef4444' : 'var(--vz-gold-core)';
  const glow = statusStep === 'success' ? 'rgba(16, 185, 129, 0.3)' : statusStep === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--vz-gold-glow)';

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem auto' }}>
      {/* Outer Rotating Ring */}
      <motion.div
        animate={{ rotate: 360, scale: isProcessing ? [1, 1.05, 1] : 1 }}
        transition={{ 
          rotate: { duration: isProcessing ? 3 : 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ position: 'absolute', inset: -10, border: `2px dashed ${color}`, borderRadius: '50%', opacity: 0.6 }}
      />
      {/* Inner Counter-Rotating Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: isProcessing ? 4 : 15, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', inset: 5, border: `1px solid ${color}`, borderRadius: '50%', opacity: 0.4 }}
      />
      {/* Ambient Core Glow */}
      <motion.div 
        animate={{ opacity: isProcessing ? [0.3, 0.7, 0.3] : 0.8 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', inset: 15, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(10px)', borderRadius: '50%' }} 
      />
      {/* Center Icon Indicator */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
        {statusStep === 'processing' && <Loader2 size={32} style={{ color, animation: 'spin 2s linear infinite' }} />}
        {statusStep === 'success' && <ShieldCheck size={32} style={{ color }} />}
        {statusStep === 'error' && <XCircle size={32} style={{ color }} />}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 🔐 MAIN CALLBACK COMPONENT
// ----------------------------------------------------------------------
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [authStep, setAuthStep] = useState('processing');
  const [statusMessage, setStatusMessage] = useState("Decrypting GitHub OAuth Payload...");
  
  const hasFetched = useRef(false);

  // --- 🛡️ UNTOUCHED AUTHENTICATION LOGIC ---
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code && !hasFetched.current) {
      hasFetched.current = true; 
      
      // Step 1: Intercept Code
      setStatusMessage("Exchanging secure token with Velzion Backend...");
      
      axios.post(`${API_URL}/callback/`, { code })
        .then(response => {
          // Step 2: Success Protocol
          setAuthStep('success');
          setStatusMessage("Handshake verified. Fetching workspace topology...");
          
          console.log("🔥 DJANGO RESPONSE:", response.data);
          
          const userData = response.data.user || response.data;
          const userRepos = response.data.repos || []; 
          
          localStorage.setItem('velzion_user', JSON.stringify(userData));
          localStorage.setItem('velzion_repos', JSON.stringify(userRepos)); 
          
          // Redirect with cinematic delay
          setTimeout(() => navigate('/zegion/dashboard'), 1500);
        })
        .catch(err => {
            // Step 3: Failure Protocol
            console.error("Auth Error:", err);
            setAuthStep('error');
            setStatusMessage("Cryptographic binding failed. Invalid code or timeout.");
            setTimeout(() => navigate('/login'), 3000);
        });
    } else if (!code) {
      setAuthStep('error');
      setStatusMessage("No authorization signature detected. Connection aborted.");
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [searchParams, navigate]);

  // Dynamic Theme Variables for the UI
  const stateColor = authStep === 'success' ? '#10b981' : authStep === 'error' ? '#ef4444' : 'var(--vz-gold-core)';

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 10
    }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={authStep}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel"
          style={{
            padding: '3.5rem 3rem',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${authStep === 'processing' ? 'var(--border-subtle)' : stateColor}`
          }}
        >
          {/* Subtle Scanning Line Effect */}
          {authStep === 'processing' && (
            <motion.div 
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', top: 0, width: '50%', height: '2px', background: `linear-gradient(90deg, transparent, ${stateColor}, transparent)` }} 
            />
          )}

          <DecryptionCore statusStep={authStep} />

          {/* Dynamic Header */}
          <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-pure)' }}>
            {authStep === 'processing' && 'Establishing Connection'}
            {authStep === 'success' && 'Authentication Verified'}
            {authStep === 'error' && 'Security Breach Detected'}
          </h2>

          {/* Terminal Status Output */}
          <div style={{ 
            background: 'var(--bg-void)', 
            border: 'var(--border-subtle)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '1.25rem', 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '1rem', 
            textAlign: 'left' 
          }}>
            <Key size={18} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-pure)', lineHeight: 1.6 }}>
              <span style={{ color: stateColor, marginRight: '0.5rem' }}>&gt;</span>
              {statusMessage}
            </p>
          </div>

          {/* Telemetry Footer */}
          <div style={{ 
            marginTop: '2.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            borderTop: 'var(--border-subtle)', 
            paddingTop: '1.5rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              <Database size={14} /> Velzion Core v2.4.1
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: stateColor, textTransform: 'uppercase', fontWeight: 700 }}>
              <motion.span 
                animate={{ opacity: authStep === 'processing' ? [0.4, 1, 0.4] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: stateColor, boxShadow: `0 0 8px ${stateColor}` }} 
              />
              {authStep === 'processing' ? 'Syncing...' : authStep === 'success' ? 'Connected' : 'Offline'}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}