import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from './TaskForm';

function fillAndSubmit(overrides = {}) {
  const fields = {
    title: 'My Task',
    dueDate: '2026-04-01',
    priority: 'Mid Priority',
    ...overrides,
  };
  if (fields.title !== undefined) {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: fields.title } });
  }
  if (fields.dueDate !== undefined) {
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: fields.dueDate } });
  }
  if (fields.priority !== undefined) {
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: fields.priority } });
  }
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));
}

describe('TaskForm', () => {
  test('renders all fields', () => {
    render(<TaskForm onAddTask={() => {}} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('calls onAddTask with correct fields on valid submit', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);
    fillAndSubmit();
    expect(onAddTask).toHaveBeenCalledTimes(1);
    expect(onAddTask).toHaveBeenCalledWith(expect.objectContaining({
      title: 'My Task',
      dueDate: '2026-04-01',
      priority: 'Mid Priority',
    }));
  });

  test('does not call onAddTask when title is missing', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);
    fillAndSubmit({ title: '' });
    expect(onAddTask).not.toHaveBeenCalled();
  });

  test('does not call onAddTask when priority is missing', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);
    fillAndSubmit({ priority: '' });
    expect(onAddTask).not.toHaveBeenCalled();
  });

  test('does not call onAddTask when dueDate is missing', () => {
    const onAddTask = jest.fn();
    render(<TaskForm onAddTask={onAddTask} />);
    fillAndSubmit({ dueDate: '' });
    expect(onAddTask).not.toHaveBeenCalled();
  });

  test('resets fields after successful submit', () => {
    render(<TaskForm onAddTask={() => {}} />);
    fillAndSubmit();
    expect(screen.getByLabelText(/title/i).value).toBe('');
    expect(screen.getByLabelText(/due date/i).value).toBe('');
  });
});
