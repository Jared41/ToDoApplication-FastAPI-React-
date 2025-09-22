import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import * as api from '../services/api';
import App from '../App';

jest.mock('../services/api');

describe('App delete flow with confirm modal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('opens modal and deletes after confirm', async () => {
    api.getUsers.mockResolvedValue([
      { id: 1, firstname: 'John', lastname: 'Doe', age: 30, date_of_birth: '1995-01-01' }
    ]);
    api.deleteUser.mockResolvedValue({ message: 'deleted' });

    render(<App />);

    // Wait for users to load
    await waitFor(() => expect(screen.getByText(/users list/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Modal appears
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const modalDeleteBtn = within(dialog).getByRole('button', { name: /delete/i });
    fireEvent.click(modalDeleteBtn);

    await waitFor(() => expect(api.deleteUser).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.getByText(/user deleted successfully/i)).toBeInTheDocument());
  });

  test('closes modal on cancel without deleting', async () => {
    api.getUsers.mockResolvedValue([
      { id: 2, firstname: 'Jane', lastname: 'Doe', age: 25, date_of_birth: '2000-02-02' }
    ]);

    render(<App />);

    await waitFor(() => expect(screen.getByText(/users list/i)).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(api.deleteUser).not.toHaveBeenCalled();
  });
});


