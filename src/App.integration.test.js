import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

function getTopNav() {
  return document.querySelector('.navbar-links');
}

function clickNav(label) {
  fireEvent.click(within(getTopNav()).getByRole('button', { name: label }));
}

function addTaskViaUI({ title = 'Test Task', priority = 'Mid Priority', dueDate = '2026-04-01', category = 'Work' } = {}) {
  clickNav('Add Task');
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: title } });
  fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: dueDate } });
  fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: priority } });
  fireEvent.change(screen.getByLabelText(/category/i), { target: { value: category } });
  fireEvent.click(within(document.querySelector('form')).getByRole('button', { name: /add task/i }));
}

describe('App integration', () => {
  describe('view navigation', () => {
    test('defaults to Tasks view', () => {
      render(<App />);
      expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
    });

    test('switches to Add Task view', () => {
      render(<App />);
      clickNav('Add Task');
      expect(screen.getByRole('heading', { name: /add a new task/i })).toBeInTheDocument();
    });

    test('switches to Calendar view', () => {
      render(<App />);
      clickNav('Calendar');
      expect(screen.getByRole('heading', { name: /calendar/i })).toBeInTheDocument();
    });

    test('nav button shows active class for current view', () => {
      render(<App />);
      const tasksBtn = within(getTopNav()).getByRole('button', { name: 'Tasks' });
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
      clickNav('Add Task');
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '  Padded Title  ' } });
      fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2026-04-01' } });
      fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'Mid Priority' } });
      fireEvent.click(within(document.querySelector('form')).getByRole('button', { name: /add task/i }));

      expect(screen.getByText('Padded Title')).toBeInTheDocument();
      expect(screen.queryByText('  Padded Title  ')).not.toBeInTheDocument();
    });
  });

  describe('stale category filter bug', () => {
    test('filter resets to All when the filtered category is deleted', () => {
      render(<App />);
      addTaskViaUI({ title: 'Work Task', category: 'Work' });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { name: 'category', value: 'Work' } });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i).value).toBe('All');
    });
  });

  describe('mobile bottom nav', () => {
    test('renders bottom nav with all view buttons', () => {
      render(<App />);
      const bottomNav = document.querySelector('.bottom-nav');
      expect(within(bottomNav).getByRole('button', { name: /tasks/i })).toBeInTheDocument();
      expect(within(bottomNav).getByRole('button', { name: /add task/i })).toBeInTheDocument();
      expect(within(bottomNav).getByRole('button', { name: /calendar/i })).toBeInTheDocument();
    });

    test('bottom nav active button matches current view', () => {
      render(<App />);
      const bottomNav = document.querySelector('.bottom-nav');
      const tasksBtn = within(bottomNav).getByRole('button', { name: /tasks/i });
      expect(tasksBtn.className).toMatch(/active/);
    });

    test('clicking bottom nav button switches view', () => {
      render(<App />);
      const bottomNav = document.querySelector('.bottom-nav');
      fireEvent.click(within(bottomNav).getByRole('button', { name: /calendar/i }));
      expect(screen.getByRole('heading', { name: /calendar/i })).toBeInTheDocument();
    });
  });
});
