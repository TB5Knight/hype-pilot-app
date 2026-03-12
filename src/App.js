import { useState, useMemo, useEffect } from 'react';
import './App.css';
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

function App() {
  const { tasks, addTask, deleteTask, toggleComplete } = useTasks();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('Dashboard');

  function handleFilterChange(name, value) {
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleAddTask(task) {
    addTask(task);
    setView('Tasks');
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
        </div>
      </nav>

      <main className="app-main">
        <ReminderBanner tasks={tasks} />

        {view === 'Dashboard' && (
          <Dashboard tasks={tasks} onNavigate={setView} />
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
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
            <TaskList tasks={filteredTasks} onComplete={toggleComplete} onDelete={deleteTask} />
          </>
        )}

        {view === 'Calendar' && (
          <>
            <h2 className="section-heading">Calendar</h2>
            <CalendarView tasks={tasks} />
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

export default App;
