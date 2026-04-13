import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import CalendarView from './components/CalendarView';
import ReminderBanner from './components/ReminderBanner';
import Dashboard from './components/Dashboard';

const DEFAULT_FILTERS = { priority: 'All', category: 'All', status: 'All' };

const VIEWS = [
  { id: 'Dashboard', label: 'Home',     icon: '⌂' },
  { id: 'Tasks',     label: 'Tasks',    icon: '✓' },
  { id: 'Add Task',  label: 'Add Task', icon: '+' },
  { id: 'Calendar',  label: 'Calendar', icon: '▦' },
];

// The main app shell — only rendered when the user is authenticated
function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { tasks, tasksLoading, taskError, addTask, deleteTask, toggleComplete } = useTasks();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('Dashboard');

  function handleFilterChange(name, value) {
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleAddTask(task) {
    addTask(task);
    setView('Tasks');
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const categories = useMemo(
    () => [...new Set(tasks.map(t => t.category).filter(Boolean))],
    [tasks]
  );

  useEffect(() => {
    if (filters.category !== 'All' && !categories.includes(filters.category)) {
      setFilters(prev => ({ ...prev, category: 'All' }));
    }
  }, [categories, filters.category]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
      if (filters.category !== 'All' && task.category !== filters.category) return false;
      if (filters.status === 'Active' && task.completed) return false;
      if (filters.status === 'Completed' && !task.completed) return false;
      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="app-wrapper">
      {/* Desktop top navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-brand">Hype Pilot</span>
          <div className="navbar-links">
            {VIEWS.map(v => (
              <button
                key={v.id}
                className={`nav-btn${view === v.id ? ' active' : ''}`}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="navbar-user">
            <span className="navbar-email">{user.email}</span>
            <button className="nav-btn signout-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        <ReminderBanner tasks={tasks} />

        {/* Surface any Supabase write/read error as a dismissible banner */}
        {taskError && (
          <div className="task-error-banner" role="alert">
            {taskError}
          </div>
        )}

        {view === 'Dashboard' && (
          tasksLoading
            ? <div className="tasks-loading">Loading your tasks…</div>
            : <Dashboard tasks={tasks} onNavigate={setView} />
        )}

        {view === 'Add Task' && (
          <>
            <h2 className="section-heading">Add a New Task</h2>
            <TaskForm onAddTask={handleAddTask} />
          </>
        )}

        {view === 'Tasks' && (
          <>
            <h2 className="section-heading">My Tasks</h2>
            {tasksLoading ? (
              <div className="tasks-loading">Loading your tasks…</div>
            ) : (
              <>
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  categories={categories}
                />
                <TaskList tasks={filteredTasks} onComplete={toggleComplete} onDelete={deleteTask} />
              </>
            )}
          </>
        )}

        {view === 'Calendar' && (
          <>
            <h2 className="section-heading">Calendar</h2>
            {tasksLoading
              ? <div className="tasks-loading">Loading your tasks…</div>
              : <CalendarView tasks={tasks} />
            }
          </>
        )}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`bottom-nav-btn${view === v.id ? ' active' : ''}`}
            onClick={() => setView(v.id)}
            aria-current={view === v.id ? 'page' : undefined}
          >
            <span className="nav-icon">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Auth pages — redirect to "/" if already logged in */}
      <Route
        path="/login"
        element={<GuestRoute><Login /></GuestRoute>}
      />
      <Route
        path="/signup"
        element={<GuestRoute><SignUp /></GuestRoute>}
      />

      {/* Protected app — redirect to "/login" if not logged in */}
      <Route
        path="/*"
        element={<ProtectedRoute><AppShell /></ProtectedRoute>}
      />
    </Routes>
  );
}
