
import React, { useState, useCallback, useMemo } from 'react';
import { InventoryProvider, useInventory } from './hooks/useInventory';
import Header from './components/Header';
import ProductList from './components/ProductList';
import PCBuilder from './components/PCBuilder';
import CustomerList from './components/CustomerList';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import AddCustomerModal from './components/AddCustomerModal';
import EditCustomerModal from './components/EditCustomerModal';
import SerialNumberManagerModal from './components/SerialNumberManagerModal';
import { Product, SerializedItem, Customer } from './types';
import { ToastContainer } from './components/Toast';
import DashboardStats from './components/DashboardStats';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

type View = 'dashboard' | 'builder' | 'customers';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [productForSerials, setProductForSerials] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [serialToDelete, setSerialToDelete] = useState<SerializedItem | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const { addToast, deleteProduct, deleteSerialNumber, deleteCustomer } = useInventory();

    const handleOpenSerialManager = useCallback((product: Product) => setProductForSerials(product), []);
    const handleOpenEditModal = useCallback((product: Product) => setProductToEdit(product), []);
    const handleOpenEditCustomerModal = useCallback((customer: Customer) => setCustomerToEdit(customer), []);

    const handleInitiateDelete = useCallback((product: Product) => setProductToDelete(product), []);
    const handleConfirmDelete = useCallback(() => {
        if (productToDelete) deleteProduct(productToDelete.id);
        setProductToDelete(null);
    }, [productToDelete, deleteProduct]);
    
    const handleInitiateSerialDelete = useCallback((serial: SerializedItem) => setSerialToDelete(serial), []);
    const handleConfirmSerialDelete = useCallback(() => {
        if (serialToDelete) deleteSerialNumber(serialToDelete.id);
        setSerialToDelete(null);
    }, [serialToDelete, deleteSerialNumber]);

    const handleInitiateCustomerDelete = useCallback((customer: Customer) => setCustomerToDelete(customer), []);
    const handleConfirmCustomerDelete = useCallback(() => {
        if (customerToDelete) deleteCustomer(customerToDelete.id);
        setCustomerToDelete(null);
    }, [customerToDelete, deleteCustomer]);

    const handleAddClick = useCallback(() => {
        if (currentView === 'dashboard') setAddProductModalOpen(true);
        if (currentView === 'customers') setAddCustomerModalOpen(true);
    }, [currentView]);

    const appTitle = useMemo(() => {
        switch (currentView) {
            case 'dashboard': return "Lagerbeholdning";
            case 'builder': return "Byg en ny PC";
            case 'customers': return "Kundeoversigt";
            default: return "Avanceret Lagersystem";
        }
    }, [currentView]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <Header
                currentView={currentView}
                setCurrentView={setCurrentView}
                onAddClick={handleAddClick}
            />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">{appTitle}</h1>
                
                {currentView === 'dashboard' && (
                    <>
                        <DashboardStats />
                        <ProductList 
                            onManageSerials={handleOpenSerialManager} 
                            onEditProduct={handleOpenEditModal}
                            onInitiateDelete={handleInitiateDelete}
                        />
                    </>
                )}
                
                {currentView === 'builder' && (
                    <PCBuilder onBuildSuccess={() => {
                      setCurrentView('dashboard');
                      addToast("Ny PC er bygget og tilføjet til lageret!", "success");
                    }} />
                )}

                {currentView === 'customers' && (
                    <CustomerList 
                        onEditCustomer={handleOpenEditCustomerModal}
                        onInitiateDelete={handleInitiateCustomerDelete}
                    />
                )}
            </main>

            <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setAddProductModalOpen(false)} />
            <AddCustomerModal isOpen={isAddCustomerModalOpen} onClose={() => setAddCustomerModalOpen(false)} />
            
            {productToEdit && <EditProductModal product={productToEdit} isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} />}
            {customerToEdit && <EditCustomerModal customer={customerToEdit} isOpen={!!customerToEdit} onClose={() => setCustomerToEdit(null)} />}
            {productForSerials && <SerialNumberManagerModal product={productForSerials} isOpen={!!productForSerials} onClose={() => setProductForSerials(null)} onInitiateDelete={handleInitiateSerialDelete} />}

            {productToDelete && (
                 <ConfirmDeleteModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={handleConfirmDelete} title={`Fjern "${productToDelete.name}"?`}>
                    <p>Er du sikker på, at du vil fjerne dette produkt permanent?</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Dette vil også fjerne alle tilknyttede serienumre og fjerne komponenten fra alle PC-byg den indgår i. Denne handling kan ikke fortrydes.
                    </p>
                </ConfirmDeleteModal>
            )}
            
            {serialToDelete && (
                 <ConfirmDeleteModal isOpen={!!serialToDelete} onClose={() => setSerialToDelete(null)} onConfirm={handleConfirmSerialDelete} title={`Fjern serienummer "${serialToDelete.serialNumber}"?`}>
                    <p>Er du sikker på, at du vil fjerne dette serienummer permanent?</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Denne handling kan ikke fortrydes.</p>
                </ConfirmDeleteModal>
            )}
            
            {customerToDelete && (
                 <ConfirmDeleteModal isOpen={!!customerToDelete} onClose={() => setCustomerToDelete(null)} onConfirm={handleConfirmCustomerDelete} title={`Fjern kunde "${customerToDelete.name}"?`}>
                    <p>Er du sikker på, at du vil fjerne denne kunde permanent?</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dette vil fjerne kunden fra eventuelle PC-byg, de er tildelt. Handlingen kan ikke fortrydes.</p>
                </ConfirmDeleteModal>
            )}

            <ToastContainer />
        </div>
    );
};

const App: React.FC = () => (
    <InventoryProvider>
        <AppContent />
    </InventoryProvider>
);

export default App;