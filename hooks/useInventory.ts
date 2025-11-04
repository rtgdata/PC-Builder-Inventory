import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Product, SerializedItem, PCBuild, ProductCategory, ToastMessage, Customer } from '../types';

interface InventoryContextType {
    products: Product[];
    serializedItems: SerializedItem[];
    pcBuilds: PCBuild[];
    customers: Customer[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (productId: string, updatedData: Omit<Product, 'id'>) => void;
    deleteProduct: (productId: string) => void;
    addSerialNumber: (productId: string, serialNumber: string) => void;
    updateSerialNumber: (serialId: string, newSerialNumber: string) => void;
    deleteSerialNumber: (serialId: string) => void;
    buildPC: (name: string, newPcSerialNumber: string, components: { productId: string; serialId?: string }[], customerId?: string) => void;
    addCustomer: (customer: Omit<Customer, 'id'>) => void;
    updateCustomer: (customerId: string, updatedData: Omit<Customer, 'id'>) => void;
    deleteCustomer: (customerId: string) => void;
    toasts: ToastMessage[];
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    removeToast: (id: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // State is now in-memory only, preparing for a backend integration.
    // TODO: Fetch initial state from the API.
    const [products, setProducts] = useState<Product[]>([]);
    const [serializedItems, setSerializedItems] = useState<SerializedItem[]>([]);
    const [pcBuilds, setPcBuilds] = useState<PCBuild[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        // TODO: API call to add product, then update state with response.
        setProducts(prev => {
            const newProduct = { ...productData, id: `prod-${Date.now()}` };
            addToast(`Produkt "${productData.name}" tilføjet.`, "success");
            return [...prev, newProduct];
        });
    };

    const updateProduct = (productId: string, updatedData: Omit<Product, 'id'>) => {
        // TODO: API call to update product.
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                 const updatedProduct = { ...p, ...updatedData };
                 if(updatedProduct.isSerialized && !p.isSerialized) {
                     updatedProduct.quantity = 0;
                 }
                 addToast(`Produkt "${updatedProduct.name}" opdateret.`, "success");
                 return updatedProduct;
            }
            return p;
        }));
    };
    
    const deleteProduct = (productId: string) => {
        // TODO: API call to delete product.
        const productToDelete = products.find(p => p.id === productId);
        if (!productToDelete) {
            window.alert("Problem: Produktet kunne ikke findes. Fjernelse mislykkedes.");
            return;
        }

        const associatedSerialIds = serializedItems
            .filter(s => s.productId === productId)
            .map(s => s.id);

        setProducts(prev => prev.filter(p => p.id !== productId));
        setSerializedItems(prev => prev.filter(s => s.productId !== productId));
        setPcBuilds(prev => prev.map(build => {
            const newComponentIds = build.componentIds.filter(id => id !== productId && !associatedSerialIds.includes(id));
            return { ...build, componentIds: newComponentIds };
        }));

        window.alert(`Produkt "${productToDelete.name}" er fjernet.`);
    };


    const addSerialNumber = (productId: string, serialNumber: string) => {
        // TODO: API call to add serial number.
        const product = products.find(p => p.id === productId);
        if (!product || !product.isSerialized) {
            addToast("Kan ikke tilføje serienummer til dette produkt.", "error");
            return;
        };

        const existingSerial = serializedItems.find(s => s.serialNumber === serialNumber);
        if(existingSerial) {
             addToast("Dette serienummer eksisterer allerede.", "error");
             return;
        }
        
        const newSerial: SerializedItem = {
            id: `ser-${Date.now()}`,
            productId,
            serialNumber,
            status: 'In Stock'
        };
        
        setSerializedItems(prev => [...prev, newSerial]);
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: p.quantity + 1 } : p));
        addToast(`Serienummer tilføjet til "${product.name}".`, "success");
    };

    const updateSerialNumber = (serialId: string, newSerialNumber: string) => {
        // TODO: API call to update serial number.
        const serialToUpdate = serializedItems.find(s => s.id === serialId);
        if (!serialToUpdate) {
            addToast("Serienummer ikke fundet.", "error");
            return;
        }

        if (serialToUpdate.status !== 'In Stock') {
            addToast("Kan kun redigere serienumre med status 'På Lager'.", "error");
            return;
        }
        
        const existingSerial = serializedItems.find(s => s.serialNumber.toLowerCase() === newSerialNumber.toLowerCase() && s.id !== serialId);
        if (existingSerial) {
            addToast("Dette serienummer eksisterer allerede.", "error");
            return;
        }
        
        setSerializedItems(prev => prev.map(s => 
            s.id === serialId ? { ...s, serialNumber: newSerialNumber } : s
        ));
        addToast(`Serienummer opdateret til "${newSerialNumber}".`, "success");
    };

    const deleteSerialNumber = (serialId: string) => {
        // TODO: API call to delete serial number.
        const serialToDelete = serializedItems.find(s => s.id === serialId);
        if (!serialToDelete) {
            window.alert("Problem: Serienummeret kunne ikke findes. Fjernelse mislykkedes.");
            return;
        }

        setSerializedItems(prev => prev.filter(s => s.id !== serialId));
        setProducts(prev => prev.map(p => 
            p.id === serialToDelete.productId ? { ...p, quantity: Math.max(0, p.quantity - 1) } : p
        ));
        setPcBuilds(prev => prev.map(build => ({
            ...build,
            componentIds: build.componentIds.filter(id => id !== serialId)
        })));
        
        window.alert(`Serienummer "${serialToDelete.serialNumber}" er fjernet.`);
    };

    const buildPC = (name: string, newPcSerialNumber: string, components: { productId: string; serialId?: string }[], customerId?: string) => {
        // TODO: API call to build PC.
        const newStates = {
            products: [...products],
            serials: [...serializedItems],
            builds: [...pcBuilds],
        };

        let componentIdsForBuild: string[] = [];
        let totalPcPrice = 0;
        
        components.forEach(comp => {
            const componentProduct = products.find(p => p.id === comp.productId);
            if (componentProduct) {
                totalPcPrice += componentProduct.price;
            }

            if (comp.serialId) {
                // Handle serialized item
                const serialIndex = newStates.serials.findIndex(s => s.id === comp.serialId);
                if (serialIndex > -1) {
                    newStates.serials[serialIndex] = { ...newStates.serials[serialIndex], status: 'Used in Build' };
                    componentIdsForBuild.push(comp.serialId);
                }
            } else {
                // Handle non-serialized item
                const productIndex = newStates.products.findIndex(p => p.id === comp.productId);
                if (productIndex > -1) {
                    newStates.products[productIndex] = { ...newStates.products[productIndex], quantity: newStates.products[productIndex].quantity - 1 };
                    componentIdsForBuild.push(comp.productId);
                }
            }
        });

        const newPcProduct: Product = {
            id: `prod-pc-${Date.now()}`,
            name: name,
            category: 'Custom PC',
            price: totalPcPrice,
            quantity: 1,
            isSerialized: true,
            sku: `CUSTOM-PC-${newPcSerialNumber.slice(-4)}`
        };
        newStates.products.push(newPcProduct);

        const newPcSerial: SerializedItem = {
            id: `ser-pc-${Date.now()}`,
            productId: newPcProduct.id,
            serialNumber: newPcSerialNumber,
            status: 'In Stock'
        };
        newStates.serials.push(newPcSerial);
        
        const newBuild: PCBuild = {
            id: `build-${Date.now()}`,
            pcProductId: newPcProduct.id,
            name: name,
            serialNumber: newPcSerialNumber,
            componentIds: componentIdsForBuild,
            customerId: customerId,
        };
        newStates.builds.push(newBuild);
        
        setProducts(newStates.products);
        setSerializedItems(newStates.serials);
        setPcBuilds(newStates.builds);
    };

    const addCustomer = (customerData: Omit<Customer, 'id'>) => {
        // TODO: API call to add customer.
        setCustomers(prev => {
            const newCustomer = { ...customerData, id: `cust-${Date.now()}` };
            addToast(`Kunde "${customerData.name}" tilføjet.`, "success");
            return [...prev, newCustomer];
        });
    };

    const updateCustomer = (customerId: string, updatedData: Omit<Customer, 'id'>) => {
        // TODO: API call to update customer.
        setCustomers(prev => prev.map(c => {
            if (c.id === customerId) {
                const updatedCustomer = { ...c, ...updatedData };
                addToast(`Kunde "${updatedCustomer.name}" opdateret.`, "success");
                return updatedCustomer;
            }
            return c;
        }));
    };

    const deleteCustomer = (customerId: string) => {
        // TODO: API call to delete customer.
        const customerToDelete = customers.find(c => c.id === customerId);
        if (!customerToDelete) {
             window.alert("Problem: Kunden kunne ikke findes. Fjernelse mislykkedes.");
             return;
        }
        
        setCustomers(prev => prev.filter(c => c.id !== customerId));
        // Optional: Un-assign from PC builds
        setPcBuilds(prev => prev.map(build => build.customerId === customerId ? { ...build, customerId: undefined } : build));
        window.alert(`Kunde "${customerToDelete.name}" er fjernet.`);
    };


    const providerValue = {
        products,
        serializedItems,
        pcBuilds,
        customers,
        addProduct,
        updateProduct,
        deleteProduct,
        addSerialNumber,
        updateSerialNumber,
        deleteSerialNumber,
        buildPC,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toasts,
        addToast,
        removeToast,
    };

    return React.createElement(InventoryContext.Provider, { value: providerValue }, children);
};

export const useInventory = (): InventoryContextType => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};
