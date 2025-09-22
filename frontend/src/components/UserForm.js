import React, { useState } from 'react';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    date_of_birth: ''
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dob = formData.date_of_birth ? new Date(formData.date_of_birth) : null;
    const inputAge = formData.age !== '' ? parseInt(formData.age, 10) : NaN;

    const isValidDate = dob instanceof Date && !isNaN(dob.getTime());

    const calculateAge = (birthDate) => {
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      const hasNotHadBirthdayThisYear =
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
      if (hasNotHadBirthdayThisYear) {
        years -= 1;
      }
      return years;
    };

    if (!isValidDate || isNaN(inputAge)) {
      setValidationError('Please provide a valid age and date of birth.');
      return;
    }

    const expectedAge = calculateAge(dob);
    if (inputAge !== expectedAge) {
      setValidationError(`Age does not match date of birth. Expected age is ${expectedAge}.`);
      return;
    }

    setValidationError('');

    const userData = {
      ...formData,
      age: parseInt(formData.age, 10)
    };

    onSubmit(userData);
    
    setFormData({
      firstname: '',
      lastname: '',
      age: '',
      date_of_birth: ''
    });
    setValidationError('');
  };

  return (
    <div className="user-form">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="150"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth:</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        {validationError && (
          <div className="error" role="alert">{validationError}</div>
        )}

        <button type="submit" className="btn btn-primary">
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;