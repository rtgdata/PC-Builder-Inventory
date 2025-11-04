
import React, { useState } from 'react';
import Modal from './Modal';
import { useInventory } from '../hooks/useInventory';
import { Customer } from '../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
    const { addCustomer } = useInventory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        const newCustomer: Omit<Customer, 'id'> = { name, email, phone, address };
        addCustomer(newCustomer);
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tilføj ny kunde"
            footer={
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
                        Annuller
                    </button>
                    <button onClick={handleSubmit} type="submit" form="addCustomerForm" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Tilføj Kunde
                    </button>
                </div>
            }
        >
            <form id="addCustomerForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fulde Navn</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                </div>
            </form>
        </Modal>
    );
};

export default AddCustomerModal;
