import { useState, useEffect } from 'react';
import { getAllUsers, getAllRoles, getAllTeams, getCurrentUser } from '../services/api';
import api from '../services/api';
import '../components/Dashboard.css';
import './Management.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const [usersData, rolesData, teamsData, currentUserData] = await Promise.all([
                getAllUsers().catch(() => []),
                getAllRoles().catch(() => []),
                getAllTeams().catch(() => []),
                getCurrentUser().catch(() => null),
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setTeams(teamsData);
            setCurrentUser(currentUserData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create user');
        }
    };

    const handleAssignRole = async (userId, roleId) => {
        try {
            await api.post(`/users/${userId}/role`, {
                roleId,
                validFrom: new Date(),
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign role');
        }
    };

    const handleAssignTeam = async (userId, teamId) => {
        try {
            await api.post(`/users/${userId}/team`, { teamId });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign team');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                Loading...
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>User Management</h1>
                <p>Manage users, assign roles, and control access</p>
            </div>

            {error && (
                <div className="error-message-box">
                    {error}
                </div>
            )}

            <div className="action-bar">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                >
                    + Create New User
                </button>
            </div>

            <div className="table-container">
                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Team</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="avatar">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="user-name">{user.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-email">{user.email}</div>
                                        </td>
                                        <td>
                                            <select
                                                value={user.roles?.[0]?.roleId?._id || ''}
                                                onChange={(e) => handleAssignRole(user._id, e.target.value)}
                                                className="table-select"

                                            >
                                                <option value="">No Role</option>
                                                {roles.map((role) => (
                                                    <option key={role._id} value={role._id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                value={user.teamId?._id || user.teamId || ''}
                                                onChange={(e) => handleAssignTeam(user._id, e.target.value)}
                                                className="table-select"
                                            >
                                                <option value="">No Team</option>
                                                {teams.map((team) => (
                                                    <option key={team._id} value={team._id}>
                                                        {team.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                disabled={currentUser?._id === user._id}
                                                className="btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New User</h2>
                        <form onSubmit={handleCreateUser} className="management-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setFormData({ name: '', email: '', password: '' });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
