import './App.css';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const { tasks, addTask, deleteTask, toggleComplete } = useTasks();

  return (
    <div className="App">
      <h1>Hype Pilot</h1>
      <TaskForm onAddTask={addTask} />
      <TaskList tasks={tasks} onComplete={toggleComplete} onDelete={deleteTask} />
    </div>
  );
}

export default App;
