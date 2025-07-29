import React, { createContext, useContext, useState, useCallback } from "react";
import { CaptureService } from "../api/capture.api";
import { type Capture } from "../types/Capture";
import { toast } from "sonner";

type FilterType = "all" | "bookmarks" | "folder" | "source";

interface CaptureContextType {
  captures: Capture[];
  selectedCapture: Capture | null;
  setSelectedCapture: (capture: Capture | null) => void;
  fetchCaptures: (filter: FilterType, id?: string | null) => Promise<void>;
  bookmarkCapture: (captureId: string) => Promise<void>;
  reProcessCapture: (captureId: string) => Promise<void>;
  getCapture: (captureId: string) => Promise<void>;
  deleteCapture: (captureId: string) => Promise<void>;
  generateCaptureSummary: (captureId: string) => Promise<string>;
  loadingSummary: boolean;
  setLoadingSummary: (loading: boolean) => void;
  loading: boolean;
  error: Error | null;
  clearError: () => void;
}

const CaptureContext = createContext<CaptureContextType | undefined>(undefined);

export const CaptureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [selectedCapture, setSelectedCapture] = useState<Capture | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getCapture = useCallback(async (captureId: string): Promise<void> => {
    try {
      setLoading(true);
      const capture = await CaptureService.getById(captureId);
      setSelectedCapture(capture);
    } catch (error) {
      setError(error as Error);
      toast.error("Failed to fetch capture details");
    } finally {
      setLoading(false);
    }
  }, []);

  const reProcessCapture = useCallback(
    async (captureId: string): Promise<void> => {
      try {
        setLoading(true);
        const reprocessedResponse = await CaptureService.reProcessCapture(
          captureId
        );
        toast.success(
          reprocessedResponse.message || "Capture re-processing initiated."
        );
        // set selectedCapture to the reprocessed capture
        if (reprocessedResponse.data) {
          setSelectedCapture(reprocessedResponse.data);
        }
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to re-process capture");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCapture = useCallback(
    async (captureId: string): Promise<void> => {
      try {
        setLoading(true);
        await CaptureService.deleteCapture(captureId);
        setCaptures((prev) =>
          prev.filter((capture) => capture._id !== captureId)
        );
        if (selectedCapture?._id === captureId) {
          setSelectedCapture(null);
        }
        toast.success("Capture deleted successfully");
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to delete capture");
      } finally {
        setLoading(false);
      }
    },
    [selectedCapture?._id]
  );

  const fetchCaptures = useCallback(
    async (filter: FilterType, id: string | null = null): Promise<void> => {
      try {
        setLoading(true);
        const response = await CaptureService.getCapturesBasedOnFilter(
          filter,
          id
        );

        const formattedCaptures = response.map((capture: Capture) => ({
          ...capture,
          title: capture.title || "Untitled",
        }));

        setCaptures(formattedCaptures);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch captures");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateCaptureSummary = useCallback(
    async (captureId: string): Promise<string> => {
      try {
        setLoadingSummary(true);
        const result = await CaptureService.generateSummary(captureId || "");

        if (!result.success || !result.summary) {
          throw new Error(result.error?.message || "No summary generated");
        }

        // Update both captures array and selected capture
        const updatedSummary = result.summary;
        setCaptures((prev) =>
          prev.map((capture) =>
            capture._id === captureId
              ? {
                  ...capture,
                  ai: {
                    ...capture.ai,
                    summary: updatedSummary,
                  },
                }
              : capture
          )
        );

        setSelectedCapture((prev) =>
          prev?._id === captureId
            ? {
                ...prev,
                ai: {
                  ...prev.ai,
                  summary: updatedSummary,
                },
              }
            : prev
        );

        return updatedSummary;
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to generate summary");
        throw error;
      } finally {
        setLoadingSummary(false);
      }
    },
    []
  );

  const bookmarkCapture = useCallback(
    async (captureId: string) => {
      try {
        // Optimistic update
        setCaptures((prev) =>
          prev.map((capture) =>
            capture._id === captureId
              ? { ...capture, bookmarked: !capture.bookmarked }
              : capture
          )
        );

        setSelectedCapture((prev) =>
          prev?._id === captureId
            ? { ...prev, bookmarked: !prev.bookmarked }
            : prev
        );

        await CaptureService.toggleBookmark(captureId);
        toast.success(
          `Capture ${
            selectedCapture?.bookmarked ? "unbookmarked" : "bookmarked"
          }`
        );
      } catch (error) {
        // Revert on error
        setCaptures((prev) =>
          prev.map((capture) =>
            capture._id === captureId
              ? { ...capture, bookmarked: !capture.bookmarked }
              : capture
          )
        );

        setSelectedCapture((prev) =>
          prev?._id === captureId
            ? { ...prev, bookmarked: !prev.bookmarked }
            : prev
        );

        setError(error as Error);
        toast.error("Failed to update bookmark status");
      }
    },
    [selectedCapture?.bookmarked]
  );

  const contextValue: CaptureContextType = {
    captures,
    selectedCapture,
    setSelectedCapture,
    setLoadingSummary,
    loadingSummary,
    fetchCaptures,
    bookmarkCapture,
    deleteCapture,
    getCapture,
    reProcessCapture,
    generateCaptureSummary,
    loading,
    error,
    clearError,
  };

  return (
    <CaptureContext.Provider value={contextValue}>
      {children}
    </CaptureContext.Provider>
  );
};

export const useCaptureContext = (): CaptureContextType => {
  const context = useContext(CaptureContext);
  if (!context) {
    throw new Error("useCaptureContext must be used within a CaptureProvider");
  }
  return context;
};
