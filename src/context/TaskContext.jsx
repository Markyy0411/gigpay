import React, { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('gigpay_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Default seed data if empty
      const initialTasks = [
        { id: 1, title: 'Design Landing Page', amount: '150', status: 'In Progress', freelancer: 'GBQX...3F1A', client: 'Stellar Foundation' },
        { id: 2, title: 'Write Smart Contract', amount: '300', status: 'Completed', freelancer: 'GCAE...9B22', client: 'DeFi Protocol X' },
        { id: 3, title: 'React Frontend Fixes', amount: '200', status: 'Available', freelancer: null, client: 'Stellar Foundation' },
        { id: 4, title: 'Smart Contract Audit', amount: '500', status: 'Available', freelancer: null, client: 'DeFi Protocol X' }
      ];
      setTasks(initialTasks);
      localStorage.setItem('gigpay_tasks', JSON.stringify(initialTasks));
    }
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('gigpay_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now() };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const updateTaskStatus = (id, newStatus, freelancerId = null) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        return { ...task, status: newStatus, freelancer: freelancerId || task.freelancer };
      }
      return task;
    }));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
