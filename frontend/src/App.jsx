import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [environments, setEnvironments] = useState([])
  const [repoUrl, setRepoUrl] = useState('')
  const [prNumber, setPrNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchData = () => {
    // OLD: axios.get('http://127.0.0.1:8000/api/environments/')
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/environments/`)
      .then(res => setEnvironments(res.data))
      .catch(err => console.error("Error fetching environments:", err))
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const isPipelineBusy = environments.some(env => 
    env.status === 'PROVISIONING' || env.status === 'DESTROYING...'
  );

  const handleTriggerDeployment = (e) => {
    e.preventDefault()
    if (!repoUrl || !prNumber) {
      setMessage('⚠️ Please provide both the Repository URL and PR Number.')
      return
    }

    setLoading(true)
    setMessage('⚡ Firing webhook payload to n8n Engine...')

    // OLD: axios.post('http://localhost:5678/webhook/zegion-pr', { ...
    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-pr`, {
      repo_url: repoUrl,
      pr_number: prNumber,
      status: 'PROVISIONING'
    })
    .then(() => {
      setMessage(`🚀 PR #${prNumber} sequence initiated! Watch the dashboard below.`)
      setPrNumber('') 
    })
    .catch(err => {
      console.error(err)
      setMessage('❌ Failed to reach n8n webhook. Is the workflow active?')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  const handleDestroy = (env) => {
    setMessage(`🗑️ Initiating Teardown for PR #${env.pr_number}...`);

    // 1. Instantly update the UI so it feels lightning fast (No network waiting)
    setEnvironments(environments.map(e => 
      e.id === env.id ? { ...e, status: 'DESTROYING...' } : e
    ));

    // 2. FIRE N8N DIRECTLY (Do not wait for Django)
    // OLD: axios.post('http://localhost:5678/webhook/zegion-destroy', { ...
    axios.post(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/zegion-destroy`, {
      repo_url: env.project_details?.github_repo_url || "https://github.com/placeholder/repo", 
      pr_number: env.pr_number
    })
    .then(() => {
      setMessage(`✅ n8n Teardown sequence triggered for PR #${env.pr_number}.`);
    })
    .catch(err => {
      console.error("n8n Webhook Error:", err);
      setMessage(`❌ Failed to reach n8n Teardown Webhook. Check console!`);
    });

    // 3. Tell Django to lock the state permanently
    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/environments/${env.id}/`, { status: 'DESTROYED' })
      .catch(err => console.error("Django DB Error:", err));
  }
// --- THE ENTERPRISE FINOPS ENGINE ---
  const calculateFinOps = (env) => {
    if (!env.created_at) return null;

    const start = new Date(env.created_at);
    const end = env.status === 'DESTROYED' && env.updated_at ? new Date(env.updated_at) : new Date();
    
    const uptimeSeconds = Math.max(0, (end - start) / 1000);

    // AWS Pricing Variables (You can make these dynamic later based on instance type!)
    const spotHourly = 0.0031;
    const odHourly = 0.0104;

    const spotCost = (uptimeSeconds * (spotHourly / 3600)).toFixed(5);
    const odCost = (uptimeSeconds * (odHourly / 3600)).toFixed(5);
    const savings = (uptimeSeconds * ((odHourly - spotHourly) / 3600)).toFixed(5);
    
    // THE NEW DYNAMIC PERCENTAGE CALCULATION
    const savingsPercent = (((odHourly - spotHourly) / odHourly) * 100).toFixed(1);

    // Format Uptime cleanly
    const h = Math.floor(uptimeSeconds / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = Math.floor(uptimeSeconds % 60);
    const uptimeString = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;

    return { spotCost, odCost, savings, uptimeString, savingsPercent };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#12121a', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* ENTERPRISE SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#1a1a24', borderRight: '1px solid #2a2a35', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ width: '30px', height: '30px', backgroundColor: '#00d2ff', borderRadius: '6px' }}></div>
          <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>VELZION</h2>
        </div>
        <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px' }}>Control Plane</p>
        <div style={{ padding: '10px', backgroundColor: '#2a2a35', borderRadius: '6px', color: '#00d2ff', cursor: 'pointer', marginBottom: '10px' }}>🚀 Ephemeral Envs</div>
        <div style={{ padding: '10px', color: '#888', cursor: 'pointer', marginBottom: '10px' }}>📊 FinOps Billing</div>
        <div style={{ padding: '10px', color: '#888', cursor: 'pointer', marginBottom: '10px' }}>⚙️ IAM Settings</div>
        
        <div style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#0d0d14', borderRadius: '6px', border: '1px solid #2a2a35' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#aaa' }}>Current IAM Role</p>
          <p style={{ margin: '0', fontSize: '11px', color: '#00e676', wordBreak: 'break-all' }}>arn:aws:iam::1234:role/VelzionBYOC</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h1 style={{ color: '#00d2ff', marginBottom: '5px' }}>🚀 Velzion Control Plane</h1>
        <p style={{ color: '#aaa', marginTop: '0' }}>BYOC Ephemeral Environments Engine</p>
        
        {/* SECTION 1: GITHUB WEBHOOK SIMULATOR */}
        <div style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #2a2a35' }}>
          <h2 style={{ marginTop: '0', color: '#fff' }}>Simulate GitHub PR Event</h2>
          <form onSubmit={handleTriggerDeployment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>GitHub Repository URL:</label>
              <input 
                type="url" 
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#12121a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Target PR Number:</label>
              <input 
                type="number" 
                placeholder="e.g., 42"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#12121a', color: '#fff', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || isPipelineBusy}
              style={{ 
                padding: '12px', 
                borderRadius: '4px', 
                border: 'none', 
                backgroundColor: (loading || isPipelineBusy) ? '#555' : '#00d2ff', 
                color: (loading || isPipelineBusy) ? '#aaa' : '#000', 
                fontWeight: 'bold', 
                cursor: (loading || isPipelineBusy) ? 'not-allowed' : 'pointer', 
                fontSize: '16px' 
              }}
            >
              {loading ? 'Transmitting...' : isPipelineBusy ? 'Pipeline Locked (Activity Detected)' : 'Execute Buildpack Pipeline'}
            </button>
          </form>
          {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#00d2ff' }}>{message}</p>}
        </div>

        {/* SECTION 2: LIVE ENVIRONMENTS TRACKER */}
        <div style={{ backgroundColor: '#1e1e2f', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a35' }}>
          <h2>Active Preview Subnets</h2>
          {environments.length === 0 ? (
            <p style={{ color: '#ff6b6b' }}>No active ephemeral deployments found. Fire a webhook to populate.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {environments.map(env => (
                <div key={env.id} style={{ borderLeft: env.status === 'DESTROYED' ? '4px solid #424242' : '4px solid #00d2ff', backgroundColor: '#12121a', padding: '20px', borderRadius: '4px', border: '1px solid #2a2a35' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '18px' }}>PR #{env.pr_number}</strong>
                    <span style={{ 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      backgroundColor: env.status === 'RUNNING' ? '#2e7d32' : env.status === 'DESTROYED' ? '#424242' : env.status === 'DESTROYING...' ? '#fbc02d' : '#f57c00',
                      color: '#fff'
                    }}>
                      {env.status}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '15px', fontSize: '14px', color: '#ccc' }}>
                    {env.status === 'DESTROYED' ? (
                      <p style={{ margin: '5px 0', color: '#ff6b6b' }}>💀 Infrastructure terminated. Zero active compute costs.</p>
                    ) : env.status === 'DESTROYING...' ? (
                      <p style={{ margin: '5px 0', color: '#fbc02d' }}>🔥 Evacuating cloud resources and wiping state...</p>
                    ) : env.dns_prefix ? (
                      <p style={{ margin: '5px 0' }}>🔗 <strong>Live URL:</strong> <a href={env.dns_prefix} target="_blank" rel="noreferrer" style={{ color: '#00d2ff' }}>{env.dns_prefix}</a></p>
                    ) : (
                      <p style={{ margin: '5px 0' }}>⏳ Negotiating compute capacity with AWS...</p>
                    )}

                    {/* LIVE FINOPS DATA WIDGET */}
                    {(() => {
                      const stats = calculateFinOps(env);
                      if (!stats) return null;
                      return (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1a1a24', borderLeft: `3px solid ${env.status === 'RUNNING' ? '#00e676' : '#666'}`, borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <p style={{ margin: '0', fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
                              {env.status === 'DESTROYED' ? 'Final FinOps Report' : 'Live FinOps Telemetry'}
                            </p>
                            
                            {/* DYNAMIC SAVINGS BADGE */}
                            <span style={{ backgroundColor: 'rgba(0, 230, 118, 0.1)', color: '#00e676', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #00e676' }}>
                              {stats.savingsPercent}% COST REDUCTION
                            </span>
                            
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                            <div>
                              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#aaa' }}>Total Uptime</p>
                              <p style={{ margin: '0', fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>{stats.uptimeString}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#aaa' }}>Spot Compute Cost</p>
                              <p style={{ margin: '0', fontWeight: 'bold', color: '#00d2ff', fontSize: '16px' }}>${stats.spotCost}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#aaa' }}>On-Demand Pricing</p>
                              <p style={{ margin: '0', fontWeight: 'bold', color: '#ff6b6b', textDecoration: 'line-through', fontSize: '16px' }}>${stats.odCost}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#aaa' }}>Money Saved</p>
                              <p style={{ margin: '0', fontWeight: 'bold', color: '#00e676', fontSize: '16px' }}>+ ${stats.savings}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* BOTTOM ROW */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #2a2a35', paddingTop: '15px' }}>
                      <p style={{ margin: '0', color: '#888' }}>⚙️ <strong>AWS Instance:</strong> {env.instance_id || 'Pending...'}</p>
                      
                      {env.status === 'RUNNING' && (
                        <button 
                          onClick={() => handleDestroy(env)}
                          disabled={isPipelineBusy}
                          style={{ 
                            padding: '8px 16px', 
                            backgroundColor: isPipelineBusy ? '#555' : '#b71c1c', 
                            color: isPipelineBusy ? '#aaa' : 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: isPipelineBusy ? 'not-allowed' : 'pointer', 
                            fontSize: '13px', 
                            fontWeight: 'bold',
                            transition: '0.2s'
                          }}
                        >
                          Terminate Instance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App