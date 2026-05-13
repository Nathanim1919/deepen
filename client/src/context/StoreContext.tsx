import { createContext, useContext } from "react";
import { useAppStore } from "../stores/app-store";
import { useUIStore } from "../stores/ui-store";

interface StoreContextType {
    ui: ReturnType<typeof useUIStore>;
    app: ReturnType<typeof useAppStore>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);


// Provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ui = useUIStore();
    const app = useAppStore();

    return (
        <StoreContext.Provider value={{ ui, app }}>
            {children}
        </StoreContext.Provider>
    )
}

// Hook to access the store context
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}