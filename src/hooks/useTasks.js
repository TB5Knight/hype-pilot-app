import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// ─── Shape mapping ────────────────────────────────────────────────────────────
// The DB uses snake_case; the UI uses camelCase.
// All translation happens here so nothing else in the app thinks about it.

function toClient(row) {
  return {
    id:          row.id,
    title:       row.title,
    category:    row.category    ?? '',
    priority:    row.priority,
    dueDate:     row.due_date,
    description: row.description ?? '',
    completed:   row.completed,
    createdAt:   row.created_at,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useTasks() {
  const { user } = useAuth();
  const [tasks,        setTasks]        = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskError,    setTaskError]    = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  // Re-runs whenever `user` changes:
  //   • user becomes non-null  → fetch that user's tasks (RLS filters by auth.uid())
  //   • user becomes null      → clear tasks immediately (logout / session expiry)
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    let cancelled = false;
    setTasksLoading(true);
    setTaskError(null);

    supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setTaskError(error.message);
        } else {
          setTasks(data.map(toClient));
        }
        setTasksLoading(false);
      });

    return () => { cancelled = true; };
  }, [user]);

  // ── Insert ─────────────────────────────────────────────────────────────────
  // user_id is intentionally omitted from the payload.
  // The DB column has DEFAULT auth.uid(), so Postgres fills it in from the JWT.
  // The RLS INSERT policy then verifies it matches — enforced at DB level,
  // not just client level.
  async function addTask({ title, category, priority, dueDate, description = '' }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title:       title.trim(),
        category,
        priority,
        due_date:    dueDate,
        description,
        completed:   false,
      })
      .select()
      .single();

    if (error) {
      setTaskError(error.message);
      return { error };
    }

    // Prepend the confirmed row (with its DB-generated id and created_at)
    setTasks(prev => [toClient(data), ...prev]);
    return { error: null };
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  // RLS DELETE policy (auth.uid() = user_id) ensures users can only delete
  // their own rows — even if the id is guessed or forged.
  async function deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      setTaskError(error.message);
      return { error };
    }

    setTasks(prev => prev.filter(t => t.id !== id));
    return { error: null };
  }

  // ── Update (toggle completed) ──────────────────────────────────────────────
  // Reads current value from local state rather than re-fetching,
  // then confirms the change before updating local state.
  // RLS UPDATE policy protects this row server-side.
  async function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return { error: 'Task not found' };

    const newValue = !task.completed;
    const { error } = await supabase
      .from('tasks')
      .update({ completed: newValue })
      .eq('id', id);

    if (error) {
      setTaskError(error.message);
      return { error };
    }

    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: newValue } : t)
    );
    return { error: null };
  }

  return { tasks, tasksLoading, taskError, addTask, deleteTask, toggleComplete };
}
