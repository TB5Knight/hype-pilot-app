import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

const tasks = [
  { id: '1', title: 'Task One', category: 'Work', priority: 'Top Priority', dueDate: '2026-03-20', description: '', completed: false },
  { id: '2', title: 'Task Two', category: 'Personal', priority: 'Low Priority', dueDate: '2026-03-25', description: '', completed: true },
];

describe('TaskList', () => {
  test('renders empty state message when no tasks', () => {
    render(<TaskList tasks={[]} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  test('renders a card for each task', () => {
    render(<TaskList tasks={tasks} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  test('renders correct number of checkboxes', () => {
    render(<TaskList tasks={tasks} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });
});
