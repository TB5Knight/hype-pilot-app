import { useMemo } from 'react';
import { getNextDays, formatDate, isToday, isDueSoon } from '../utils/dateHelpers';

const PRIORITY_ITEM_CLASS = {
  'Top Priority': 'priority-top',
  'Mid Priority': 'priority-mid',
  'Low Priority': 'priority-low',
};

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
    <div className="calendar-section">
      <div className="calendar-grid">
        {days.map(dateStr => {
          const dayTasks = tasksByDate[dateStr] || [];
          const today = isToday(dateStr);
          const soon = !today && isDueSoon(dateStr);

          const cellClass = [
            'calendar-cell',
            today ? 'today' : '',
            soon ? 'due-soon' : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={dateStr} className={cellClass}>
              <div className="calendar-date-label">
                {formatDate(dateStr)}
                {today && <span className="today-badge">Today</span>}
              </div>

              {dayTasks.length > 0 && (
                <>
                  <ul className="calendar-task-list">
                    {dayTasks.map(task => {
                      const itemClass = [
                        'calendar-task-item',
                        PRIORITY_ITEM_CLASS[task.priority] || '',
                        task.completed ? 'completed' : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <li key={task.id} className={itemClass} title={task.title}>
                          {task.title}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="calendar-count">
                    {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
