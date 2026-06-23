import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Server, CheckCircle2, XCircle, ExternalLink, Loader2, 
  ChevronDown, TerminalSquare, Cpu, DollarSign, Clock, Activity, Box 
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// ----------------------------------------------------------------------
// ⚡ PHYSICS SPECS
// ----------------------------------------------------------------------
const springCrisp = { type: "spring", stiffness: 450, damping: 32, mass: 0.8 };
const springPage = { type: "spring", stiffness: 280, damping: 28 };
const springModal = { type: "spring", stiffness: 400, damping: 24, velocity: 2 };
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
const itemVariants = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: springPage } };

// ----------------------------------------------------------------------
// 📊 LIGHTWEIGHT CUSTOM SVG CHART (Replaces Recharts)
// ----------------------------------------------------------------------
const TelemetryChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const mapToPath = (key) => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d[key] || 0);
      return `${x},${y}`;
    });
    return `0,100 ${points.join(' ')} 100,100`;
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="gradRam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradCpu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--vz-gold-core)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--vz-gold-core)" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" strokeWidth="0.5" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" strokeWidth="0.5" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" strokeWidth="0.5" />

      <polygon points={mapToPath('ram')} fill="url(#gradRam)" />
      <polyline points={mapToPath('ram').replace('0,100 ', '').replace(' 100,100', '')} fill="none" stroke="#a78bfa" strokeWidth="1.5" />

      <polygon points={mapToPath('cpu')} fill="url(#gradCpu)" />
      <polyline points={mapToPath('cpu').replace('0,100 ', '').replace(' 100,100', '')} fill="none" stroke="var(--vz-gold-core)" strokeWidth="1.5" />
    </svg>
  );
};

// ----------------------------------------------------------------------
// ⚡ MAIN PRODUCTION DASHBOARD
// ----------------------------------------------------------------------
export default function Production() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const navigate = useNavigate();

  // --- UI & WIZARD STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [currentDeploymentId, setCurrentDeploymentId] = useState(null);
  const [step, setStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [launchStatus, setLaunchStatus] = useState('idle');
  const [instanceType, setInstanceType] = useState('t3.small');
  const [volumeSize, setVolumeSize] = useState(30);

  // --- TELEMETRY & CINEMATIC STATE ---
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isLightning, setIsLightning] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  const { metrics } = useTelemetry();

  const yamlTemplate = `version: 1.0

# ====================================================================
# 🌩️ VELZION STORM CONTRACT
# ====================================================================
services:
  frontend:
    path: ./frontend       
    port: 80               
    env:
      - VITE_API_URL=/api

  backend:
    path: ./backend        
    port: 5000             
    needs: [database]      
    env:
      - NODE_ENV=production

database:
  engine: mongo:latest

routes:
  /: frontend              
  /api: backend            
`;

  useEffect(() => {
    const storedUser = localStorage.getItem('velzion_user');
    const storedRepos = localStorage.getItem('velzion_repos'); 
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setRepos(storedRepos ? JSON.parse(storedRepos) : []); 
    fetchDeployments();
  }, [navigate]);

  useEffect(() => {
    let interval;
    const activeStatuses = ['PROVISIONING', 'COMPILING', 'DESTROYING', 'RUNNING'];
    if (deployments.some(d => activeStatuses.includes(d.status))) {
      interval = setInterval(fetchDeployments, 5000); 
    }
    return () => clearInterval(interval);
  }, [deployments]);

  useEffect(() => {
    const clock = setInterval(() => setTimeTick(t => t + 1), 1000);
    const stormInterval = setInterval(() => {
      setTimeout(() => {
        setIsLightning(true);
        setTimeout(() => setIsLightning(false), 1200); 
      }, Math.random() * 10000);
    }, 20000); 
    return () => { clearInterval(clock); clearInterval(stormInterval); };
  }, []);

  const fetchDeployments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/`);
      setDeployments(res.data);
    } catch (err) { console.error("Failed to fetch deployments", err); }
  };

  const handleStartDeployment = async () => {
    if (!selectedRepo) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/`, {
        github_repo_url: `https://github.com/${selectedRepo}`,
        branch: 'main',
        instance_type: instanceType,
        volume_size: parseInt(volumeSize, 10)
      });
      setCurrentDeploymentId(res.data.id);
      setStep(2);
    } catch (err) { console.error("Failed to initialize deployment", err); }
  };

  const handleCommitToGitHub = () => {
    const encodedYaml = encodeURIComponent(yamlTemplate);
    const githubUrl = `https://github.com/${selectedRepo}/new/main?filename=velzion.yaml&value=${encodedYaml}`;
    window.open(githubUrl, '_blank');
    setStep(3);
  };

  const handleVerifyContract = async () => {
    setVerificationStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/${currentDeploymentId}/verify_contract/`);
      setVerificationStatus('success');
    } catch (err) { setVerificationStatus('error'); }
  };

  const handleLaunchProduction = async () => {
    setLaunchStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/${currentDeploymentId}/trigger_deploy/`);
      setLaunchStatus('success');
      setIsModalOpen(false);
      fetchDeployments();
    } catch (err) { setLaunchStatus('error'); }
  };

  const handleDestroyCluster = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("CRITICAL WARNING: This will permanently destroy the AWS hardware and wipe all persistent data. Proceed?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/${id}/destroy_cluster/`);
      fetchDeployments(); 
      setExpandedRowId(null);
    } catch (err) { console.error("Failed to terminate cluster", err); }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const calculateUptime = (dep) => {
    if (dep.status !== 'RUNNING') return "Awaiting boot...";
    if (!dep.ascended_at) return "00:00:00";
    const diff = (new Date() - new Date(dep.ascended_at)) / 1000;
    if (diff < 0) return "00:00:00";
    const h = Math.floor(diff / 3600).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(diff % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const calculateCost = (dep) => {
    if (dep.status !== 'RUNNING' && dep.status !== 'DESTROYED') return "0.00000";
    if (!dep.ascended_at) return "0.00000";
    const endTime = (dep.status === 'RUNNING') ? new Date() : new Date(dep.updated_at);
    const diffHours = (endTime - new Date(dep.ascended_at)) / (1000 * 3600);
    return (Math.max(0, diffHours) * 0.0208).toFixed(5);
  };

  const sortedDeployments = [...deployments].filter(dep => dep.status !== 'VERIFYING' && !(dep.status === 'OFFLINE' && !dep.ascended_at)).reverse();

  return (
    <motion.div 
      animate={isLightning ? { x: [-2, 2, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <AnimatePresence>
        {isLightning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0, 0.5, 0] }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} style={{ position: 'absolute', inset: -50, background: 'var(--vz-gold-core)', zIndex: 0, pointerEvents: 'none' }} />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <span style={{ color: 'var(--vz-gold-core)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Production Operations</span>
            <h1 style={{ margin: '0.5rem 0 0 0', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-pure)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Zap size={36} strokeWidth={1.5} style={{ color: 'var(--vz-gold-core)', fill: 'var(--vz-gold-core)' }} /> Velzard Clusters
            </h1>
          </div>
          <button 
            onClick={() => { setIsModalOpen(true); setStep(1); }}
            style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, cursor: 'pointer', transition: 'all var(--transition-fast)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 20px rgba(245, 203, 92, 0.3), inset 0 0 10px rgba(251, 191, 36, 0.1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--vz-gold-core)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.6)'; e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'; e.currentTarget.style.color = 'var(--vz-gold-core)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 203, 92, 0.3), inset 0 0 10px rgba(251, 191, 36, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Zap size={16} strokeWidth={2} /> Initialize Cluster
          </button>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="glass-panel spotlight-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-layer-2)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' }}>Entity Target</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' }}>Current State</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' }}>Gateway IP</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeployments.length === 0 ? (
                <motion.tr variants={itemVariants}>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
                    <Server size={48} strokeWidth={1.5} style={{ opacity: 0.3, margin: '0 auto 1rem', color: 'var(--vz-gold-core)' }} />
                    <p style={{ fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>No clusters active in this workspace.</p>
                  </td>
                </motion.tr>
              ) : (
                sortedDeployments.map(dep => {
                  const isExpanded = expandedRowId === dep.id;
                  const isTerminated = ['OFFLINE', 'DESTROYED', 'DESTROYING', 'FAILED'].includes(dep.status);
                  
                  return (
                    <React.Fragment key={dep.id}>
                      <motion.tr variants={itemVariants} style={{ cursor: 'pointer', background: isExpanded ? 'var(--vz-gold-glow)' : 'transparent', transition: 'background var(--transition-fast)', borderBottom: isExpanded ? 'none' : '1px solid var(--border-subtle)' }} onClick={() => toggleRowExpansion(dep.id)}>
                        <td style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--text-pure)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <ChevronDown size={18} strokeWidth={1.5} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', color: 'var(--vz-gold-core)' }} />
                          {dep.github_repo_url.replace('https://github.com/', '')}
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', background: dep.status === 'RUNNING' ? 'rgba(245, 203, 92, 0.15)' : 'var(--bg-layer-2)', color: dep.status === 'RUNNING' ? 'var(--vz-gold-core)' : 'var(--text-muted)', border: `1px solid ${dep.status === 'RUNNING' ? 'var(--vz-gold-border)' : 'var(--border-subtle)'}` }}>
                            {dep.status === 'RUNNING' ? <><Zap size={12} fill="var(--vz-gold-core)"/> RUNNING</> : dep.status === 'PROVISIONING' ? <><Loader2 size={12} style={{ animation: 'spin 2s linear infinite' }}/> PROVISIONING</> : dep.status === 'OFFLINE' ? 'TERMINATED' : dep.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--vz-gold-core)', fontWeight: 600, fontSize: '0.85rem' }}>
                          {dep.elastic_ip && !isTerminated ? (
                            <a href={`http://${dep.elastic_ip}`} target="_blank" rel="noreferrer" style={{ color: 'var(--vz-gold-core)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                              {dep.elastic_ip} <ExternalLink size={12} strokeWidth={1.5} />
                            </a>
                          ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                        </td>
                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                          {!isTerminated ? (
                            <button style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => handleDestroyCluster(dep.id, e)}>
                              <XCircle size={14} strokeWidth={1.5} /> Terminate
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>{dep.status === 'DESTROYING' ? 'TERMINATING...' : 'TERMINATED'}</span>
                          )}
                        </td>
                      </motion.tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={springCrisp} style={{ background: 'var(--bg-void)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <td colSpan="4" style={{ padding: '0 2rem 2.5rem 2rem' }}>
                              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--vz-gold-border)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1.5rem' }}>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Cpu size={14} style={{ color: 'var(--vz-gold-core)' }} /> Compute Core</div>
                                      <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 800, color: 'var(--text-pure)', fontFamily: 'var(--font-mono)' }}>AWS {dep.instance_type || 't3.small'}</div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{dep.volume_size || 30} GB EBS Storage</div>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.25rem' }}>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Clock size={14} style={{ color: '#a78bfa' }} /> Server Uptime</div>
                                      <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{calculateUptime(dep)}</div>
                                    </div>
                                    <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><DollarSign size={14} style={{ color: '#10b981' }} /> Server Cost</div>
                                      <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>${calculateCost(dep)}</div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Rate: $0.0208 / hr</div>
                                    </div>
                                  </div>

                                  <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={14} style={{ color: 'var(--vz-gold-core)' }} /> Live OTLP Telemetry</div>
                                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                        <span style={{ color: 'var(--vz-gold-core)' }}>⚡ CPU Core</span>
                                        <span style={{ color: '#a78bfa' }}>⚡ RAM Usage</span>
                                      </div>
                                    </div>
                                    <div style={{ flex: 1, minHeight: '200px', position: 'relative' }}>
                                      {dep.status === 'RUNNING' && dep.telemetry_history?.length > 0 ? (
                                        <TelemetryChart data={dep.telemetry_history} />
                                      ) : (
                                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem' }}>
                                          <Loader2 size={24} style={{ animation: 'spin 2s linear infinite', color: 'var(--vz-gold-core)' }} />
                                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Establishing OTLP Uplink...</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="glass-panel" style={{ overflowY: 'auto', padding: '1.5rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Box size={14} style={{ color: '#38bdf8' }} /> Cluster Metadata</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                      <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Cluster Serial Number (ID)</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-pure)', fontFamily: 'var(--font-mono)' }}>{dep.id}</div>
                                      </div>
                                      <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Initialization Time</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-pure)', fontFamily: 'var(--font-mono)' }}>{new Date(dep.created_at).toLocaleString()}</div>
                                      </div>
                                      {isTerminated && dep.updated_at && (
                                        <div>
                                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Termination Time</div>
                                          <div style={{ fontSize: '0.85rem', color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{new Date(dep.updated_at).toLocaleString()}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>


                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px) saturate(180%)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <motion.div variants={itemVariants} initial="hidden" animate="show" exit="hidden" transition={springModal} className="glass-panel" style={{ width: '100%', maxWidth: '650px', padding: '3rem', position: 'relative' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-pure)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <XCircle size={24} strokeWidth={1.5} />
              </button>
              
              <h2 style={{ marginTop: 0, color: 'var(--text-pure)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                <Zap style={{ color: 'var(--vz-gold-core)', fill: 'var(--vz-gold-core)' }} size={28} /> Initialize Cluster
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>Define your architectural contract to summon infrastructure.</p>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} style={{ flex: 1, position: 'relative', height: '4px', background: 'var(--bg-layer-2)', borderRadius: '2px' }}>
                    {step >= s && <motion.div layoutId="stepperProgress" initial={{ width: 0 }} animate={{ width: '100%' }} transition={springCrisp} style={{ position: 'absolute', inset: 0, background: 'var(--vz-gold-core)', borderRadius: '2px' }} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={springPage}>
                  <label style={{ display: 'block', color: 'var(--vz-gold-core)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Repository</label>
                  
                  <div style={{ position: 'relative', width: '100%', marginBottom: '2rem', userSelect: 'none' }}>
                    <div style={{ width: '100%', padding: '1.25rem', background: 'var(--bg-layer-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-pure)', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <span style={{ color: selectedRepo ? 'var(--text-pure)' : 'var(--text-muted)', fontWeight: selectedRepo ? 700 : 400 }}>{selectedRepo || "Select authorized repository..."}</span>
                      <ChevronDown size={18} strokeWidth={1.5} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform var(--transition-smooth)', color: 'var(--vz-gold-core)' }} />
                    </div>
                    {isDropdownOpen && (
                      <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: 'var(--bg-layer-2)', backdropFilter: 'blur(24px)', border: '1px solid var(--vz-gold-core)', borderRadius: 'var(--radius-sm)', maxHeight: '250px', overflowY: 'auto', zIndex: 200, boxShadow: 'var(--shadow-void)' }}>
                        {repos.length === 0 ? (
                          <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No repositories found.</div>
                        ) : (
                          repos.map(repo => (
                            <div key={repo} style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', transition: 'all var(--transition-fast)' }} onClick={() => { setSelectedRepo(repo); setIsDropdownOpen(false); }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--vz-gold-core)'; e.currentTarget.style.background = 'var(--vz-gold-glow)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                              {repo}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--vz-gold-core)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hardware Tier</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['t3.small', 't3.medium', 'c5.large'].map(type => (
                          <div key={type} onClick={() => setInstanceType(type)} style={{ padding: '1rem', border: `1px solid ${instanceType === type ? 'var(--vz-gold-core)' : 'var(--border-subtle)'}`, background: instanceType === type ? 'var(--vz-gold-glow)' : 'var(--bg-layer-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-pure)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{type}</span>
                            {instanceType === type && <CheckCircle2 size={16} strokeWidth={1.5} color="var(--vz-gold-core)" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', color: 'var(--vz-gold-core)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>EBS Storage (GB)</label>
                      <div style={{ padding: '1.5rem', background: 'var(--bg-layer-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-pure)', fontFamily: 'var(--font-mono)' }}>{volumeSize} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>GB</span></div>
                        <input type="range" min="10" max="200" step="10" value={volumeSize} onChange={(e) => setVolumeSize(e.target.value)} style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', accentColor: 'var(--vz-gold-core)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>10 GB</span>
                          <span>200 GB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button style={{ width: '100%', justifyContent: 'center', padding: '1.25rem', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)', borderRadius: 'var(--radius-sm)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: selectedRepo ? 'pointer' : 'not-allowed', opacity: selectedRepo ? 1 : 0.5, boxShadow: 'inset 0 0 10px rgba(251, 191, 36, 0.1)', transition: 'all 0.2s' }} disabled={!selectedRepo} onClick={handleStartDeployment} onMouseEnter={e => { if(selectedRepo) { e.currentTarget.style.background = 'var(--vz-gold-core)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.6)'; e.currentTarget.style.transform = 'scale(0.99)'; } }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'; e.currentTarget.style.color = 'var(--vz-gold-core)'; e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(251, 191, 36, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    Generate Contract <ExternalLink size={18} strokeWidth={2} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={springPage}>
                  <p style={{ color: 'var(--text-pure)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Blueprint generated for <b style={{color: 'var(--vz-gold-core)'}}>{selectedRepo}</b>.</p>
                  <div style={{ background: '#000', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'pre-wrap', marginBottom: '2.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {yamlTemplate}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-pure)', padding: '1rem', borderRadius: 'var(--radius-sm)', flex: 1, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setStep(1)} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-layer-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Go Back</button>
                    <button onClick={handleCommitToGitHub} style={{ flex: 2, justifyContent: 'center', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'inset 0 0 10px rgba(251, 191, 36, 0.1)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--vz-gold-core)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.6)'; e.currentTarget.style.transform = 'scale(0.99)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'; e.currentTarget.style.color = 'var(--vz-gold-core)'; e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(251, 191, 36, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                      Commit via GitHub <ExternalLink size={16} strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={springPage}>
                  <div style={{ background: 'var(--bg-layer-2)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '2.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '2.5rem', boxShadow: 'inset 0 0 20px rgba(251, 191, 36, 0.05)' }}>
                    <h3 style={{ color: 'var(--text-pure)', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Awaiting Verification</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>Velzard will scan the <code>main</code> branch of your repository for the <code>velzion.yaml</code> file to lock the state.</p>
                    
                    {verificationStatus === 'idle' && (
                      <button style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--vz-gold-core)', color: 'var(--vz-gold-core)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 15px rgba(251, 191, 36, 0.2)' }} onClick={handleVerifyContract} onMouseEnter={e => e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'}>Scan Remote Repository</button>
                    )}
                    {verificationStatus === 'loading' && (
                      <button disabled style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Loader2 size={16} style={{ animation: 'spin 2s linear infinite' }} /> Verifying GitHub Contract...</button>
                    )}
                    {verificationStatus === 'success' && (
                      <div style={{ color: 'var(--sys-success)', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1rem', background: 'rgba(34, 197, 94, 0.1)', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--sys-success)', textTransform: 'uppercase', boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' }}>
                        <CheckCircle2 size={20} strokeWidth={2} /> Contract Secured
                      </div>
                    )}
                  </div>
                  <button style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', fontSize: '1.25rem', background: 'rgba(251, 191, 36, 0.15)', color: 'var(--vz-gold-core)', border: '1px solid var(--vz-gold-border)', borderRadius: 'var(--radius-sm)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: verificationStatus !== 'success' || launchStatus === 'loading' ? 'not-allowed' : 'pointer', opacity: verificationStatus !== 'success' || launchStatus === 'loading' ? 0.5 : 1, transition: 'all 0.2s', boxShadow: 'inset 0 0 20px rgba(251, 191, 36, 0.15), 0 0 20px rgba(251, 191, 36, 0.2)' }} disabled={verificationStatus !== 'success' || launchStatus === 'loading'} onClick={handleLaunchProduction} onMouseEnter={e => { if(verificationStatus === 'success' && launchStatus !== 'loading') { e.currentTarget.style.background = 'var(--vz-gold-core)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = '0 0 40px rgba(251, 191, 36, 0.8)'; e.currentTarget.style.transform = 'scale(0.99)'; } }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)'; e.currentTarget.style.color = 'var(--vz-gold-core)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(251, 191, 36, 0.15), 0 0 20px rgba(251, 191, 36, 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    {launchStatus === 'loading' ? <><Loader2 size={24} style={{ animation: 'spin 2s linear infinite' }} /> Executing Deployment...</> : <><Zap size={24} strokeWidth={2} /> IGNITE CLUSTER</>}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}