import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const Dashboard = () => {
  // --- AUTH STATE ---
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // --- UI NAVIGATION STATE (THIS WAS MISSING!) ---
  const [activeTab, setActiveTab] = useState('environments'); // 'environments' or 'iam'

  // --- DASHBOARD STATE ---
  const [environments, setEnvironments] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- IAM SETUP STATE (THIS WAS MISSING!) ---
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

  // --- DATA FETCH EFFECT ---
  const fetchData = () => {
    if (window.location.pathname !== '/dashboard') return;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/environments/`)
      .then(res => setEnvironments(res.data || []))
      .catch(err => console.error("Error fetching environments:", err));
  };

  useEffect(() => {
    if (user) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
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

  // --- WEBHOOK LOGIC ---
  const handleTriggerDeployment = (e) => {
    e.preventDefault();
    if (!repoUrl || !prNumber) {
      setMessage('⚠️ Please provide both the Repository URL and PR Number.');
      return;
    }

    setLoading(true);
    setMessage('⚡ Firing webhook payload to n8n Engine...');

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-pr`, {
      repo_url: repoUrl, pr_number: prNumber, status: 'PROVISIONING'
    }).then(() => {
      setMessage(`🚀 PR #${prNumber} sequence initiated! Watch the dashboard below.`);
      setPrNumber(''); 
    }).catch(err => {
      console.error(err);
      setMessage('❌ Failed to reach n8n webhook. Is the workflow active?');
    }).finally(() => { setLoading(false); });
  };

  const handleDestroy = (env) => {
    setMessage(`🗑️ Initiating Teardown for PR #${env.pr_number}...`);
    setEnvironments((environments || []).map(e => e.id === env.id ? { ...e, status: 'DESTROYING...' } : e));

    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: env.project_details?.github_repo_url || "https://github.com/placeholder/repo", 
      pr_number: env.pr_number
    }).then(() => {
      setMessage(`✅ n8n Teardown sequence triggered for PR #${env.pr_number}.`);
    }).catch(err => {
      console.error("n8n Webhook Error:", err);
      setMessage(`❌ Failed to reach n8n Teardown Webhook.`);
    });

    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/environments/${env.id}/`, { status: 'DESTROYED' })
      .catch(err => console.error("Django DB Error:", err));
  };

  // --- IAM INTEGRATION SAVE (THIS WAS MISSING!) ---
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
    }).catch(err => {
      console.error("Error saving IAM setup:", err);
      setIamStatus('error');
    });
  };

  // --- FINOPS ENGINE ---
  const calculateFinOps = (env) => {
    if (!env.created_at) return null;
    const start = new Date(env.created_at);
    const end = env.status === 'DESTROYED' && env.updated_at ? new Date(env.updated_at) : new Date();
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

    return { spotCost, odCost, savings, uptimeString, savingsPercent };
  };

  if (!user) return null;

  // The link to your newly deployed S3 CloudFormation template
  const s3TemplateUrl = "https://velzion-public-templates-12345.s3.us-east-1.amazonaws.com/velzion-trust.yaml";
  const cfnLink = `https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review?templateURL=${s3TemplateUrl}&stackName=Velzion-Integration`;

  return (
    <div className="vz-dashboard">
      {/* INJECTED CSS FOR STYLING WITHOUT TAILWIND */}
      <style>{`
        :root {
          --bg-dark: #0f1115;
          --bg-card: #161920;
          --bg-card-hover: #1b1e27;
          --border-color: #272c36;
          --accent-cyan: #00d2ff;
          --accent-cyan-hover: #00b8e6;
          --accent-emerald: #00e676;
          --accent-red: #ff5252;
          --text-main: #f8f9fa;
          --text-muted: #8b949e;
          --font-family: system-ui, -apple-system, sans-serif;
        }
        body { margin: 0; background: var(--bg-dark); }
        .vz-dashboard { display: flex; min-height: 100vh; background-color: var(--bg-dark); color: var(--text-main); font-family: var(--font-family); }
        .vz-sidebar { width: 280px; background-color: var(--bg-card); border-right: 1px solid var(--border-color); padding: 30px 20px; display: flex; flex-direction: column; }
        .vz-logo-container { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding: 0 10px; }
        .vz-logo-box { width: 32px; height: 32px; background-color: var(--accent-cyan); border-radius: 8px; box-shadow: 0 0 15px rgba(0, 210, 255, 0.4); }
        .vz-logo-text { margin: 0; font-size: 22px; letter-spacing: 2px; font-weight: 800; color: #fff; }
        .vz-nav-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin: 0 0 15px 10px; }
        .vz-nav-item { padding: 12px 15px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; color: var(--text-muted); text-decoration: none; display: block; font-weight: 500; }
        .vz-nav-item:hover { background-color: rgba(255,255,255,0.05); color: #fff; }
        .vz-nav-item.active { background-color: rgba(0, 210, 255, 0.1); color: var(--accent-cyan); border: 1px solid rgba(0, 210, 255, 0.2); }
        .vz-iam-box { margin-top: auto; padding: 15px; background-color: var(--bg-dark); border-radius: 8px; border: 1px solid var(--border-color); }
        .vz-iam-title { margin: 0 0 5px 0; font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
        .vz-iam-role { margin: 0; font-size: 12px; color: var(--accent-emerald); word-break: break-all; font-family: monospace; }
        .vz-main { flex: 1; padding: 40px 50px; overflow-y: auto; }
        .vz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; background: var(--bg-card); padding: 20px 30px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .vz-header-titles h1 { color: #fff; margin: 0 0 5px 0; font-size: 26px; }
        .vz-header-titles p { color: var(--text-muted); margin: 0; font-size: 15px; }
        .vz-header-actions { display: flex; align-items: center; gap: 20px; }
        .vz-profile { display: flex; align-items: center; gap: 15px; padding-right: 20px; border-right: 1px solid var(--border-color); }
        .vz-avatar { width: 45px; height: 45px; border-radius: 50%; border: 2px solid var(--accent-cyan); object-fit: cover; }
        .vz-avatar-fallback { width: 45px; height: 45px; border-radius: 50%; background-color: var(--accent-cyan); color: #000; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; }
        .vz-user-info p { margin: 0; }
        .vz-username { font-weight: bold; color: #fff; font-size: 15px; }
        .vz-status { font-size: 12px; color: var(--accent-emerald); }
        .vz-btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; text-decoration: none; border: none; font-size: 14px; }
        .vz-btn-calc { background-color: rgba(0, 230, 118, 0.1); color: var(--accent-emerald); border: 1px solid rgba(0, 230, 118, 0.3); display: flex; align-items: center; gap: 8px; }
        .vz-btn-calc:hover { background-color: rgba(0, 230, 118, 0.2); }
        .vz-btn-logout { background-color: rgba(255, 82, 82, 0.1); color: var(--accent-red); border: 1px solid rgba(255, 82, 82, 0.3); }
        .vz-section { background-color: var(--bg-card); padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px solid var(--border-color); }
        .vz-section-title { margin-top: 0; color: #fff; font-size: 20px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
        .vz-form-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px; align-items: end; }
        .vz-input-group label { display: block; margin-bottom: 8px; color: var(--text-muted); font-size: 13px; font-weight: 600; }
        .vz-input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border-color); background-color: var(--bg-dark); color: #fff; box-sizing: border-box; font-family: monospace; }
        .vz-input:focus { outline: none; border-color: var(--accent-cyan); }
        .vz-btn-submit { background-color: var(--accent-cyan); color: #000; width: 100%; height: 43px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;}
        .vz-btn-submit:hover:not(:disabled) { background-color: var(--accent-cyan-hover); }
        .vz-message { margin-top: 20px; padding: 15px; background: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.2); border-radius: 8px; color: var(--accent-cyan); font-weight: 500; font-size: 14px; }
        .vz-env-list { display: flex; flex-direction: column; gap: 20px; }
        .vz-env-card { background-color: var(--bg-dark); padding: 25px; border-radius: 10px; border: 1px solid var(--border-color); position: relative; overflow: hidden; }
        .vz-status-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
        .status-RUNNING .vz-status-indicator { background-color: var(--accent-emerald); }
        .status-DESTROYED .vz-status-indicator { background-color: #424242; }
        .status-PROVISIONING .vz-status-indicator, .status-DESTROYING { background-color: #ffb300; }
        .vz-env-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .vz-env-pr { font-size: 20px; margin: 0; color: #fff; }
        .vz-badge { padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; letter-spacing: 1px; }
        .bg-green { background: rgba(0, 230, 118, 0.1); color: var(--accent-emerald); border: 1px solid rgba(0, 230, 118, 0.2); }
        .bg-gray { background: #1f232b; color: #888; border: 1px solid #333; }
        .bg-yellow { background: rgba(255, 179, 0, 0.1); color: #ffb300; border: 1px solid rgba(255, 179, 0, 0.2); }
        .vz-env-meta { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
        .vz-link { color: var(--accent-cyan); text-decoration: none; font-family: monospace; }
        .vz-finops { background-color: var(--bg-card); border-radius: 8px; padding: 20px; border: 1px solid var(--border-color); }
        .vz-finops-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .vz-finops-title { margin: 0; font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: bold; }
        .vz-finops-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .vz-stat-label { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; }
        .vz-stat-val { font-size: 18px; font-weight: bold; font-family: monospace; color: #fff; }
        .vz-env-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-color); }
        .vz-instance { margin: 0; color: var(--text-muted); font-family: monospace; font-size: 12px; }
        .vz-btn-terminate { background-color: transparent; color: var(--accent-red); border: 1px solid var(--accent-red); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; }
        .vz-btn-terminate:hover:not(:disabled) { background-color: var(--accent-red); color: #fff; }
      `}</style>

      {/* ENTERPRISE SIDEBAR */}
      <div className="vz-sidebar">
        <div className="vz-logo-container">
          <div className="vz-logo-box"></div>
          <h2 className="vz-logo-text">VELZION</h2>
        </div>
        <p className="vz-nav-label">Control Plane</p>
        
        {/* INTERACTIVE TAB CONTROLS */}
        <div 
          onClick={() => setActiveTab('environments')} 
          className={`vz-nav-item ${activeTab === 'environments' ? 'active' : ''}`}
        >
          🚀 Ephemeral Envs
        </div>
        
        <Link to="/finopscalculator" className="vz-nav-item">
          📊 FinOps Billing
        </Link>
        
        <div 
          onClick={() => setActiveTab('iam')} 
          className={`vz-nav-item ${activeTab === 'iam' ? 'active' : ''}`}
        >
          ⚙️ IAM Settings
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="vz-main">
        
        {/* HEADER */}
        <div className="vz-header">
          <div className="vz-header-titles">
            <h1>Velzion Engine</h1>
            <p>{activeTab === 'environments' ? 'BYOC Ephemeral Environments Control' : 'Cloud Security & IAM Integrations'}</p>
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
            <button onClick={handleLogout} className="vz-btn vz-btn-logout">Logout</button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CONDITIONAL RENDERING: ENVIRONMENTS TAB                          */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'environments' && (
          <>
            <div className="vz-section">
              <h2 className="vz-section-title">⚡ Simulate GitHub PR Event</h2>
              <form onSubmit={handleTriggerDeployment} className="vz-form-grid">
                <div className="vz-input-group">
                  <label>Target Repository URL</label>
                  <input type="url" placeholder="https://github.com/username/repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="vz-input" />
                </div>
                <div className="vz-input-group">
                  <label>PR Number</label>
                  <input type="number" placeholder="e.g., 42" value={prNumber} onChange={(e) => setPrNumber(e.target.value)} className="vz-input" />
                </div>
                <button type="submit" disabled={loading || isPipelineBusy} className="vz-btn-submit">
                  {loading ? 'Transmitting...' : isPipelineBusy ? 'Pipeline Locked' : 'Execute Webhook'}
                </button>
              </form>
              {message && <div className="vz-message">{message}</div>}
            </div>

            <div className="vz-section" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <h2 className="vz-section-title">☁️ Active Cloud Subnets</h2>
              
              {!(environments || []).length ? (
                <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <p style={{ color: '#888', fontSize: '18px', margin: 0 }}>No active deployments found. Fire a webhook to provision.</p>
                </div>
              ) : (
                <div className="vz-env-list">
                  {(environments || []).map(env => {
                    const stats = calculateFinOps(env);
                    let statusClass = "bg-gray";
                    if (env.status === 'RUNNING') statusClass = "bg-green";
                    else if (env.status === 'PROVISIONING' || env.status === 'DESTROYING...') statusClass = "bg-yellow";

                    return (
                      <div key={env.id} className={`vz-env-card status-${env.status.replace('...', '')}`}>
                        <div className="vz-status-indicator"></div>
                        <div className="vz-env-header">
                          <h3 className="vz-env-pr">PR #{env.pr_number}</h3>
                          <span className={`vz-badge ${statusClass}`}>{env.status}</span>
                        </div>
                        <div className="vz-env-meta">
                          {env.status === 'DESTROYED' ? (
                            <span style={{ color: '#ff5252' }}>💀 Infrastructure terminated. Zero compute costs.</span>
                          ) : env.status === 'DESTROYING...' ? (
                            <span style={{ color: '#ffb300' }}>🔥 Evacuating cloud resources...</span>
                          ) : env.dns_prefix ? (
                            <span>🔗 <a href={env.dns_prefix} target="_blank" rel="noreferrer" className="vz-link">{env.dns_prefix}</a></span>
                          ) : (
                            <span>⏳ Negotiating capacity with AWS...</span>
                          )}
                        </div>

                        {stats && (
                          <div className="vz-finops">
                            <div className="vz-finops-header">
                              <p className="vz-finops-title">{env.status === 'DESTROYED' ? 'Final FinOps Report' : 'Live Telemetry'}</p>
                              <span className="vz-badge bg-green">{stats.savingsPercent}% REDUCTION</span>
                            </div>
                            <div className="vz-finops-grid">
                              <div><p className="vz-stat-label">Uptime</p><p className="vz-stat-val">{stats.uptimeString}</p></div>
                              <div><p className="vz-stat-label">Spot Cost</p><p className="vz-stat-val" style={{ color: 'var(--accent-cyan)' }}>${stats.spotCost}</p></div>
                              <div><p className="vz-stat-label">OD Cost</p><p className="vz-stat-val" style={{ textDecoration: 'line-through', color: '#666' }}>${stats.odCost}</p></div>
                              <div><p className="vz-stat-label">Saved</p><p className="vz-stat-val" style={{ color: 'var(--accent-emerald)' }}>+ ${stats.savings}</p></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="vz-env-footer">
                          <p className="vz-instance">INSTANCE: {env.instance_id || 'Pending...'}</p>
                          {env.status === 'RUNNING' && (
                            <button onClick={() => handleDestroy(env)} disabled={isPipelineBusy} className="vz-btn-terminate">
                              Terminate Instance
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

        {/* ---------------------------------------------------------------- */}
        {/* CONDITIONAL RENDERING: IAM SETTINGS TAB                          */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'iam' && (
          <div className="vz-section">
            <h2 className="vz-section-title">☁️ Connect Target AWS Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
              Grant Velzion secure, temporary access to provision PR environments in your own AWS account using a cross-account IAM role.
            </p>

            <div style={{ backgroundColor: 'rgba(0, 210, 255, 0.05)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.2)', marginBottom: '30px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '16px' }}>Step 1: Deploy IAM Trust Policy</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                Click below to launch our verified CloudFormation template in your AWS Console. It will generate a secure `VelzionExecutionRole` tied strictly to your account.
              </p>
              <a 
                href={cfnLink} 
                target="_blank" 
                rel="noreferrer" 
                className="vz-btn-submit" 
                style={{ display: 'inline-block', width: 'auto', padding: '12px 24px', textDecoration: 'none', color: '#000', backgroundColor: 'var(--accent-cyan)' }}
              >
                🚀 Launch 1-Click AWS Setup
              </a>
            </div>

            <h4 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '16px' }}>Step 2: Link Repository & Credentials</h4>
            <form onSubmit={handleSaveIntegration} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="vz-input-group">
                <label>Target GitHub Repository URL</label>
                <input 
                  type="url" 
                  value={iamRepoUrl} 
                  onChange={(e) => setIamRepoUrl(e.target.value)} 
                  placeholder="https://github.com/your-org/your-repo" 
                  required 
                  className="vz-input" 
                />
              </div>
              <div className="vz-input-group">
                <label>Generated AWS Role ARN (from Step 1)</label>
                <input 
                  type="text" 
                  value={iamRoleArn} 
                  onChange={(e) => setIamRoleArn(e.target.value)} 
                  placeholder="arn:aws:iam::123456789012:role/VelzionExecutionRole" 
                  required 
                  className="vz-input" 
                />
              </div>
              <button type="submit" className="vz-btn-submit" style={{ width: '200px', alignSelf: 'flex-start' }}>
                Save Integration
              </button>
            </form>

            {iamStatus === 'success' && <div className="vz-message" style={{ color: 'var(--accent-emerald)', borderColor: 'rgba(0, 230, 118, 0.3)', backgroundColor: 'rgba(0, 230, 118, 0.1)' }}>✓ Configuration saved! n8n will now use this role for PRs on that repo.</div>}
            {iamStatus === 'error' && <div className="vz-message" style={{ color: 'var(--accent-red)', borderColor: 'rgba(255, 82, 82, 0.3)', backgroundColor: 'rgba(255, 82, 82, 0.1)' }}>✗ Failed to save configuration. Check console.</div>}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;