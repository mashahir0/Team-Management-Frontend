import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/api';
import Sidebar from '../components/Sidebar';
import '../components/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar user={user} />
            <div className="dashboard-main">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
