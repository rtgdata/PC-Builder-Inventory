
import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Customer } from '../types';
import { EditIcon, SearchIcon, TrashIcon } from './Icons';

interface CustomerListProps {
    onEditCustomer: (customer: Customer) => void;
    onInitiateDelete: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onEditCustomer, onInitiateDelete }) => {
    const { customers } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Søg efter kunde..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Navn</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kontakt</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adresse</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{customer.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-slate-900 dark:text-white">{customer.email}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{customer.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center space-x-2">
                                        <button onClick={() => onEditCustomer(customer)} className="p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Rediger Kunde">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => onInitiateDelete(customer)}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors" title="Fjern Kunde"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            <span>Fjern</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredCustomers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                    Ingen kunder fundet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;
