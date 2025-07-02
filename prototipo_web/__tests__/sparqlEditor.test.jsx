import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SparqlEditor from '../frontend/src/pages/SparqlEditor';
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

vi.mock('../frontend/src/components/Guide', () => ({
  default: () => <div>Guide Section</div>
}));
global.fetch = vi.fn();


describe('SparqlEditor', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders title and textarea', () => {
    render(<SparqlEditor />);
    expect(screen.getByText(/Editor SPARQL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escribe tu consulta SPARQL/i)).toBeInTheDocument();
  });

  test('executes query and displays results', async () => {
    const mockResponse = {
      head: { vars: ['s', 'p', 'o'] },
      results: {
        bindings: [
          {
            s: { value: 'subject1' },
            p: { value: 'predicate1' },
            o: { value: 'object1' },
          },
        ],
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<SparqlEditor />);
    const textarea = screen.getByPlaceholderText(/Escribe tu consulta SPARQL/i);
    fireEvent.change(textarea, { target: { value: 'SELECT * WHERE { ?s ?p ?o }' } });

    const button = screen.getByText(/Ejecutar/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('s')).toBeInTheDocument();
      expect(screen.getByText('subject1')).toBeInTheDocument();
    });
  });

  test('shows error on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SparqlEditor />);
    const textarea = screen.getByPlaceholderText(/Escribe tu consulta SPARQL/i);
    fireEvent.change(textarea, { target: { value: 'SELECT * WHERE { ?s ?p ?o }' } });

    fireEvent.click(screen.getByText(/Ejecutar/i));

    await waitFor(() => {
      expect(screen.getByText(/Error al ejecutar la consulta/i)).toBeInTheDocument();
    });
  });
});
