import { useMemo } from 'react';
import { getNextDays, formatDate, isToday, isDueSoon } from '../utils/dateHelpers';

export default function CalendarView({ tasks }) {
  const days = useMemo(() => getNextDays(30), []);

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!task.dueDate) return acc;
      if (!acc[task.dueDate]) acc[task.dueDate] = [];
      acc[task.dueDate].push(task);
      return acc;
    }, {});
  }, [tasks]);

  return (
    <div>
      <h2>Next 30 Days</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {days.map(dateStr => {
          const dayTasks = tasksByDate[dateStr] || [];
          const today = isToday(dateStr);
          const soon = !today && isDueSoon(dateStr);

          return (
            <div
              key={dateStr}
              style={{
                border: today ? '2px solid #333' : '1px solid #ccc',
                borderRadius: '6px',
                padding: '6px',
                background: today ? '#eef' : soon ? '#fff8e1' : '#fff',
                minHeight: '80px',
              }}
            >
              <div style={{ fontWeight: today ? 'bold' : 'normal', fontSize: '0.75rem', marginBottom: '4px' }}>
                {formatDate(dateStr)}
                {today && ' — Today'}
              </div>

              {dayTasks.length === 0 ? null : (
                <ul style={{ margin: 0, padding: '0 0 0 12px', fontSize: '0.75rem' }}>
                  {dayTasks.map(task => (
                    <li
                      key={task.id}
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.priority === 'Top Priority' ? '#c00' : 'inherit',
                      }}
                    >
                      {task.title}
                    </li>
                  ))}
                </ul>
              )}

              {dayTasks.length > 0 && (
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>
                  {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
