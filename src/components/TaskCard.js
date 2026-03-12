const PRIORITY_BADGE = {
  'Top Priority': 'badge-top',
  'Mid Priority': 'badge-mid',
  'Low Priority': 'badge-low',
};

const CARD_BORDER = {
  'Top Priority': 'priority-top',
  'Mid Priority': 'priority-mid',
  'Low Priority': 'priority-low',
};

export default function TaskCard({ task, onComplete, onDelete }) {
  const { id, title, category, priority, dueDate, description, completed } = task;

  const cardClass = [
    'task-card',
    completed ? 'completed' : '',
    CARD_BORDER[priority] || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className="task-card-top">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onComplete(id)}
          aria-label={`Mark "${title}" complete`}
        />
        <span className="task-title">{title}</span>
      </div>

      <div className="task-badges">
        {category && (
          <span className="badge badge-category">{category}</span>
        )}
        {priority && (
          <span className={`badge ${PRIORITY_BADGE[priority] || ''}`}>{priority}</span>
        )}
      </div>

      <div className="task-meta">
        <span className="task-date">Due: {dueDate}</span>
      </div>

      {description && (
        <p className="task-description">{description}</p>
      )}

      <div className="task-footer">
        <button className="btn-danger" onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}
