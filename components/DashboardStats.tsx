
import React, { useMemo, ReactNode } from 'react';
import { useInventory } from '../hooks/useInventory';
import { BoxIcon, BoxesIcon, TriangleAlertIcon, CircleSlashIcon } from './Icons';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    color: 'indigo' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex items-center justify-between transition-transform hover:scale-105 duration-300">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                {icon}
            </div>
        </div>
    );
};


const DashboardStats: React.FC = () => {
    const { products } = useInventory();

    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
        const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
        const outOfStockCount = products.filter(p => p.quantity === 0).length;

        return { totalProducts, totalItems, lowStockCount, outOfStockCount };
    }, [products]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Totale Produkter"
                value={stats.totalProducts}
                icon={<BoxIcon className="w-6 h-6" />}
                color="indigo"
            />
            <StatCard
                title="Totale Varer på Lager"
                value={stats.totalItems}
                icon={<BoxesIcon className="w-6 h-6" />}
                color="green"
            />
            <StatCard
                title="Lav Lagerbeholdning"
                value={stats.lowStockCount}
                icon={<TriangleAlertIcon className="w-6 h-6" />}
                color="yellow"
            />
            <StatCard
                title="Udsolgte Varer"
                value={stats.outOfStockCount}
                icon={<CircleSlashIcon className="w-6 h-6" />}
                color="red"
            />
        </div>
    );
};

export default DashboardStats;
