import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { toLocalISODate } from '../utils/dateHelpers';

function daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toLocalISODate(d);
}

const today     = daysFromToday(0);
const tomorrow  = daysFromToday(1);
const yesterday = daysFromToday(-1);

const mockNavigate = jest.fn();

beforeEach(() => {
  mockNavigate.mockClear();
});

const baseTask = (overrides) => ({
  id: Math.random().toString(36).slice(2),
  title: 'Task',
  category: 'Work',
  priority: 'Mid Priority',
  dueDate: tomorrow,
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('Dashboard', () => {

  describe('rendering', () => {
    test('renders without crashing with empty task list', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(screen.getByText(/good/i)).toBeInTheDocument();
    });

    test('shows empty state when no tasks', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });

    test('hides empty state when tasks exist', () => {
      render(<Dashboard tasks={[baseTask()]} onNavigate={mockNavigate} />);
      expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
    });

    test('renders all three stat cards', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();
      expect(screen.getByText('Overdue Tasks')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    test('renders priority breakdown section', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
    });

    test('renders weekly strip with 7 cells', () => {
      const { container } = render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(container.querySelectorAll('.week-cell')).toHaveLength(7);
    });

    test('marks today cell with week-today class', () => {
      const { container } = render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(container.querySelector('.week-cell.week-today')).toBeInTheDocument();
    });

    test('renders all three quick action buttons', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      expect(screen.getByRole('button', { name: /add new task/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view all tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /open calendar/i })).toBeInTheDocument();
    });
  });

  describe('stat counts', () => {
    test('counts upcoming tasks correctly', () => {
      const tasks = [
        baseTask({ dueDate: today }),
        baseTask({ dueDate: tomorrow }),
        baseTask({ dueDate: yesterday, completed: true }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const upcomingCard = screen.getByText('Upcoming Tasks').closest('.stat-card');
      expect(upcomingCard.querySelector('.stat-value').textContent).toBe('2');
    });

    test('counts overdue tasks correctly', () => {
      const tasks = [
        baseTask({ dueDate: yesterday }),
        baseTask({ dueDate: daysFromToday(-3) }),
        baseTask({ dueDate: tomorrow }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const overdueCard = screen.getByText('Overdue Tasks').closest('.stat-card');
      expect(overdueCard.querySelector('.stat-value').textContent).toBe('2');
    });

    test('does not count completed tasks as overdue', () => {
      const tasks = [
        baseTask({ dueDate: yesterday, completed: true }),
        baseTask({ dueDate: daysFromToday(-3), completed: true }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const overdueCard = screen.getByText('Overdue Tasks').closest('.stat-card');
      expect(overdueCard.querySelector('.stat-value').textContent).toBe('0');
    });

    test('counts completed tasks correctly', () => {
      const tasks = [
        baseTask({ completed: true }),
        baseTask({ completed: true }),
        baseTask({ completed: false }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const doneCard = screen.getByText('Completed').closest('.stat-card');
      expect(doneCard.querySelector('.stat-value').textContent).toBe('2');
    });
  });

  describe('priority breakdown', () => {
    test('shows correct counts for each priority', () => {
      const tasks = [
        baseTask({ priority: 'Top Priority' }),
        baseTask({ priority: 'Top Priority' }),
        baseTask({ priority: 'Mid Priority' }),
        baseTask({ priority: 'Low Priority' }),
        baseTask({ priority: 'Low Priority' }),
        baseTask({ priority: 'Low Priority' }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const counts = screen.getAllByText(/^\d+$/).map(el => el.textContent);
      expect(counts).toContain('2'); // top
      expect(counts).toContain('1'); // mid
      expect(counts).toContain('3'); // low
    });

    test('priority bars render at 0 width when no incomplete tasks', () => {
      const tasks = [baseTask({ completed: true })];
      const { container } = render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      container.querySelectorAll('.priority-bar-fill').forEach(bar => {
        expect(bar.style.width).toBe('0%');
      });
    });

    test('does not count completed tasks in priority breakdown', () => {
      const tasks = [
        baseTask({ priority: 'Top Priority', completed: true }),
        baseTask({ priority: 'Top Priority' }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      // Only 1 top priority task is incomplete, so count should be 1
      const topLabel = screen.getByText('Top Priority').closest('.priority-item');
      expect(topLabel.querySelector('.priority-item-count').textContent).toBe('1');
    });
  });

  describe('Coming Up section — overdue task bug', () => {
    test('does NOT show overdue tasks in Coming Up list', () => {
      const tasks = [
        baseTask({ title: 'Overdue Task', dueDate: yesterday }),
        baseTask({ title: 'Future Task',  dueDate: tomorrow }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      expect(screen.queryByText('Overdue Task')).not.toBeInTheDocument();
      expect(screen.getByText('Future Task')).toBeInTheDocument();
    });

    test('Coming Up section is hidden when no upcoming tasks', () => {
      const tasks = [baseTask({ dueDate: yesterday })];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      expect(screen.queryByText(/coming up/i)).not.toBeInTheDocument();
    });

    test('Coming Up shows at most 5 tasks', () => {
      const tasks = Array.from({ length: 8 }, (_, i) =>
        baseTask({ title: `Task ${i}`, dueDate: daysFromToday(i + 1) })
      );
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBeLessThanOrEqual(5);
    });

    test('Coming Up tasks are sorted by due date ascending', () => {
      const tasks = [
        baseTask({ title: 'Later',  dueDate: daysFromToday(5) }),
        baseTask({ title: 'Sooner', dueDate: daysFromToday(1) }),
        baseTask({ title: 'Middle', dueDate: daysFromToday(3) }),
      ];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      const items = screen.getAllByRole('listitem').map(li => li.textContent);
      const soonerIdx = items.findIndex(t => t.includes('Sooner'));
      const middleIdx = items.findIndex(t => t.includes('Middle'));
      const laterIdx  = items.findIndex(t => t.includes('Later'));
      expect(soonerIdx).toBeLessThan(middleIdx);
      expect(middleIdx).toBeLessThan(laterIdx);
    });

    test('does not show category badge when category is empty', () => {
      const tasks = [baseTask({ title: 'No Category', category: '', dueDate: tomorrow })];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      expect(screen.queryByText('Work')).not.toBeInTheDocument();
    });
  });

  describe('quick action navigation', () => {
    test('Add New Task calls onNavigate with Add Task', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /add new task/i }));
      expect(mockNavigate).toHaveBeenCalledWith('Add Task');
    });

    test('View All Tasks calls onNavigate with Tasks', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /view all tasks/i }));
      expect(mockNavigate).toHaveBeenCalledWith('Tasks');
    });

    test('Open Calendar calls onNavigate with Calendar', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /open calendar/i }));
      expect(mockNavigate).toHaveBeenCalledWith('Calendar');
    });

    test('View all tasks link calls onNavigate with Tasks', () => {
      const tasks = [baseTask({ dueDate: tomorrow })];
      render(<Dashboard tasks={tasks} onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByText(/view all tasks →/i));
      expect(mockNavigate).toHaveBeenCalledWith('Tasks');
    });

    test('empty state Add a Task calls onNavigate with Add Task', () => {
      render(<Dashboard tasks={[]} onNavigate={mockNavigate} />);
      fireEvent.click(screen.getByRole('button', { name: /add a task/i }));
      expect(mockNavigate).toHaveBeenCalledWith('Add Task');
    });
  });
});
