import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Failed to fetch tasks from Supabase:", error);
      } else if (data) {
        setTasks(data);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          amount: task.amount,
          status: 'Available',
          client: task.client
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setTasks(prev => [data[0], ...prev]);
      }
    } catch (err) {
      console.error("Failed to add task to Supabase:", err);
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

      const { data, error } = await supabase
        .from('tasks')
        .update(updatedFields)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setTasks(prev => prev.map(task => task.id === id ? data[0] : task));
      }
    } catch (err) {
      console.error("Failed to update task in Supabase:", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
