import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../UserList';

describe('UserList delete trigger', () => {
  test('calls onDeleteRequest with the correct id', () => {
    const onDeleteRequest = jest.fn();
    const users = [
      { id: 1, firstname: 'John', lastname: 'Doe', age: 30, date_of_birth: '1995-01-01' },
      { id: 2, firstname: 'Jane', lastname: 'Doe', age: 25, date_of_birth: '2000-02-02' }
    ];

    render(<UserList users={users} onDeleteRequest={onDeleteRequest} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[1]);

    expect(onDeleteRequest).toHaveBeenCalledTimes(1);
    expect(onDeleteRequest).toHaveBeenCalledWith(2);
  });
});


