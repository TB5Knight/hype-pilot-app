import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  expect(screen.getByText('Hype Pilot')).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /tasks/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
});
