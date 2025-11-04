
import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { useInventory } from '../hooks/useInventory';
import { ProductCategory, Product } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const CATEGORIES: ProductCategory[] = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case', 'Other'];

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
    const { updateProduct, serializedItems } = useInventory();
    const [formData, setFormData] = useState<Product>(product);

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);
    
    const hasSerials = useMemo(() => {
        return serializedItems.some(item => item.productId === product.id);
    }, [serializedItems, product.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.sku) return;
        
        const { id, ...updateData } = formData;
        updateProduct(id, updateData);
        onClose();
    };

    if (!product) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Rediger ${product.name}`}
            footer={
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
                        Annuller
                    </button>
                    <button onClick={handleSubmit} type="submit" form="editProductForm" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Gem Ændringer
                    </button>
                </div>
            }
        >
            <form id="editProductForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produktnavn</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                    <input type="text" name="sku" value={formData.sku.toUpperCase()} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pris (DKK)</label>
                        <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleNumberChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kræver serienummer?</span>
                    <label htmlFor="isSerializedToggleEdit" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="isSerializedToggleEdit" name="isSerialized" className="sr-only peer" checked={formData.isSerialized} onChange={handleCheckboxChange} disabled={hasSerials} />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-500 peer-checked:bg-indigo-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                </div>
                {hasSerials && (
                     <p className="text-xs text-slate-500 dark:text-slate-400">Kan ikke ændre, da der allerede er registreret serienumre.</p>
                )}
                {!formData.isSerialized && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Antal</label>
                        <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleNumberChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                )}
                 {formData.isSerialized && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Antal styres via tilføjelse af individuelle serienumre.</p>
                )}
            </form>
        </Modal>
    );
};

export default EditProductModal;