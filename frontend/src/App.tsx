import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'lucide-react';

// Placeholder components
const Dashboard = () => <div className="p-4">Dashboard Content</div>;
const ActivityLogs = () => <div className="p-4">Activity Logs Content</div>;
const Login = () => <div className="p-4">Login Page</div>;

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">ManagerVNC</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </header>
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/activity-logs" element={<ActivityLogs />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
