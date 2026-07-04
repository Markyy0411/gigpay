import React, { useState } from 'react';
import { Wallet, ArrowUpRight, CheckCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';

const FreelancerDashboard = () => {
  const { tasks, isLoading, updateTaskStatus } = useTasks();
  const { addToast } = useToast();
  const availableTasks = tasks.filter(t => t.status === 'Available');
  const acceptedTasks = tasks.filter(t => t.status === 'In Progress' && t.freelancer === 'Me');
  const completedTasks = tasks.filter(t => t.status === 'Completed' && t.freelancer === 'Me');
  
  const totalEarned = completedTasks.reduce((sum, task) => sum + Number(task.amount), 0);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAcceptWork = (id) => {
    updateTaskStatus(id, 'In Progress', 'Me');
    addToast("Work accepted! Good luck on the task.", "success");
  };

  const handleWithdraw = () => {
    if (totalEarned === 0) {
      addToast("No funds available to withdraw.", "error");
      return;
    }
    
    if (!isKycVerified) {
      setShowKycModal(true);
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      addToast(`Successfully withdrawn $${totalEarned} USDC to your local bank account.`, "success");
    }, 2000);
  };

  const handleSimulateKyc = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsKycVerified(true);
      setShowKycModal(false);
      addToast("Identity Verified successfully! You can now withdraw funds.", "success");
    }, 2500);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ flex: '1 1 250px', borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Earned</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>${totalEarned} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>USDC</span></div>
        </div>
        <div className="glass-panel" style={{ flex: '1 1 250px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Escrows</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{acceptedTasks.length}</div>
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
        {isLoading ? (
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--accent)' }}>
            Syncing with Supabase Realtime...
          </div>
        ) : availableTasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks available right now.</p>
        ) : null}
        {!isLoading && availableTasks.map(task => (
          <div key={task.id} className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{task.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client: {task.client}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>${task.amount} USDC Locked</div>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => handleAcceptWork(task.id)}>
                Accept Work <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {acceptedTasks.length > 0 && (
        <>
          <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>Your Active Jobs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {acceptedTasks.map(task => (
              <div key={task.id} className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client: {task.client}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>${task.amount} USDC Locked</div>
                  <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <CheckCircle size={18} /> In Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#ffb84d' }}>
              <ShieldAlert size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem' }}>Identity Verification Required</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              To comply with global anti-money laundering (AML) laws, you must verify your identity before withdrawing funds to a local bank account.
            </p>
            
            <button 
              className="btn btn-primary" 
              onClick={handleSimulateKyc}
              disabled={isVerifying}
              style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', opacity: isVerifying ? 0.7 : 1 }}
            >
              {isVerifying ? 'Scanning ID Document...' : 'Start Secure KYC Check'}
            </button>
            
            <button 
              className="btn btn-outline" 
              onClick={() => setShowKycModal(false)}
              disabled={isVerifying}
              style={{ width: '100%', borderColor: 'transparent', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
