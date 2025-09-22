import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import ConfirmModal from './components/ConfirmModal';
import { getUsers, createUser, deleteUser } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      setSuccess('User created successfully!');
      setError('');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create user');
      setSuccess('');
      console.error('Error creating user:', err);
    }
  };

  const requestDeleteUser = (userId) => {
    setPendingDeleteId(userId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId == null) return;
    try {
      await deleteUser(pendingDeleteId);
      setSuccess('User deleted successfully!');
      setError('');
      setConfirmOpen(false);
      setPendingDeleteId(null);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      setSuccess('');
      setConfirmOpen(false);
      setPendingDeleteId(null);
      console.error('Error deleting user:', err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>User Management System</h1>
        <p>Add, view, and delete users</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <UserForm onSubmit={handleCreateUser} />
      
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <UserList users={users} onDeleteRequest={requestDeleteUser} />
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;