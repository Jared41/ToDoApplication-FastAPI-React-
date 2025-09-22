import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from '../UserForm';

const fillAndSubmit = ({ firstname = 'John', lastname = 'Doe', age, dob }) => {
  const firstInput = screen.getByLabelText(/first name/i);
  const lastInput = screen.getByLabelText(/last name/i);
  const ageInput = screen.getByLabelText(/age/i);
  const dobInput = screen.getByLabelText(/date of birth/i);

  fireEvent.change(firstInput, { target: { value: firstname } });
  fireEvent.change(lastInput, { target: { value: lastname } });
  if (age !== undefined) fireEvent.change(ageInput, { target: { value: String(age) } });
  if (dob !== undefined) fireEvent.change(dobInput, { target: { value: dob } });

  fireEvent.submit(screen.getByRole('button', { name: /add user/i }));
};

describe('UserForm age–DOB validation', () => {
  test('shows error when age does not match DOB', () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    // Pick a DOB such that expected age is 30
    const today = new Date();
    const year = today.getFullYear() - 30;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;

    fillAndSubmit({ age: 25, dob });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/expected age is 30/i);
  });

  test('submits successfully when age matches DOB', () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    const today = new Date();
    const year = today.getFullYear() - 22;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dob = `${year}-${month}-${day}`;

    fillAndSubmit({ age: 22, dob });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({ age: 22, date_of_birth: dob })
    );
  });
});


