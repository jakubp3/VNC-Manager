import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface User {
    id: number;
    email: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
}

export const AdminPanel = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (userId: number, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to update user role:', error);
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">User Management</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => toggleRole(user.id, user.role)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                                                >
                                                    Toggle Role
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
