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
  
  // 1. Create a persistent lock that survives React's double-renders
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    
    // 2. Only proceed if we have a code AND the lock is false
    if (code && !hasFetched.current) {
      
      // 3. Instantly snap the lock shut!
      hasFetched.current = true; 
      
      axios.post(`${API_URL}/callback/`, { code })
        .then(response => {
          setStatus("Authentication successful! Redirecting...");
          
          // 1. Log the exact payload so we can see what Django sent
          console.log("🔥 DJANGO RESPONSE:", response.data);
          
          // 2. Dynamically grab the user data, whether it's nested or at the root
          const userData = response.data.user || response.data;
          
          // 3. Save it cleanly
          localStorage.setItem('velzion_user', JSON.stringify(userData));
          
          setTimeout(() => navigate('/dashboard'), 1000);
        })
    } else if (!code) {
      setStatus("No authorization code found.");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-xl font-semibold animate-pulse">
        {status}
      </div>
    </div>
  );
};

export default AuthCallback;