
import React, { useState, useMemo, useRef } from 'react';
import { useInventory } from '../hooks/useInventory';
import { ProductCategory, Product, SerializedItem } from '../types';
import { generatePCName } from '../services/geminiService';
import { SparklesIcon, BuildIcon, LoadingIcon, GripVerticalIcon } from './Icons';

const COMPONENT_CATEGORIES: ProductCategory[] = ['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Case'];

interface PCBuilderProps {
  onBuildSuccess: () => void;
}

const PCBuilder: React.FC<PCBuilderProps> = ({ onBuildSuccess }) => {
    const { products, serializedItems, buildPC, addToast, customers } = useInventory();
    const [orderedCategories, setOrderedCategories] = useState<ProductCategory[]>(COMPONENT_CATEGORIES);
    const [selectedComponents, setSelectedComponents] = useState<Record<ProductCategory, string | undefined>>({} as any);
    const [selectedSerials, setSelectedSerials] = useState<Record<string, string | undefined>>({});
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
    const [pcName, setPcName] = useState('');
    const [pcSerialNumber, setPcSerialNumber] = useState('');
    const [isGeneratingName, setIsGeneratingName] = useState(false);
    const [isBuilding, setIsBuilding] = useState(false);

    // Drag and drop refs
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const availableProducts = useMemo(() => {
        const result: Record<ProductCategory, Product[]> = {} as any;
        COMPONENT_CATEGORIES.forEach(cat => {
            result[cat] = products.filter(p => p.category === cat && p.quantity > 0);
        });
        return result;
    }, [products]);

    const totalPrice = useMemo(() => {
        return Object.values(selectedComponents).reduce((sum, productId) => {
            if (!productId) return sum;
            const product = products.find(p => p.id === productId);
            return sum + (product?.price || 0);
        }, 0);
    }, [selectedComponents, products]);

    const handleGenerateName = async () => {
        setIsGeneratingName(true);
        const selectedProducts = Object.values(selectedComponents)
            .map(prodId => products.find(p => p.id === prodId))
            .filter((p): p is Product => !!p);
        
        if (selectedProducts.length > 0) {
            try {
                const name = await generatePCName(selectedProducts);
                setPcName(name);
            } catch (e) {
                addToast("Kunne ikke generere AI-navn.", "error");
            }
        } else {
             addToast("Vælg mindst én komponent for at generere et navn.", "info");
        }
        setIsGeneratingName(false);
    };

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newCategories = [...orderedCategories];
        const [draggedElement] = newCategories.splice(dragItem.current, 1);
        newCategories.splice(dragOverItem.current, 0, draggedElement);
        
        setOrderedCategories(newCategories);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleBuildPC = () => {
        if (!pcName || !pcSerialNumber) {
            addToast("PC-navn og serienummer er påkrævet.", "error");
            return;
        }

        const componentsToBuild: { productId: string; serialId?: string }[] = [];
        for (const category of COMPONENT_CATEGORIES) {
            const productId = selectedComponents[category];
            if (!productId) {
                addToast(`Vælg venligst en ${category}.`, "error");
                return;
            }
            const product = products.find(p => p.id === productId);
            if (!product) continue;

            if (product.isSerialized) {
                const serialId = selectedSerials[productId];
                if (!serialId) {
                     addToast(`Vælg venligst et serienummer for ${product.name}.`, "error");
                    return;
                }
                componentsToBuild.push({ productId, serialId });
            } else {
                componentsToBuild.push({ productId });
            }
        }
        setIsBuilding(true);
        setTimeout(() => { // Simulate build time
          buildPC(pcName, pcSerialNumber, componentsToBuild, selectedCustomerId);
          setIsBuilding(false);
          onBuildSuccess();
        }, 1500)
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Vælg Komponenter</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orderedCategories.map((category, index) => {
                        const selectedProductId = selectedComponents[category];
                        const product = products.find(p => p.id === selectedProductId);
                        return (
                            <div 
                                key={category}
                                draggable
                                onDragStart={() => dragItem.current = index}
                                onDragEnter={() => dragOverItem.current = index}
                                onDragEnd={handleSort}
                                onDragOver={(e) => e.preventDefault()}
                                className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-grab active:cursor-grabbing transition-shadow"
                            >
                                <span className="pt-8 text-slate-400 hover:text-slate-600">
                                    <GripVerticalIcon className="w-5 h-5" />
                                </span>
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{category}</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                                        value={selectedProductId || ''}
                                        onChange={e => setSelectedComponents({...selectedComponents, [category]: e.target.value})}
                                    >
                                        <option value="">Vælg {category}...</option>
                                        {availableProducts[category]?.map(p => {
                                            const stockLabel = p.isSerialized ? (p.quantity === 1 ? 'tilgængelig' : 'tilgængelige') : 'på lager';
                                            return (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.quantity} {stockLabel})
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {product?.isSerialized && (
                                        <div className="mt-2">
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Serienummer</label>
                                            <select
                                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-xs"
                                                value={selectedSerials[product.id] || ''}
                                                onChange={e => setSelectedSerials({...selectedSerials, [product.id]: e.target.value })}
                                            >
                                                <option value="">Vælg serienummer...</option>
                                                {serializedItems.filter(s => s.productId === product.id && s.status === 'In Stock').map(s => <option key={s.id} value={s.id}>{s.serialNumber}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl h-fit sticky top-24">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Færdigbygget PC</h2>
                 <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PC Navn</label>
                        <div className="flex gap-2">
                            <input type="text" value={pcName} onChange={e => setPcName(e.target.value)} placeholder="f.eks. 'Gaming Beast X1'" className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                            <button onClick={handleGenerateName} disabled={isGeneratingName} className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50">
                                {isGeneratingName ? <LoadingIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                            </button>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nyt Serienummer</label>
                        <input type="text" value={pcSerialNumber} onChange={e => setPcSerialNumber(e.target.value.toUpperCase())} placeholder="Indtast unikt serienummer" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"/>
                     </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tildel til Kunde (valgfrit)</label>
                        <select
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                            value={selectedCustomerId || ''}
                            onChange={e => setSelectedCustomerId(e.target.value || undefined)}
                        >
                            <option value="">Ingen kunde</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                     </div>
                     <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-slate-600 dark:text-slate-300">Total Pris:</span>
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(totalPrice)}
                            </span>
                        </div>
                    </div>
                     <button
                        onClick={handleBuildPC}
                        disabled={isBuilding}
                        className="w-full mt-4 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                       {isBuilding ? <LoadingIcon className="w-5 h-5 animate-spin mr-2"/> : <BuildIcon className="w-5 h-5 mr-2" />}
                       {isBuilding ? 'Bygger...' : 'Færdiggør Byg'}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default PCBuilder;