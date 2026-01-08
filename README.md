# Team Management System - Frontend

A sleek and responsive React application for managing users, roles, and teams.

## Features

- **Modern Dashboard**: Unified view for all user roles.
- **User Management**: Admin-only user administration with role/team assignment.
- **Role Management**: Interactive UI for creating roles and assigning/removing permissions.
- **Team Management**: Create teams and monitor member counts.
- **Audit Logs**: Visual representation of system activity.
- **Security**: Protected routes based on authentication and permissions.

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Modern, premium aesthetics)
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Getting Started

### Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    VITE_API_BASE_URL=http://localhost:3006
    ```

3.  **Run in Development**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/pages`: Main application views (Management, Logs, etc.).
- `src/components`: Reusable UI components.
- `src/services`: API interaction layer.
- `src/middleware`: Frontend route protection.
- `src/index.css`: Global design system and base styles.
