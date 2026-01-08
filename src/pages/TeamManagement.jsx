import { useState, useEffect } from 'react';
import { getAllTeams, createTeam } from '../services/api';
import '../components/Dashboard.css';
import './Management.css';

const TeamManagement = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const data = await getAllTeams();
            setTeams(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await createTeam(teamName);
            setTeamName('');
            setShowCreateModal(false);
            fetchTeams();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create team');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Team Management</h1>
                <p>Manage teams and organization structure</p>
            </div>

            {error && <div className="error-message-box">{error}</div>}

            <div className="action-bar">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                >
                    + Create New Team
                </button>
            </div>

            <div className="table-container">
                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Created At</th>
                                <th>Members</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-state">No teams found</td>
                                </tr>
                            ) : (
                                teams.map(team => (
                                    <tr key={team._id}>
                                        <td style={{ fontWeight: '600', color: '#1a1a1a' }}>{team.name}</td>
                                        <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge">{team.memberCount || 0} Members</span>
                                        </td>
                                        <td>
                                            <button className="btn-secondary" disabled style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                                Manage
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
                        <h2>Create New Team</h2>
                        <form onSubmit={handleCreateTeam} className="management-form">
                            <div className="form-group">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    placeholder="e.g. Engineering, Marketing"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
