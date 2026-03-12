import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

function addTaskViaUI({ title = 'Test Task', priority = 'Mid Priority', dueDate = '2026-04-01', category = 'Work' } = {}) {
  fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: title } });
  fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: dueDate } });
  fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: priority } });
  fireEvent.change(screen.getByLabelText(/category/i), { target: { value: category } });
  const form = document.querySelector('form');
  fireEvent.click(within(form).getByRole('button', { name: /add task/i }));
}

describe('App integration', () => {
  describe('view navigation', () => {
    test('defaults to Tasks view', () => {
      render(<App />);
      expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
    });

    test('switches to Add Task view', () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      expect(screen.getByRole('heading', { name: /add a new task/i })).toBeInTheDocument();
    });

    test('switches to Calendar view', () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /calendar/i }));
      expect(screen.getByRole('heading', { name: /calendar/i })).toBeInTheDocument();
    });

    test('nav button shows active class for current view', () => {
      render(<App />);
      const tasksBtn = screen.getByRole('button', { name: 'Tasks' });
      expect(tasksBtn.className).toMatch(/active/);
    });

    test('submitting the form redirects back to Tasks view', () => {
      render(<App />);
      addTaskViaUI({ title: 'Redirect test' });
      expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
      expect(screen.getByText('Redirect test')).toBeInTheDocument();
    });
  });

  describe('task title trimming', () => {
    test('stores trimmed title when submitted with surrounding whitespace', () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: /add task/i }));
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '  Padded Title  ' } });
      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2026-04-01' } });
      fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'Mid Priority' } });
      fireEvent.click(within(document.querySelector('form')).getByRole('button', { name: /add task/i }));

      // Should show trimmed title, not padded one
      expect(screen.getByText('Padded Title')).toBeInTheDocument();
      expect(screen.queryByText('  Padded Title  ')).not.toBeInTheDocument();
    });
  });

  describe('stale category filter bug', () => {
    test('filter resets to All when the filtered category is deleted', () => {
      render(<App />);

      // Add a Work task
      addTaskViaUI({ title: 'Work Task', category: 'Work' });

      // Set category filter to Work
      fireEvent.change(screen.getByLabelText(/category/i), { target: { name: 'category', value: 'Work' } });

      // Delete the only Work task
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      // Category filter should have reset to All — the empty state message appears, not zero filtered tasks
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

      // The category select should now show "All" (since Work category no longer exists)
      const categorySelect = screen.getByLabelText(/category/i);
      expect(categorySelect.value).toBe('All');
    });
  });
});
