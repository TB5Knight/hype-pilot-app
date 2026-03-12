import { useState, useMemo } from 'react';
import './App.css';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import CalendarView from './components/CalendarView';
import ReminderBanner from './components/ReminderBanner';

const DEFAULT_FILTERS = { priority: 'All', category: 'All', status: 'All' };
const VIEWS = ['Tasks', 'Add Task', 'Calendar'];

function App() {
  const { tasks, addTask, deleteTask, toggleComplete } = useTasks();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('Tasks');

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
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-brand">Hype Pilot</span>
          <div className="navbar-links">
            {VIEWS.map(v => (
              <button
                key={v}
                className={`nav-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <ReminderBanner tasks={tasks} />

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
    </div>
  );
}

export default App;
