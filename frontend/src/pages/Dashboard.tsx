import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { VncTabManager } from '../components/VncTabManager';
import { MachineList } from '../components/MachineList';

export interface VncMachine {
    id: number;
    name: string;
    host: string;
    port: number;
    password?: string | null;
    ownerId: number | null;
    owner?: { id: number; email: string } | null;
    createdAt: string;
    updatedAt: string;
}

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [machines, setMachines] = useState<VncMachine[]>([]);
    const [openTabs, setOpenTabs] = useState<VncMachine[]>([]);
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');

    const fetchMachines = async () => {
        try {
            const response = await fetch(`${API_URL}/vnc-machines`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMachines(data);
            }
        } catch (error) {
            console.error('Failed to fetch machines:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const openMachine = (machine: VncMachine) => {
        if (!openTabs.find(t => t.id === machine.id)) {
            setOpenTabs([...openTabs, machine]);
        }
        setActiveTab(machine.id);
    };

    const closeTab = (machineId: number) => {
        setOpenTabs(openTabs.filter(t => t.id !== machineId));
        if (activeTab === machineId) {
            setActiveTab(openTabs[0]?.id || null);
        }
    };

    const sharedMachines = machines.filter(m => m.ownerId === null);
    const personalMachines = machines.filter(m => m.ownerId === user?.id);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ManagerVNC</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
                        {user?.role === 'ADMIN' && (
                            <a href="/admin" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                Admin Panel
                            </a>
                        )}
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* VNC Tabs */}
            {openTabs.length > 0 && (
                <VncTabManager
                    tabs={openTabs}
                    activeTab={activeTab}
                    onTabClick={setActiveTab}
                    onTabClose={closeTab}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Shared Machines</h2>
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <MachineList machines={sharedMachines} onOpen={openMachine} onRefresh={fetchMachines} />
                        )}

                        <h2 className="text-lg font-semibold mt-8 mb-4 text-gray-900 dark:text-white">My Machines</h2>
                        <MachineList machines={personalMachines} onOpen={openMachine} onRefresh={fetchMachines} canEdit />
                    </div>
                </aside>

                {/* VNC Display Area */}
                <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                    {activeTab && openTabs.find(t => t.id === activeTab) ? (
                        <div className="h-full">
                            <iframe
                                src={`http://localhost:6080/vnc.html?host=${openTabs.find(t => t.id === activeTab)?.host}&port=${openTabs.find(t => t.id === activeTab)?.port}`}
                                className="w-full h-full border-0"
                                title={openTabs.find(t => t.id === activeTab)?.name}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <p>Select a machine to connect</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
