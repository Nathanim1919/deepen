import { useCallback } from "react";
import { useCaptureStore } from "../stores/capture-store";
import {
    useCaptures,
    useCapture,
    useDeleteCapture,
    useGenerateSummary,
    useToggleBookmark,
} from "./useCaptures";


// Combined Hook: Main Capture manager
export const useCaptureManager = (filter: 'all' | 'bookmarks' | 'folder' | 'source', id?: string) => {
    // Zustand store for client state
    const captureStore = useCaptureStore();

    // React Query for server state
    const capturesQuery = useCaptures(filter, id);


    // Mutations
    const deleteMutation = useDeleteCapture();
    const summaryMutation = useGenerateSummary();
    const bookmarkMutation = useToggleBookmark();



    // Combined actions that coordinate both stores
    const deleteCapture = async (captureId: string) => {
        await deleteMutation.mutateAsync(captureId);

        // Update client state if needed
        if (captureStore.selectedCapture?._id === captureId) {
            captureStore.clearSelectedCapture();
        }
    };


    const toggleBookmark = async (captureId: string) => {
        await bookmarkMutation.mutateAsync(captureId);

        // Update client state if needed
        if (captureStore.selectedCapture?._id === captureId) {
            const updatedCapture = bookmarkMutation.data;
            if (updatedCapture) {
                captureStore.setSelectedCapture(updatedCapture);
            }
        }
    };


    const generateSummary = async (captureId: string) => {
        const result = await summaryMutation.mutateAsync(captureId);

        // Update client state if needed
        if (captureStore.selectedCapture?._id === captureId && result.summary) {
            captureStore.setSelectedCapture({
                ...captureStore.selectedCapture,
                ai: {
                    ...captureStore.selectedCapture.ai,
                    summary: result.summary,
                    tags: result.tags || [],
                },
            });
        }

        return result.summary;
    };


    return {
        // Server state (from React Query)
        captures: capturesQuery.data || [],
        loading: capturesQuery.isLoading,
        error: capturesQuery.error,
        refetch: capturesQuery.refetch,

        // Client state (from Zustand)
        selectedCapture: captureStore.selectedCapture,
        setSelectedCapture: captureStore.setSelectedCapture,
        clearSelectedCapture: captureStore.clearSelectedCapture,
        getSelectedCaptureId: captureStore.getSelectedCaptureId,
        isCaptureSelected: captureStore.isCaptureSelected,

        // UI preferences (from Zustand)
        viewMode: captureStore.viewMode,
        toggleViewMode: captureStore.toggleViewMode,
        resetFilters: captureStore.resetFilters,
        sortBy: captureStore.sortBy,
        filters: captureStore.filters,

        // Combined Actions
        deleteCapture,
        toggleBookmark,
        generateSummary,


        // Mutation states
        isDeleting: deleteMutation.isPending,
        isBookmarking: bookmarkMutation.isPending,
        isGeneratingSummary: summaryMutation.isPending,
    }

}



// Combined Hook: Single Capture Manager
export const useCaptureDetail = (captureId: string) => {
    const captureStore = useCaptureStore();
    const captureQuery = useCapture(captureId);

    const deleteMutation = useDeleteCapture();
    const bookmarkMutation = useToggleBookmark();
    const summaryMutation = useGenerateSummary();

    // Combined actions
    const deleteCapture = async () => {
        await deleteMutation.mutateAsync(captureId);
        captureStore.clearSelectedCapture();
    };

    const toggleBookmark = async () => {
        await bookmarkMutation.mutateAsync(captureId);

        // Update client state
        const updatedCapture = bookmarkMutation.data;
        if (updatedCapture) {
            captureStore.setSelectedCapture(updatedCapture);
        }
    };

    const generateSummary = async () => {
        const result = await summaryMutation.mutateAsync(captureId);

        // Update client state
        if (result.summary && captureStore.selectedCapture) {
            captureStore.setSelectedCapture({
                ...captureStore.selectedCapture,
                ai: {
                    ...captureStore.selectedCapture.ai,
                    summary: result.summary,
                    tags: result.tags || [],
                },
            });
        }

        return result.summary;
    };

    return {
        // Server state
        capture: captureQuery.data,
        isLoading: captureQuery.isLoading,
        error: captureQuery.error,
        refetch: captureQuery.refetch,

        // Client state
        isSelected: captureStore.isCaptureSelected(captureId),
        setAsSelected: useCallback(() => {
            captureStore.setSelectedCapture(captureQuery.data || null);
        }, [captureQuery.data, captureStore]),

        // Actions
        deleteCapture,
        toggleBookmark,
        generateSummary,

        // Mutation states
        isDeleting: deleteMutation.isPending,
        isBookmarking: bookmarkMutation.isPending,
        isGeneratingSummary: summaryMutation.isPending,
    };
};