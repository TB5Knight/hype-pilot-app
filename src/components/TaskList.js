import TaskCard from './TaskCard';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return <p className="task-empty">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskCard task={task} onComplete={onComplete} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
