
import React, { useState, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types';
import { SerialIcon, EditIcon, SearchIcon, TrashIcon, UsersIcon } from './Icons';

interface ProductListProps {
    onManageSerials: (product: Product) => void;
    onEditProduct: (product: Product) => void;
    onInitiateDelete: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onManageSerials, onEditProduct, onInitiateDelete }) => {
    const { products, customers, pcBuilds } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');

    const customerLookup = useMemo(() => {
        const pcBuildMap = new Map<string, string | undefined>(); // pcProductId -> customerId
        pcBuilds.forEach(build => {
            if (build.pcProductId) {
                pcBuildMap.set(build.pcProductId, build.customerId);
            }
        });

        const customerMap = new Map<string, string>(); // customerId -> customerName
        customers.forEach(customer => {
            customerMap.set(customer.id, customer.name);
        });

        return { pcBuildMap, customerMap };
    }, [pcBuilds, customers]);


    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockIndicatorColor = (quantity: number) => {
        if (quantity === 0) return 'bg-red-500';
        if (quantity <= 5) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Søg efter produkt, SKU eller kategori..."
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produkt</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kategori</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Antal</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredProducts.map((product) => {
                            const customerId = product.category === 'Custom PC' ? customerLookup.pcBuildMap.get(product.id) : undefined;
                            const customerName = customerId ? customerLookup.customerMap.get(customerId) : null;

                            return (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</div>
                                        {customerName && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                <UsersIcon className="w-3 h-3"/>
                                                <span>{customerName}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">{product.sku}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center">
                                            <span className={`h-2.5 w-2.5 rounded-full ${getStockIndicatorColor(product.quantity)} mr-2`}></span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{product.quantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            {product.isSerialized && (
                                                <button 
                                                    onClick={() => onManageSerials(product)}
                                                    className="p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                    title="Administrer Serienumre"
                                                >
                                                    <SerialIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => onEditProduct(product)} className="p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Rediger Produkt">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => onInitiateDelete(product)}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors" title="Fjern Produkt"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                <span>Fjern</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                         {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                    Ingen produkter fundet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;