import React, { useState } from 'react';
import { PlusCircle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user, publicKey } = useAuth();
  const { tasks, isLoading, addTask, updateTaskStatus } = useTasks();
  const { addToast } = useToast();
  const clientTasks = tasks.filter(t => t.client_id === user?.id && t.status !== 'Available');
  
  const [isTransacting, setIsTransacting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAmount, setNewTaskAmount] = useState('');
  const [taskToApprove, setTaskToApprove] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  const initiateApproval = (id) => {
    setTaskToApprove(id);
    setConfirmText('');
  };

  const handleApprove = () => {
    if (confirmText !== 'CONFIRM' || !taskToApprove) return;
    setIsTransacting(true);
    setTaskToApprove(null);
    // Simulate Stellar network transaction delay
    setTimeout(() => {
      updateTaskStatus(taskToApprove, 'Completed');
      setIsTransacting(false);
      addToast("Transaction Confirmed! Funds released to freelancer.", "success");
    }, 2500);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskAmount) return;
    setIsTransacting(true);
    
    setTimeout(() => {
      const newTask = {
        title: newTaskTitle,
        amount: newTaskAmount
      };
      addTask(newTask);
      setNewTaskTitle('');
      setNewTaskAmount('');
      setIsTransacting(false);
      addToast("Task Escrow created successfully!", "success");
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Client Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your funded tasks and approve work.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Task List */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isLoading ? (
            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', padding: '2rem', color: 'var(--accent)' }}>
              Loading tasks from blockchain...
            </div>
          ) : clientTasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No active tasks.</p>
          ) : null}
          {!isLoading && clientTasks.map(task => (
            <div key={task.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{task.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {task.status}
                  </span>
                  <span>Freelancer: {task.freelancer_id ? task.freelancer_id.slice(0, 8) + '...' : 'Unassigned'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  ${task.amount} USDC
                </div>
                {task.status === 'In Progress' ? (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => initiateApproval(task.id)}
                    disabled={isTransacting}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--accent)', color: 'var(--accent)', opacity: isTransacting ? 0.5 : 1 }}
                  >
                    <CheckCircle size={14} /> {isTransacting ? 'Processing...' : 'Approve & Pay'}
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paid</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Form */}
        <div className="glass-panel" style={{ flex: '1 1 300px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Create Task Escrow</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleCreateTask}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Task Title</label>
              <input 
                type="text" 
                placeholder="e.g. Logo Design" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Amount (USDC)</label>
              <input 
                type="number" 
                placeholder="100" 
                value={newTaskAmount}
                onChange={(e) => setNewTaskAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
                required
              />
            </div>
            {!publicKey && (
              <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={16} /> Please connect Freighter Wallet first.
              </div>
            )}
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '0.5rem', opacity: isTransacting || !publicKey ? 0.5 : 1 }}
              disabled={isTransacting || !publicKey}
            >
              <PlusCircle size={18}/> {isTransacting ? 'Locking...' : 'Lock Funds in Escrow'}
            </button>
          </form>
        </div>
      </div>

      {/* AWS-style Confirmation Modal */}
      {taskToApprove && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', border: '1px solid #ff4444' }}>
            <h3 style={{ color: '#ff4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ Danger Zone
            </h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              You are about to release funds from escrow. This action is irreversible on the blockchain.
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              To proceed, please type <strong>CONFIRM</strong> below:
            </p>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ff4444', background: 'rgba(0,0,0,0.4)', color: 'white', marginBottom: '1.5rem' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setTaskToApprove(null)}
                style={{ padding: '0.5rem 1rem', borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
              <button 
                className="btn" 
                onClick={handleApprove}
                disabled={confirmText !== 'CONFIRM'}
                style={{ padding: '0.5rem 1rem', backgroundColor: confirmText === 'CONFIRM' ? '#ff4444' : '#555', color: 'white', cursor: confirmText === 'CONFIRM' ? 'pointer' : 'not-allowed' }}
              >
                Force Release Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
