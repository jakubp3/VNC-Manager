import { VncMachine } from '../pages/Dashboard';

interface VncTabManagerProps {
    tabs: VncMachine[];
    activeTab: number | null;
    onTabClick: (id: number) => void;
    onTabClose: (id: number) => void;
}

export const VncTabManager: React.FC<VncTabManagerProps> = ({
    tabs,
    activeTab,
    onTabClick,
    onTabClose,
}) => {
    return (
        <div className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`flex items-center gap-2 px-4 py-2 border-r border-gray-300 dark:border-gray-600 cursor-pointer ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => onTabClick(tab.id)}
                    >
                        <span className="text-sm font-medium">{tab.name}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
