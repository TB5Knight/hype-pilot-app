import { useState, useMemo } from 'react';
import './App.css';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import CalendarView from './components/CalendarView';

const DEFAULT_FILTERS = { priority: 'All', category: 'All', status: 'All' };

function App() {
  const { tasks, addTask, deleteTask, toggleComplete } = useTasks();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  function handleFilterChange(name, value) {
    setFilters(prev => ({ ...prev, [name]: value }));
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
    <div className="App">
      <h1>Hype Pilot</h1>
      <TaskForm onAddTask={addTask} />
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />
      <TaskList tasks={filteredTasks} onComplete={toggleComplete} onDelete={deleteTask} />
      <CalendarView tasks={tasks} />
    </div>
  );
}

export default App;
