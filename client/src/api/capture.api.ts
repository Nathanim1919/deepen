import { api, apiCall, handleApiError, type ApiResponse, type ApiError } from ".";
import type { Capture } from "../types/Capture";

// Enhanced filter types with better type safety
export type CaptureFilter = "all" | "bookmarks" | "folder" | "source";

export interface CaptureFilters {
  type: CaptureFilter;
  id?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateCaptureDto {
  url: string;
  title: string;
  description?: string;
  folderId?: string;
  tags?: string[];
}

export interface UpdateCaptureDto {
  title?: string;
  description?: string;
  folderId?: string;
  tags?: string[];
}

export interface CaptureSearchParams {
  query: string;
  filters?: {
    folderId?: string;
    sourceId?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  limit?: number;
  offset?: number;
}

export const CaptureService = {
  /**
   * Get captures based on filter with enhanced parameters
   * @param filters - Filter configuration
   * @returns Promise<Capture[]> Array of captures
   */
  async getCapturesBasedOnFilter(filters: CaptureFilters): Promise<Capture[]> {
    return apiCall(
      () => {
        const endpoint = this.buildFilterEndpoint(filters.type, filters.id);
        const params = this.buildQueryParams(filters);
        return api.get<ApiResponse<Capture[]>>(endpoint, { params });
      },
      "Failed to fetch captures"
    ).then(response => response.data);
  },

  /**
   * Get all captures with optional pagination
   * @param limit - Number of captures to return
   * @param offset - Number of captures to skip
   * @returns Promise<Capture[]> Array of captures
   */
  async getAllCaptures(limit?: number, offset?: number): Promise<Capture[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Capture[]>>("/captures", { params });
      },
      "Failed to fetch all captures"
    ).then(response => response.data);
  },

  /**
   * Get capture by ID
   * @param captureId - Capture ID
   * @returns Promise<Capture> Capture object
   */
  async getById(captureId: string): Promise<Capture> {
    return apiCall(
      () => api.get<ApiResponse<Capture>>(`/captures/${captureId}`),
      "Failed to fetch capture"
    ).then(response => response.data);
  },

  /**
   * Create a new capture
   * @param data - Capture data
   * @returns Promise<Capture> Created capture
   */
  async create(data: CreateCaptureDto): Promise<Capture> {
    return apiCall(
      () => api.post<ApiResponse<Capture>>("/captures", data),
      "Failed to create capture"
    ).then(response => response.data);
  },

  /**
   * Update an existing capture
   * @param captureId - Capture ID
   * @param data - Update data
   * @returns Promise<Capture> Updated capture
   */
  async update(captureId: string, data: UpdateCaptureDto): Promise<Capture> {
    return apiCall(
      () => api.put<ApiResponse<Capture>>(`/captures/${captureId}`, data),
      "Failed to update capture"
    ).then(response => response.data);
  },

  /**
   * Delete a capture
   * @param captureId - Capture ID
   * @returns Promise<void>
   */
  async deleteCapture(captureId: string): Promise<void> {
    await apiCall(
      () => api.delete<ApiResponse<null>>(`/captures/${captureId}`),
      "Failed to delete capture"
    );
  },

  /**
   * Toggle bookmark status for a capture
   * @param captureId - Capture ID
   * @returns Promise<Capture> Updated capture
   */
  async toggleBookmark(captureId: string): Promise<Capture> {
    return apiCall(
      () => api.patch<ApiResponse<Capture>>(`/captures/${captureId}/bookmark`),
      "Failed to toggle bookmark"
    ).then(response => response.data);
  },

  /**
   * Search captures with advanced parameters
   * @param params - Search parameters
   * @returns Promise<Capture[]> Array of matching captures
   */
  async search(params: CaptureSearchParams): Promise<Capture[]> {
    return apiCall(
      () => api.get<ApiResponse<Capture[]>>("/captures/search", { params }),
      "Search failed"
    ).then(response => response.data);
  },

  /**
   * Reprocess a capture
   * @param captureId - Capture ID
   * @returns Promise<Capture> Reprocessed capture
   */
  async reProcessCapture(captureId: string): Promise<Capture> {
    return apiCall(
      () => api.post<ApiResponse<Capture>>(`/captures/${captureId}/reprocess`),
      "Failed to reprocess capture"
    ).then(response => response.data);
  },

  /**
   * Generate AI summary for capture
   * @param captureId - Capture ID
   * @returns Promise<{success: boolean, summary?: string, error?: ApiError}>
   */
  async generateSummary(captureId: string): Promise<{
    success: boolean;
    summary?: string;
    tags?: string[];
    error?: ApiError;
  }> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { summary: string; tags?: string[]; captureId: string };
      }>("/ai/summary", { captureId });

      return {
        success: true,
        summary: response.data.data.summary,
        tags: response.data.data.tags,
      };
    } catch (error) {
      const apiError = handleApiError(error, "Summary generation failed");
      return {
        success: false,
        error: apiError,
      };
    }
  },

  /**
   * Get captures by folder ID
   * @param folderId - Folder ID
   * @param limit - Number of captures to return
   * @param offset - Number of captures to skip
   * @returns Promise<Capture[]> Array of captures
   */
  async getCapturesByFolder(folderId: string, limit?: number, offset?: number): Promise<Capture[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Capture[]>>(`/folders/${folderId}/captures`, { params });
      },
      "Failed to fetch folder captures"
    ).then(response => response.data);
  },

  /**
   * Get captures by source ID
   * @param sourceId - Source ID
   * @param limit - Number of captures to return
   * @param offset - Number of captures to skip
   * @returns Promise<Capture[]> Array of captures
   */
  async getCapturesBySource(sourceId: string, limit?: number, offset?: number): Promise<Capture[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Capture[]>>(`/sources/${sourceId}/captures`, { params });
      },
      "Failed to fetch source captures"
    ).then(response => response.data);
  },

  /**
   * Get bookmarked captures
   * @param limit - Number of captures to return
   * @param offset - Number of captures to skip
   * @returns Promise<Capture[]> Array of bookmarked captures
   */
  async getBookmarkedCaptures(limit?: number, offset?: number): Promise<Capture[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Capture[]>>("/captures/bookmarked", { params });
      },
      "Failed to fetch bookmarked captures"
    ).then(response => response.data);
  },

  // Private helper methods
  buildFilterEndpoint(filter: CaptureFilter, id?: string): string {
    switch (filter) {
      case "bookmarks":
        return "/captures/bookmarked";
      case "folder":
        if (!id) throw new Error("Folder ID is required for folder filter");
        return `/folders/${id}/captures`;
      case "source":
        if (!id) throw new Error("Source ID is required for source filter");
        return `/sources/${id}/captures`;
      default:
        return "/captures";
    }
  },

  buildQueryParams(filters: CaptureFilters): Record<string, any> {
    const params: Record<string, any> = {};

    if (filters.limit !== undefined) params.limit = filters.limit;
    if (filters.offset !== undefined) params.offset = filters.offset;
    if (filters.search) params.search = filters.search;

    return params;
  },
};
