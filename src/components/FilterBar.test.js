import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';

const defaultFilters = { priority: 'All', category: 'All', status: 'All' };
const categories = ['Work', 'Personal'];

describe('FilterBar', () => {
  test('renders priority, category, and status selects', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={() => {}} categories={categories} />);
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  test('renders dynamic category options', () => {
    render(<FilterBar filters={defaultFilters} onFilterChange={() => {}} categories={categories} />);
    expect(screen.getByRole('option', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Personal' })).toBeInTheDocument();
  });

  test('calls onFilterChange with correct args when priority changes', () => {
    const onFilterChange = jest.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} categories={categories} />);
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { name: 'priority', value: 'Top Priority' } });
    expect(onFilterChange).toHaveBeenCalledWith('priority', 'Top Priority');
  });

  test('calls onFilterChange with correct args when status changes', () => {
    const onFilterChange = jest.fn();
    render(<FilterBar filters={defaultFilters} onFilterChange={onFilterChange} categories={categories} />);
    fireEvent.change(screen.getByLabelText(/status/i), { target: { name: 'status', value: 'Completed' } });
    expect(onFilterChange).toHaveBeenCalledWith('status', 'Completed');
  });

  test('reflects current filter values', () => {
    const filters = { priority: 'Low Priority', category: 'Work', status: 'Active' };
    render(<FilterBar filters={filters} onFilterChange={() => {}} categories={categories} />);
    expect(screen.getByLabelText(/priority/i).value).toBe('Low Priority');
    expect(screen.getByLabelText(/category/i).value).toBe('Work');
    expect(screen.getByLabelText(/status/i).value).toBe('Active');
  });
});
