
import React, { ReactNode } from 'react';
import Modal from './Modal';
import { TriangleAlertIcon } from './Icons';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        footer={
            <div className="flex justify-end gap-3">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800"
                >
                    Annuller
                </button>
                <button 
                    onClick={onConfirm} 
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
                >
                    Ja, fjern
                </button>
            </div>
        }
    >
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <TriangleAlertIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
