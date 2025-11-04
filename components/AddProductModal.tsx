
import React, { useState } from 'react';
import Modal from './Modal';
import { useInventory } from '../hooks/useInventory';
import { ProductCategory, Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ProductCategory[] = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Other'];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
    const { addProduct } = useInventory();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ProductCategory>('Other');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [isSerialized, setIsSerialized] = useState(false);
    const [sku, setSku] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !sku) return;
        const newProduct: Omit<Product, 'id'> = { name, category, price, quantity: isSerialized ? 0 : quantity, isSerialized, sku };
        addProduct(newProduct);
        onClose();
        // Reset form
        setName('');
        setCategory('Other');
        setPrice(0);
        setQuantity(0);
        setIsSerialized(false);
        setSku('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tilføj nyt produkt"
            footer={
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
                        Annuller
                    </button>
                    <button onClick={handleSubmit} type="submit" form="addProductForm" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Tilføj Produkt
                    </button>
                </div>
            }
        >
            <form id="addProductForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produktnavn</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                    <input type="text" value={sku} onChange={e => setSku(e.target.value.toUpperCase())} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                        <select value={category} onChange={e => setCategory(e.target.value as ProductCategory)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pris (DKK)</label>
                        <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kræver serienummer?</span>
                    <label htmlFor="isSerializedToggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="isSerializedToggle" className="sr-only peer" checked={isSerialized} onChange={() => setIsSerialized(!isSerialized)} />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-500 peer-checked:bg-indigo-600"></div>
                    </label>
                </div>
                {!isSerialized && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Antal</label>
                        <input type="number" min="0" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                )}
                 {isSerialized && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Antal for produkter med serienumre styres ved at tilføje individuelle serienumre.</p>
                )}
            </form>
        </Modal>
    );
};

export default AddProductModal;