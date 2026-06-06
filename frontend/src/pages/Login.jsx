import React, { useState, useRef } from 'react';
import axios from 'axios';

// --- FRAMER MOTION & LUCIDE ICONS ---
// Removed 'Github' from the import list to fix the build error
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

// --- REACT THREE FIBER (3D ENGINE) ---
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows, Sphere } from '@react-three/drei';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Note: Ensure this matches your Django urls.py for the auth app!
const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth`;

// ----------------------------------------------------------------------
// 🌌 3D COMPONENT: Cryptographic Security Core
// ----------------------------------------------------------------------
const SecurityCore = () => {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.15;
      outerRef.current.rotation.y += delta * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.3;
      innerRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={2.5}>
      {/* Outer Protective Shell */}
      <mesh ref={outerRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#00e5ff" 
          wireframe={true} 
          transparent 
          opacity={0.15} 
        />
      </mesh>
      
      {/* Inner Distorted Core */}
      <mesh ref={innerRef} scale={1.2}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial 
            color="#b366ff" 
            emissive="#4c00ff"
            emissiveIntensity={0.8}
            distort={0.5} 
            speed={3} 
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </mesh>
    </Float>
  );
};

// ----------------------------------------------------------------------
// 🔐 MAIN LOGIN COMPONENT
// ----------------------------------------------------------------------
const Login = () => {
  const [loading, setLoading] = useState(false);

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
    <div className="vz-login-gateway">
      <style>{`
        /* ==========================================================================
           🛡️ VELZION AUTHENTICATION DESIGN SYSTEM
           ========================================================================== */
        
        :root {
          --bg-deep: #020203;
          --bg-card: rgba(10, 12, 16, 0.45);
          --accent-cyan: #00e5ff;
          --accent-cyan-glow: rgba(0, 229, 255, 0.3);
          --accent-purple: #b366ff;
          --accent-purple-glow: rgba(179, 102, 255, 0.3);
          --text-main: #ffffff;
          --text-muted: #8a919e;
          --glass-border: rgba(255, 255, 255, 0.08);
          --glass-highlight: rgba(255, 255, 255, 0.15);
        }

        body {
          margin: 0;
          background-color: var(--bg-deep);
          color: var(--text-main);
          font-family: 'Inter', system-ui, sans-serif;
          overflow: hidden; 
        }

        .vz-login-gateway {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          perspective: 1000px;
          z-index: 1;
        }

        .vz-login-gateway::before, .vz-login-gateway::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: -2;
          pointer-events: none;
        }
        .vz-login-gateway::before {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: floatCore 12s infinite alternate ease-in-out;
        }
        .vz-login-gateway::after {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(179, 102, 255, 0.08) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: floatCore 18s infinite alternate-reverse ease-in-out;
        }

        @keyframes floatCore {
          0% { transform: scale(1) translate(0, 0); opacity: 0.6; }
          100% { transform: scale(1.1) translate(40px, -40px); opacity: 1; }
        }

        .vz-login-canvas {
          position: absolute !important;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .vz-auth-card {
          background: var(--bg-card);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid var(--glass-border);
          border-top: 1px solid var(--glass-highlight);
          border-radius: 24px;
          padding: 56px 48px;
          width: 100%;
          max-width: 440px;
          text-align: center;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,255,255,0.02);
          position: relative;
          overflow: hidden;
        }

        .vz-auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 100%;
          background: radial-gradient(circle at top, rgba(0, 229, 255, 0.05), transparent 60%);
          pointer-events: none;
        }

        .vz-github-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(180deg, #2b3137 0%, #24292e 100%);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          border-top: 1px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          cursor: pointer;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }

        .vz-github-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.05);
          background: linear-gradient(180deg, #323940 0%, #2b3137 100%);
        }

        .vz-github-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .vz-github-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .vz-auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(0, 229, 255, 0.05);
          border: 1px solid rgba(0, 229, 255, 0.2);
          color: var(--accent-cyan);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
      `}</style>

      {/* 🛑 The WebGL 3D Security Core 🛑 */}
      <Canvas className="vz-login-canvas" camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00e5ff" />
        <directionalLight position={[-5, -5, -5]} intensity={1} color="#b366ff" />
        <SecurityCore />
        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Canvas>

      {/* 🛑 The Framer Motion Glass UI 🛑 */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
          className="vz-auth-card"
        >
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="vz-auth-badge">
              <Lock size={14} /> Secure Gateway
            </div>
          </motion.div>

          <h1 style={{ margin: '0 0 12px 0', fontSize: '42px', fontWeight: 900, letterSpacing: '-1px', textShadow: '0 0 30px rgba(255,255,255,0.2)' }}>
            Velzion
          </h1>
          
          <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '16px', lineHeight: '1.6', fontWeight: 500 }}>
            Zero-CI Cloud Control Plane. Authenticate to establish connection to your infrastructure.
          </p>
          
          <button 
            onClick={handleGitHubLogin} 
            disabled={loading}
            className="vz-github-btn"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
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

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#525964', fontSize: '12px', fontWeight: 600 }}>
            <ShieldCheck size={14} /> Enterprise-grade keyless infrastructure
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;