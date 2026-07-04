import React, { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Failed to fetch tasks:", err));
  }, []);

  const addTask = async (task) => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTaskStatus = async (id, newStatus, freelancerId = null) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      if (!taskToUpdate) return;
      
      const updatedFields = { 
        status: newStatus, 
        freelancer: freelancerId || taskToUpdate.freelancer 
      };

      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const updatedTask = await response.json();
      
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
