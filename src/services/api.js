import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Register a new user
export const registerUser = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
};

// Login user
export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

// Get current user details
export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

// Get all users
export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

// Get all teams
export const getAllTeams = async () => {
    const response = await api.get('/teams');
    return response.data;
};

// Create a new team
export const createTeam = async (name) => {
    const response = await api.post('/teams', { name });
    return response.data;
};

// Get all roles
export const getAllRoles = async () => {
    const response = await api.get('/roles');
    return response.data;
};

// Create a new role
export const createRole = async (name) => {
    const response = await api.post('/roles', { name });
    return response.data;
};

// Get all permissions
export const getAllPermissions = async () => {
    const response = await api.get('/roles/permissions');
    return response.data;
};

// Add permission to role
export const addPermissionToRole = async (roleId, permissionKey) => {
    const response = await api.post(`/roles/${roleId}/permissions`, { permissionKey });
    return response.data;
};

// Remove permission from role
export const removePermissionFromRole = async (roleId, permissionKey) => {
    const response = await api.delete(`/roles/${roleId}/permissions/${permissionKey}`);
    return response.data;
};

// Get audit logs
export const getAuditLogs = async () => {
    const response = await api.get('/audit-logs');
    return response.data;
};

export default api;

