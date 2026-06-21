import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Settings, User, ChevronRight } from 'lucide-react';

// Reusable Icon Button
const ActionButton = ({ icon: Icon }) => (
  <button style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    color: 'var(--text-muted)',
    transition: 'all var(--transition-fast)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
    e.currentTarget.style.color = 'var(--text-pure)';
    e.currentTarget.style.border = 'var(--border-subtle)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = 'var(--text-muted)';
    e.currentTarget.style.border = '1px solid transparent';
  }}
  >
    <Icon size={18} />
  </button>
);

export default function TopNavbar() {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const u = localStorage.getItem('velzion_user');
    if (u) {
      try { setUser(JSON.parse(u)); } catch(e) {}
    }
  }, []);

  const [iamConnected, setIamConnected] = useState(false);
  React.useEffect(() => {
    setIamConnected(localStorage.getItem('velzion_iam_connected') === 'true');
    const handleStorageChange = () => {
      setIamConnected(localStorage.getItem('velzion_iam_connected') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Parse URL for dynamic breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isVelzard = location.pathname.includes('/velzard');
  
  const engineName = isVelzard ? 'Velzard' : 'Zegion';
  const engineGradient = isVelzard ? 'text-gradient-velzard' : 'text-gradient-zegion';
  
  // Format the current page name (e.g., "setup-guide" -> "setup guide")
  const currentPage = pathParts.length > 1 
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ') 
    : 'Overview';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: 'var(--border-subtle)',
      backgroundColor: 'transparent',
      zIndex: 40
    }}>
      
      {/* Contextual Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className={engineGradient} style={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          letterSpacing: '0.02em'
        }}>
          {engineName}
        </span>
        {pathParts.length > 1 && (
          <>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ 
              color: 'var(--text-muted)', 
              textTransform: 'capitalize',
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              {currentPage}
            </span>
          </>
        )}
      </div>

      {/* Global Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Glassmorphism Command Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: isSearchFocused ? '280px' : '220px',
          height: '40px',
          backgroundColor: isSearchFocused ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
          border: isSearchFocused ? 'var(--border-focus)' : 'var(--border-subtle)',
          borderRadius: 'var(--radius-pill)',
          padding: '0 1rem',
          transition: 'all var(--transition-smooth)'
        }}>
          <Search size={16} style={{ 
            color: isSearchFocused ? 'var(--text-pure)' : 'var(--text-muted)',
            minWidth: '16px'
          }} />
          <input 
            type="text"
            placeholder="Search resources (⌘K)"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-pure)',
              width: '100%',
              marginLeft: '0.5rem',
              fontSize: '0.9rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ActionButton icon={Bell} />
          <ActionButton icon={Settings} />
          
          {/* Profile Divider */}
          <div style={{ 
            width: '1px', 
            height: '20px', 
            backgroundColor: 'var(--border-subtle)',
            margin: '0 0.5rem'
          }} />
          
          {iamConnected ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginRight: '0.5rem'
            }}>
              IAM Connected
            </div>
          ) : (
            <Link to="/Iam-login-page" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--vz-gold-border)',
              background: 'var(--vz-gold-glow)',
              color: 'var(--vz-gold-core)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginRight: '0.5rem'
            }}>
              IAM Login
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-pure)' }}>{user.username || 'User'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>GitHub Identity</span>
              </div>
            </div>
          ) : (
            <ActionButton icon={User} />
          )}
        </div>
      </div>

    </header>
  );
}