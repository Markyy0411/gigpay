import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, DollarSign, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div style={{ paddingTop: '2rem', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative' }}
      >
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: -1, pointerEvents: 'none'
        }} />

        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1px' }}
        >
          Instant Payouts.<br />
          <span style={{ background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Zero Middlemen.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem auto' }}
        >
          The decentralized payment platform for gig workers in APAC. Get paid in USDC the second your job is done, directly to your Stellar wallet.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}
        >
          <Link to="/freelancer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderRadius: '2rem' }}>
            I'm a Freelancer <ArrowRight size={20} />
          </Link>
          <Link to="/client" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.03)' }}>
            I'm a Client
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
        
        <motion.div 
          whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(59,130,246,0.3)' }}
          className="glass-panel"
          style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><Zap size={100} /></div>
          <Zap size={36} color="#00f2fe" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Lightning Fast</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Powered by Stellar network, payments settle in under 5 seconds cross-border, directly to your wallet.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(16,185,129,0.3)' }}
          className="glass-panel"
          style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><DollarSign size={100} /></div>
          <DollarSign size={36} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Near-Zero Fees</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Stop giving 20% to traditional platforms. Keep exactly what you earn with fraction-of-a-cent fees.</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(192,132,252,0.3)' }}
          className="glass-panel"
          style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><ShieldCheck size={100} /></div>
          <ShieldCheck size={36} color="#c084fc" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Smart Escrow</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Funds are locked safely in a Soroban smart contract until the work is verified and approved.</p>
        </motion.div>

      </div>
      
    </div>
  );
};

export default LandingPage;
