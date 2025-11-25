import { useState } from 'react';
import { VncMachine } from '../pages/Dashboard';

interface MachineListProps {
    machines: VncMachine[];
    onOpen: (machine: VncMachine) => void;
    onRefresh: () => void;
    canEdit?: boolean;
}

export const MachineList: React.FC<MachineListProps> = ({
    machines,
    onOpen,
    onRefresh,
    canEdit = false,
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', host: '', port: 5900, password: '', isShared: false });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001/api';
    const token = localStorage.getItem('token');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/vnc-machines`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowAddForm(false);
                setFormData({ name: '', host: '', port: 5900, password: '', isShared: false });
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to create machine:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this machine?')) return;

        try {
            const response = await fetch(`${API_URL}/vnc-machines/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error('Failed to delete machine:', error);
        }
    };

    return (
        <div className="space-y-2">
            {machines.map((machine) => (
                <div
                    key={machine.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{machine.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {machine.host}:{machine.port}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onOpen(machine)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Open
                            </button>
                            {canEdit && (
                                <button
                                    onClick={() => handleDelete(machine.id)}
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {canEdit && (
                <div>
                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            + Add Machine
                        </button>
                    ) : (
                        <form onSubmit={handleCreate} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 space-y-2">
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                            />
                            <input
                                type="text"
                                placeholder="Host"
                                required
                                value={formData.host}
                                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                                className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                            />
                            <input
                                type="number"
                                placeholder="Port"
                                required
                                value={formData.port}
                                onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                            />
                            <input
                                type="password"
                                placeholder="VNC Password (optional)"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-600 dark:border-gray-500"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};
