import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  expect(screen.getByText('Hype Pilot')).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(<App />);
  const navbar = screen.getByRole('navigation', { name: /^$/i }) || document.querySelector('.navbar');
  const topNav = document.querySelector('.navbar-links');
  expect(within(topNav).getByRole('button', { name: 'Tasks' })).toBeInTheDocument();
  expect(within(topNav).getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  expect(within(topNav).getByRole('button', { name: 'Calendar' })).toBeInTheDocument();
});
