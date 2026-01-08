import { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/api';
import '../components/Dashboard.css';
import './Management.css';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch audit logs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Audit Logs</h1>
                <p>View system activity and audit trail</p>
            </div>

            {error && <div className="error-message-box">{error}</div>}

            <div className="table-container">
                <div className="table-responsive">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Category</th>
                                <th>Target</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-state">No activity logs found</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log._id}>
                                        <td style={{ fontSize: '0.875rem', color: '#666' }}>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{log.actorUserId?.name || 'System'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#999' }}>{log.actorUserId?.email}</div>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: '#f0f2f5', color: '#1a1a1a', border: '1px solid #e1e4e8' }}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td>{log.targetType || 'N/A'}</td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{log.targetName || 'N/A'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#999' }}>ID: {log.target}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
