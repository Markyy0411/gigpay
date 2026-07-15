import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Zap } from 'lucide-react';
import SlideToVerify from '../components/SlideToVerify';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const processSubmit = async () => {
    if (!isVerified) {
      addToast("Please complete the human verification.", "error");
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const data = await signIn(email, password);
        addToast("Logged in successfully!", "success");
        const userRole = data.user.user_metadata?.role || 'client';
        navigate(userRole === 'client' ? '/client' : '/freelancer');
      } else {
        const data = await signUp(email, password, { role });
        addToast("Account created successfully! Please check your email to verify your account before logging in.", "success");
        setIsLogin(true); // switch to login mode
        setIsVerified(false); // require re-verification for login
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      if (error.message.includes('Email not confirmed')) {
        addToast("Please check your email and click the confirmation link before logging in.", "error");
      } else {
        addToast(error.message || "An error occurred.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processSubmit();
  };

  // Premium Automation: Auto-Login Debounce Hook
  useEffect(() => {
    if (isLogin && email && password.length >= 6 && isVerified && !isLoading) {
      const timeoutId = setTimeout(() => {
        processSubmit();
      }, 1000); // Trigger auto-login after 1s of inactivity
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, isVerified, isLogin]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', color: 'var(--accent)' }}>
          <Zap size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
                required
              />
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>I am a...</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: role === 'client' ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: role === 'client' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                    color: role === 'client' ? 'var(--accent)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: role === 'client' ? 'bold' : 'normal'
                  }}
                >
                  Client (Hiring)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('freelancer')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: role === 'freelancer' ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: role === 'freelancer' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                    color: role === 'freelancer' ? 'var(--accent)' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: role === 'freelancer' ? 'bold' : 'normal'
                  }}
                >
                  Freelancer (Working)
                </button>
              </div>
            </div>
          )}

          <SlideToVerify key={isLogin ? 'login' : 'signup'} onVerify={setIsVerified} />

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', opacity: isLoading || !isVerified ? 0.5 : 1 }}
            disabled={isLoading || !isVerified}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setIsVerified(false); // Reset verification on toggle
            }} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
