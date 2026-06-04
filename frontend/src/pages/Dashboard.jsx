import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
  const [isLoaded, setIsLoaded] = useState(false); // Triggers the cascade entrance animations

  // --- DASHBOARD STATE ---
  const [environments, setEnvironments] = useState([]);

  // --- IAM SETUP STATE ---
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
        const hasAccess = storedRepos.some(r => 
          (typeof r === 'string' ? r : r.full_name) === currentWorkspace
        );

        if (!hasAccess) {
          alert(`🔒 ACCESS DENIED: You are not a collaborator on ${currentWorkspace}. Redirecting to safe zone.`);
          navigate('/dashboard'); 
        }
      }
      
      // Trigger entrance animations once auth is verified
      setTimeout(() => setIsLoaded(true), 100);
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

  // --- DESTROY LOGIC ---
  const isPipelineBusy = (environments || []).some(env => 
    env.status === 'PROVISIONING' || env.status === 'DESTROYING...'
  );

  const handleDestroy = (env) => {
    setMessage(`🗑️ Initiating Teardown for PR #${env.pr_number}...`);
    setEnvironments((environments || []).map(e => e.id === env.id ? { ...e, status: 'DESTROYING...' } : e));

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: `https://github.com/${currentWorkspace}`, 
      pr_number: env.pr_number
    }).then(() => {
      setMessage(`✅ n8n Teardown sequence triggered for PR #${env.pr_number}.`);
      setTimeout(() => setMessage(''), 5000);
    }).catch(err => {
      setMessage(`❌ Failed to reach n8n Teardown Webhook.`);
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

  const cfnLink = `https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=https://velzion-public-templates-12345.s3.us-east-1.amazonaws.com/velzion-trust.yaml&stackName=Velzion-Integration`;

  return (
    <div className={`vz-dashboard ${isLoaded ? 'loaded' : ''}`}>
      <style>{`
        :root {
          --bg-base: #030305;
          --glass-surface: rgba(15, 17, 21, 0.6);
          --glass-border: rgba(255, 255, 255, 0.06);
          --glass-highlight: rgba(255, 255, 255, 0.1);
          --accent-cyan: #00f0ff;
          --accent-cyan-glow: rgba(0, 240, 255, 0.4);
          --accent-emerald: #00ff9d;
          --accent-emerald-glow: rgba(0, 255, 157, 0.3);
          --accent-purple: #9d4edd;
          --accent-purple-glow: rgba(157, 78, 221, 0.4);
          --accent-amber: #ffaa00;
          --text-main: #ffffff;
          --text-muted: #8a919e;
          --font-main: 'Inter', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        body { margin: 0; background-color: var(--bg-base); overflow-x: hidden; }

        /* THE AMBIENT ENGINE BACKGROUND */
        .vz-dashboard {
          display: flex; min-height: 100vh; font-family: var(--font-main); color: var(--text-main);
          position: relative; z-index: 1;
        }
        
        .vz-dashboard::before, .vz-dashboard::after {
          content: ''; position: fixed; border-radius: 50%; filter: blur(120px); z-index: -1;
          animation: ambientDrift 20s infinite alternate ease-in-out;
        }
        .vz-dashboard::before {
          width: 600px; height: 600px; background: radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 70%);
          top: -200px; left: -100px;
        }
        .vz-dashboard::after {
          width: 700px; height: 700px; background: radial-gradient(circle, rgba(157,78,221,0.05) 0%, transparent 70%);
          bottom: -300px; right: -100px; animation-delay: -10s;
        }

        @keyframes ambientDrift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 30px) scale(1.1); }
          100% { transform: translate(-30px, 50px) scale(0.9); }
        }

        /* STAGGERED ENTRANCE ANIMATIONS */
        .cascade-up {
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .loaded .cascade-up { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        
        /* EXTREME GLASSMORPHISM UTILS */
        .glass-panel {
          background: var(--glass-surface); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border); border-top: 1px solid var(--glass-highlight);
          border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        /* SIDEBAR (Sleek & Floating) */
        .vz-sidebar {
          width: 280px; background: rgba(5, 6, 8, 0.8); backdrop-filter: blur(30px);
          border-right: 1px solid var(--glass-border); padding: 40px 24px;
          display: flex; flex-direction: column; z-index: 10; position: relative;
        }
        
        .vz-logo-container { display: flex; align-items: center; gap: 16px; margin-bottom: 56px; }
        .vz-logo-box {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-cyan), #0055ff);
          box-shadow: 0 0 24px var(--accent-cyan-glow), inset 0 0 10px rgba(255,255,255,0.5);
          position: relative; overflow: hidden;
        }
        .vz-logo-box::after {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(transparent, rgba(255,255,255,0.8), transparent);
          transform: rotate(45deg); animation: logoShine 4s infinite linear;
        }
        @keyframes logoShine { 0% { transform: translateX(-150%) rotate(45deg); } 100% { transform: translateX(150%) rotate(45deg); } }
        
        .vz-logo-text { margin: 0; font-size: 22px; letter-spacing: 3px; font-weight: 900; background: linear-gradient(to right, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .vz-nav-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 2px; margin: 0 0 16px 12px; }
        .vz-nav-item {
          padding: 14px 18px; border-radius: 12px; margin-bottom: 10px; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); color: #a1a1aa; text-decoration: none;
          display: flex; align-items: center; gap: 14px; font-weight: 600; font-size: 14px; border: 1px solid transparent;
        }
        .vz-nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; transform: translateX(4px); }
        .vz-nav-item.active {
          background: linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent);
          color: var(--accent-cyan); border-left: 2px solid var(--accent-cyan);
          box-shadow: inset 20px 0 40px -20px var(--accent-cyan-glow);
        }
        .vz-nav-disabled { opacity: 0.3; pointer-events: none; }

        /* MAIN LAYOUT */
        .vz-main { flex: 1; padding: 48px 72px; overflow-y: auto; position: relative; z-index: 5; }
        .vz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; }
        .vz-header-titles h1 { margin: 0 0 8px 0; font-size: 38px; font-weight: 800; letter-spacing: -1px; }
        .vz-header-titles p { color: var(--text-muted); margin: 0; font-size: 16px; font-weight: 400; }
        
        .vz-header-actions { display: flex; align-items: center; gap: 24px; }
        
        /* WORKSPACE SWITCHER (Next-Gen UI) */
        .vz-workspace-select-wrapper { position: relative; display: flex; align-items: center; }
        .vz-workspace-select {
          background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border);
          color: #fff; padding: 12px 48px 12px 20px; border-radius: 12px; font-family: var(--font-main);
          font-size: 14px; font-weight: 600; cursor: pointer; outline: none; transition: all 0.3s ease;
          appearance: none; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
        }
        .vz-workspace-select:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); box-shadow: 0 0 20px rgba(0,240,255,0.1); }
        .vz-workspace-select-icon { position: absolute; right: 16px; pointer-events: none; color: var(--text-muted); }
        
        /* BUTTONS & PROFILE */
        .vz-btn { padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; text-decoration: none; border: none; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; }
        .vz-btn-calc { background: rgba(0, 255, 157, 0.1); color: var(--accent-emerald); border: 1px solid rgba(0, 255, 157, 0.2); box-shadow: 0 4px 15px rgba(0, 255, 157, 0.05); }
        .vz-btn-calc:hover { background: rgba(0, 255, 157, 0.15); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 255, 157, 0.15); }
        .vz-btn-logout { background: transparent; color: var(--text-muted); }
        .vz-btn-logout:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
        
        .vz-profile { display: flex; align-items: center; gap: 16px; padding-right: 24px; border-right: 1px solid var(--glass-border); }
        .vz-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--accent-cyan); box-shadow: 0 0 15px var(--accent-cyan-glow); }
        .vz-user-info p { margin: 0; }
        .vz-username { font-weight: 700; color: #fff; font-size: 15px; }
        .vz-status { font-size: 12px; color: var(--accent-emerald); display: flex; align-items: center; gap: 6px; margin-top: 4px;}
        .vz-status::before { content: ''; width: 8px; height: 8px; background: var(--accent-emerald); border-radius: 50%; box-shadow: 0 0 10px var(--accent-emerald); animation: pulseGreen 2s infinite; }
        @keyframes pulseGreen { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

        /* THE BLANK SLATE */
        .vz-blank-slate {
          display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; text-align: center;
          border: 1px dashed rgba(255,255,255,0.1); border-radius: 24px; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px);
        }
        .vz-blank-slate-icon { font-size: 80px; margin-bottom: 32px; filter: drop-shadow(0 0 30px rgba(255,255,255,0.2)); animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

        /* DYNAMIC ENVIRONMENT CARDS (Lifting & Glowing) */
        .vz-env-list { display: grid; gap: 32px; grid-template-columns: 1fr; }
        .vz-env-card {
          position: relative; overflow: hidden; padding: 32px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .vz-env-card::before {
          content: ''; position: absolute; inset: 0; padding: 1px; border-radius: 16px;
          background: linear-gradient(180deg, rgba(255,255,255,0.1), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }

        .vz-env-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
        
        /* DYNAMIC STATUS GLOWS */
        .status-RUNNING:hover { box-shadow: 0 20px 60px rgba(0, 255, 157, 0.08), 0 0 0 1px rgba(0, 255, 157, 0.1); }
        .status-SLEEPING:hover { box-shadow: 0 20px 60px rgba(157, 78, 221, 0.08), 0 0 0 1px rgba(157, 78, 221, 0.1); }
        .status-PROVISIONING:hover { box-shadow: 0 20px 60px rgba(255, 170, 0, 0.08), 0 0 0 1px rgba(255, 170, 0, 0.1); }
        
        .status-indicator-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 6px; transition: 0.5s; }
        .status-RUNNING .status-indicator-bar { background: var(--accent-emerald); box-shadow: 0 0 20px var(--accent-emerald); }
        .status-SLEEPING .status-indicator-bar { background: var(--accent-purple); box-shadow: 0 0 20px var(--accent-purple); animation: breathePurple 4s infinite; }
        @keyframes breathePurple { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        .status-PROVISIONING .status-indicator-bar, .status-DESTROYING .status-indicator-bar { background: var(--accent-amber); animation: pulseAmber 2s infinite; }
        @keyframes pulseAmber { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .status-DESTROYED { filter: grayscale(80%) opacity(0.7); }
        .status-DESTROYED .status-indicator-bar { background: #374151; }

        .vz-env-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .vz-env-pr { font-size: 28px; margin: 0; font-weight: 800; display: flex; align-items: center; gap: 16px; letter-spacing: -0.5px; }
        
        .vz-badge { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px; text-transform: uppercase;}
        .bg-green { background: rgba(0, 255, 157, 0.1); color: var(--accent-emerald); border: 1px solid rgba(0, 255, 157, 0.2); }
        .bg-gray { background: rgba(255,255,255,0.03); color: var(--text-muted); border: 1px solid var(--glass-border); }
        .bg-yellow { background: rgba(255, 170, 0, 0.1); color: var(--accent-amber); border: 1px solid rgba(255, 170, 0, 0.2); }
        .bg-purple { background: rgba(157, 78, 221, 0.15); color: #c77dff; border: 1px solid rgba(157, 78, 221, 0.3); }

        .vz-env-meta { font-size: 15px; color: var(--text-muted); margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--glass-border); }
        .vz-link { color: var(--accent-cyan); text-decoration: none; font-family: var(--font-mono); font-weight: 600; background: rgba(0, 240, 255, 0.05); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.15); transition: all 0.2s ease; }
        .vz-link:hover { background: rgba(0, 240, 255, 0.15); box-shadow: 0 0 15px var(--accent-cyan-glow); }

        /* FINOPS WIDGET (Micro-interaction details) */
        .vz-finops { background: rgba(0,0,0,0.4); border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.04); position: relative; overflow: hidden; }
        .vz-finops.paused { border: 1px dashed rgba(157, 78, 221, 0.4); background: rgba(157, 78, 221, 0.02); }
        .vz-finops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .vz-finops-title { margin: 0; font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;}
        .vz-finops-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .vz-stat-label { font-size: 12px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
        .vz-stat-val { font-size: 24px; font-weight: 800; font-family: var(--font-mono); letter-spacing: -0.5px; }
        
        .vz-env-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; }
        .vz-instance { margin: 0; color: #6b7280; font-family: var(--font-mono); font-size: 13px; background: rgba(0,0,0,0.5); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); }
        
        .vz-btn-terminate { background: transparent; color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); padding: 12px 24px; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 700; transition: all 0.3s ease; }
        .vz-btn-terminate:hover:not(:disabled) { background: rgba(255, 77, 77, 0.1); border-color: #ff4d4d; box-shadow: 0 0 20px rgba(255, 77, 77, 0.2); }
      `}</style>
{/* ---------------- SIDEBAR (Glassmorphism) ---------------- */}
      <div className="vz-sidebar">
        <div className="vz-logo-container">
          <div className="vz-logo-box"></div>
          <h2 className="vz-logo-text">VELZION</h2>
        </div>
        
        <p className="vz-nav-label">Platform Control</p>
        
        <div 
          onClick={() => currentWorkspace && setActiveTab('environments')} 
          className={`vz-nav-item ${activeTab === 'environments' ? 'active' : ''} ${!currentWorkspace ? 'vz-nav-disabled' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>⚡</span> Active Deployments
        </div>
        
        <Link to="/finopscalculator" className="vz-nav-item">
          <span style={{ fontSize: '18px' }}>📊</span> FinOps Dashboard
        </Link>
        
        <div 
          onClick={() => currentWorkspace && setActiveTab('iam')} 
          className={`vz-nav-item ${activeTab === 'iam' ? 'active' : ''} ${!currentWorkspace ? 'vz-nav-disabled' : ''}`}
        >
          <span style={{ fontSize: '18px' }}>🔐</span> Security & IAM
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="vz-main">
        
        {/* HEADER & WORKSPACE SWITCHER */}
        <div className="vz-header cascade-up delay-1">
          <div className="vz-header-titles">
            <h1>{currentWorkspace ? currentWorkspace.split('/')[1] : 'Control Plane'}</h1>
            <p>{currentWorkspace ? `Isolated Workspace: ${currentWorkspace}` : 'Select a workspace to begin orchestration'}</p>
          </div>
          
          <div className="vz-header-actions">
            {/* WORKSPACE DROPDOWN */}
            <div className="vz-workspace-select-wrapper">
              <select 
                className="vz-workspace-select"
                value={currentWorkspace || ''}
                onChange={(e) => {
                  if (e.target.value) navigate(`/dashboard/${e.target.value}`);
                }}
              >
                <option value="" disabled>Select Workspace...</option>
                {workspaces.map(w => {
                  const name = typeof w === 'string' ? w : w.full_name;
                  return <option key={name} value={name}>{name}</option>;
                })}
              </select>
              <div className="vz-workspace-select-icon">▼</div>
            </div>

            <Link to="/finopscalculator" className="vz-btn vz-btn-calc">💰 ROI</Link>
            
            <div className="vz-profile">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="vz-avatar" />
              ) : (
                <div className="vz-avatar-fallback" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="vz-user-info">
                <p className="vz-username">{user?.username || 'Admin'}</p>
                <p className="vz-status">Authenticated</p>
              </div>
            </div>
            <button onClick={handleLogout} className="vz-btn vz-btn-logout">Sign Out</button>
          </div>
        </div>

        {/* ---------------- THE BLANK SLATE (No Workspace Selected) ---------------- */}
        {!currentWorkspace && (
          <div className="vz-blank-slate cascade-up delay-2">
            <div className="vz-blank-slate-icon">🌌</div>
            <h2 style={{ fontSize: '32px', color: '#fff', margin: '0 0 16px 0', fontWeight: '800' }}>Welcome to Velzion</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6' }}>
              Your authentication was successful. To view active environments or manage infrastructure, please select a repository workspace from the top navigation menu.
            </p>
          </div>
        )}

        {/* ---------------- ENVIRONMENTS TAB (Requires Workspace) ---------------- */}
        {currentWorkspace && activeTab === 'environments' && (
          <div className="cascade-up delay-2">
            {message && <div className="vz-message" style={{marginBottom: '32px'}}>{message}</div>}
            
            <div className="vz-env-list">
              {!(environments || []).length ? (
                <div className="glass-panel cascade-up delay-3" style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '56px', marginBottom: '24px', opacity: 0.8, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}>🌩️</div>
                  <h3 style={{ color: '#fff', margin: '0 0 12px 0', fontSize: '24px', fontWeight: '700' }}>No Infrastructure Deployed</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0 }}>Open a Pull Request on <strong style={{ color: '#fff' }}>{currentWorkspace}</strong> to provision a node.</p>
                </div>
              ) : (
                (environments || []).map((env, index) => {
                  const stats = calculateFinOps(env);
                  let statusClass = "bg-gray";
                  if (env.status === 'RUNNING') statusClass = "bg-green";
                  else if (env.status === 'SLEEPING') statusClass = "bg-purple";
                  else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') statusClass = "bg-yellow";

                  return (
                    <div key={env.id} className={`glass-panel vz-env-card status-${env.status.replace('...', '')} cascade-up`} style={{ transitionDelay: `${0.1 * index}s` }}>
                      <div className="status-indicator-bar"></div>
                      
                      <div className="vz-env-header">
                        <h3 className="vz-env-pr">
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '18px' }}>PR</span> #{env.pr_number}
                        </h3>
                        <span className={`vz-badge ${statusClass}`}>
                          {env.status === 'SLEEPING' && <span>💤 </span>} {env.status}
                        </span>
                      </div>
                      
                      <div className="vz-env-meta">
                        {env.status === 'DESTROYED' ? <span style={{ color: 'var(--text-muted)' }}>Infrastructure terminated successfully. Billing cycle closed.</span> : 
                         env.status === 'DESTROYING...' ? <span style={{ color: 'var(--accent-amber)' }}>Evacuating cloud resources & dismantling VPCs...</span> : 
                         env.status === 'PROVISIONING' ? <span style={{ color: 'var(--accent-amber)' }}>Negotiating Spot capacity and compiling Terraform state...</span> : 
                         env.status === 'SLEEPING' ? <span style={{ color: '#c77dff' }}>Environment suspended. Billing paused at $0.00/hr.</span> : 
                         env.dns_prefix ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>Traffic Routed To: <a href={env.dns_prefix} target="_blank" rel="noreferrer" className="vz-link">{env.dns_prefix} ↗</a></span> : 
                         <span>Awaiting Network Interface...</span>}
                      </div>

                      {stats && (
                        <div className={`vz-finops ${stats.isFrozen ? 'paused' : ''}`}>
                          <div className="vz-finops-header">
                            <p className="vz-finops-title">
                              {env.status === 'DESTROYED' ? 'Final FinOps Report' : 'Live Telemetry'}
                              {stats.isFrozen && env.status !== 'DESTROYED' && <span style={{ color: '#c77dff', textTransform: 'none', background: 'rgba(157, 78, 221, 0.15)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>⏸ Paused</span>}
                            </p>
                            <span className="vz-badge bg-green">{stats.savingsPercent}% Spot Reduction</span>
                          </div>
                          <div className="vz-finops-grid">
                            <div><p className="vz-stat-label">Uptime</p><p className="vz-stat-val" style={{ color: stats.isFrozen ? 'var(--text-muted)' : '#fff' }}>{stats.uptimeString}</p></div>
                            <div><p className="vz-stat-label">Spot Price</p><p className="vz-stat-val" style={{ color: 'var(--accent-cyan)', textShadow: '0 0 15px rgba(0,240,255,0.4)' }}>${stats.spotCost}</p></div>
                            <div><p className="vz-stat-label">On-Demand</p><p className="vz-stat-val" style={{ textDecoration: 'line-through', color: '#4b5563' }}>${stats.odCost}</p></div>
                            <div><p className="vz-stat-label">Saved</p><p className="vz-stat-val" style={{ color: 'var(--accent-emerald)', textShadow: '0 0 15px rgba(0,255,157,0.3)' }}>+${stats.savings}</p></div>
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
                })
              )}
            </div>
          </div>
        )}

        {/* ---------------- IAM SETTINGS TAB (Requires Workspace) ---------------- */}
        {currentWorkspace && activeTab === 'iam' && (
          <div className="glass-panel cascade-up delay-2" style={{ padding: '48px', borderRadius: '24px' }}>
            <h2 style={{ marginTop: 0, color: '#fff', fontSize: '28px', marginBottom: '12px', fontWeight: '800', letterSpacing: '-0.5px' }}>Target AWS Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '40px', lineHeight: '1.6', maxWidth: '700px' }}>
              Grant the Velzion Engine secure, temporary access to provision Pull Request environments in your own AWS account using a keyless AssumeRole architecture.
            </p>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>STEP 1</span> 
                Deploy IAM Trust Policy
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
                Launch our verified CloudFormation template in your AWS Console. This provisions a secure <code style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>VelzionExecutionRole</code> with strict least-privilege access tied exclusively to your infrastructure.
              </p>
              <a href={cfnLink} target="_blank" rel="noreferrer" className="vz-btn" style={{ background: 'var(--accent-cyan)', color: '#000', padding: '14px 28px', boxShadow: '0 0 20px rgba(0,240,255,0.3)', fontWeight: '800', fontSize: '15px' }}>
                Launch AWS CloudFormation ↗
              </a>
            </div>

            <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800' }}>STEP 2</span>
              Bind Workspace Credentials
            </h4>
            
            <form onSubmit={handleSaveIntegration} style={{ display: 'grid', gap: '24px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>Targeting Workspace:</span>
                <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '700', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{currentWorkspace}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 700 }}>Assumed AWS Role ARN (Output from Step 1)</label>
                <input 
                  type="text" 
                  value={iamRoleArn} 
                  onChange={(e) => setIamRoleArn(e.target.value)} 
                  placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" 
                  required 
                  style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px', borderRadius: '10px', outline: 'none', width: '100%', boxSizing: 'border-box', fontSize: '15px', fontFamily: 'var(--font-mono)', transition: '0.3s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <button type="submit" className="vz-btn" style={{ background: 'var(--text-main)', color: '#000', padding: '14px 28px', width: 'fit-content', fontSize: '15px', fontWeight: '800', marginTop: '8px' }}>
                Securely Save Integration
              </button>
            </form>

            {iamStatus === 'success' && <div className="vz-message" style={{ marginTop: '24px', color: 'var(--accent-emerald)', borderColor: 'rgba(0, 255, 157, 0.3)', backgroundColor: 'rgba(0, 255, 157, 0.1)' }}>✓ Configuration encrypted and saved. The Engine will now utilize this execution role.</div>}
            {iamStatus === 'error' && <div className="vz-message" style={{ marginTop: '24px', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)', backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>✗ Architecture binding failed. Verify your network logs.</div>}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;