import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const Dashboard = () => {
  // --- AUTH STATE ---
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- UI NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('environments'); // 'environments' or 'iam'

  // --- DASHBOARD STATE ---
  const [environments, setEnvironments] = useState([]);
  const [message, setMessage] = useState(''); 

  // --- IAM SETUP STATE ---
  const [iamRepoUrl, setIamRepoUrl] = useState('');
  const [iamRoleArn, setIamRoleArn] = useState('');
  const [iamStatus, setIamStatus] = useState('');

  // --- AUTH CHECK EFFECT ---
  useEffect(() => {
    const storedUser = localStorage.getItem('velzion_user');
    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('velzion_user');
        navigate('/login');
      }
    }
  }, [navigate]);

  // --- SMART DYNAMIC POLLING EFFECT ---
  // Automatically adjusts API rate based on active cloud transitions
  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const pollData = () => {
      if (window.location.pathname !== '/dashboard') return;
      
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/environments/`)
        .then(res => {
          if (!isMounted) return;
          const data = res.data || [];
          setEnvironments(data);
          
          // If any environment is actively building/destroying, poll fast (5s). Otherwise, rest (15s).
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

    if (user) pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [user]);

  // --- AUTH LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('velzion_user');
    navigate('/login');
  };

  // 🛡️ CRASH PROOF
  const isPipelineBusy = (environments || []).some(env => 
    env.status === 'PROVISIONING' || env.status === 'DESTROYING...'
  );

  // --- DESTROY LOGIC (CRITICAL - PRESERVED) ---
  const handleDestroy = (env) => {
    setMessage(`🗑️ Initiating Teardown for PR #${env.pr_number}...`);
    setEnvironments((environments || []).map(e => e.id === env.id ? { ...e, status: 'DESTROYING...' } : e));

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: env.project_details?.github_repo_url || "https://github.com/placeholder/repo", 
      pr_number: env.pr_number
    }).then(() => {
      setMessage(`✅ n8n Teardown sequence triggered for PR #${env.pr_number}.`);
      setTimeout(() => setMessage(''), 5000);
    }).catch(err => {
      console.error("n8n Webhook Error:", err);
      setMessage(`❌ Failed to reach n8n Teardown Webhook.`);
    });

    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/environments/${env.id}/`, { status: 'DESTROYED' })
      .catch(err => console.error("Django DB Error:", err));
  };

  // --- IAM INTEGRATION SAVE (CRITICAL - PRESERVED) ---
  const handleSaveIntegration = (e) => {
    e.preventDefault();
    if(!iamRepoUrl || !iamRoleArn) return;
    
    setIamStatus('saving');
    
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects/`, {
      github_repo_url: iamRepoUrl,
      aws_role_arn: iamRoleArn,
      vpc_id: 'vpc-default-mvp' 
    }).then(() => {
      setIamStatus('success');
      setIamRepoUrl('');
      setIamRoleArn('');
      setTimeout(() => setIamStatus(''), 5000);
    }).catch(err => {
      console.error("Error saving IAM setup:", err);
      setIamStatus('error');
    });
  };

  // --- STATE-AWARE FINOPS ENGINE ---
  const calculateFinOps = (env) => {
    if (!env.created_at) return null;
    const start = new Date(env.created_at);
    
    // 🔥 THE FIX: If sleeping or destroyed, freeze time at the exact updated_at timestamp!
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

  // --- LIVE TIMER TRIGGER ---
  // Forces React to re-render the FinOps math every second for RUNNING environments
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const hasLiveEnvs = environments.some(e => e.status === 'RUNNING' || e.status === 'PROVISIONING');
    if (hasLiveEnvs) {
      const timer = setInterval(() => setTick(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [environments]);

  if (!user) return null;

  const s3TemplateUrl = "https://velzion-public-templates-12345.s3.us-east-1.amazonaws.com/velzion-trust.yaml";
  const cfnLink = `https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=${s3TemplateUrl}&stackName=Velzion-Integration`;

  return (
    <div className="vz-dashboard">
      {/* ENTERPRISE UI STYLES */}
      <style>{`
        :root {
          --bg-dark: #050505;
          --bg-card: rgba(18, 20, 24, 0.7);
          --bg-card-hover: rgba(24, 26, 32, 0.9);
          --border-color: rgba(255, 255, 255, 0.08);
          --accent-cyan: #00e5ff;
          --accent-cyan-dim: rgba(0, 229, 255, 0.1);
          --accent-emerald: #10b981;
          --accent-emerald-dim: rgba(16, 185, 129, 0.1);
          --accent-red: #ef4444;
          --accent-red-dim: rgba(239, 68, 68, 0.1);
          --accent-amber: #f59e0b;
          --accent-indigo: #818cf8;
          --accent-indigo-dim: rgba(129, 140, 248, 0.15);
          --text-main: #f3f4f6;
          --text-muted: #9ca3af;
          --font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        body { margin: 0; background: var(--bg-dark); }
        
        /* Modern Grid Background */
        .vz-dashboard { 
          display: flex; min-height: 100vh; color: var(--text-main); font-family: var(--font-family);
          background-color: var(--bg-dark);
          background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        /* SIDEBAR */
        .vz-sidebar { width: 260px; background-color: rgba(10, 10, 12, 0.95); backdrop-filter: blur(10px); border-right: 1px solid var(--border-color); padding: 32px 24px; display: flex; flex-direction: column; z-index: 10;}
        .vz-logo-container { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
        .vz-logo-box { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent-cyan), #0077ff); border-radius: 8px; box-shadow: 0 0 20px var(--accent-cyan-dim); }
        .vz-logo-text { margin: 0; font-size: 20px; letter-spacing: 2px; font-weight: 800; color: #fff; }
        .vz-nav-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; margin: 0 0 16px 8px; }
        .vz-nav-item { padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease; color: var(--text-muted); text-decoration: none; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 14px; }
        .vz-nav-item:hover { background-color: rgba(255,255,255,0.03); color: #fff; }
        .vz-nav-item.active { background-color: var(--accent-cyan-dim); color: var(--accent-cyan); border: 1px solid rgba(0, 229, 255, 0.2); }
        
        /* MAIN LAYOUT */
        .vz-main { flex: 1; padding: 40px 60px; overflow-y: auto; position: relative; z-index: 5; }
        .vz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
        .vz-header-titles h1 { color: #fff; margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .vz-header-titles p { color: var(--text-muted); margin: 0; font-size: 15px; }
        .vz-header-actions { display: flex; align-items: center; gap: 24px; }
        
        /* USER PROFILE */
        .vz-profile { display: flex; align-items: center; gap: 16px; padding-right: 24px; border-right: 1px solid var(--border-color); }
        .vz-avatar, .vz-avatar-fallback { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--accent-cyan); }
        .vz-avatar-fallback { background-color: var(--accent-cyan-dim); color: var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 1px solid var(--accent-cyan); }
        .vz-user-info p { margin: 0; }
        .vz-username { font-weight: 600; color: #fff; font-size: 14px; margin-bottom: 2px !important; }
        .vz-status { font-size: 12px; color: var(--accent-emerald); display: flex; align-items: center; gap: 6px; }
        .vz-status::before { content: ''; width: 6px; height: 6px; background: var(--accent-emerald); border-radius: 50%; box-shadow: 0 0 8px var(--accent-emerald); }
        
        /* BUTTONS */
        .vz-btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; text-decoration: none; border: none; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; justify-content: center; }
        .vz-btn-calc { background-color: var(--accent-emerald-dim); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); backdrop-filter: blur(5px); }
        .vz-btn-calc:hover { background-color: rgba(16, 185, 129, 0.15); transform: translateY(-1px); }
        .vz-btn-logout { background-color: transparent; color: var(--text-muted); border: 1px solid var(--border-color); }
        .vz-btn-logout:hover { color: #fff; border-color: #555; }
        .vz-btn-submit { background-color: var(--accent-cyan); color: #000; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.2s; box-shadow: 0 4px 15px var(--accent-cyan-dim); }
        .vz-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0, 229, 255, 0.2); }
        
        /* ALERT NOTIFICATIONS */
        .vz-message { margin-top: 24px; padding: 16px; background: var(--accent-cyan-dim); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 8px; color: var(--accent-cyan); font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 10px; backdrop-filter: blur(5px); }
        
        /* ENVIRONMENTS LIST */
        .vz-listener-banner { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(90deg, var(--accent-cyan-dim), transparent); border-left: 3px solid var(--accent-cyan); padding: 16px 24px; border-radius: 0 8px 8px 0; margin-bottom: 32px; backdrop-filter: blur(4px); }
        .vz-listener-banner p { margin: 0; color: var(--accent-cyan); font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 12px; }
        .vz-pulse { width: 10px; height: 10px; background-color: var(--accent-cyan); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); } }
        
        .vz-env-list { display: grid; gap: 24px; grid-template-columns: 1fr; }
        
        /* THE GLASSMORPHISM CARD */
        .vz-env-card { 
          background: linear-gradient(145deg, rgba(22, 24, 28, 0.8) 0%, rgba(12, 14, 18, 0.9) 100%); 
          backdrop-filter: blur(12px);
          padding: 28px; 
          border-radius: 12px; 
          border: 1px solid rgba(255,255,255,0.05); 
          position: relative; 
          overflow: hidden; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .vz-env-card:hover { 
          border-color: rgba(255,255,255,0.1); 
          box-shadow: 0 10px 40px rgba(0,0,0,0.5); 
          transform: translateY(-2px);
        }
        
        /* STATUS INDICATORS & ANIMATIONS */
        .status-indicator-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; transition: 0.5s; }
        
        .status-RUNNING .status-indicator-bar { background-color: var(--accent-emerald); box-shadow: 0 0 20px var(--accent-emerald); }
        .status-DESTROYED { opacity: 0.6; filter: grayscale(50%); }
        .status-DESTROYED .status-indicator-bar { background-color: #374151; }
        
        /* SLEEPING ANIMATION (Slow Purple Breathe) */
        .status-SLEEPING .status-indicator-bar { 
          background-color: var(--accent-indigo); 
          animation: breathe-indigo 4s infinite ease-in-out; 
        }
        @keyframes breathe-indigo { 0% { box-shadow: 0 0 5px var(--accent-indigo); opacity: 0.5; } 50% { box-shadow: 0 0 25px var(--accent-indigo); opacity: 1; } 100% { box-shadow: 0 0 5px var(--accent-indigo); opacity: 0.5; } }
        
        /* PROVISIONING ANIMATION */
        .status-PROVISIONING .status-indicator-bar, .status-DESTROYING .status-indicator-bar { background-color: var(--accent-amber); animation: pulse-amber 2s infinite; }
        @keyframes pulse-amber { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        
        .vz-env-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .vz-env-pr { font-size: 22px; margin: 0; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 12px; }
        
        /* BADGES */
        .vz-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 6px;}
        .bg-green { background: var(--accent-emerald-dim); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.2); }
        .bg-gray { background: rgba(255,255,255,0.03); color: var(--text-muted); border: 1px solid var(--border-color); }
        .bg-yellow { background: var(--accent-red-dim); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.2); }
        .bg-indigo { background: var(--accent-indigo-dim); color: var(--accent-indigo); border: 1px solid rgba(129, 140, 248, 0.2); }
        
        .vz-env-meta { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
        .vz-link { color: var(--accent-cyan); text-decoration: none; font-family: 'JetBrains Mono', monospace; background: rgba(0, 229, 255, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0, 229, 255, 0.1); transition: 0.2s; }
        .vz-link:hover { background: var(--accent-cyan-dim); }
        
        /* FINOPS WIDGET */
        .vz-finops { background-color: rgba(0,0,0,0.3); border-radius: 10px; padding: 20px; border: 1px solid rgba(255,255,255,0.03); position: relative; }
        .vz-finops.paused { border: 1px dashed rgba(129, 140, 248, 0.3); } /* Dashed border for sleep */
        .vz-finops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .vz-finops-title { margin: 0; font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;}
        .vz-finops-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .vz-stat-label { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; font-weight: 600; }
        .vz-stat-val { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #fff; }
        
        .vz-env-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
        .vz-instance { margin: 0; color: #6b7280; font-family: 'JetBrains Mono', monospace; font-size: 12px; background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03); }
        
        .vz-btn-terminate { background-color: transparent; color: var(--accent-red); border: 1px solid rgba(239, 68, 68, 0.5); padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: 0.2s; }
        .vz-btn-terminate:hover:not(:disabled) { background-color: var(--accent-red); color: #fff; box-shadow: 0 0 20px var(--accent-red-dim); border-color: var(--accent-red); }
        .vz-btn-terminate:disabled { opacity: 0.5; cursor: not-allowed; border-color: #555; color: #555; }
      `}</style>

      {/* ---------------- SIDEBAR ---------------- */}
      <div className="vz-sidebar">
        <div className="vz-logo-container">
          <div className="vz-logo-box"></div>
          <h2 className="vz-logo-text">VELZION</h2>
        </div>
        
        <p className="vz-nav-label">Platform Control</p>
        
        <div 
          onClick={() => setActiveTab('environments')} 
          className={`vz-nav-item ${activeTab === 'environments' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '16px' }}>⚡</span> Active Deployments
        </div>
        
        <Link to="/finopscalculator" className="vz-nav-item">
          <span style={{ fontSize: '16px' }}>📊</span> FinOps Dashboard
        </Link>
        
        <div 
          onClick={() => setActiveTab('iam')} 
          className={`vz-nav-item ${activeTab === 'iam' ? 'active' : ''}`}
        >
          <span style={{ fontSize: '16px' }}>🔐</span> Security & IAM
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="vz-main">
        
        <div className="vz-header">
          <div className="vz-header-titles">
            <h1>Platform Control Plane</h1>
            <p>{activeTab === 'environments' ? 'Real-time infrastructure orchestration via GitHub Webhooks' : 'Cross-account AssumeRole architecture settings'}</p>
          </div>
          
          <div className="vz-header-actions">
            <Link to="/finopscalculator" className="vz-btn vz-btn-calc">
              💰 ROI Calculator
            </Link>
            <div className="vz-profile">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="vz-avatar" />
              ) : (
                <div className="vz-avatar-fallback">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</div>
              )}
              <div className="vz-user-info">
                <p className="vz-username">{user?.username || 'Admin'}</p>
                <p className="vz-status">Authenticated</p>
              </div>
            </div>
            <button onClick={handleLogout} className="vz-btn vz-btn-logout">Sign Out</button>
          </div>
        </div>

        {/* ---------------- ENVIRONMENTS TAB ---------------- */}
        {activeTab === 'environments' && (
          <>
            {message && <div className="vz-message" style={{marginBottom: '24px'}}>{message}</div>}
            
            <div className="vz-listener-banner">
              <p><span className="vz-pulse"></span> n8n Engine is actively listening for GitHub Pull Request events...</p>
              <span className="vz-badge bg-green" style={{ border: 'none', background: 'rgba(0, 229, 255, 0.15)', color: 'var(--accent-cyan)' }}>WEBHOOKS ONLINE</span>
            </div>

            <div style={{ background: 'transparent', border: 'none', padding: 0 }}>
              {!(environments || []).length ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(5px)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🌩️</div>
                  <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>No Infrastructure Deployed</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Open a Pull Request on GitHub to automatically provision a Spot Instance.</p>
                </div>
              ) : (
                <div className="vz-env-list">
                  {(environments || []).map(env => {
                    const stats = calculateFinOps(env);
                    
                    // SMART STATUS STYLING
                    let statusClass = "bg-gray";
                    if (env.status === 'RUNNING') statusClass = "bg-green";
                    else if (env.status === 'SLEEPING') statusClass = "bg-indigo";
                    else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') statusClass = "bg-yellow";

                    return (
                      <div key={env.id} className={`vz-env-card status-${env.status.replace('...', '')}`}>
                        <div className="status-indicator-bar"></div>
                        
                        <div className="vz-env-header">
                          <h3 className="vz-env-pr">
                            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>PR</span> #{env.pr_number}
                          </h3>
                          <span className={`vz-badge ${statusClass}`}>
                            {env.status === 'SLEEPING' && <span>💤 </span>}
                            {env.status}
                          </span>
                        </div>
                        
                        <div className="vz-env-meta">
                          {env.status === 'DESTROYED' ? (
                            <span style={{ color: 'var(--text-muted)' }}>Infrastructure terminated successfully. Billing cycle closed.</span>
                          ) : env.status === 'DESTROYING...' ? (
                            <span style={{ color: 'var(--accent-amber)' }}>Evacuating cloud resources & dismantling VPCs...</span>
                          ) : env.status === 'PROVISIONING' ? (
                            <span style={{ color: 'var(--accent-amber)' }}>Negotiating Spot capacity and compiling Terraform state...</span>
                          ) : env.status === 'SLEEPING' ? (
                            <span style={{ color: 'var(--accent-indigo)' }}>Environment suspended. Billing paused at $0.00/hr.</span>
                          ) : env.dns_prefix ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                              Traffic Routed To: <a href={env.dns_prefix} target="_blank" rel="noreferrer" className="vz-link">{env.dns_prefix} ↗</a>
                            </span>
                          ) : (
                            <span>Awaiting Network Interface...</span>
                          )}
                        </div>

                        {stats && (
                          <div className={`vz-finops ${stats.isFrozen ? 'paused' : ''}`}>
                            <div className="vz-finops-header">
                              <p className="vz-finops-title">
                                {env.status === 'DESTROYED' ? 'Final FinOps Report' : 'Live Telemetry'}
                                {stats.isFrozen && env.status !== 'DESTROYED' && <span style={{ color: 'var(--accent-indigo)', textTransform: 'none', background: 'var(--accent-indigo-dim)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>⏸ Paused</span>}
                              </p>
                              <span className="vz-badge bg-green">{stats.savingsPercent}% Spot Reduction</span>
                            </div>
                            <div className="vz-finops-grid">
                              <div><p className="vz-stat-label">Uptime</p><p className="vz-stat-val" style={{ color: stats.isFrozen ? 'var(--text-muted)' : '#fff' }}>{stats.uptimeString}</p></div>
                              <div><p className="vz-stat-label">Spot Price</p><p className="vz-stat-val" style={{ color: 'var(--accent-cyan)' }}>${stats.spotCost}</p></div>
                              <div><p className="vz-stat-label">On-Demand</p><p className="vz-stat-val" style={{ textDecoration: 'line-through', color: '#6b7280' }}>${stats.odCost}</p></div>
                              <div><p className="vz-stat-label">Saved</p><p className="vz-stat-val" style={{ color: 'var(--accent-emerald)' }}>+${stats.savings}</p></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="vz-env-footer">
                          <p className="vz-instance">EC2_ID: {env.instance_id || 'PENDING_ALLOCATION'}</p>
                          {(env.status === 'RUNNING' || env.status === 'SLEEPING') && (
                            <button onClick={() => handleDestroy(env)} disabled={isPipelineBusy} className="vz-btn-terminate">
                              Terminate Architecture
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ---------------- IAM SETTINGS TAB ---------------- */}
        {activeTab === 'iam' && (
          <div className="vz-section" style={{ background: 'rgba(18, 20, 24, 0.7)', backdropFilter: 'blur(10px)' }}>
            <h2 style={{ marginTop: 0, color: '#fff', fontSize: '24px', marginBottom: '8px' }}>Target AWS Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
              Grant the Velzion Engine secure, temporary access to provision Pull Request environments in your own AWS account using a keyless AssumeRole architecture.
            </p>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>STEP 1</span> 
                Deploy IAM Trust Policy
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                Launch our verified CloudFormation template in your AWS Console. This provisions a secure <code>VelzionExecutionRole</code> with strict least-privilege access tied exclusively to your infrastructure.
              </p>
              <a 
                href={cfnLink} 
                target="_blank" 
                rel="noreferrer" 
                className="vz-btn-submit" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#000', backgroundColor: 'var(--accent-cyan)' }}
              >
                Launch AWS CloudFormation ↗
              </a>
            </div>

            <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>STEP 2</span>
              Bind Repository Credentials
            </h4>
            
            <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '24px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="vz-input-group">
                <label>Target GitHub Repository URL</label>
                <input 
                  type="url" 
                  value={iamRepoUrl} 
                  onChange={(e) => setIamRepoUrl(e.target.value)} 
                  placeholder="https://github.com/organization/repository" 
                  required 
                  className="vz-input" 
                />
              </div>
              <div className="vz-input-group">
                <label>Assumed AWS Role ARN (Output from Step 1)</label>
                <input 
                  type="text" 
                  value={iamRoleArn} 
                  onChange={(e) => setIamRoleArn(e.target.value)} 
                  placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" 
                  required 
                  className="vz-input" 
                />
              </div>
              <button type="submit" className="vz-btn-submit" style={{ width: 'fit-content' }}>
                Securely Save Integration
              </button>
            </form>

            {iamStatus === 'success' && <div className="vz-message" style={{ marginTop: '24px', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'var(--accent-emerald-dim)' }}>✓ Configuration encrypted and saved. The n8n Engine will now utilize this execution role.</div>}
            {iamStatus === 'error' && <div className="vz-message" style={{ marginTop: '24px', color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'var(--accent-red-dim)' }}>✗ Architecture binding failed. Verify your network logs.</div>}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;