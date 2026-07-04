import React, { useState } from 'react';
import { Wallet, ArrowUpRight, CheckCircle } from 'lucide-react';

const FreelancerDashboard = () => {
  const [availableTasks, setAvailableTasks] = useState([
    { id: 1, title: 'React Frontend Fixes', amount: '200', client: 'Stellar Foundation', status: 'available' },
    { id: 2, title: 'Smart Contract Audit', amount: '500', client: 'DeFi Protocol X', status: 'available' }
  ]);

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleAcceptWork = (id) => {
    setAvailableTasks(availableTasks.map(task => 
      task.id === id ? { ...task, status: 'accepted' } : task
    ));
  };

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      alert("Successfully withdrawn $850 USDC to your local bank account via Stellar Anchor.");
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ flex: '1 1 250px', borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Earned</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>$850 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>USDC</span></div>
        </div>
        <div className="glass-panel" style={{ flex: '1 1 250px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Escrows</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{availableTasks.filter(t => t.status === 'accepted').length}</div>
        </div>
        <div className="glass-panel" style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '0.5rem', opacity: isWithdrawing ? 0.5 : 1 }}
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            <Wallet size={18} /> {isWithdrawing ? 'Processing...' : 'Withdraw to Bank'}
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>Available Funded Tasks</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {availableTasks.map(task => (
          <div key={task.id} className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{task.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client: {task.client}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>${task.amount} USDC Locked</div>
              {task.status === 'available' ? (
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => handleAcceptWork(task.id)}>
                  Accept Work <ArrowUpRight size={16} />
                </button>
              ) : (
                <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <CheckCircle size={18} /> Accepted
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
