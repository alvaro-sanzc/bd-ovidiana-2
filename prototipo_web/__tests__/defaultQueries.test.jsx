import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import DefaultQueries from '../frontend/src/pages/DefaultQueries';
vi.mock('axios');

describe('DefaultQueries Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

test('renders the component title', () => {
  render(<DefaultQueries />);
  expect(screen.getByText(/Consultas por defecto/i)).toBeInTheDocument();
});


  test('updates the result limit input', () => {
    render(<DefaultQueries />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '25' } });
    expect(input.value).toBe('25');
  });

  test('toggles the "Show All" checkbox', () => {
    render(<DefaultQueries />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });


  test('displays an error message if the API fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<DefaultQueries />);
    const button = screen.getByText(/Tripletas relacionadas con ilustraciones/i);

    fireEvent.click(button);

    const errorMessage = await screen.findByText(/Error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
