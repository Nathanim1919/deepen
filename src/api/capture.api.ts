import type { AxiosError } from "axios";
import { api } from ".";
import type { Capture } from "../types/Capture";

// Strongly typed filter
export type CaptureFilter = "all" | "bookmarks" | "folder" | "source";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

export const CaptureService = {
  /**
   * Get captures based on filter
   * @param {CaptureFilter} filter - Filter type
   * @param {string | null} id - Optional ID for folder/source filters
   * @returns {Promise<Capture[]>} Array of captures
   * @throws {ErrorResponse} If request fails
   */
  async getCapturesBasedOnFilter(
    filter: CaptureFilter,
    id: string | null = null
  ): Promise<Capture[]> {
    try {
      let endpoint = "/captures";

      switch (filter) {
        case "bookmarks":
          endpoint = "/captures/bookmarked";
          break;
        case "folder":
          if (!id) throw new Error("Folder ID is required");
          endpoint = `/folders/${id}/captures`;
          break;
        case "source":
          if (!id) throw new Error("Source ID is required");
          endpoint = `/sources/${id}/captures`;
          break;
      }

      const response = await api.get<ApiResponse<Capture[]>>(endpoint);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch captures");
    }
  },

  /**
   * Reprocess a capture
   * @param {string} captureId - Capture ID
   * @returns {Promise<Capture>} Reprocessed capture
   * @throws {ErrorResponse} If request fails
   */
  async reProcessCapture(captureId: string) {
    try {
      const response = await api.post<ApiResponse<Capture>>(
        `/captures/${captureId}/reprocess`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to reprocess capture");
    }
  },

  async deleteCapture(captureId: string): Promise<void> {
    try {
      await api.delete<ApiResponse<null>>(`/captures/${captureId}`);
    } catch (error) {
      throw this.handleError(error, "Failed to delete capture");
    }
  },

  /**
   * Toggle bookmark status for a capture
   * @param {string} captureId - Capture ID
   * @returns {Promise<Capture>} Updated capture
   * @throws {ErrorResponse} If request fails
   */
  async toggleBookmark(captureId: string): Promise<Capture> {
    try {
      const response = await api.patch<ApiResponse<Capture>>(
        `/captures/${captureId}/bookmark`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to toggle bookmark");
    }
  },

  /**
   * Search captures
   * @param {string} searchTerm - Search query
   * @returns {Promise<Capture[]>} Array of matching captures
   * @throws {ErrorResponse} If request fails
   */
  async search(searchTerm: string): Promise<Capture[]> {
    try {
      const response = await api.get<ApiResponse<Capture[]>>(
        `/captures/search`,
        { params: { query: searchTerm } }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Search failed");
    }
  },

  /**
   * Get capture by ID
   * @param {string} captureId - Capture ID
   * @returns {Promise<Capture | null>} Capture or null if not found
   */
  async getById(captureId: string): Promise<Capture | null> {
    try {
      const response = await api.get<ApiResponse<Capture>>(
        `/captures/${captureId}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch capture");
    }
  },

  /**
   * Generate AI summary for capture
   * @param {string} captureId - Capture ID
   * @returns {Promise<{success: boolean, data?: Capture, error?: ErrorResponse}>} Result object
   */
  async generateSummary(captureId: string): Promise<{
    success: boolean;
    summary?: string;
    error?: ErrorResponse;
  }> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { summary: string; captureId: string };
      }>("/ai/summary", { captureId });

      return {
        success: true,
        summary: response.data.data.summary,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: {
          message:
            (axiosError.response?.data as { message?: string })?.message ||
            axiosError.message ||
            "Summary generation failed",
          code: axiosError.code,
          details: axiosError.response?.data,
        },
      };
    }
  },

  /**
   * Handle API errors consistently
   * @private
   */
  handleError(error: unknown, defaultMessage: string): ErrorResponse {
    const axiosError = error as AxiosError;
    console.error("API Error:", {
      message: axiosError.message,
      code: axiosError.code,
      response: axiosError.response?.data,
    });

    return {
      message:
        (axiosError.response?.data as { message?: string })?.message ||
        defaultMessage,
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  },
};
