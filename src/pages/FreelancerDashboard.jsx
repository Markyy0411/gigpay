import React, { useState } from 'react';
import { Wallet, ArrowUpRight, CheckCircle, ShieldAlert, ShieldCheck, Landmark } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { requestWalletSignature } from '../lib/stellar';
import TaskProgress from '../components/TaskProgress';

const FreelancerDashboard = () => {
  const { user, publicKey } = useAuth();
  const { tasks, isLoading, updateTaskStatus } = useTasks();
  const { addToast } = useToast();
  const availableTasks = tasks.filter(t => t.status === 'Available');
  const acceptedTasks = tasks.filter(t => (t.status === 'In Progress' || t.status === 'Disputed') && t.freelancer_id === user?.id);
  const completedTasks = tasks.filter(t => t.status === 'Completed' && t.freelancer_id === user?.id);
  
  const totalEarned = completedTasks.reduce((sum, task) => sum + Number(task.amount), 0);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // New Bank Off-ramp State
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const banks = [
    { id: 'unionbank', name: 'UnionBank (PH)' },
    { id: 'gcash', name: 'GCash' },
    { id: 'dbs', name: 'DBS Bank' },
    { id: 'revolut', name: 'Revolut' }
  ];

  const handleAcceptWork = async (id, amount) => {
    setIsAccepting(true);
    try {
      await requestWalletSignature(publicKey, `Accept Escrow Contract for $${amount} USDC`);
      updateTaskStatus(id, 'In Progress', true);
      addToast("Work accepted! Good luck on the task.", "success");
    } catch (error) {
      addToast(error.message || "Failed to sign acceptance.", "error");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleWithdraw = async () => {
    if (totalEarned === 0) {
      addToast("No funds available to withdraw.", "error");
      return;
    }
    
    if (!isKycVerified) {
      setShowKycModal(true);
      return;
    }

    // Instead of withdrawing instantly, open bank selection
    setShowBankModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedBank || !accountNumber) {
      addToast("Please select a bank and enter an account number.", "error");
      return;
    }

    setIsWithdrawing(true);
    try {
      await requestWalletSignature(publicKey, `Withdraw $${totalEarned} USDC from Escrow to ${selectedBank}`);
      const bankName = banks.find(b => b.id === selectedBank)?.name || selectedBank;
      const last4 = accountNumber.slice(-4) || '1234';
      addToast(`Successfully converted & transferred $${totalEarned} USDC to ${bankName} account ending in ****${last4}.`, "success");
      setShowBankModal(false);
      setSelectedBank('');
      setAccountNumber('');
    } catch (error) {
      addToast(error.message || "Withdrawal signature failed.", "error");
    } finally {
      setIsWithdrawing(false);
    }
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
          {!publicKey && (
            <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <ShieldAlert size={16} /> Wallet Required
            </div>
          )}
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '0.5rem', opacity: isWithdrawing || !publicKey ? 0.5 : 1 }}
            onClick={handleWithdraw}
            disabled={isWithdrawing || !publicKey}
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
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client: {task.client_id ? task.client_id.slice(0, 8) + '...' : 'Unknown'}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>${task.amount} USDC Locked</div>
                <button 
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', opacity: !publicKey || isAccepting ? 0.5 : 1 }} 
                  onClick={() => handleAcceptWork(task.id, task.amount)}
                  disabled={!publicKey || isAccepting}
                  title={!publicKey ? "Connect wallet to accept work" : ""}
                >
                  {isAccepting ? 'Signing...' : <>Accept Work <ArrowUpRight size={16} /></>}
                </button>
            </div>
          </div>
          <TaskProgress status={task.status} />
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
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client: {task.client_id ? task.client_id.slice(0, 8) + '...' : 'Unknown'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ fontWeight: 'bold', color: task.status === 'Disputed' ? '#ef4444' : 'var(--accent)' }}>${task.amount} USDC Locked</div>
                  <span style={{ color: task.status === 'Disputed' ? '#ef4444' : 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    {task.status === 'Disputed' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />} 
                    {task.status === 'Disputed' ? 'Disputed' : 'In Progress'}
                  </span>
                </div>
              </div>
              <TaskProgress status={task.status} />
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

      {/* Bank Selection Off-Ramp Modal */}
      {showBankModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Landmark size={28} />
              <h3 style={{ margin: 0, color: 'white' }}>Select Off-Ramp Destination</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Convert and withdraw your ${totalEarned} USDC directly to your local bank account.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {banks.map(bank => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${selectedBank === bank.id ? 'var(--accent)' : 'var(--border)'}`,
                    backgroundColor: selectedBank === bank.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontWeight: selectedBank === bank.id ? 'bold' : 'normal'
                  }}
                >
                  {bank.name}
                </button>
              ))}
            </div>

            {selectedBank && (
              <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Account Number
                </label>
                <input 
                  type="text" 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 1093 4293 4810"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', color: 'white' }} 
                />
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => { setShowBankModal(false); setSelectedBank(''); setAccountNumber(''); }}
                disabled={isWithdrawing}
                style={{ flex: 1, borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmWithdraw}
                disabled={isWithdrawing || !selectedBank || !accountNumber}
                style={{ flex: 2, opacity: isWithdrawing || !selectedBank || !accountNumber ? 0.5 : 1 }}
              >
                {isWithdrawing ? 'Processing Transfer...' : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
