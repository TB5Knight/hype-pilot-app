import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

const task = {
  id: '1',
  title: 'Write tests',
  category: 'Work',
  priority: 'Top Priority',
  dueDate: '2026-03-20',
  description: 'Make sure everything works',
  completed: false,
};

describe('TaskCard', () => {
  test('renders title, category, priority, and dueDate', () => {
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Top Priority')).toBeInTheDocument();
    expect(screen.getByText(/2026-03-20/)).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Make sure everything works')).toBeInTheDocument();
  });

  test('does not render description paragraph when empty', () => {
    const t = { ...task, description: '' };
    render(<TaskCard task={t} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.queryByText('Make sure everything works')).not.toBeInTheDocument();
  });

  test('checkbox reflects completed=false', () => {
    render(<TaskCard task={task} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('checkbox reflects completed=true', () => {
    render(<TaskCard task={{ ...task, completed: true }} onComplete={() => {}} onDelete={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onComplete with task id when checkbox clicked', () => {
    const onComplete = jest.fn();
    render(<TaskCard task={task} onComplete={onComplete} onDelete={() => {}} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  test('calls onDelete with task id when delete button clicked', () => {
    const onDelete = jest.fn();
    render(<TaskCard task={task} onComplete={() => {}} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
