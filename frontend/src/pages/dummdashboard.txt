import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

// --- FRAMER MOTION & LUCIDE ---
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, BarChart3, Shield, LogOut, ChevronDown, 
  Trash2, ExternalLink, Play, PauseCircle, Loader2, CloudCog, Activity
} from 'lucide-react';

// --- 🆕 THE BLEEDING EDGE: REACT THREE FIBER ---
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// ----------------------------------------------------------------------
// 🌌 3D COMPONENT: Abstract Cloud Node
// ----------------------------------------------------------------------
const HolographicNode = () => {
  const meshRef = useRef();

  // Subtle rotation over time
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial 
          color="#00e5ff" 
          emissive="#0044ff"
          emissiveIntensity={0.5}
          wireframe={true}
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Inner solid core */}
      <mesh scale={0.8}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#b366ff" transparent opacity={0.8} />
      </mesh>
    </Float>
  );
};

const Dashboard = () => {
  // --- ROUTING & WORKSPACE CONTEXT ---
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const currentWorkspace = owner && repo ? `${owner}/${repo}` : null;

  // --- AUTH & USER STATE ---
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]); 

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('environments'); 
  const [message, setMessage] = useState(''); 
  const [isLoaded, setIsLoaded] = useState(false); 

  // --- DASHBOARD STATE ---
  const [environments, setEnvironments] = useState([]);

  // --- IAM SETUP STATE ---
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [iamStatus, setIamStatus] = useState('');

  // [Part 2 will continue with the useEffects and Logic...]
