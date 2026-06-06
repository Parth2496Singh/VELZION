import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, BarChart3, Shield, ChevronDown, 
  Trash2, ExternalLink, Play, PauseCircle, Loader2, CloudCog, Activity
} from 'lucide-react';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// ----------------------------------------------------------------------
// 🌌 FRAMER MOTION: Lightweight Abstract Cloud Node
// ----------------------------------------------------------------------
const HolographicNode = () => (
  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
    <motion.div 
      animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
      style={{ position: 'absolute', inset: -20, border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '50%' }} 
    />
    <motion.div 
      animate={{ rotate: -360 }} 
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
      style={{ position: 'absolute', inset: 0, border: '2px dashed var(--zg-purple-core)', borderRadius: '50%', opacity: 0.5 }} 
    />
    <motion.div 
      animate={{ opacity: [0.3, 0.6, 0.3] }} 
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
      style={{ position: 'absolute', inset: 10, background: 'radial-gradient(circle, var(--zg-purple-core) 0%, transparent 70%)', filter: 'blur(15px)', borderRadius: '50%' }} 
    />
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
      <Server size={40} style={{ color: 'var(--text-pure)' }} />
    </div>
  </div>
);

// ----------------------------------------------------------------------
// ⚡ MAIN DASHBOARD COMPONENT
// ----------------------------------------------------------------------
export default function Dashboard() {
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
          navigate('/zegion/dashboard'); 
        }
      }
      
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

  // --- OPTIMIZED IAM INTEGRATION (Intact) ---
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ---------------- ZEGION COMMAND BAR ---------------- */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-panel"
        style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => currentWorkspace && setActiveTab('environments')} 
            disabled={!currentWorkspace}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
              background: activeTab === 'environments' ? 'var(--zg-purple-glow)' : 'transparent',
              color: activeTab === 'environments' ? 'var(--zg-purple-core)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === 'environments' ? 'var(--zg-purple-border)' : 'transparent'}`,
              cursor: currentWorkspace ? 'pointer' : 'not-allowed', opacity: currentWorkspace ? 1 : 0.5, fontWeight: 600, transition: 'all var(--transition-fast)'
            }}
          >
            <Server size={16} /> Deployments
          </button>
          
          <button 
            onClick={() => currentWorkspace && setActiveTab('iam')} 
            disabled={!currentWorkspace}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
              background: activeTab === 'iam' ? 'var(--zg-purple-glow)' : 'transparent',
              color: activeTab === 'iam' ? 'var(--zg-purple-core)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === 'iam' ? 'var(--zg-purple-border)' : 'transparent'}`,
              cursor: currentWorkspace ? 'pointer' : 'not-allowed', opacity: currentWorkspace ? 1 : 0.5, fontWeight: 600, transition: 'all var(--transition-fast)'
            }}
          >
            <Shield size={16} /> IAM Bindings
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Workspace Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select 
              value={currentWorkspace || ''} 
              onChange={(e) => { if (e.target.value) navigate(`/zegion/dashboard/${e.target.value}`); }}
              style={{ 
                background: 'var(--bg-void)', border: 'var(--border-subtle)', color: 'var(--text-pure)', 
                padding: '0.5rem 2.5rem 0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', 
                fontWeight: 600, cursor: 'pointer', outline: 'none', appearance: 'none' 
              }}
            >
              <option value="" disabled>Select Repository...</option>
              {workspaces.map(w => {
                const name = typeof w === 'string' ? w : w.full_name;
                return <option key={name} value={name}>{name}</option>;
              })}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          <Link to="/zegion/finops" style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
            borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', border: 'var(--border-subtle)', 
            color: 'var(--text-pure)', fontSize: '0.9rem', fontWeight: 600, transition: 'all var(--transition-fast)' 
          }}>
            <BarChart3 size={16} style={{ color: 'var(--zg-purple-core)' }}/> ROI
          </Link>
        </div>
      </motion.div>

      {/* ---------------- THE BLANK SLATE ---------------- */}
      <AnimatePresence mode="wait">
        {!currentWorkspace && (
          <motion.div 
            key="blank-slate"
            initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0 }}
            className="glass-panel"
            style={{ padding: '6rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <HolographicNode />
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-pure)', margin: '0 0 1rem 0', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Awaiting Coordinates
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.6, margin: '0 auto' }}>
              The Zegion engine is primed. Select a repository workspace from the command bar to initialize the ephemeral control plane.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- ENVIRONMENTS TAB & FLEET TELEMETRY ---------------- */}
      <AnimatePresence mode="wait">
        {currentWorkspace && activeTab === 'environments' && (
          <motion.div key="environments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* SYSTEM ALERTS */}
            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                    <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLEET TELEMETRY HUD */}
            {(environments || []).length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={{ borderRight: 'var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Nodes</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={20} style={{ color: 'var(--zg-purple-core)' }} /> {(environments || []).filter(e => e.status === 'RUNNING').length}
                  </p>
                </div>
                <div style={{ borderRight: 'var(--border-subtle)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sleeping PRs</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <PauseCircle size={20} style={{ color: 'var(--text-muted)' }} /> {(environments || []).filter(e => e.status === 'SLEEPING').length}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Network Health</p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }} /> Optimal
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC ENVIRONMENT CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!(environments || []).length ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                  <Server size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
                  <h3 style={{ color: 'var(--text-pure)', margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 800 }}>Infrastructure Offline</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 auto', maxWidth: '450px', lineHeight: 1.6 }}>
                    The orchestration engine is standing by. Open a Pull Request on <strong style={{ color: 'var(--zg-purple-core)' }}>{currentWorkspace}</strong> to provision an isolated cloud environment.
                  </p>
                </div>
              ) : (
                (environments || []).map((env) => {
                  const stats = calculateFinOps(env);
                  let statusColor = "var(--text-muted)"; let bgGlow = "transparent"; let StatusIcon = Activity;

                  if (env.status === 'RUNNING') { statusColor = "#10b981"; bgGlow = "rgba(16, 185, 129, 0.05)"; StatusIcon = Play; }
                  else if (env.status === 'SLEEPING') { statusColor = "var(--zg-purple-core)"; bgGlow = "var(--zg-purple-glow)"; StatusIcon = PauseCircle; }
                  else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') { statusColor = "#f59e0b"; bgGlow = "rgba(245, 158, 11, 0.05)"; StatusIcon = Loader2; }
                  else if (env.status === 'DESTROYED') { statusColor = "#ef4444"; StatusIcon = Trash2; }

                  return (
                    <motion.div key={env.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ background: `linear-gradient(145deg, var(--bg-glass), ${bgGlow})`, borderLeft: `4px solid ${statusColor}` }}>
                      <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                          <div>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 0.75rem 0', fontSize: '1.75rem', fontWeight: 800 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>Pull Request</span> 
                              <span style={{ color: 'var(--text-pure)' }}>#{env.pr_number}</span>
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                              {env.status === 'DESTROYED' ? <span style={{ color: 'var(--text-muted)' }}>Architecture terminated. Security groups dismantled.</span> : 
                               env.status === 'DESTROYING...' ? <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={14} className="animate-spin"/> Evacuating instances...</span> : 
                               env.status === 'PROVISIONING' ? <span style={{ color: 'var(--zg-purple-core)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={14} className="animate-spin"/> Compiling Terraform State...</span> : 
                               env.status === 'SLEEPING' ? <span style={{ color: 'var(--text-muted)' }}>Resources frozen to disk. Billing paused.</span> : 
                               env.dns_prefix ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-pure)' }}>
                                  External Endpoint: 
                                  <a href={env.dns_prefix} target="_blank" rel="noreferrer" style={{ color: 'var(--text-pure)', background: 'var(--bg-surface)', border: 'var(--border-subtle)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem' }}>
                                    {env.dns_prefix} <ExternalLink size={12} />
                                  </a>
                                </span>
                               ) : <span style={{ color: 'var(--text-muted)' }}>Awaiting DNS Propagation...</span>}
                            </div>
                          </div>
                          
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: statusColor, background: 'var(--bg-surface)', border: `1px solid ${statusColor}` }}>
                            <StatusIcon size={14} style={{ animation: env.status.includes('ING') ? 'spin 2s linear infinite' : 'none' }} />
                            {env.status}
                          </span>
                        </div>

                        {/* FINOPS WIDGET */}
                        <AnimatePresence>
                          {stats && (
                            <motion.div layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                              <div style={{ background: stats.isFrozen ? 'var(--zg-purple-glow)' : 'var(--bg-void)', border: stats.isFrozen ? '1px dashed var(--zg-purple-border)' : 'var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: 'var(--border-subtle)' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BarChart3 size={14} style={{ color: '#10b981' }} />
                                    {env.status === 'DESTROYED' ? 'Final FinOps Receipt' : 'Real-Time Telemetry'}
                                    {stats.isFrozen && env.status !== 'DESTROYED' && <span style={{ color: 'var(--zg-purple-core)', background: 'var(--zg-purple-glow)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem' }}>Paused</span>}
                                  </p>
                                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {stats.savingsPercent}% Spot Optimization
                                  </span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Uptime</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', color: stats.isFrozen ? 'var(--text-muted)' : 'var(--text-pure)' }}>{stats.uptimeString}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Spot Rate</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--zg-purple-core)' }}>${stats.spotCost}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>On-Demand</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#4b5563', textDecoration: 'line-through' }}>${stats.odCost}</p></div>
                                  <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Capital Saved</p><p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace', color: '#10b981' }}>+${stats.savings}</p></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: 'var(--border-subtle)' }}>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-void)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                            <Server size={14} /> EC2_ID: <span style={{ color: 'var(--text-pure)' }}>{env.instance_id || 'PENDING_ALLOCATION'}</span>
                          </p>
                          {(env.status === 'RUNNING' || env.status === 'SLEEPING') && (
                            <button 
                              onClick={() => handleDestroy(env)} disabled={isPipelineBusy} 
                              style={{ background: 'transparent', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)', cursor: isPipelineBusy ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 700, transition: 'all var(--transition-fast)', opacity: isPipelineBusy ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                              <Trash2 size={14} /> Terminate Architecture
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

      {/* ---------------- IAM SETTINGS TAB (Logic Preserved, Inheriting Global Styles) ---------------- */}
      <AnimatePresence mode="wait">
        {currentWorkspace && activeTab === 'iam' && (
          <motion.div key="iam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-panel" style={{ padding: '3rem' }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-pure)', fontSize: '2rem', marginBottom: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield size={32} style={{ color: 'var(--zg-purple-core)' }} /> Security & IAM Bindings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '700px' }}>
              Deploying infrastructure requires authorization. Grant the Zegion Engine secure, temporary access to provision environments in your AWS account using a keyless AssumeRole architecture.
            </p>

            <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ background: 'var(--bg-void)', border: 'var(--border-subtle)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Targeting Workspace:</span>
                <span style={{ color: 'var(--text-pure)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CloudCog size={18} style={{ color: 'var(--zg-purple-core)' }} /> {currentWorkspace}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assumed AWS Role ARN</label>
                <input 
                  type="text" value={iamRoleArn} onChange={(e) => setIamRoleArn(e.target.value)} 
                  placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" required 
                  style={{ background: 'var(--bg-void)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-pure)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', outline: 'none', width: '100%', fontSize: '1rem', fontFamily: 'monospace' }}
                />
              </div>
              
              <button type="submit" disabled={iamStatus === 'saving'} style={{ background: 'var(--zg-purple-core)', color: 'var(--text-pure)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', width: 'fit-content', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: iamStatus === 'saving' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: iamStatus === 'saving' ? 0.7 : 1 }}>
                {iamStatus === 'saving' ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Establishing Trust Link...</> : <><Shield size={18} /> Secure Integration</>}
              </button>
            </form>

            <AnimatePresence>
              {iamStatus === 'success' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: 'var(--radius-sm)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                  <Shield size={20} /> Cryptographic handshake complete. Engine is authorized.
                </motion.div>
              )}
              {iamStatus === 'error' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: 'var(--radius-sm)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
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