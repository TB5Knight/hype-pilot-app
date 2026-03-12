import { useMemo } from 'react';
import { todayStr, isToday, getNextDays, formatDate } from '../utils/dateHelpers';

const PRIORITY_ITEM_CLASS = {
  'Top Priority': 'priority-top',
  'Mid Priority': 'priority-mid',
  'Low Priority': 'priority-low',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function friendlyDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function Dashboard({ tasks, onNavigate }) {
  const today = todayStr();

  const stats = useMemo(() => {
    const overdue   = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today);
    const upcoming  = tasks.filter(t => !t.completed && t.dueDate && t.dueDate >= today);
    const completed = tasks.filter(t => t.completed);
    const topCount  = tasks.filter(t => !t.completed && t.priority === 'Top Priority').length;
    const midCount  = tasks.filter(t => !t.completed && t.priority === 'Mid Priority').length;
    const lowCount  = tasks.filter(t => !t.completed && t.priority === 'Low Priority').length;
    const total     = topCount + midCount + lowCount;
    return { overdue, upcoming, completed, topCount, midCount, lowCount, total };
  }, [tasks, today]);

  const weekDays = useMemo(() => getNextDays(7), []);

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, t) => {
      if (!t.dueDate) return acc;
      if (!acc[t.dueDate]) acc[t.dueDate] = [];
      acc[t.dueDate].push(t);
      return acc;
    }, {});
  }, [tasks]);

  // Next 5 upcoming incomplete tasks sorted by dueDate
  const nextTasks = useMemo(() => {
    return [...tasks]
      .filter(t => !t.completed && t.dueDate && t.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks, today]);

  const pct = (n) => (stats.total > 0 ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="dashboard">

      {/* Greeting */}
      <div className="dash-greeting">
        <h2 className="dash-greeting-title">{getGreeting()} 👋</h2>
        <p className="dash-greeting-date">{friendlyDate()}</p>
      </div>

      {/* Summary stat cards */}
      <div className="dash-stat-grid">
        <div className="stat-card stat-upcoming">
          <div className="stat-value">{stats.upcoming.length}</div>
          <div className="stat-label">Upcoming Tasks</div>
          <div className="stat-sub">not yet due</div>
        </div>
        <div className="stat-card stat-overdue">
          <div className="stat-value">{stats.overdue.length}</div>
          <div className="stat-label">Overdue Tasks</div>
          <div className="stat-sub">need attention</div>
        </div>
        <div className="stat-card stat-done">
          <div className="stat-value">{stats.completed.length}</div>
          <div className="stat-label">Completed</div>
          <div className="stat-sub">total finished</div>
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="dash-section">
        <h3 className="dash-section-title">Tasks by Priority</h3>
        <div className="priority-breakdown">
          <div className="priority-item">
            <div className="priority-item-header">
              <span className="priority-dot dot-top" />
              <span className="priority-item-label">Top Priority</span>
              <span className="priority-item-count">{stats.topCount}</span>
            </div>
            <div className="priority-bar-track">
              <div className="priority-bar-fill bar-top" style={{ width: `${pct(stats.topCount)}%` }} />
            </div>
          </div>
          <div className="priority-item">
            <div className="priority-item-header">
              <span className="priority-dot dot-mid" />
              <span className="priority-item-label">Mid Priority</span>
              <span className="priority-item-count">{stats.midCount}</span>
            </div>
            <div className="priority-bar-track">
              <div className="priority-bar-fill bar-mid" style={{ width: `${pct(stats.midCount)}%` }} />
            </div>
          </div>
          <div className="priority-item">
            <div className="priority-item-header">
              <span className="priority-dot dot-low" />
              <span className="priority-item-label">Low Priority</span>
              <span className="priority-item-count">{stats.lowCount}</span>
            </div>
            <div className="priority-bar-track">
              <div className="priority-bar-fill bar-low" style={{ width: `${pct(stats.lowCount)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom two-column section: weekly strip + quick actions */}
      <div className="dash-bottom-grid">

        {/* Weekly overview */}
        <div className="dash-section dash-week">
          <h3 className="dash-section-title">This Week</h3>
          <div className="week-strip">
            {weekDays.map(dateStr => {
              const d = new Date(dateStr + 'T00:00:00');
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum  = d.getDate();
              const dayTasks = tasksByDate[dateStr] || [];
              const hasTasks = dayTasks.length > 0;
              const allDone   = hasTasks && dayTasks.every(t => t.completed);

              return (
                <div
                  key={dateStr}
                  className={[
                    'week-cell',
                    isToday(dateStr) ? 'week-today' : '',
                    hasTasks && !allDone ? 'week-has-tasks' : '',
                    allDone ? 'week-all-done' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <span className="week-day-name">{dayName}</span>
                  <span className="week-day-num">{dayNum}</span>
                  {hasTasks && (
                    <span className="week-dot-row">
                      {dayTasks.slice(0, 3).map(t => (
                        <span
                          key={t.id}
                          className={`week-dot ${PRIORITY_ITEM_CLASS[t.priority] || ''} ${t.completed ? 'done' : ''}`}
                        />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="dash-section dash-actions">
          <h3 className="dash-section-title">Quick Actions</h3>
          <div className="quick-actions">
            <button type="button" className="qa-btn qa-primary" onClick={() => onNavigate('Add Task')}>
              <span className="qa-icon">+</span>
              <span>Add New Task</span>
            </button>
            <button type="button" className="qa-btn qa-secondary" onClick={() => onNavigate('Tasks')}>
              <span className="qa-icon">✓</span>
              <span>View All Tasks</span>
            </button>
            <button type="button" className="qa-btn qa-secondary" onClick={() => onNavigate('Calendar')}>
              <span className="qa-icon">▦</span>
              <span>Open Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming tasks list */}
      {nextTasks.length > 0 && (
        <div className="dash-section">
          <h3 className="dash-section-title">Coming Up</h3>
          <ul className="dash-task-list">
            {nextTasks.map(task => (
              <li key={task.id} className={`dash-task-item ${PRIORITY_ITEM_CLASS[task.priority] || ''}`}>
                <span className={`dash-task-dot ${PRIORITY_ITEM_CLASS[task.priority] || ''}`} />
                <div className="dash-task-body">
                  <span className="dash-task-title">{task.title}</span>
                  {task.category && (
                    <span className="dash-task-cat">{task.category}</span>
                  )}
                </div>
                <span className="dash-task-date">{formatDate(task.dueDate)}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="dash-view-all" onClick={() => onNavigate('Tasks')}>
            View all tasks →
          </button>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="dash-empty">
          <p>No tasks yet — get started by adding your first task.</p>
          <button type="button" className="btn-primary" onClick={() => onNavigate('Add Task')}>
            + Add a Task
          </button>
        </div>
      )}
    </div>
  );
}
