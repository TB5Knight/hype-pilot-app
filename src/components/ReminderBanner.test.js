import { render, screen } from '@testing-library/react';
import ReminderBanner from './ReminderBanner';
import { toLocalISODate } from '../utils/dateHelpers';

function daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toLocalISODate(d);
}

const taskDueToday = { id: '1', title: 'Due Today', dueDate: daysFromToday(0), priority: 'Top Priority', completed: false };
const taskDueIn2 = { id: '2', title: 'Due in 2 days', dueDate: daysFromToday(2), priority: 'Mid Priority', completed: false };
const taskDueIn5 = { id: '3', title: 'Due in 5 days', dueDate: daysFromToday(5), priority: 'Low Priority', completed: false };
const taskCompleted = { id: '4', title: 'Already Done', dueDate: daysFromToday(1), priority: 'Low Priority', completed: true };

describe('ReminderBanner', () => {
  beforeEach(() => {
    delete window.Notification;
  });

  test('renders nothing when no tasks are due soon', () => {
    const { container } = render(<ReminderBanner tasks={[taskDueIn5]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when all due-soon tasks are completed', () => {
    const { container } = render(<ReminderBanner tasks={[taskCompleted]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders banner when there are upcoming tasks', () => {
    render(<ReminderBanner tasks={[taskDueToday]} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/upcoming deadlines/i)).toBeInTheDocument();
  });

  test('lists all due-soon incomplete tasks', () => {
    render(<ReminderBanner tasks={[taskDueToday, taskDueIn2, taskDueIn5, taskCompleted]} />);
    expect(screen.getByText(/due today/i)).toBeInTheDocument();
    expect(screen.getByText(/due in 2 days/i)).toBeInTheDocument();
    expect(screen.queryByText(/due in 5 days/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/already done/i)).not.toBeInTheDocument();
  });

  test('shows (Top Priority) label for top priority tasks', () => {
    render(<ReminderBanner tasks={[taskDueToday]} />);
    expect(screen.getByText(/top priority/i)).toBeInTheDocument();
  });

  test('does not show priority label for non-top-priority tasks', () => {
    render(<ReminderBanner tasks={[taskDueIn2]} />);
    expect(screen.queryByText(/top priority/i)).not.toBeInTheDocument();
  });

  test('renders with empty task list without crashing', () => {
    const { container } = render(<ReminderBanner tasks={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('fires browser notification when Notification is granted', () => {
    const mockNotification = jest.fn();
    mockNotification.permission = 'granted';
    window.Notification = mockNotification;

    render(<ReminderBanner tasks={[taskDueToday]} />);
    expect(mockNotification).toHaveBeenCalledWith(
      'Hype Pilot Reminder',
      expect.objectContaining({ body: expect.stringContaining('Due Today') })
    );
  });

  test('requests permission when Notification permission is default', () => {
    const mockNotification = jest.fn();
    mockNotification.permission = 'default';
    mockNotification.requestPermission = jest.fn().mockResolvedValue('denied');
    window.Notification = mockNotification;

    render(<ReminderBanner tasks={[taskDueToday]} />);
    expect(mockNotification.requestPermission).toHaveBeenCalled();
  });

  test('does not fire notification when Notification API is unavailable', () => {
    // window.Notification already deleted in beforeEach
    expect(() => render(<ReminderBanner tasks={[taskDueToday]} />)).not.toThrow();
  });
});
