import { useState, useEffect } from 'react';
import { getAllRoles, createRole, getAllPermissions, addPermissionToRole, removePermissionFromRole } from '../services/api';
import '../components/Dashboard.css';
import './Management.css';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // Form states
    const [roleName, setRoleName] = useState('');
    const [newPermission, setNewPermission] = useState({
        permissionKey: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rolesData, permissionsData] = await Promise.all([
                getAllRoles(),
                getAllPermissions()
            ]);
            setRoles(rolesData);
            setPermissions(permissionsData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load roles and permissions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        try {
            await createRole(roleName);
            setRoleName('');
            setShowCreateModal(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create role');
        }
    };

    const handleAddPermission = async (e) => {
        e.preventDefault();
        if (!newPermission.permissionKey) {
            alert('Please select a permission');
            return;
        }
        try {
            await addPermissionToRole(selectedRole._id, newPermission.permissionKey);
            setNewPermission({ permissionKey: '' });
            // Refresh local roles list to show the new permission
            const updatedRoles = await getAllRoles();
            setRoles(updatedRoles);
            // Update selected role to show new permissions in modal
            const updatedRole = updatedRoles.find(r => r._id === selectedRole._id);
            setSelectedRole(updatedRole);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add permission');
        }
    };

    const handleRemovePermission = async (roleId, permissionKey) => {
        if (!window.confirm(`Are you sure you want to remove ${permissionKey}?`)) return;
        try {
            await removePermissionFromRole(roleId, permissionKey);
            // Refresh roles list
            const updatedRoles = await getAllRoles();
            setRoles(updatedRoles);

            // If the modal for this role is open, update the selected role state too
            if (selectedRole && selectedRole._id === roleId) {
                const updatedRole = updatedRoles.find(r => r._id === roleId);
                setSelectedRole(updatedRole);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove permission');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Role Management</h1>
                <p>Define roles and assign fine-grained permissions</p>
            </div>

            {error && <div className="error-message-box">{error}</div>}

            <div className="action-bar">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                >
                    + Create New Role
                </button>
            </div>

            <div className="table-container">
                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Role Name</th>
                                <th>Permissions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="empty-state">No roles found</td>
                                </tr>
                            ) : (
                                roles.map(role => (
                                    <tr key={role._id}>
                                        <td style={{ fontWeight: '600', color: '#1a1a1a' }}>{role.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {role.permissions?.length > 0 ? (
                                                    role.permissions.map((p, idx) => (
                                                        <span key={idx} className="badge badge-with-remove">
                                                            {p.permissionKey}
                                                            <button
                                                                onClick={() => handleRemovePermission(role._id, p.permissionKey)}
                                                                className="remove-btn"
                                                                title="Remove permission"
                                                            >&times;</button>
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span style={{ color: '#999', fontSize: '0.875rem' }}>No permissions</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setSelectedRole(role);
                                                    setShowPermissionModal(true);
                                                }}
                                                className="btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            >
                                                Manage Permissions
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Role</h2>
                        <form onSubmit={handleCreateRole} className="management-form">
                            <div className="form-group">
                                <label>Role Name</label>
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="e.g. Content Manager"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Role</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Permissions Modal */}
            {showPermissionModal && selectedRole && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h2>Permissions for {selectedRole.name}</h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Active Permissions</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedRole.permissions?.map((p, idx) => (
                                    <span key={idx} className="badge badge-with-remove">
                                        {p.permissionKey}
                                        <button
                                            onClick={() => handleRemovePermission(selectedRole._id, p.permissionKey)}
                                            className="remove-btn"
                                            title="Remove permission"
                                        >&times;</button>
                                    </span>
                                ))}
                                {(!selectedRole.permissions || selectedRole.permissions.length === 0) && (
                                    <p style={{ color: '#666', fontSize: '0.875rem' }}>No permissions assigned yet.</p>
                                )}
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

                        <h3>Add New Permission</h3>
                        <form onSubmit={handleAddPermission} className="management-form" style={{ marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Select Permission</label>
                                <select
                                    value={newPermission.permissionKey}
                                    onChange={(e) => setNewPermission({ ...newPermission, permissionKey: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose Permission --</option>
                                    {permissions.map(p => (
                                        <option key={p.key} value={p.key}>{p.description} ({p.key})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowPermissionModal(false)} className="btn-secondary">Close</button>
                                <button type="submit" className="btn-primary">Add Permission</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;
