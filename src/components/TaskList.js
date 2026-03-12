import TaskCard from './TaskCard';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above!</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map(task => (
        <li key={task.id}>
          <TaskCard task={task} onComplete={onComplete} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
