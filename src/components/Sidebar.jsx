import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Sidebar = ({ user }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Team Manager</h2>
            </div>

            {user && (
                <div className="sidebar-user">
                    <div className="sidebar-user-name">{user.name}</div>
                    <div className="sidebar-user-email">{user.email}</div>
                    {user.roles && user.roles.length > 0 && user.roles[0].roleId && (
                        <div className="sidebar-user-role">
                            {user.roles[0].roleId.name || 'User'}
                        </div>
                    )}
                </div>
            )}

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" end className="sidebar-nav-item">
                    <span className="sidebar-nav-icon">🏠</span>
                    Dashboard
                </NavLink>
                <NavLink to="/dashboard/users" className="sidebar-nav-item">
                    <span className="sidebar-nav-icon">👥</span>
                    User Management
                </NavLink>
                <NavLink to="/dashboard/teams" className="sidebar-nav-item">
                    <span className="sidebar-nav-icon">🏢</span>
                    Team Management
                </NavLink>
                <NavLink to="/dashboard/roles" className="sidebar-nav-item">
                    <span className="sidebar-nav-icon">🔐</span>
                    Role Management
                </NavLink>
                <NavLink to="/dashboard/logs" className="sidebar-nav-item">
                    <span className="sidebar-nav-icon">📋</span>
                    Audit Logs
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-logout-btn">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
