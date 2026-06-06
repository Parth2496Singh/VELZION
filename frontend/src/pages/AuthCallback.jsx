import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- 🆕 FRAMER MOTION & LUCIDE ICONS ---
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Key, ShieldCheck, Database } from 'lucide-react';

// --- 🆕 REACT THREE FIBER (3D ENGINE) ---
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, TorusKnot } from '@react-three/drei';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth`;

// ----------------------------------------------------------------------
// 🌌 3D COMPONENT: Cryptographic Handshake Node
// ----------------------------------------------------------------------
const DecryptionCore = ({ statusStep }) => {
  const knotRef = useRef();

  // The rotation speed reacts dynamically to the authentication state
  useFrame((state, delta) => {
    if (knotRef.current) {
      const baseSpeed = statusStep === 'success' ? 0.5 : statusStep === 'error' ? 0.1 : 2.5;
      knotRef.current.rotation.x += delta * baseSpeed;
      knotRef.current.rotation.y += delta * (baseSpeed * 0.8);
      knotRef.current.rotation.z -= delta * (baseSpeed * 0.5);
    }
  });

  // Dynamic Color Mapping based on Auth Status
  const coreColor = statusStep === 'success' ? '#00ff9d' : statusStep === 'error' ? '#ff0055' : '#00e5ff';
  const emissiveColor = statusStep === 'success' ? '#006633' : statusStep === 'error' ? '#660022' : '#0044ff';

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <TorusKnot ref={knotRef} args={[1, 0.3, 128, 32]} scale={1.2}>
        <MeshDistortMaterial 
          color={coreColor} 
          emissive={emissiveColor}
          emissiveIntensity={1.5}
          wireframe={statusStep === 'processing'} 
          distort={statusStep === 'processing' ? 0.6 : 0.1} 
          speed={statusStep === 'processing' ? 4 : 1} 
          roughness={0.2}
          metalness={0.8}
        />
      </TorusKnot>
    </Float>
  );
};

// ----------------------------------------------------------------------
// 🔐 MAIN CALLBACK COMPONENT
// ----------------------------------------------------------------------
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Advanced Visual State Machine: 'processing' | 'success' | 'error'
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
          setTimeout(() => navigate('/dashboard'), 1500);
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

  // [Part 2 will contain the massive CSS grid, R3F Canvas, and Framer Layout...]
  return (
    <div className={`vz-auth-callback-gateway state-${authStep}`}>
      <style>{`
        /* ==========================================================================
           ⚡ VELZION CALLBACK & DECRYPTION ENGINE
           ========================================================================== */
        
        :root {
          --bg-deep: #020203;
          --glass-surface: rgba(10, 12, 16, 0.6);
          --glass-border: rgba(255, 255, 255, 0.05);
          
          /* Dynamic State Colors (CSS Vars updated by class) */
          --state-color: #00e5ff;
          --state-glow: rgba(0, 229, 255, 0.2);
        }

        /* State Modifiers */
        .state-success { --state-color: #00ff9d; --state-glow: rgba(0, 255, 157, 0.2); }
        .state-error { --state-color: #ff0055; --state-glow: rgba(255, 0, 85, 0.2); }

        body {
          margin: 0;
          background-color: var(--bg-deep);
          color: #ffffff;
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden;
        }

        /* --- 🌌 THE NEURAL GRID --- */
        .vz-auth-callback-gateway {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          transition: all 0.8s ease;
          z-index: 1;
        }

        /* State-Reactive Ambient Glow */
        .vz-auth-callback-gateway::before {
          content: '';
          position: absolute;
          width: 800px; height: 800px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--state-glow) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(100px);
          z-index: -2;
          pointer-events: none;
          transition: background 0.8s ease;
          animation: pulseCore 4s infinite alternate ease-in-out;
        }

        @keyframes pulseCore {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }

        /* --- 🛑 R3F CANVAS --- */
        .vz-decryption-canvas {
          position: absolute !important;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        /* --- 🧊 HUD GLASS TERMINAL --- */
        .vz-hud-terminal {
          background: var(--glass-surface);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--state-color);
          box-shadow: 0 0 40px var(--state-glow), inset 0 0 20px rgba(255,255,255,0.02);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 500px;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Top Bar Scanning Line */
        .vz-hud-terminal::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--state-color), transparent);
          animation: scanLine 2s infinite linear;
        }

        @keyframes scanLine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .vz-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #fff;
          margin-top: 24px;
          line-height: 1.6;
        }
      `}</style>

      {/* 🛑 The WebGL 3D Decryption Node 🛑 */}
      <Canvas className="vz-decryption-canvas" camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <DecryptionCore statusStep={authStep} />
        <Environment preset="city" />
      </Canvas>

      {/* 🛑 The Framer Motion HUD 🛑 */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={authStep}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="vz-hud-terminal"
        >
          {/* Dynamic Icon based on state */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--state-color)' }}
          >
            {authStep === 'processing' && <Loader2 size={48} className="animate-spin" style={{ animation: 'spin 3s linear infinite' }} />}
            {authStep === 'success' && <ShieldCheck size={48} />}
            {authStep === 'error' && <XCircle size={48} />}
          </motion.div>

          {/* Dynamic Header */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>
            {authStep === 'processing' && 'Establishing Connection'}
            {authStep === 'success' && 'Authentication Verified'}
            {authStep === 'error' && 'Security Breach Detected'}
          </h2>

          {/* Typing Effect for Status Message */}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'left' }}>
            <Key size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
            <p className="vz-status-text" style={{ margin: 0 }}>
              <span style={{ color: 'var(--state-color)', marginRight: '8px' }}>&gt;</span>
              {statusMessage}
            </p>
          </div>

          {/* Sub-Telemetry (Mocking terminal output for aesthetics) */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              <Database size={14} /> Velzion Core v2.4.1
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--state-color)', textTransform: 'uppercase', fontWeight: 800 }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--state-color)', boxShadow: '0 0 8px var(--state-glow)' }}></span>
              {authStep === 'processing' ? 'Syncing...' : authStep === 'success' ? 'Connected' : 'Offline'}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthCallback;