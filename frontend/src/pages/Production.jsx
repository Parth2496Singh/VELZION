import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Server, CheckCircle2, XCircle, ExternalLink, Loader2, Play, 
  GitMerge, ChevronDown, TerminalSquare, AlertTriangle, Cpu, DollarSign, Clock, Activity, Box 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart 
} from 'recharts';

axios.defaults.withCredentials = true;

const Production = () => {
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

  // --- TELEMETRY & CINEMATIC STATE ---
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isLightning, setIsLightning] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

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

  // --- 1. INITIALIZE & POLL STATE ---
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

  // Automatic Background Polling Engine
  useEffect(() => {
    let interval;
    const activeStatuses = ['PROVISIONING', 'COMPILING', 'DESTROYING', 'RUNNING'];
    if (deployments.some(d => activeStatuses.includes(d.status))) {
      interval = setInterval(fetchDeployments, 5000); 
    }
    return () => clearInterval(interval);
  }, [deployments]);

  // Cinematic Lightning Engine & Clock
  useEffect(() => {
    const clock = setInterval(() => setTimeTick(t => t + 1), 1000);
    const stormInterval = setInterval(() => {
      // Trigger lightning strike every 15-25 seconds randomly
      setTimeout(() => {
        setIsLightning(true);
        setTimeout(() => setIsLightning(false), 1200); // Strike lasts 1.2s
      }, Math.random() * 10000);
    }, 20000); 

    return () => {
      clearInterval(clock);
      clearInterval(stormInterval);
    };
  }, []);

  const fetchDeployments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/`);
      setDeployments(res.data);
    } catch (err) {
      console.error("Failed to fetch deployments", err);
    }
  };

  // --- 2. API ACTIONS ---
  const handleStartDeployment = async () => {
    if (!selectedRepo) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/`, {
        github_repo_url: `https://github.com/${selectedRepo}`,
        branch: 'main'
      });
      setCurrentDeploymentId(res.data.id);
      setStep(2);
    } catch (err) {
      console.error("Failed to initialize deployment", err);
    }
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
    } catch (err) {
      setVerificationStatus('error');
    }
  };

  const handleLaunchProduction = async () => {
    setLaunchStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/${currentDeploymentId}/trigger_deploy/`);
      setLaunchStatus('success');
      setIsModalOpen(false);
      fetchDeployments();
    } catch (err) {
      setLaunchStatus('error');
    }
  };

  const handleDestroyCluster = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("CRITICAL WARNING: This will permanently destroy the AWS hardware and wipe all persistent data. Proceed?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/velzard/deployments/${id}/destroy_cluster/`);
      fetchDeployments(); 
      setExpandedRowId(null);
    } catch (err) {
      console.error("Failed to terminate cluster", err);
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // --- UTILITY ENGINE ---
  const calculateUptime = (createdAt) => {
    const diff = (new Date() - new Date(createdAt)) / 1000;
    if (diff < 0) return "00:00:00";
    const h = Math.floor(diff / 3600).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(diff % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const calculateCost = (createdAt) => {
    const diffHours = (new Date() - new Date(createdAt)) / (1000 * 3600);
    return (Math.max(0, diffHours) * 0.0208).toFixed(5);
  };

  const sortedDeployments = [...deployments].reverse();

  return (
    <div className={`vz-app-container ${isLightning ? 'storm-shake' : ''}`}>
      
      {/* --- CINEMATIC BACKGROUND LAYERS --- */}
      <div className="layer-void"></div>
      <div className="layer-clouds"></div>
      <div className={`layer-ghidorah ${isLightning ? 'ghidorah-reveal' : ''}`}>
        <div className="dragon-eye left-eye"></div>
        <div className="dragon-eye right-eye"></div>
      </div>
      <div className={`layer-lightning ${isLightning ? 'lightning-flash' : ''}`}></div>

      <style>{`
        :root {
          --bg-void: #030303;
          --gold-core: #FFB800;
          --gold-glow: rgba(255, 184, 0, 0.5);
          --gold-dim: rgba(255, 184, 0, 0.1);
          --lightning-bright: #FFE57A;
          --panel-bg: rgba(10, 10, 10, 0.65);
          --border-gold: rgba(255, 200, 60, 0.2);
          --text-main: #f3f4f6;
          --text-muted: #9ca3af;
        }

        body { background-color: var(--bg-void); margin: 0; color: var(--text-main); font-family: 'Inter', sans-serif; overflow-x: hidden; }
        
        /* 🚀 FIXED: App Container is now the absolute base layer */
        .vz-app-container { 
          display: flex; min-height: 100vh; position: relative; 
          background-color: var(--bg-void); 
          overflow: hidden; 
        }
        
        .storm-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }

        /* 🚀 FIXED: Z-indexes are now positive, sitting above the root div but below the UI */
        .layer-void { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 50% -20%, #1a1000 0%, #030303 100%); }
        
        .layer-clouds { 
          position: absolute; inset: 0; z-index: 2; opacity: 0.5;
          background-image: url('https://www.transparenttextures.com/patterns/black-scales.png'); 
          animation: cloud-drift 60s linear infinite;
        }
        @keyframes cloud-drift { from { background-position: 0 0; } to { background-position: 1000px 500px; } }

        .layer-ghidorah {
          position: absolute; inset: 0; z-index: 3; opacity: 0; transition: opacity 0.1s;
          background: radial-gradient(circle at 50% 30%, rgba(0,0,0,0) 0%, #000 70%);
        }
        .ghidorah-reveal { opacity: 0.25; transition: opacity 0.05s; }
        
        .dragon-eye { position: absolute; top: 25%; width: 18px; height: 8px; background: var(--gold-core); border-radius: 50%; box-shadow: 0 0 40px 15px var(--gold-core); filter: blur(1px); }
        .left-eye { left: 45%; transform: rotate(-15deg); }
        .right-eye { left: 55%; transform: rotate(15deg); }

        .layer-lightning { position: absolute; inset: 0; z-index: 4; background: var(--lightning-bright); opacity: 0; pointer-events: none; }
        .lightning-flash { animation: flash-sequence 1.2s ease-out; }
        @keyframes flash-sequence { 0% { opacity: 0; } 10% { opacity: 0.8; } 15% { opacity: 0; } 25% { opacity: 0.5; } 100% { opacity: 0; } }

        /* 🚀 FIXED: Bulletproof Glassmorphism & Energy Veins */
        .storm-glass {
          background: var(--panel-bg); 
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-gold); 
          border-radius: 16px;
          box-shadow: 0 0 50px rgba(255, 184, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.02);
          position: relative; 
          z-index: 10;
        }
        
        /* The Energy Vein Animation */
        .storm-glass::before {
          content: ''; position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px;
          border-radius: 16px; z-index: -1; opacity: 0; transition: opacity 0.3s ease;
          background: linear-gradient(90deg, transparent, rgba(255,184,0,0.8), transparent);
          background-size: 200% 100%;
          animation: vein-flow 2s linear infinite;
        }
        .storm-glass:hover::before { opacity: 1; }
        @keyframes vein-flow { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

        /* Energy Conduit in Sidebar */
        .energy-conduit {
          position: absolute; right: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(to bottom, transparent, var(--gold-glow), var(--gold-core), var(--gold-glow), transparent);
          background-size: 100% 200%; animation: power-flow 3s linear infinite;
        }
        @keyframes power-flow { 0% { background-position: 0 -100%; } 100% { background-position: 0 100%; } }

        /* Push UI to front */
        .vz-sidebar { position: relative; width: 260px; background: rgba(2, 2, 2, 0.85); backdrop-filter: blur(20px); padding: 32px 24px; z-index: 20; border-right: 1px solid rgba(255,255,255,0.05); }
        .vz-main { flex: 1; padding: 50px 70px; position: relative; z-index: 20; }
        
        /* Scrollbars */
        .vz-code-scroll::-webkit-scrollbar { width: 6px; }
        .vz-code-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        .vz-code-scroll::-webkit-scrollbar-thumb { background: var(--border-gold); border-radius: 4px; }
        .vz-code-scroll::-webkit-scrollbar-thumb:hover { background: var(--gold-core); }

        /* Buttons & Badges */
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%); }
        .status-ASCENDED { background: rgba(255, 184, 0, 0.15); color: var(--gold-core); border: 1px solid var(--gold-glow); box-shadow: 0 0 15px var(--gold-dim); }
        .status-STORMBOUND { background: rgba(255, 255, 255, 0.05); color: #ccc; border: 1px dashed rgba(255,255,255,0.2); animation: pulse-white 2s infinite; }
        .status-DESTROYING { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); animation: pulse-red 2s infinite; }
        
        .telemetry-card { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
        .telemetry-value { font-size: 28px; font-weight: 900; color: #fff; margin: 8px 0 4px 0; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .telemetry-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; display: flex; align-items: center; gap: 6px; }

        .btn-ghidorah {
          background: linear-gradient(135deg, #FFB800, #b45309); color: #000; border: none; padding: 14px 28px;
          border-radius: 8px; font-weight: 900; cursor: pointer; transition: 0.3s; display: inline-flex; align-items: center; gap: 10px;
          box-shadow: 0 0 30px rgba(255, 184, 0, 0.3); font-size: 14px; text-transform: uppercase; letter-spacing: 2px;
          position: relative; overflow: hidden;
        }
        .btn-ghidorah:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(255, 184, 0, 0.6); }
      `}</style>

      {/* --- SIDEBAR --- */}
      <div className="vz-sidebar">
        <div className="energy-conduit"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
          <div className="vz-logo-box" style={{ background: 'var(--gold-core)', width: 36, height: 36, borderRadius: 8, boxShadow: '0 0 20px var(--gold-glow)' }}></div>
          <h2 style={{ margin: 0, fontSize: '22px', letterSpacing: '4px', fontWeight: 900, color: '#fff' }}>VELZION</h2>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--gold-core)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '2px', margin: '0 0 20px 10px' }}>Storm Control Plane</p>
        <div className="vz-nav-item"><GitMerge size={18} /> Ephemeral Previews</div>
        <div className="vz-nav-item active"><Server size={18} /> Production Core</div>
        <div className="vz-nav-item"><Zap size={18} /> FinOps Engine</div>
      </div>

      {/* --- MAIN CONTENT HEADER --- */}
      <div className="vz-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <span style={{ color: 'var(--gold-core)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 900 }}>High-Availability Operations</span>
            <h1 className="vz-title" style={{ marginTop: 10 }}>
              <Zap size={40} color="var(--lightning-bright)" fill="var(--gold-core)" /> 
              Velzard Core
            </h1>
          </div>
          <button className="btn-ghidorah" onClick={() => { setIsModalOpen(true); setStep(1); }}>
            <Zap size={16} fill="#000" /> Ignite Cluster
          </button>
        </div>

        {/* --- DEPLOYMENTS MATRIX --- */}
        <motion.div className="storm-glass" style={{ padding: 0 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.8)' }}>
                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-gold)' }}>Entity Target</th>
                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-gold)' }}>Current State</th>
                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-gold)' }}>Gateway IP</th>
                <th style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-gold)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDeployments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                    <Server size={64} style={{ opacity: 0.1, margin: '0 auto 20px', color: 'var(--gold-core)' }} />
                    <p style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>No storms active in this sector.</p>
                  </td>
                </tr>
              ) : (
                sortedDeployments.map(dep => (
                  <React.Fragment key={dep.id}>
                    {/* STANDARD ROW */}
                    <tr 
                      style={{ cursor: 'pointer', background: expandedRowId === dep.id ? 'rgba(255, 184, 0, 0.05)' : 'transparent', transition: '0.2s', borderBottom: expandedRowId === dep.id ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
                      onClick={() => toggleRowExpansion(dep.id)}
                    >
                      <td style={{ padding: '24px', fontWeight: 800, color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ChevronDown size={18} style={{ transform: expandedRowId === dep.id ? 'rotate(180deg)' : 'rotate(-90deg)', transition: '0.3s', color: 'var(--gold-core)' }} />
                        {dep.github_repo_url.replace('https://github.com/', '')}
                      </td>
                      <td style={{ padding: '24px' }}>
                        <span className={`status-badge status-${dep.status === 'RUNNING' ? 'ASCENDED' : 'STORMBOUND'}`}>
                          {dep.status === 'RUNNING' ? <><Zap size={12} fill="var(--gold-core)"/> ⚡ ASCENDED</> : 
                           dep.status === 'PROVISIONING' ? <><Loader2 size={12} className="spin"/> ⚡ STORMBOUND</> : 
                           dep.status}
                        </span>
                      </td>
                      <td style={{ padding: '24px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--lightning-bright)', fontWeight: 600, fontSize: '13px' }}>
                        {dep.elastic_ip ? (
                          <a href={`http://${dep.elastic_ip}`} target="_blank" rel="noreferrer" style={{ color: 'var(--lightning-bright)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                            {dep.elastic_ip} <ExternalLink size={12} />
                          </a>
                        ) : <span style={{ color: '#555' }}>Awaiting...</span>}
                      </td>
                      <td style={{ padding: '24px', textAlign: 'right' }}>
                        <button 
                          style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', padding: '8px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }} 
                          onClick={(e) => handleDestroyCluster(dep.id, e)}
                        >
                          <XCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/> Terminate
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED TELEMETRY DASHBOARD */}
                    <AnimatePresence>
                      {expandedRowId === dep.id && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <td colSpan="4" style={{ padding: '0 30px 40px 30px' }}>
                            <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 184, 0, 0.2)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>
                                
                                {/* COL 1: ECONOMICS & HARDWARE */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  <div className="telemetry-card">
                                    <div className="telemetry-label"><Cpu size={14} color="var(--gold-core)" /> Compute Core</div>
                                    <div className="telemetry-value" style={{ fontSize: '24px' }}>AWS t3.small</div>
                                    <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '4px' }}>2 vCPU • 2 GiB Memory</div>
                                  </div>
                                  <div className="telemetry-card">
                                    <div className="telemetry-label"><Clock size={14} color="#a78bfa" /> Storm Duration</div>
                                    <div className="telemetry-value" style={{ color: '#a78bfa' }}>{calculateUptime(dep.created_at)}</div>
                                  </div>
                                  <div className="telemetry-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.05)' }}>
                                    <div className="telemetry-label"><DollarSign size={14} color="#34d399" /> Accrued Energy Cost</div>
                                    <div className="telemetry-value" style={{ color: '#34d399' }}>${calculateCost(dep.created_at)}</div>
                                    <div style={{ color: '#a1a1aa', fontSize: '12px', marginTop: '4px' }}>Rate: $0.0208 / hr</div>
                                  </div>
                                </div>

                                {/* COL 2: REAL-TIME GRAPHS (OTLP DATA) */}
                                <div className="telemetry-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div className="telemetry-label"><Activity size={14} color="var(--gold-core)" /> Live Pulse Telemetry</div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                                      <span style={{ color: 'var(--gold-core)', textShadow: '0 0 10px var(--gold-glow)' }}>⚡ CPU Core</span>
                                      <span style={{ color: '#a78bfa', textShadow: '0 0 10px rgba(167, 139, 250, 0.5)' }}>⚡ RAM Matrix</span>
                                    </div>
                                  </div>
                                  <div style={{ flex: 1, minHeight: '220px' }}>
                                    {dep.status === 'RUNNING' && dep.telemetry_history?.length > 0 ? (
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dep.telemetry_history}>
                                          <defs>
                                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="var(--gold-core)" stopOpacity={0.6}/>
                                              <stop offset="95%" stopColor="var(--gold-core)" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.6}/>
                                              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                          <XAxis dataKey="time" stroke="#444" fontSize={10} tickMargin={10} />
                                          <YAxis stroke="#444" fontSize={10} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                                          <Tooltip 
                                            contentStyle={{ background: 'rgba(5,5,5,0.9)', border: '1px solid var(--gold-core)', borderRadius: '8px', backdropFilter: 'blur(10px)' }} 
                                            itemStyle={{ fontSize: '13px', fontWeight: 900, fontFamily: 'JetBrains Mono' }}
                                            labelStyle={{ color: '#9ca3af', fontSize: '11px' }}
                                          />
                                          <Area type="monotone" dataKey="ram" stroke="#a78bfa" fillOpacity={1} fill="url(#colorRam)" strokeWidth={2} isAnimationActive={false} />
                                          <Area type="monotone" dataKey="cpu" stroke="var(--gold-core)" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} isAnimationActive={false} />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    ) : (
                                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555', gap: 10 }}>
                                        <Loader2 size={24} className="spin" color="var(--gold-core)" />
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Establishing OTLP Uplink...</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* COL 3: CONTAINER MATRIX (SCALE GLASS) */}
                                <div className="telemetry-card" style={{ overflowY: 'auto', padding: '24px' }}>
                                  <div className="telemetry-label" style={{ marginBottom: '20px' }}><Box size={14} color="#38bdf8" /> Dragon Scale Matrix</div>
                                  {dep.status === 'RUNNING' && dep.container_status?.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                      {dep.container_status.map(container => (
                                        <div key={container.ID} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,184,0,0.1)', padding: '14px', clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)', position: 'relative' }}>
                                          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: container.State.includes('Up') ? 'var(--gold-core)' : '#f87171' }}></div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingLeft: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>{container.Names}</span>
                                            <span style={{ fontSize: '10px', fontWeight: 900, color: container.State.includes('Up') ? 'var(--gold-core)' : '#f87171', letterSpacing: '1px' }}>
                                              {container.State.includes('Up') ? '⚡ ACTIVE' : 'DOWN'}
                                            </span>
                                          </div>
                                          <div style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'JetBrains Mono', paddingLeft: '8px' }}>
                                            {container.Ports || 'Internal Network'}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div style={{ color: '#555', fontSize: '11px', textAlign: 'center', marginTop: '60px', textTransform: 'uppercase', letterSpacing: '2px' }}>Awaiting Scale Boot...</div>
                                  )}
                                </div>
                              </div>

                              {/* TERMINAL LOGS ROW */}
                              <div style={{ marginTop: '24px', background: '#030303', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>
                                  <TerminalSquare size={14} color="var(--gold-core)" /> Live Output Stream
                                </div>
                                <div className="vz-code-scroll" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#fff', maxHeight: '160px', overflowY: 'auto', lineHeight: '1.8' }}>
                                  <div style={{ color: '#555' }}>[{new Date().toISOString().split('T')[1].slice(0,8)}] Storm core initialized.</div>
                                  <div style={{ color: '#555' }}>[{new Date().toISOString().split('T')[1].slice(0,8)}] Node allocation: {dep.aws_instance_id || 'Pending'}</div>
                                  {dep.status === 'PROVISIONING' && <div><span style={{color:'var(--gold-core)'}}>⚡</span> Negotiating raw compute from AWS matrix...</div>}
                                  {dep.status === 'COMPILING' && <div><span style={{color:'var(--gold-core)'}}>⚡</span> Hardware acquired. Building container topology...</div>}
                                  {dep.status === 'RUNNING' && <div><span style={{color:'#34d399'}}>▶</span> Gateway Nginx bound to {dep.elastic_ip}. OTLP sidecar active.</div>}
                                  <div style={{ marginTop: '6px', animation: 'pulse-gold 1s infinite', color: 'var(--gold-core)' }}>_</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* THE DEPLOYMENT WIZARD MODAL                  */}
      {/* ========================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="storm-glass" style={{ width: '100%', maxWidth: '700px', padding: '50px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.5, transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.opacity=1} onMouseOut={e => e.currentTarget.style.opacity=0.5}><XCircle size={28} /></button>
            
            <h2 style={{ marginTop: 0, color: '#fff', fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-1px' }}>
              <Zap color="var(--gold-core)" fill="var(--gold-core)" size={32} /> Initialize Storm
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px', lineHeight: '1.6' }}>Define your architectural contract to summon infrastructure.</p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
              <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--gold-core)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', boxShadow: step >= 1 ? '0 0 15px var(--gold-glow)' : 'none', transition: '0.5s' }}></div>
              <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--gold-core)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', boxShadow: step >= 2 ? '0 0 15px var(--gold-glow)' : 'none', transition: '0.5s' }}></div>
              <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--gold-core)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', boxShadow: step >= 3 ? '0 0 15px var(--gold-glow)' : 'none', transition: '0.5s' }}></div>
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <label style={{ display: 'block', color: 'var(--gold-core)', fontSize: '12px', fontWeight: 900, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>Target Repository</label>
                
                <div style={{ position: 'relative', width: '100%', marginBottom: '30px', userSelect: 'none' }}>
                  <div style={{ width: '100%', padding: '20px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '12px', color: '#fff', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.3s' }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span style={{ color: selectedRepo ? '#fff' : 'var(--text-muted)', fontWeight: selectedRepo ? 700 : 400 }}>{selectedRepo || "Select authorized repository..."}</span>
                    <ChevronDown size={20} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s', color: 'var(--gold-core)' }} />
                  </div>
                  {isDropdownOpen && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#0a0a0a', border: '1px solid var(--gold-core)', borderRadius: '12px', maxHeight: '250px', overflowY: 'auto', zIndex: 200, boxShadow: '0 20px 50px rgba(0,0,0,1)' }}>
                      {repos.length === 0 ? (
                        <div style={{ padding: '16px', color: 'var(--text-muted)' }}>No repositories found.</div>
                      ) : (
                        repos.map(repo => (
                          <div 
                            key={repo} 
                            style={{ padding: '16px 20px', color: 'var(--text-muted)', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}
                            onClick={() => { setSelectedRepo(repo); setIsDropdownOpen(false); }}
                            onMouseOver={e => { e.currentTarget.style.color = 'var(--gold-core)'; e.currentTarget.style.paddingLeft = '28px'; e.currentTarget.style.background = 'rgba(255,184,0,0.05)'; }}
                            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.paddingLeft = '20px'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            {repo}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button className="btn-ghidorah" style={{ width: '100%', justifyContent: 'center', padding: '20px' }} disabled={!selectedRepo} onClick={handleStartDeployment}>
                  Generate Contract <ExternalLink size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <p style={{ color: '#fff', fontSize: '15px', marginBottom: '20px' }}>Blueprint generated for <b style={{color: 'var(--gold-core)'}}>{selectedRepo}</b>.</p>
                <div className="vz-code-scroll" style={{ background: '#000', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace', color: '#a1a1aa', fontSize: '13px', whiteSpace: 'pre-wrap', marginBottom: '40px', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)', maxHeight: '350px', overflowY: 'auto' }}>
                  {yamlTemplate}
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '16px', borderRadius: '8px', flex: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => setStep(1)}>Go Back</button>
                  <button className="btn-ghidorah" onClick={handleCommitToGitHub} style={{ flex: 2, justifyContent: 'center' }}>
                    Commit via GitHub <ExternalLink size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px dashed var(--gold-core)', padding: '40px', borderRadius: '16px', textAlign: 'center', marginBottom: '40px' }}>
                  <h3 style={{ color: '#fff', margin: '0 0 16px 0', fontSize: '22px' }}>Awaiting Uplink Verification</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '30px', lineHeight: '1.5' }}>Velzard will scan the <code>main</code> branch of your repository for the <code>velzion.yaml</code> file to lock the state.</p>
                  
                  {verificationStatus === 'idle' && (
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--gold-core)', color: 'var(--gold-core)', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }} onClick={handleVerifyContract}>Scan Remote Repository</button>
                  )}
                  {verificationStatus === 'loading' && (
                    <button disabled style={{ background: 'transparent', border: '1px solid #555', color: '#555', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}><Loader2 size={16} className="spin" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} /> Establishing GitHub Uplink...</button>
                  )}
                  {verificationStatus === 'success' && (
                    <div style={{ color: 'var(--gold-core)', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 900, fontSize: '16px', background: 'rgba(255,184,0,0.1)', padding: '16px 32px', borderRadius: '8px', border: '1px solid var(--gold-core)', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 0 30px rgba(255,184,0,0.2)' }}>
                      <CheckCircle2 size={24} /> Contract Secured
                    </div>
                  )}
                </div>
                <button 
                  className="btn-ghidorah" 
                  style={{ width: '100%', justifyContent: 'center', padding: '24px', fontSize: '20px' }} 
                  disabled={verificationStatus !== 'success' || launchStatus === 'loading'}
                  onClick={handleLaunchProduction}
                >
                  {launchStatus === 'loading' ? <><Loader2 size={28} className="spin" /> Executing Storm Core...</> : <><Zap size={28} fill="#000" /> IGNITE CLUSTER</>}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Production;