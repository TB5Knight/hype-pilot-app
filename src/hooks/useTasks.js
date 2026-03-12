import { useState, useEffect } from 'react';

const STORAGE_KEY = 'hype-pilot-tasks';

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask({ title, category, priority, dueDate, description = '' }) {
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: title.trim(),
      category,
      priority,
      dueDate,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function toggleComplete(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return { tasks, addTask, deleteTask, toggleComplete };
}
