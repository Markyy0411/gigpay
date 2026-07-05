import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ShieldAlert, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOut, publicKey, connectWallet } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleConnect = async () => {
    setError('');
    try {
      await connectWallet();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatKey = (key) => {
    if (!key) return '';
    return `${key.slice(0, 5)}...${key.slice(-4)}`;
  };

  return (
    <nav className="navbar animate-fade-in" style={{ flexWrap: 'wrap' }}>
      <Link to="/" className="logo">
        <Zap className="logo-icon" fill="currentColor" />
        GigPay
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            {user.user_metadata?.role === 'client' && (
              <Link to="/client" className="btn btn-outline">Client Portal</Link>
            )}
            {user.user_metadata?.role === 'freelancer' && (
              <Link to="/freelancer" className="btn btn-outline">Freelancer Portal</Link>
            )}
            
            {publicKey ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--accent)' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>{formatKey(publicKey)}</span>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleConnect}>Connect Wallet</button>
            )}

            <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'transparent', color: 'var(--text-main)' }}>
              <User size={16} /> Profile
            </Link>
            <button onClick={handleSignOut} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'transparent', color: 'var(--text-muted)' }}>
              <LogOut size={16} /> Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" className="btn btn-primary">Sign In / Sign Up</Link>
        )}
      </div>
      {error && (
        <div style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '0.5rem', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <ShieldAlert size={16} /> {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
