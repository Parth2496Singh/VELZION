import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth`;

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Authenticating with GitHub...");
  
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code && !hasFetched.current) {
      hasFetched.current = true; 
      
      axios.post(`${API_URL}/callback/`, { code })
        .then(response => {
          setStatus("Authentication successful! Loading your workspaces...");
          
          console.log("🔥 DJANGO RESPONSE:", response.data);
          
          const userData = response.data.user || response.data;
          
          // 🛡️ NEW: Grab the repositories list Django fetched from GitHub
          // Fallback to empty array if backend hasn't implemented it yet
          const userRepos = response.data.repos || []; 
          
          localStorage.setItem('velzion_user', JSON.stringify(userData));
          localStorage.setItem('velzion_repos', JSON.stringify(userRepos)); // Save accessible workspaces
          
          // Redirect to the clean Blank Slate dashboard
          setTimeout(() => navigate('/dashboard'), 1000);
        })
        .catch(err => {
            console.error("Auth Error:", err);
            setStatus("Authentication failed. Please try again.");
            setTimeout(() => navigate('/login'), 2000);
        });
    } else if (!code) {
      setStatus("No authorization code found.");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div className="text-xl font-semibold" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        <span style={{ fontSize: '24px', marginRight: '12px' }}>⚡</span>
        {status}
      </div>
    </div>
  );
};

export default AuthCallback;