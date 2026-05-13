import { create } from "zustand";
import { persist } from "zustand/middleware";


interface SourceState {
    selectedSource: string | null;
}

interface SourceActions {
    setSelectedSource: (source: string) => void;
}

type SourceStore = SourceState & SourceActions;

export const useSourceStore = create<SourceStore>()(
    persist((set) => ({
        selectedSource: null,
        setSelectedSource: (source) => set({ selectedSource: source }),
    }), {
        name: "source-store",
        partialize: (state) => ({
            selectedSource: state.selectedSource,
        }),
    })
)