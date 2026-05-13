import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Capture } from "../types/Capture";


// Define the state interface
interface CaptureState {
    selectedCapture: Capture | null;
    viewMode: 'list' | 'grid' | 'card';
    sortBy: 'date' | 'title' | 'bookmarked';
    filters: {
        showBookmarkedOnly: boolean;
        showUnreadOnly: boolean;
    }
}

// Define the actions interface
interface CaptureActions {
    setSelectedCapture: (capture: Capture | null) => void;
    clearSelectedCapture: () => void;
    getSelectedCaptureId: () => string | null;
    isCaptureSelected: (captureId: string) => boolean;
    toggleViewMode: () => void;
    resetFilters: () => void;
}


// Combine the state and actions interfaces
type CaptureStore = CaptureState & CaptureActions;


// Create the store
export const useCaptureStore = create<CaptureStore>()(
    persist(
        (set, get) => ({
            // Initial state
            selectedCapture: null,
            viewMode: 'list',
            sortBy: 'date',
            filters: {
                showBookmarkedOnly: false,
                showUnreadOnly: false,
            },

            // Actions
            setSelectedCapture: (capture) => set({ selectedCapture: capture }),
            clearSelectedCapture: () => set({ selectedCapture: null }),
            getSelectedCaptureId: () => get().selectedCapture?._id || null,
            isCaptureSelected: (captureId) => get().selectedCapture?._id === captureId,
            toggleViewMode: () => {
                const state = get();
                const modes = ['list', 'grid', 'card'] as const;
                const currentIndex = modes.indexOf(state.viewMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                set({ viewMode: modes[nextIndex] });
            },
            resetFilters: () => set({ filters: { showBookmarkedOnly: false, showUnreadOnly: false } }),
        }), {
        name: 'capture-store',
        partialize: (state) => ({
            // Only persist the selected capture, not temporary state
            selectedCapture: state.selectedCapture,
            viewMode: state.viewMode,
            sortBy: state.sortBy,
            filters: state.filters,
        }),
    }),
);