// --- 🛡️ THE SECURITY BOUNCER (Intact Logic) ---
  useEffect(() => {
    const storedUser = localStorage.getItem('velzion_user');
    const storedRepos = JSON.parse(localStorage.getItem('velzion_repos') || '[]');

    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
      setWorkspaces(storedRepos);

      if (currentWorkspace && storedRepos.length > 0) {
        const hasAccess = storedRepos.some(r => 
          (typeof r === 'string' ? r : r.full_name) === currentWorkspace
        );

        if (!hasAccess) {
          alert(`🔒 ACCESS DENIED: You are not a collaborator on ${currentWorkspace}. Redirecting to safe zone.`);
          navigate('/dashboard'); 
        }
      }
      
      // Sequence the initial load for Framer Motion orchestrations
      setTimeout(() => setIsLoaded(true), 150);
    } catch (e) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate, currentWorkspace]);

  // --- SMART DYNAMIC POLLING EFFECT (Intact Logic) ---
  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pollData = () => {
      if (!currentWorkspace) return;
      
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/environments/?repo=${currentWorkspace}`)
        .then(res => {
          if (!isMounted) return;
          const data = res.data || [];
          setEnvironments(Array.isArray(data) ? data : (data.environments || []));
          
          const hasActiveTransitions = data.some(e => 
            ['PROVISIONING', 'DESTROYING...', 'BUILDING'].includes(e.status)
          );
          
          timeoutId = setTimeout(pollData, hasActiveTransitions ? 5000 : 15000);
        })
        .catch(err => {
          console.error("Error fetching environments:", err);
          if (isMounted) timeoutId = setTimeout(pollData, 15000);
        });
    };

    if (user && currentWorkspace) pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user, currentWorkspace]);

  // --- AUTH LOGOUT ---
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // --- DESTROY LOGIC (Intact Webhook Integration) ---
  const isPipelineBusy = (environments || []).some(env => 
    env.status === 'PROVISIONING' || env.status === 'DESTROYING...'
  );

  const handleDestroy = (env) => {
    setMessage(`Initiating Teardown for PR #${env.pr_number}...`);
    setEnvironments((environments || []).map(e => e.id === env.id ? { ...e, status: 'DESTROYING...' } : e));

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: `https://github.com/${currentWorkspace}`, 
      pr_number: env.pr_number
    }).then(() => {
      setMessage(`Teardown sequence triggered for PR #${env.pr_number}.`);
      setTimeout(() => setMessage(''), 5000);
    }).catch(err => {
      setMessage(`Failed to reach Teardown Webhook.`);
    });
  };

  // --- OPTIMIZED IAM INTEGRATION ---
  const handleSaveIntegration = (e) => {
    e.preventDefault();
    if(!iamRoleArn || !currentWorkspace) return;
    setIamStatus('saving');
    
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects/`, {
      github_repo_url: `https://github.com/${currentWorkspace}`,
      aws_role_arn: iamRoleArn,
      vpc_id: 'vpc-default-mvp' 
    }).then(() => {
      setIamStatus('success');
      setIamRoleArn('');
      setTimeout(() => setIamStatus(''), 5000);
    }).catch(err => setIamStatus('error'));
  };

  // --- STATE-AWARE FINOPS ENGINE (Intact Math) ---
  const calculateFinOps = (env) => {
    if (!env.created_at) return null;
    const start = new Date(env.created_at);
    const isFrozen = env.status === 'DESTROYED' || env.status === 'SLEEPING';
    const end = (isFrozen && env.updated_at) ? new Date(env.updated_at) : new Date();
    
    const uptimeSeconds = Math.max(0, (end - start) / 1000);
    const spotHourly = 0.0043; const odHourly = 0.0104;
    const spotCost = (uptimeSeconds * (spotHourly / 3600)).toFixed(5);
    const odCost = (uptimeSeconds * (odHourly / 3600)).toFixed(5);
    const savings = (uptimeSeconds * ((odHourly - spotHourly) / 3600)).toFixed(5);
    const savingsPercent = (((odHourly - spotHourly) / odHourly) * 100).toFixed(1);

    const h = Math.floor(uptimeSeconds / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = Math.floor(uptimeSeconds % 60);
    const uptimeString = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;

    return { spotCost, odCost, savings, uptimeString, savingsPercent, isFrozen };
  };

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const hasLiveEnvs = environments.some(e => e.status === 'RUNNING' || e.status === 'PROVISIONING');
    if (hasLiveEnvs) {
      const timer = setInterval(() => setTick(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [environments]);

  if (!user) return null;

  const cfnLink = `https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=https://velzion-public-templates-12345.s3.us-east-1.amazonaws.com/velzion-trust.yaml&stackName=Velzion-Integration`;

  return (
    <div className="vz-dashboard">
      <style>{`
        /* ==========================================================================
           🚀 VELZION BLEEDING-EDGE DESIGN SYSTEM
           ========================================================================== */
        
        :root {
          /* Deep Space Palette */
          --bg-base: #030406;
          --bg-surface: rgba(10, 12, 16, 0.6);
          --bg-surface-hover: rgba(16, 20, 26, 0.8);
          
          /* Neon Accents */
          --accent-cyan: #00f0ff;
          --accent-cyan-glow: rgba(0, 240, 255, 0.4);
          --accent-emerald: #00ff9d;
          --accent-emerald-glow: rgba(0, 255, 157, 0.3);
          --accent-purple: #9d4edd;
          --accent-purple-glow: rgba(157, 78, 221, 0.4);
          --accent-amber: #ffaa00;
          --accent-rose: #ff0055;
          
          /* Typography */
          --text-main: #ffffff;
          --text-muted: #8a919e;
          --font-main: 'Inter', system-ui, -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
          
          /* Glass Morphics */
          --glass-border: rgba(255, 255, 255, 0.05);
          --glass-highlight: rgba(255, 255, 255, 0.1);
          --glass-shadow: 0 30px 60px -12px rgba(0,0,0,0.8);
        }

        /* --- GLOBAL RESETS & SCROLLBAR --- */
        body { 
          margin: 0; 
          background-color: var(--bg-base); 
          color: var(--text-main);
          font-family: var(--font-main);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-base); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        /* --- 🌌 THE HOLOGRAPHIC GRID BACKGROUND --- */
        .vz-dashboard {
          display: flex; 
          min-height: 100vh; 
          position: relative; 
          z-index: 1;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center center;
          perspective: 1000px;
        }

        /* Animated Mesh Gradients */
        .vz-dashboard::before, .vz-dashboard::after {
          content: ''; 
          position: fixed; 
          border-radius: 50%; 
          filter: blur(150px); 
          z-index: -1;
          pointer-events: none;
          transform: translateZ(0); 
        }
        .vz-dashboard::before {
          width: 800px; height: 800px; 
          background: radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation: meshPulse 15s infinite alternate ease-in-out;
        }
        .vz-dashboard::after {
          width: 900px; height: 900px; 
          background: radial-gradient(circle, rgba(157,78,221,0.06) 0%, transparent 70%);
          bottom: -300px; right: -200px; 
          animation: meshPulse 20s infinite alternate-reverse ease-in-out;
        }

        @keyframes meshPulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          50% { transform: scale(1.2) translate(50px, -50px); opacity: 1; }
          100% { transform: scale(0.9) translate(-50px, 50px); opacity: 0.5; }
        }

        /* --- 🧊 PREMIUM GLASS PANELS --- */
        .glass-panel {
          background: var(--bg-surface); 
          backdrop-filter: blur(30px); 
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--glass-border); 
          border-top: 1px solid var(--glass-highlight);
          border-radius: 20px; 
          box-shadow: var(--glass-shadow);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Advanced Hover Glow Injection */
        .glass-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%);
          z-index: 0;
          opacity: 0;
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .glass-panel:hover::before { opacity: 1; }

        /* Content needs to sit above the hover gradient */
        .glass-panel > * { position: relative; z-index: 1; }

        /* --- BUTTONS & INTERACTIVE ELEMENTS --- */
        .vz-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          border: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        
        .vz-btn::after {
          content: ''; position: absolute; inset: 0; 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: 0.5s;
        }
        .vz-btn:hover::after { transform: translateX(100%); }

        .vz-btn-calc {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.1);
        }
        .vz-btn-calc:hover {
          background: rgba(0, 240, 255, 0.15);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 30px rgba(0, 240, 255, 0.2);
        }

        /* --- 3D CANVAS CONTAINER --- */
        .canvas-container {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none; /* Let clicks pass through to UI */
        }
      `}</style>
{/* ---------------- SIDEBAR (Glassmorphic) ---------------- */}
      <div className="vz-sidebar" style={{ width: '280px', borderRight: '1px solid var(--glass-border)', padding: '40px 24px', display: 'flex', flexDirection: 'column', zIndex: 10, background: 'rgba(5, 6, 8, 0.4)', backdropFilter: 'blur(40px)' }}>
        <div className="vz-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
          <div className="vz-logo-box" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-cyan), #0055ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px var(--accent-cyan-glow)' }}>
            <CloudCog color="#ffffff" size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '4px', fontWeight: 900, background: 'linear-gradient(to right, #fff, #8a919e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VELZION</h2>
        </div>
        
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '2px', margin: '0 0 16px 12px' }}>Platform Control</p>
        
        <div 
          onClick={() => currentWorkspace && setActiveTab('environments')} 
          style={{ padding: '16px 20px', borderRadius: '14px', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 600, fontSize: '14px', color: activeTab === 'environments' ? '#fff' : '#8a919e', background: activeTab === 'environments' ? 'rgba(0, 240, 255, 0.1)' : 'transparent', borderLeft: activeTab === 'environments' ? '3px solid var(--accent-cyan)' : '3px solid transparent', transition: 'all 0.3s', opacity: !currentWorkspace ? 0.3 : 1 }}
        >
          <Server size={18} color={activeTab === 'environments' ? 'var(--accent-cyan)' : 'currentColor'} /> Active Deployments
        </div>
        
        <Link to="/finopscalculator" style={{ padding: '16px 20px', borderRadius: '14px', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 600, fontSize: '14px', color: '#8a919e', textDecoration: 'none', borderLeft: '3px solid transparent', transition: 'all 0.3s' }}>
          <BarChart3 size={18} /> FinOps Dashboard
        </Link>
        
        <div 
          onClick={() => currentWorkspace && setActiveTab('iam')} 
          style={{ padding: '16px 20px', borderRadius: '14px', marginBottom: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 600, fontSize: '14px', color: activeTab === 'iam' ? '#fff' : '#8a919e', background: activeTab === 'iam' ? 'rgba(157, 78, 221, 0.1)' : 'transparent', borderLeft: activeTab === 'iam' ? '3px solid var(--accent-purple)' : '3px solid transparent', transition: 'all 0.3s', opacity: !currentWorkspace ? 0.3 : 1 }}
        >
          <Shield size={18} color={activeTab === 'iam' ? 'var(--accent-purple)' : 'currentColor'} /> Security & IAM
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="vz-main" style={{ flex: 1, padding: '48px 72px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '56px' }}
        >
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>
              {currentWorkspace ? currentWorkspace.split('/')[1] : 'Control Plane'}
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '16px', fontWeight: 500 }}>
              {currentWorkspace ? `Isolated Workspace: ${currentWorkspace}` : 'Select a workspace to begin orchestration'}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select 
                value={currentWorkspace || ''} onChange={(e) => { if (e.target.value) navigate(`/dashboard/${e.target.value}`); }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: '#fff', padding: '14px 48px 14px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', outline: 'none', appearance: 'none', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.3s' }}
              >
                <option value="" disabled style={{ color: '#000' }}>Select Workspace...</option>
                {workspaces.map(w => {
                  const name = typeof w === 'string' ? w : w.full_name;
                  return <option key={name} value={name} style={{ color: '#000' }}>{name}</option>;
                })}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '20px', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>

            <Link to="/finopscalculator" className="vz-btn vz-btn-calc"><BarChart3 size={16} /> ROI</Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '24px', borderRight: '1px solid var(--glass-border)' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', boxShadow: '0 0 15px var(--accent-cyan-glow)' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '15px' }}>{user?.username || 'Admin'}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--accent-emerald)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-emerald)', animation: 'pulse 2s infinite' }}></span> Authenticated
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="vz-btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}><LogOut size={16} /> Sign Out</button>
          </div>
        </motion.div>

        {/* ---------------- THE BLANK SLATE (React Three Fiber Integration) ---------------- */}
        <AnimatePresence mode="wait">
          {!currentWorkspace && (
            <motion.div 
              key="blank-slate"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel"
              style={{ position: 'relative', height: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}
            >
              {/* 🛑 The 3D WebGL Canvas Layer 🛑 */}
              <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <directionalLight position={[-10, -10, -5]} color="#9d4edd" intensity={2} />
                  <HolographicNode />
                  <Environment preset="city" />
                  <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                </Canvas>
              </div>

              {/* UI Layer sitting safely on top of the 3D Canvas */}
              <div style={{ position: 'relative', zIndex: 2, background: 'rgba(10, 12, 16, 0.4)', padding: '40px 60px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '42px', color: '#fff', margin: '0 0 16px 0', fontWeight: 900, letterSpacing: '-1px' }}>
                  Awaiting Coordinates
                </h2>
                <p style={{ color: 'var(--text-main)', opacity: 0.8, fontSize: '18px', maxWidth: '500px', lineHeight: '1.6', margin: '0 auto' }}>
                  The engine is primed. Select a repository workspace from the top navigation to initialize the control plane.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
{/* ---------------- ENVIRONMENTS TAB & FLEET TELEMETRY ---------------- */}
        <AnimatePresence mode="wait">
          {currentWorkspace && activeTab === 'environments' && (
            <motion.div 
              key="environments"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {/* SYSTEM ALERTS */}
              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '16px 24px', background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)', color: 'var(--accent-amber)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 600, boxShadow: '0 10px 30px rgba(255, 170, 0, 0.1)' }}>
                      <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
                      <span style={{ fontSize: '15px' }}>{message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FLEET TELEMETRY HUD (Bleeding Edge Addition) */}
              {(environments || []).length > 0 && (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', borderBottom: '2px solid var(--accent-cyan)' }}>
                  <div style={{ borderRight: '1px solid var(--glass-border)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Active Nodes</p>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Activity size={24} color="var(--accent-cyan)" /> {(environments || []).filter(e => e.status === 'RUNNING').length}
                    </p>
                  </div>
                  <div style={{ borderRight: '1px solid var(--glass-border)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Sleeping PRs</p>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <PauseCircle size={24} /> {(environments || []).filter(e => e.status === 'SLEEPING').length}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Network Health</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--accent-emerald)', borderRadius: '50%', boxShadow: '0 0 15px var(--accent-emerald-glow)' }}></span> Optimal
                    </p>
                  </div>
                </motion.div>
              )}

              {/* DYNAMIC ENVIRONMENT CARDS */}
              <div className="vz-env-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {!(environments || []).length ? (
                  <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } } }} className="glass-panel" style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <Server size={80} color="rgba(255,255,255,0.05)" style={{ marginBottom: '24px' }} />
                    </motion.div>
                    <h3 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>Infrastructure Offline</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0, maxWidth: '450px', lineHeight: '1.7' }}>
                      The orchestration engine is standing by. Open a Pull Request on <strong style={{ color: 'var(--accent-cyan)' }}>{currentWorkspace}</strong> to provision an isolated cloud environment.
                    </p>
                  </motion.div>
                ) : (
                  (environments || []).map((env) => {
                    const stats = calculateFinOps(env);
                    let statusColor = "var(--text-muted)"; let bgGlow = "transparent"; let StatusIcon = Activity;

                    if (env.status === 'RUNNING') { statusColor = "var(--accent-emerald)"; bgGlow = "rgba(0, 255, 157, 0.05)"; StatusIcon = Play; }
                    else if (env.status === 'SLEEPING') { statusColor = "var(--accent-purple)"; bgGlow = "rgba(157, 78, 221, 0.05)"; StatusIcon = PauseCircle; }
                    else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') { statusColor = "var(--accent-amber)"; bgGlow = "rgba(255, 170, 0, 0.05)"; StatusIcon = Loader2; }
                    else if (env.status === 'DESTROYED') { StatusIcon = Trash2; }

                    return (
                      <motion.div key={env.id} layout variants={{ hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } } }} className="glass-panel vz-env-card" style={{ background: `linear-gradient(145deg, var(--bg-surface), ${bgGlow})`, borderLeft: `4px solid ${statusColor}` }}>
                        <div style={{ padding: '32px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                              <h3 style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 0 12px 0', fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}>Pull Request</span> 
                                #{env.pr_number}
                              </h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
                                {env.status === 'DESTROYED' ? <span style={{ color: 'var(--text-muted)' }}>Architecture terminated. Security groups dismantled.</span> : 
                                 env.status === 'DESTROYING...' ? <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}><Loader2 size={16} className="animate-spin"/> Evacuating instances...</span> : 
                                 env.status === 'PROVISIONING' ? <span style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}><Loader2 size={16} className="animate-spin"/> Compiling Terraform State...</span> : 
                                 env.status === 'SLEEPING' ? <span style={{ color: 'var(--accent-purple)' }}>Resources frozen to disk. Billing paused.</span> : 
                                 env.dns_prefix ? (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                                    External Endpoint: 
                                    <a href={env.dns_prefix} target="_blank" rel="noreferrer" style={{ color: '#000', background: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', transition: 'all 0.3s', boxShadow: '0 0 15px var(--accent-cyan-glow)' }}>
                                      {env.dns_prefix} <ExternalLink size={14} />
                                    </a>
                                  </span>
                                 ) : <span style={{ color: 'var(--text-muted)' }}>Awaiting DNS Propagation...</span>}
                              </div>
                            </div>
                            
                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', color: statusColor, background: 'rgba(255,255,255,0.03)', border: `1px solid ${statusColor}`, boxShadow: `inset 0 0 20px ${statusColor}20` }}>
                              <StatusIcon size={18} className={env.status.includes('ING') ? 'animate-spin' : ''} />
                              {env.status}
                            </span>
                          </div>

                          {/* FINOPS WIDGET WITH FRAMER MOTION LAYOUT */}
                          <AnimatePresence>
                            {stats && (
                              <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                                <div style={{ background: stats.isFrozen ? 'rgba(157, 78, 221, 0.05)' : 'rgba(0,0,0,0.5)', border: stats.isFrozen ? '1px dashed rgba(157, 78, 221, 0.3)' : '1px solid var(--glass-border)', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <BarChart3 size={16} color="var(--accent-emerald)" />
                                      {env.status === 'DESTROYED' ? 'Final FinOps Receipt' : 'Real-Time Telemetry'}
                                      {stats.isFrozen && env.status !== 'DESTROYED' && <span style={{ color: 'var(--accent-purple)', background: 'rgba(157, 78, 221, 0.15)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>⏸ Paused</span>}
                                    </p>
                                    <span style={{ background: 'rgba(0, 255, 157, 0.1)', border: '1px solid rgba(0, 255, 157, 0.3)', color: 'var(--accent-emerald)', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, boxShadow: '0 0 10px var(--accent-emerald-glow)' }}>
                                      {stats.savingsPercent}% Spot Optimization
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                                    <div><p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>Uptime</p><p style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: stats.isFrozen ? 'var(--text-muted)' : '#fff' }}>{stats.uptimeString}</p></div>
                                    <div><p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>Spot Rate</p><p style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textShadow: '0 0 20px var(--accent-cyan-glow)' }}>${stats.spotCost}</p></div>
                                    <div><p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>On-Demand</p><p style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#4b5563', textDecoration: 'line-through' }}>${stats.odCost}</p></div>
                                    <div><p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>Capital Saved</p><p style={{ margin: 0, fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>+${stats.savings}</p></div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '8px' }}>
                              <Server size={14} /> EC2_ID: <span style={{ color: '#fff' }}>{env.instance_id || 'PENDING_ALLOCATION'}</span>
                            </p>
                            {(env.status === 'RUNNING' || env.status === 'SLEEPING') && (
                              <button 
                                onClick={() => handleDestroy(env)} disabled={isPipelineBusy} 
                                style={{ background: 'transparent', color: 'var(--accent-rose)', border: '1px solid rgba(255, 0, 85, 0.3)', padding: '14px 28px', borderRadius: '12px', cursor: isPipelineBusy ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 800, transition: 'all 0.3s', opacity: isPipelineBusy ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                                onMouseEnter={(e) => { if(!isPipelineBusy) { e.currentTarget.style.background = 'rgba(255, 0, 85, 0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.2)'; }}}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                              >
                                <Trash2 size={16} /> Terminate Architecture
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------------- IAM SETTINGS TAB & ARCHITECTURE VISUAL ---------------- */}
        <AnimatePresence mode="wait">
          {currentWorkspace && activeTab === 'iam' && (
            <motion.div 
              key="iam"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel" style={{ padding: '56px', borderRadius: '24px' }}
            >
              <h2 style={{ marginTop: 0, color: '#fff', fontSize: '36px', marginBottom: '16px', fontWeight: 900, letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Shield size={40} color="var(--accent-purple)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-purple-glow))' }} /> Security & IAM Bindings
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '48px', lineHeight: '1.7', maxWidth: '800px' }}>
                Deploying infrastructure requires authorization. Grant the Velzion Engine secure, temporary access to provision environments in your AWS account using a keyless AssumeRole architecture.
              </p>

              {/* ARCHITECTURE DIAGRAM (Pure HTML/CSS) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '32px 48px', borderRadius: '16px', border: '1px dashed rgba(157, 78, 221, 0.3)', marginBottom: '48px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 240, 255, 0.1)', border: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}><CloudCog size={32} color="var(--accent-cyan)" /></div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>Velzion Engine</p>
                </div>
                <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', margin: '0 24px', position: 'relative' }}>
                  <motion.div animate={{ x: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-4px', left: 0, width: '10px', height: '10px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 10px #fff' }} />
                  <p style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>AssumeRole (STS)</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(157, 78, 221, 0.1)', border: '2px solid var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}><Server size={32} color="var(--accent-purple)" /></div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>Your AWS VPC</p>
                </div>
              </div>

              {/* STEP 1 */}
              <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-cyan)' }}></div>
                <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 800 }}>
                  <span style={{ background: 'var(--accent-cyan)', color: '#000', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 900 }}>STEP 1</span> Deploy Trust Policy
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.7', maxWidth: '700px' }}>
                  Launch our verified CloudFormation template. This provisions a secure <code style={{ color: 'var(--accent-cyan)', background: 'rgba(0, 240, 255, 0.1)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}>VelzionExecutionRole</code> with strict least-privilege access tied exclusively to your repository infrastructure.
                </p>
                <a href={cfnLink} target="_blank" rel="noreferrer" style={{ background: '#fff', color: '#000', padding: '16px 32px', borderRadius: '12px', fontWeight: 900, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}>
                  Launch AWS CloudFormation <ExternalLink size={18} />
                </a>
              </div>

              {/* STEP 2 */}
              <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-purple)' }}></div>
                <h4 style={{ margin: '0 0 24px 0', color: '#fff', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 800 }}>
                  <span style={{ background: 'var(--accent-purple)', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 900 }}>STEP 2</span> Bind Credentials
                </h4>
                
                <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '32px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>Targeting Workspace:</span>
                    <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CloudCog size={20} color="var(--accent-cyan)" /> {currentWorkspace}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 700 }}>Assumed AWS Role ARN (Output from Step 1)</label>
                    <input 
                      type="text" value={iamRoleArn} onChange={(e) => setIamRoleArn(e.target.value)} 
                      placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" required 
                      style={{ background: 'rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.05)', color: '#fff', padding: '20px 24px', borderRadius: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '16px', fontFamily: 'var(--font-mono)', transition: 'all 0.3s' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent-purple)'; e.target.style.boxShadow = '0 0 25px var(--accent-purple-glow)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.05)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  
                  <button type="submit" disabled={iamStatus === 'saving'} style={{ background: 'var(--accent-purple)', color: '#fff', padding: '18px 36px', borderRadius: '14px', width: 'fit-content', fontSize: '16px', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', opacity: iamStatus === 'saving' ? 0.7 : 1, transition: 'all 0.3s' }}>
                    {iamStatus === 'saving' ? <><Loader2 size={20} className="animate-spin" /> Establishing Trust Link...</> : <><Shield size={20} /> Secure Integration</>}
                  </button>
                </form>

                <AnimatePresence>
                  {iamStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '32px', padding: '20px 24px', borderRadius: '14px', color: 'var(--accent-emerald)', border: '1px solid rgba(0, 255, 157, 0.3)', backgroundColor: 'rgba(0, 255, 157, 0.05)', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 700 }}>
                      <Shield size={24} /> Cryptographic handshake complete. Engine is authorized.
                    </motion.div>
                  )}
                  {iamStatus === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '32px', padding: '20px 24px', borderRadius: '14px', color: 'var(--accent-rose)', border: '1px solid rgba(255, 0, 85, 0.3)', backgroundColor: 'rgba(255, 0, 85, 0.05)', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: 700 }}>
                      <Server size={24} /> Binding failed. Validate the ARN syntax and ensure the CFN stack deployed successfully.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Dashboard;