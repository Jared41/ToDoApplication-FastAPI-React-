import React from 'react';

const UserList = ({ users, onDeleteRequest }) => {
  const handleDelete = (userId) => {
    onDeleteRequest(userId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="users-list">
      <h2>Users List</h2>
      {users.length === 0 ? (
        <div className="no-users">No users found. Add a user to get started!</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.age}</td>
                <td>{formatDate(user.date_of_birth)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;