export default function TaskCard({ task, onComplete, onDelete }) {
  const { id, title, category, priority, dueDate, description, completed } = task;

  return (
    <div style={{ opacity: completed ? 0.6 : 1 }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onComplete(id)}
        aria-label={`Mark "${title}" complete`}
      />

      <span>{title}</span>

      {category && <span>{category}</span>}

      <span>{priority}</span>

      <span>{dueDate}</span>

      {description && <p>{description}</p>}

      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}
