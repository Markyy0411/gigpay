import React, { useState } from 'react';
import { PlusCircle, CheckCircle, Clock } from 'lucide-react';

const ClientDashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Landing Page', amount: '150', status: 'In Progress', freelancer: 'GBQX...3F1A' },
    { id: 2, title: 'Write Smart Contract', amount: '300', status: 'Completed', freelancer: 'GCAE...9B22' }
  ]);
  const [isTransacting, setIsTransacting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAmount, setNewTaskAmount] = useState('');

  const handleApprove = (id) => {
    setIsTransacting(true);
    // Simulate Stellar network transaction delay
    setTimeout(() => {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
      setIsTransacting(false);
      alert("Transaction Confirmed on Stellar Testnet! Funds released.");
    }, 2500);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskAmount) return;
    setIsTransacting(true);
    
    setTimeout(() => {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        amount: newTaskAmount,
        status: 'In Progress',
        freelancer: 'Pending...'
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskAmount('');
      setIsTransacting(false);
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
          {tasks.map(task => (
            <div key={task.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{task.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {task.status}
                  </span>
                  <span>Freelancer: {task.freelancer}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  ${task.amount} USDC
                </div>
                {task.status === 'In Progress' ? (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => handleApprove(task.id)}
                    disabled={isTransacting}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--accent)', color: 'var(--accent)', opacity: isTransacting ? 0.5 : 1 }}
                  >
                    <CheckCircle size={14} /> {isTransacting ? 'Signing tx...' : 'Approve & Pay'}
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
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '1rem', opacity: isTransacting ? 0.5 : 1 }}
              disabled={isTransacting}
            >
              <PlusCircle size={18}/> {isTransacting ? 'Locking...' : 'Lock Funds in Escrow'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
