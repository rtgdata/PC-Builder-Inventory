
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { useInventory } from '../hooks/useInventory';
import { Product, SerializedItem } from '../types';
import { PlusIcon, TrashIcon, EditIcon, CheckIcon, XIcon } from './Icons';

interface SerialNumberManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onInitiateDelete: (serial: SerializedItem) => void;
}

const SerialNumberManagerModal: React.FC<SerialNumberManagerModalProps> = ({ isOpen, onClose, product, onInitiateDelete }) => {
    const { serializedItems, addSerialNumber, updateSerialNumber } = useInventory();
    const [newSerial, setNewSerial] = useState('');
    const [editingSerialId, setEditingSerialId] = useState<string | null>(null);
    const [editingSerialValue, setEditingSerialValue] = useState('');

    const productSerials = useMemo(() => {
        return serializedItems.filter(item => item.productId === product.id);
    }, [serializedItems, product.id]);

    const handleAddSerial = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSerial) return;
        addSerialNumber(product.id, newSerial.toUpperCase());
        setNewSerial('');
    };

    const handleStartEdit = (item: SerializedItem) => {
        setEditingSerialId(item.id);
        setEditingSerialValue(item.serialNumber);
    };

    const handleCancelEdit = () => {
        setEditingSerialId(null);
        setEditingSerialValue('');
    };

    const handleSaveEdit = () => {
        if (editingSerialId && editingSerialValue) {
            updateSerialNumber(editingSerialId, editingSerialValue.toUpperCase());
            handleCancelEdit();
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'In Stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Used in Build': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Sold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Serienumre for ${product.name}`}>
            <div className="space-y-4">
                <form onSubmit={handleAddSerial} className="flex gap-2">
                    <input
                        type="text"
                        value={newSerial}
                        onChange={e => setNewSerial(e.target.value)}
                        placeholder="Tilføj nyt serienummer"
                        className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                    />
                    <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </form>
                <div className="max-h-80 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50">
                    {productSerials.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {productSerials.map(item => (
                                <li key={item.id} className="py-2 px-2 flex justify-between items-center group">
                                    {editingSerialId === item.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingSerialValue}
                                                onChange={(e) => setEditingSerialValue(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') handleCancelEdit(); }}
                                                className="flex-grow w-full p-1 border border-indigo-500 rounded-md bg-white dark:bg-slate-700 text-sm font-mono"
                                                autoFocus
                                            />
                                            <div className="flex items-center gap-1 ml-2">
                                                <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition-colors" title="Gem">
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={handleCancelEdit} className="p-1 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md transition-colors" title="Annuller">
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{item.serialNumber}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChip(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.status === 'In Stock' && (
                                                        <button 
                                                            onClick={() => handleStartEdit(item)} 
                                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                                            title="Rediger Serienummer"
                                                        >
                                                            <EditIcon className="w-3 h-3" />
                                                            Rediger
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => onInitiateDelete(item)}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
                                                        title="Fjern Serienummer"
                                                    >
                                                        <TrashIcon className="w-3 h-3" />
                                                        Fjern
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">Ingen serienumre fundet for dette produkt.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default SerialNumberManagerModal;
