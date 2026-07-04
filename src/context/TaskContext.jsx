import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Failed to fetch tasks from Supabase:", error);
      } else if (data) {
        setTasks(data);
      }
      setIsLoading(false);
    };

    fetchTasks();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map((t) => t.id === payload.new.id ? payload.new : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTask = async (task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          title: task.title,
          amount: task.amount,
          status: 'Available',
          client: task.client
        }]);

      if (error) throw error;
      // Realtime listener handles the state update
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

      const { error } = await supabase
        .from('tasks')
        .update(updatedFields)
        .eq('id', id);

      if (error) throw error;
      // Realtime listener handles the state update
    } catch (err) {
      console.error("Failed to update task in Supabase:", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, isLoading, addTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
