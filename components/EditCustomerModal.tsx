
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useInventory } from '../hooks/useInventory';
import { Customer } from '../types';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ isOpen, onClose, customer }) => {
    const { updateCustomer } = useInventory();
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>(customer);

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        
        updateCustomer(customer.id, formData);
        onClose();
    };

    if (!customer) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Rediger ${customer.name}`}
            footer={
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">
                        Annuller
                    </button>
                    <button onClick={handleSubmit} type="submit" form="editCustomerForm" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Gem Ændringer
                    </button>
                </div>
            }
        >
            <form id="editCustomerForm" onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fulde Navn</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700" />
                </div>
            </form>
        </Modal>
    );
};

export default EditCustomerModal;
