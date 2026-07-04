import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, DollarSign } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
        Instant Payouts.<br />Zero Middlemen.
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        The decentralized payment platform for gig workers in APAC. Get paid in USDC the second your job is done, directly to your Stellar wallet.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '5rem' }}>
        <Link to="/freelancer" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          I'm a Freelancer <ArrowRight size={20} />
        </Link>
        <Link to="/client" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          I'm a Client
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
        <div className="glass-panel">
          <Zap size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>Lightning Fast</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Powered by Stellar network, payments settle in under 5 seconds cross-border.</p>
        </div>
        <div className="glass-panel">
          <DollarSign size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3>Near-Zero Fees</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Stop giving 20% to platforms. Keep exactly what you earn with fraction-of-a-cent fees.</p>
        </div>
        <div className="glass-panel">
          <ShieldCheck size={32} color="#c084fc" style={{ marginBottom: '1rem' }} />
          <h3>Smart Escrow</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Funds are locked safely in a Soroban smart contract until the work is approved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
