import { useSourceStore } from "../stores/source-store";
import { useSources } from "./useSources";

export const useSourceManager = () => {
  const sourceStore = useSourceStore();
  const sourcesQuery = useSources();

  return {
    // Server state (from React Query)
    sources: sourcesQuery.data?.siteNames || [],
    siteNameCounts: sourcesQuery.data?.siteNameCounts || {},
    loading: sourcesQuery.isLoading,
    error: sourcesQuery.error,
    refetch: sourcesQuery.refetch,

    // Client state (from Zustand)
    selectedSource: sourceStore.selectedSource,
    setSelectedSource: sourceStore.setSelectedSource,
  };
};