import { useQuery } from "@tanstack/react-query";
import { getSources } from "../api/source.api";


// Query Keys
export const sourceQueryKeys = {
    all: ["sources"] as const,
    lists: () => [...sourceQueryKeys.all, "list"] as const,
    list: () => [...sourceQueryKeys.lists()] as const
} as const;


// Hook: Fetch All Sources
export const useSources = () => {
    return useQuery({
        queryKey: sourceQueryKeys.list(),
        queryFn: () => getSources(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}