import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, BarChart3, Shield, ChevronDown, 
  Trash2, ExternalLink, Play, PauseCircle, Loader2, CloudCog, Activity, Sparkles, Network
} from 'lucide-react';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// ----------------------------------------------------------------------
// 🌌 FRAMER MOTION: Cosmic Nebula Background Simulation
// Mimics the provided deep-space reference images using pure CSS math
// ----------------------------------------------------------------------
const CosmicNebulaBackground = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    {/* Deep Space Base */}
    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#05010a' }} />
    
    {/* Fuchsia/Magenta Gas Cloud (Reference Image 2 & 3) */}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.15) 0%, transparent 60%)', filter: 'blur(90px)' }}
    />

    {/* Deep Violet Core (Reference Image 1 & 4) */}
    <motion.div 
      animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.4, 0.6, 0.4], x: [0, -40, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(107, 33, 168, 0.25) 0%, transparent 70%)', filter: 'blur(100px)' }}
    />

    {/* Stellar Dust Particles */}
    <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: 'absolute', inset: 0, 
        background: 'radial-gradient(1px 1px at 10% 20%, #ffffff, transparent), radial-gradient(1px 1px at 30% 60%, rgba(217, 70, 239, 0.8), transparent), radial-gradient(2px 2px at 80% 40%, var(--zg-purple-core), transparent), radial-gradient(1.5px 1.5px at 60% 80%, #ffffff, transparent)',
        backgroundSize: '150px 150px', opacity: 0.4
      }} 
    />
  </div>
);

// ----------------------------------------------------------------------
// 🌌 FRAMER MOTION: Upgraded Holographic Rift (Blank Slate)
// ----------------------------------------------------------------------
const CosmicRiftNode = () => (
  <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 3rem auto' }}>
    {/* Outer Accretion Disk */}
    <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
      style={{ position: 'absolute', inset: -30, border: '1px solid rgba(217, 70, 239, 0.2)', borderRadius: '50%', borderLeft: '2px solid rgba(217, 70, 239, 0.6)' }} />
    
    {/* Counter-Rotating Inner Field */}
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
      style={{ position: 'absolute', inset: -10, border: '2px dashed var(--zg-purple-core)', borderRadius: '50%', opacity: 0.4 }} />
    
    {/* Central Pulsar Glow */}
    <motion.div animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
      style={{ position: 'absolute', inset: 15, background: 'radial-gradient(circle, var(--zg-purple-core) 0%, transparent 70%)', filter: 'blur(20px)', borderRadius: '50%' }} />
    
    {/* Core Icon */}
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
      <Network size={48} style={{ color: '#fff', filter: 'drop-shadow(0 0 10px var(--zg-purple-core))' }} />
    </div>
  </div>
);

