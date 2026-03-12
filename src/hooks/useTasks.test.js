import { renderHook, act } from '@testing-library/react';
import useTasks from './useTasks';

const STORAGE_KEY = 'hype-pilot-tasks';

beforeEach(() => {
  localStorage.clear();
});

const sampleTask = {
  title: 'Test task',
  category: 'Work',
  priority: 'Top Priority',
  dueDate: '2026-03-20',
  description: 'A test task',
};

describe('useTasks', () => {
  test('initializes with empty array when localStorage is empty', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  test('loads tasks from localStorage on first render', () => {
    const stored = [
      { id: '1', title: 'Existing', category: 'Work', priority: 'Low Priority',
        dueDate: '2026-03-15', description: '', completed: false, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Existing');
  });

  test('addTask adds a task with correct shape', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask(sampleTask);
    });

    const tasks = result.current.tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: 'Test task',
      category: 'Work',
      priority: 'Top Priority',
      dueDate: '2026-03-20',
      description: 'A test task',
      completed: false,
    });
    expect(tasks[0].id).toBeDefined();
    expect(tasks[0].createdAt).toBeDefined();
  });

  test('addTask defaults description to empty string when omitted', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask({ title: 'No desc', category: 'Personal', priority: 'Mid Priority', dueDate: '2026-04-01' });
    });

    expect(result.current.tasks[0].description).toBe('');
  });

  test('deleteTask removes task by id', () => {
    const { result } = renderHook(() => useTasks());

    act(() => { result.current.addTask(sampleTask); });
    const id = result.current.tasks[0].id;

    act(() => { result.current.deleteTask(id); });
    expect(result.current.tasks).toHaveLength(0);
  });

  test('deleteTask does not remove other tasks', () => {
    const { result } = renderHook(() => useTasks());

    act(() => { result.current.addTask({ ...sampleTask, title: 'Task A' }); });
    act(() => { result.current.addTask({ ...sampleTask, title: 'Task B' }); });

    const idA = result.current.tasks[0].id;
    act(() => { result.current.deleteTask(idA); });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Task B');
  });

  test('toggleComplete flips completed status', () => {
    const { result } = renderHook(() => useTasks());

    act(() => { result.current.addTask(sampleTask); });
    const id = result.current.tasks[0].id;

    expect(result.current.tasks[0].completed).toBe(false);

    act(() => { result.current.toggleComplete(id); });
    expect(result.current.tasks[0].completed).toBe(true);

    act(() => { result.current.toggleComplete(id); });
    expect(result.current.tasks[0].completed).toBe(false);
  });

  test('tasks are persisted to localStorage on change', () => {
    const { result } = renderHook(() => useTasks());

    act(() => { result.current.addTask(sampleTask); });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Test task');
  });

  test('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });
});
