import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CaptureService } from "../api/capture.api";
import { toast } from "sonner";
import { PROCESSING_STATUS, type Capture } from "../types/Capture";

// Query Keys - Critical for caching and invalidation
export const captureQueryKeys = {
  all: ["captures"] as const,
  lists: () => [...captureQueryKeys.all, "list"] as const,
  list: (filter: string, id?: string) =>
    [...captureQueryKeys.lists(), filter, id] as const,
  details: () => [...captureQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...captureQueryKeys.details(), id] as const,
} as const;

// Main Hook: Fetch Captures
export const useCaptures = (
  filter: "all" | "bookmarks" | "folder" | "source",
  id?: string
) => {
  return useQuery({
    queryKey: captureQueryKeys.list(filter, id),
    queryFn: () =>
      CaptureService.getCapturesBasedOnFilter({ type: filter, id }),
    staleTime: 5 * 60 * 1000, // 5 minutes - cache for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
  });
};

// Hook: Get Single Capture
export const useCapture = (captureId: string) => {
  return useQuery({
    queryKey: captureQueryKeys.detail(captureId),
    queryFn: () => CaptureService.getById(captureId),
    enabled: !!captureId,
    staleTime: 5 * 60 * 1000, // 5 minutes - cache for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    refetchInterval: (query) => {
      const status = query.state.data?.processingStatus;
      if (status === "PENDING" || status === "PROCESSING") {
        return 5000; // Poll every 5s while processing
      }
      return false;
    },
  });
};

// Hook: Delete Capture
export const useDeleteCapture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CaptureService.deleteCapture,
    onSuccess: (_, captureId) => {
      // Invalidate and refetch captures lists
      queryClient.invalidateQueries({ queryKey: captureQueryKeys.lists() });

      // Remove from cache
      queryClient.removeQueries({
        queryKey: captureQueryKeys.detail(captureId),
      });

      toast.success("Capture deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete capture");
      console.error("Failed to delete capture", error);
    },
  });
};

// Hook: Generate Summary
export const useGenerateSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CaptureService.generateSummary,
    onSuccess: (result, captureId) => {
      // Update the capture in cache with new summary
      queryClient.setQueryData(
        captureQueryKeys.detail(captureId),
        (oldData: Capture) => ({
          ...oldData,
          ai: {
            ...oldData.ai,
            summary: result.summary,
          },
        })
      );

      // Invalidate lists to refresh the summary
      queryClient.invalidateQueries({ queryKey: captureQueryKeys.lists() });

      toast.success("Summary generated successfully");
    },
    onError: (error) => {
      toast.error("Failed to generate summary");
      console.error("Failed to generate summary", error);
    },
  });
};

// Hook: Toggle Bookmark
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CaptureService.toggleBookmark,
    onSuccess: (updatedCapture, captureId) => {
      // Update the specific capture in cache
      queryClient.setQueryData(
        captureQueryKeys.detail(captureId),
        updatedCapture
      );

      // Invalidate lists to refresh the bookmark status
      queryClient.invalidateQueries({ queryKey: captureQueryKeys.lists() });

      toast.success("Bookmark status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update bookmark status");
      console.error("Failed to update bookmark status", error);
    },
  });
};
