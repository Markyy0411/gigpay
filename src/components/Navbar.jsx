import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldAlert } from 'lucide-react';
import { connectWallet } from '../lib/stellar';

const Navbar = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    const res = await connectWallet();
    if (res.error) {
      setError(res.error);
    } else {
      setPublicKey(res.publicKey);
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
        <Link to="/client" className="btn btn-outline">Client Portal</Link>
        <Link to="/freelancer" className="btn btn-outline">Freelancer Portal</Link>
        
        {publicKey ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--accent)' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>{formatKey(publicKey)}</span>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleConnect}>Connect Wallet</button>
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