// ----------------------------------------------------------------------
// ⚡ MAIN DASHBOARD COMPONENT (Logic Intact)
// ----------------------------------------------------------------------
export default function Dashboard() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const currentWorkspace = owner && repo ? `${owner}/${repo}` : null;

  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]); 
  const [activeTab, setActiveTab] = useState('environments'); 
  const [message, setMessage] = useState(''); 
  const [isLoaded, setIsLoaded] = useState(false); 
  const [environments, setEnvironments] = useState([]);
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [iamStatus, setIamStatus] = useState('');

  // --- 🛡️ THE SECURITY BOUNCER ---
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
        const hasAccess = storedRepos.some(r => (typeof r === 'string' ? r : r.full_name) === currentWorkspace);
        if (!hasAccess) {
          alert(`🔒 ACCESS DENIED: You are not a collaborator on ${currentWorkspace}. Redirecting to safe zone.`);
          navigate('/zegion/dashboard'); 
        }
      }
      setTimeout(() => setIsLoaded(true), 150);
    } catch (e) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate, currentWorkspace]);

  // --- SMART DYNAMIC POLLING EFFECT ---
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
          const hasActiveTransitions = data.some(e => ['PROVISIONING', 'DESTROYING...', 'BUILDING'].includes(e.status));
          timeoutId = setTimeout(pollData, hasActiveTransitions ? 5000 : 15000);
        })
        .catch(err => {
          console.error("Error fetching environments:", err);
          if (isMounted) timeoutId = setTimeout(pollData, 15000);
        });
    };

    if (user && currentWorkspace) pollData();
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, [user, currentWorkspace]);

  // --- DESTROY LOGIC (Webhook Integration) ---
  const isPipelineBusy = (environments || []).some(env => env.status === 'PROVISIONING' || env.status === 'DESTROYING...');

  const handleDestroy = (env) => {
    setMessage(`Initiating Teardown for PR #${env.pr_number}...`);
    setEnvironments((environments || []).map(e => e.id === env.id ? { ...e, status: 'DESTROYING...' } : e));

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: `https://github.com/${currentWorkspace}`, pr_number: env.pr_number
    }).then(() => {
      setMessage(`Teardown sequence triggered for PR #${env.pr_number}.`);
      setTimeout(() => setMessage(''), 5000);
    }).catch(err => {
      setMessage(`Failed to reach Teardown Webhook.`);
    });
  };

  // --- IAM INTEGRATION ---
  const handleSaveIntegration = (e) => {
    e.preventDefault();
    if(!iamRoleArn || !currentWorkspace) return;
    setIamStatus('saving');
    
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects/`, {
      github_repo_url: `https://github.com/${currentWorkspace}`, aws_role_arn: iamRoleArn, vpc_id: 'vpc-default-mvp' 
    }).then(() => {
      setIamStatus('success'); setIamRoleArn(''); setTimeout(() => setIamStatus(''), 5000);
    }).catch(err => setIamStatus('error'));
  };

  // --- STATE-AWARE FINOPS ENGINE ---
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', minHeight: '100%' }}>
      <CosmicNebulaBackground />

      {/* ---------------- ZEGION COMMAND BAR ---------------- */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
        className="glass-panel"
        style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(217, 70, 239, 0.2)' }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => currentWorkspace && setActiveTab('environments')} disabled={!currentWorkspace}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
              background: activeTab === 'environments' ? 'rgba(217, 70, 239, 0.15)' : 'transparent',
              color: activeTab === 'environments' ? '#e879f9' : 'var(--text-muted)',
              border: `1px solid ${activeTab === 'environments' ? 'rgba(217, 70, 239, 0.4)' : 'transparent'}`,
              cursor: currentWorkspace ? 'pointer' : 'not-allowed', opacity: currentWorkspace ? 1 : 0.5, fontWeight: 600, transition: 'all var(--transition-fast)'
            }}>
            <Server size={16} /> Deployments
          </button>
          
          <button onClick={() => currentWorkspace && setActiveTab('iam')} disabled={!currentWorkspace}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
              background: activeTab === 'iam' ? 'rgba(217, 70, 239, 0.15)' : 'transparent',
              color: activeTab === 'iam' ? '#e879f9' : 'var(--text-muted)',
              border: `1px solid ${activeTab === 'iam' ? 'rgba(217, 70, 239, 0.4)' : 'transparent'}`,
              cursor: currentWorkspace ? 'pointer' : 'not-allowed', opacity: currentWorkspace ? 1 : 0.5, fontWeight: 600, transition: 'all var(--transition-fast)'
            }}>
            <Shield size={16} /> IAM Bindings
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={currentWorkspace || ''} onChange={(e) => { if (e.target.value) navigate(`/zegion/dashboard/${e.target.value}`); }}
              style={{ 
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-pure)', 
                padding: '0.5rem 2.5rem 0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', 
                fontWeight: 600, cursor: 'pointer', outline: 'none', appearance: 'none' 
              }}>
              <option value="" disabled>Select Cosmic Workspace...</option>
              {workspaces.map(w => {
                const name = typeof w === 'string' ? w : w.full_name;
                return <option key={name} value={name}>{name}</option>;
              })}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          <Link to="/zegion/finops" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
            borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
            color: 'var(--text-pure)', fontSize: '0.9rem', fontWeight: 600, transition: 'all var(--transition-fast)' 
          }}>
            <BarChart3 size={16} style={{ color: '#e879f9' }}/> ROI Target
          </Link>
        </div>
      </motion.div>

      {/* ---------------- THE BLANK SLATE ---------------- */}
      <AnimatePresence mode="wait">
        {!currentWorkspace && (
          <motion.div key="blank-slate" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            style={{ padding: '8rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}
          >
            <CosmicRiftNode />
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-pure)', margin: '0 0 1rem 0', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 0 20px rgba(217, 70, 239, 0.5)' }}>
              Awaiting Coordinates
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6, margin: '0 auto' }}>
              The Zegion ephemeral engine is standing by in the void. Select a repository workspace from the command bar to initialize the control plane.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- ENVIRONMENTS TAB & FLEET TELEMETRY ---------------- */}
      <AnimatePresence mode="wait">
        {currentWorkspace && activeTab === 'environments' && (
          <motion.div key="environments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10 }}>
            
            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.5rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
                    <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLEET TELEMETRY HUD (Cosmic Styling) */}
            {(environments || []).length > 0 && (
              <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Active Nodes</p>
                  <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.75rem', textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}><Activity size={24} style={{ color: '#10b981' }} /></motion.div>
                    {(environments || []).filter(e => e.status === 'RUNNING').length}
                  </p>
                </div>
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Sleeping PRs</p>
                  <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.75rem', textShadow: '0 0 15px rgba(217, 70, 239, 0.5)' }}>
                    <PauseCircle size={24} style={{ color: '#e879f9' }} /> {(environments || []).filter(e => e.status === 'SLEEPING').length}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Network Stability</p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 15px #34d399' }} /> Optimal Flow
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC ENVIRONMENT CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!(environments || []).length ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(8, 3, 16, 0.4)', backdropFilter: 'blur(10px)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(217, 70, 239, 0.3)' }}>
                  <Sparkles size={48} style={{ color: '#e879f9', margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
                  <h3 style={{ color: 'var(--text-pure)', margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Void Empty</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: '0 auto', maxWidth: '450px', lineHeight: 1.6 }}>
                    The orchestration engine is listening to the cosmic background. Open a Pull Request on <strong style={{ color: '#e879f9' }}>{currentWorkspace}</strong> to spawn a new cluster.
                  </p>
                </div>
              ) : (
                (environments || []).map((env) => {
                  const stats = calculateFinOps(env);
                  let statusColor = "rgba(255,255,255,0.5)"; let bgGlow = "rgba(255,255,255,0.02)"; let StatusIcon = Activity; let edgeColor = "transparent";

                  if (env.status === 'RUNNING') { statusColor = "#34d399"; bgGlow = "rgba(52, 211, 153, 0.05)"; StatusIcon = Play; edgeColor = "#34d399"; }
                  else if (env.status === 'SLEEPING') { statusColor = "#e879f9"; bgGlow = "rgba(217, 70, 239, 0.05)"; StatusIcon = PauseCircle; edgeColor = "#e879f9"; }
                  else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') { statusColor = "#fbbf24"; bgGlow = "rgba(251, 191, 36, 0.05)"; StatusIcon = Loader2; edgeColor = "#fbbf24"; }
                  else if (env.status === 'DESTROYED') { statusColor = "#f87171"; StatusIcon = Trash2; }

                  return (
                    <motion.div key={env.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                      style={{ position: 'relative', background: `linear-gradient(145deg, rgba(8,3,16,0.7), ${bgGlow})`, backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                      
                      {/* Neon Edge Tracking */}
                      {env.status !== 'DESTROYED' && (
                         <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: edgeColor, boxShadow: `0 0 15px ${edgeColor}` }} />
                      )}

                      <div style={{ padding: '2rem 2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                          <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 0.75rem 0', fontSize: '1.75rem', fontWeight: 800 }}>
                              <span style={{ color: '#e879f9', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(217, 70, 239, 0.1)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', letterSpacing: '1px', border: '1px solid rgba(217, 70, 239, 0.3)' }}>Pull Request</span> 
                              <span style={{ color: 'var(--text-pure)' }}>#{env.pr_number}</span>
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                              {env.status === 'DESTROYED' ? <span style={{ color: 'rgba(255,255,255,0.5)' }}>Architecture vaporized into the void.</span> : 
                               env.status === 'DESTROYING...' ? <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={14} className="animate-spin"/> Evacuating instances...</span> : 
                               env.status === 'PROVISIONING' ? <span style={{ color: '#e879f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={14} className="animate-spin"/> Compiling Terraform State...</span> : 
                               env.status === 'SLEEPING' ? <span style={{ color: 'rgba(255,255,255,0.6)' }}>Resources frozen. Awaiting awakening protocol.</span> : 
                               env.dns_prefix ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-pure)' }}>
                                  External Endpoint: 
                                  <a href={env.dns_prefix} target="_blank" rel="noreferrer" style={{ color: 'var(--text-pure)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}>
                                    {env.dns_prefix} <ExternalLink size={12} />
                                  </a>
                                </span>
                               ) : <span style={{ color: 'rgba(255,255,255,0.5)' }}>Awaiting DNS Propagation...</span>}
                            </div>
                          </div>
                          
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', color: statusColor, background: 'rgba(0,0,0,0.5)', border: `1px solid ${statusColor}`, letterSpacing: '1px', boxShadow: `0 0 15px rgba(${statusColor === '#34d399' ? '52,211,153' : statusColor === '#e879f9' ? '217,70,239' : '251,191,36'}, 0.2)` }}>
                            <StatusIcon size={14} style={{ animation: env.status.includes('ING') ? 'spin 2s linear infinite' : 'none' }} />
                            {env.status}
                          </span>
                        </div>

                        {/* FINOPS WIDGET */}
                        <AnimatePresence>
                          {stats && (
                            <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                              <div style={{ background: stats.isFrozen ? 'rgba(217, 70, 239, 0.05)' : 'rgba(0,0,0,0.3)', border: stats.isFrozen ? '1px dashed rgba(217, 70, 239, 0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart3 size={14} style={{ color: '#34d399' }} />
                                    {env.status === 'DESTROYED' ? 'Final FinOps Receipt' : 'Real-Time Telemetry'}
                                    {stats.isFrozen && env.status !== 'DESTROYED' && <span style={{ color: '#e879f9', background: 'rgba(217, 70, 239, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', border: '1px solid rgba(217, 70, 239, 0.3)' }}>STASIS PAUSED</span>}
                                  </p>
                                  <span style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34d399', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', boxShadow: '0 0 10px rgba(52,211,153,0.2)' }}>
                                    {stats.savingsPercent}% SPOT OPTIMIZATION
                                  </span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                                  <div><p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Uptime</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: stats.isFrozen ? 'rgba(255,255,255,0.4)' : 'var(--text-pure)' }}>{stats.uptimeString}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Spot Rate</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: '#e879f9', textShadow: '0 0 10px rgba(217,70,239,0.4)' }}>${stats.spotCost}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>On-Demand</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>${stats.odCost}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Capital Saved</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', color: '#34d399', textShadow: '0 0 10px rgba(52,211,153,0.4)' }}>+${stats.savings}</p></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Server size={14} /> NODE_ID: <span style={{ color: 'var(--text-pure)' }}>{env.instance_id || 'AWAITING_ALLOCATION'}</span>
                          </p>
                          {(env.status === 'RUNNING' || env.status === 'SLEEPING') && (
                            <button 
                              onClick={() => handleDestroy(env)} disabled={isPipelineBusy} 
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', cursor: isPipelineBusy ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s', opacity: isPipelineBusy ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 15px rgba(239,68,68,0.2)' }}
                            >
                              <Trash2 size={16} /> Vaporize Instance
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

      {/* ---------------- IAM SETTINGS TAB ---------------- */}
      <AnimatePresence mode="wait">
        {currentWorkspace && activeTab === 'iam' && (
          <motion.div key="iam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} 
            style={{ padding: '3rem', background: 'rgba(8, 3, 16, 0.6)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-pure)', fontSize: '2rem', marginBottom: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield size={32} style={{ color: '#e879f9' }} /> Security & IAM Bindings
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '700px' }}>
              Deploying infrastructure requires authorization. Grant the Zegion Engine secure, temporary access to provision environments in your AWS account using a keyless AssumeRole architecture.
            </p>

            <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '2.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Targeting Workspace:</span>
                <span style={{ color: 'var(--text-pure)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', textShadow: '0 0 10px rgba(217,70,239,0.5)' }}>
                  <CloudCog size={20} style={{ color: '#e879f9' }} /> {currentWorkspace}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Assumed AWS Role ARN</label>
                <input 
                  type="text" value={iamRoleArn} onChange={(e) => setIamRoleArn(e.target.value)} 
                  placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" required 
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(217, 70, 239, 0.3)', color: 'var(--text-pure)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', outline: 'none', width: '100%', fontSize: '1rem', fontFamily: 'monospace', transition: 'border 0.2s', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}
                />
              </div>
              
              <button type="submit" disabled={iamStatus === 'saving'} 
                style={{ background: 'linear-gradient(135deg, var(--zg-purple-core) 0%, #d946ef 100%)', color: 'var(--text-pure)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', width: 'fit-content', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: iamStatus === 'saving' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: iamStatus === 'saving' ? 0.7 : 1, boxShadow: '0 10px 20px rgba(217,70,239,0.3)' }}>
                {iamStatus === 'saving' ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Establishing Trust Link...</> : <><Shield size={18} /> Secure Integration</>}
              </button>
            </form>

            <AnimatePresence>
              {iamStatus === 'success' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: 'var(--radius-sm)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.4)', backgroundColor: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                  <Shield size={20} /> Cryptographic handshake complete. Engine is authorized.
                </motion.div>
              )}
              {iamStatus === 'error' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: 'var(--radius-sm)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.4)', backgroundColor: 'rgba(248, 113, 113, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                  <Server size={20} /> Binding failed. Validate the ARN syntax.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}