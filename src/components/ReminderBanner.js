import { useEffect, useRef } from 'react';
import { isDueSoon, formatDate } from '../utils/dateHelpers';

export default function ReminderBanner({ tasks }) {
  const notifiedRef = useRef(false);

  const dueSoonTasks = tasks.filter(t => !t.completed && isDueSoon(t.dueDate, 3));

  useEffect(() => {
    if (notifiedRef.current) return;
    if (dueSoonTasks.length === 0) return;

    if (!('Notification' in window)) return;

    const notify = () => {
      notifiedRef.current = true;
      dueSoonTasks.forEach(task => {
        new Notification('Hype Pilot Reminder', {
          body: `"${task.title}" is due on ${formatDate(task.dueDate)}`,
        });
      });
    };

    if (Notification.permission === 'granted') {
      notify();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') notify();
      });
    }
  }, [dueSoonTasks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (dueSoonTasks.length === 0) return null;

  return (
    <div role="alert" aria-live="polite">
      <strong>Upcoming deadlines:</strong>
      <ul>
        {dueSoonTasks.map(task => (
          <li key={task.id}>
            {task.title} — due {formatDate(task.dueDate)}
            {task.priority === 'Top Priority' && ' (Top Priority)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
