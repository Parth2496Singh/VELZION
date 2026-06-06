import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

// --- AXIOS CONFIGURATION (Preserved exactly as requested) ---
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth`;

// ----------------------------------------------------------------------
// 🌌 FRAMER MOTION COMPONENT: Lightweight Cryptographic Core
// Replaces heavy WebGL/Three.js with pure CSS physics
// ----------------------------------------------------------------------
const CryptographicCore = () => (
  <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem auto' }}>
    {/* Outer Orbit */}
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      style={{ position: 'absolute', inset: -10, border: '1px solid var(--vz-gold-border)', borderRadius: '50%', opacity: 0.5 }}
    />
    {/* Inner Distorted Ring */}
    <motion.div
      animate={{ rotate: -360, scale: [1, 1.15, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ position: 'absolute', inset: 0, border: '2px dashed var(--zg-purple-core)', borderRadius: '50%', opacity: 0.8 }}
    />
    {/* Core Glow */}
    <motion.div 
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, var(--zg-purple-core) 0%, transparent 70%)', filter: 'blur(12px)', borderRadius: '50%' }} 
    />
    {/* Icon Anchor */}
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
      <Lock size={28} style={{ color: 'var(--text-pure)' }} />
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 🔐 MAIN LOGIN COMPONENT
// ----------------------------------------------------------------------
export default function Login() {
  const [loading, setLoading] = useState(false);

  // Preserved Axios Logic
  const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/login/url/`);
      window.location.href = response.data.login_url;
    } catch (error) {
      console.error("Error fetching login URL:", error);
      alert("Failed to connect to backend.");
      setLoading(false);
    }
  };

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
      
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel"
          style={{
            padding: '3.5rem 3rem',
            width: '100%',
            maxWidth: '440px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Top Border Highlight */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--zg-purple-core), transparent)', opacity: 0.5 }} />

          <CryptographicCore />

          <h1 style={{ margin: '0 0 0.75rem 0', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-pure)' }}>
            Velzion
          </h1>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
            Zero-CI Cloud Control Plane. Authenticate to establish connection to your infrastructure.
          </p>
          
          <button 
            onClick={handleGitHubLogin} 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.1rem',
              background: 'linear-gradient(180deg, #2b3137 0%, #24292e 100%)',
              color: 'var(--text-pure)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all var(--transition-smooth)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.05)';
                e.currentTarget.style.background = 'linear-gradient(180deg, #323940 0%, #2b3137 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                e.currentTarget.style.background = 'linear-gradient(180deg, #2b3137 0%, #24292e 100%)';
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Establishing Handshake...
              </>
            ) : (
              <>
                {/* Embedded Original GitHub SVG */}
                <svg style={{ width: '22px', height: '22px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <ShieldCheck size={14} style={{ color: 'var(--zg-purple-core)' }} /> Enterprise-grade keyless infrastructure
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}