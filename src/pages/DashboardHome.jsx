import { useState, useEffect } from 'react';
import { getCurrentUser, getAllTeams } from '../services/api';
import '../components/Dashboard.css';

const DashboardHome = () => {
    const [user, setUser] = useState(null);
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const userData = await getCurrentUser();
                setUser(userData);

                // Fetch team if user has a teamId
                if (userData.teamId) {
                    try {
                        const teams = await getAllTeams();
                        const userTeam = teams.find(t => t._id === userData.teamId);
                        setTeam(userTeam);
                    } catch (err) {
                        // User might not have permission to view teams
                        console.log('Could not fetch team data');
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message-box">{error}</div>;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p>Here's an overview of your account and team status</p>
            </div>

            <div className="card-grid">
                <div className="card">
                    <h2>Your Profile</h2>
                    <div className="info-item">
                        <span className="info-label">Name</span>
                        <span className="info-value">{user?.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{user?.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Role</span>
                        <span className="info-value">
                            {user?.roles && user.roles.length > 0 && user.roles[0].roleId ? (
                                <span className="badge">{user.roles[0].roleId.name}</span>
                            ) : (
                                <span className="badge badge-secondary">No Role Assigned</span>
                            )}
                        </span>
                    </div>
                </div>

                <div className="card">
                    <h2>Team Status</h2>
                    {team ? (
                        <>
                            <div className="info-item">
                                <span className="info-label">Team Name</span>
                                <span className="info-value">{team.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Description</span>
                                <span className="info-value">{team.description || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="info-value">
                                    <span className="badge">Active</span>
                                </span>
                            </div>
                        </>
                    ) : (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>
                            You are not currently assigned to any team.
                        </p>
                    )}
                </div>
            </div>

            <div className="card">
                <h2>Quick Stats</h2>
                <p>
                    Your account was created and you have access to various features based on your role
                    and permissions. Use the sidebar to navigate to different management sections.
                </p>
            </div>
        </div>
    );
};

export default DashboardHome;
