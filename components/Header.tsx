
import React from 'react';
import { ComputerIcon, PlusIcon, LayoutDashboardIcon, UsersIcon } from './Icons';

type View = 'dashboard' | 'builder' | 'customers';

interface HeaderProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    onAddClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onAddClick }) => {
    const navItemClasses = "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
    const activeClasses = "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white";
    const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50";

    const addButtonLabel = currentView === 'customers' ? 'Tilføj Kunde' : 'Tilføj Produkt';

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm dark:shadow-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                           <ComputerIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Lagersystem</h1>
                        <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setCurrentView('dashboard')}
                                className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
                            >
                                <LayoutDashboardIcon className="w-5 h-5 mr-2" />
                                Lager
                            </button>
                             <button
                                onClick={() => setCurrentView('customers')}
                                className={`${navItemClasses} ${currentView === 'customers' ? activeClasses : inactiveClasses}`}
                            >
                                <UsersIcon className="w-5 h-5 mr-2" />
                                Kunder
                            </button>
                            <button
                                onClick={() => setCurrentView('builder')}
                                className={`${navItemClasses} ${currentView === 'builder' ? activeClasses : inactiveClasses}`}
                            >
                                <ComputerIcon className="w-5 h-5 mr-2" />
                                PC Bygger
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center">
                       {currentView !== 'builder' && (
                         <button
                            onClick={onAddClick}
                            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
                        >
                            <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                            {addButtonLabel}
                        </button>
                       )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;