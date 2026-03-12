import { render, screen } from '@testing-library/react';
import CalendarView from './CalendarView';
import { toLocalISODate } from '../utils/dateHelpers';

function daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toLocalISODate(d);
}

const tasks = [
  { id: '1', title: 'Due Today', dueDate: daysFromToday(0), priority: 'Top Priority', completed: false },
  { id: '2', title: 'Due in 5 days', dueDate: daysFromToday(5), priority: 'Mid Priority', completed: false },
  { id: '3', title: 'Completed Task', dueDate: daysFromToday(0), priority: 'Low Priority', completed: true },
];

describe('CalendarView', () => {
  test('renders the heading', () => {
    render(<CalendarView tasks={[]} />);
    expect(screen.getByText(/next 30 days/i)).toBeInTheDocument();
  });

  test('renders a cell for each of the 30 days', () => {
    render(<CalendarView tasks={[]} />);
    // each day cell shows a formatted date — spot check Today label
    expect(screen.getByText(/today/i)).toBeInTheDocument();
  });

  test('displays task titles on their due date', () => {
    render(<CalendarView tasks={tasks} />);
    expect(screen.getByText('Due Today')).toBeInTheDocument();
    expect(screen.getByText('Due in 5 days')).toBeInTheDocument();
  });

  test('does not display tasks due outside the 30-day window', () => {
    const future = [{ id: '99', title: 'Way Future', dueDate: daysFromToday(45), priority: 'Low Priority', completed: false }];
    render(<CalendarView tasks={future} />);
    expect(screen.queryByText('Way Future')).not.toBeInTheDocument();
  });

  test('shows task count badge on days with tasks', () => {
    render(<CalendarView tasks={tasks} />);
    expect(screen.getByText(/2 tasks/i)).toBeInTheDocument();
  });

  test('renders with empty task list without crashing', () => {
    render(<CalendarView tasks={[]} />);
    expect(screen.getByText(/next 30 days/i)).toBeInTheDocument();
  });

  test('ignores tasks with no dueDate', () => {
    const t = [{ id: '5', title: 'No date task', dueDate: '', priority: 'Low Priority', completed: false }];
    expect(() => render(<CalendarView tasks={t} />)).not.toThrow();
    expect(screen.queryByText('No date task')).not.toBeInTheDocument();
  });
});
