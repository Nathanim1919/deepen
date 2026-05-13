import { api, apiCall, handleApiError, type ApiResponse } from ".";

// Enhanced feedback types
export interface Feedback {
  id: string;
  feedback: string;
  name?: string;
  profession?: string;
  email?: string;
  rating?: number;
  category?: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedbackDto {
  feedback: string;
  name?: string;
  profession?: string;
  email?: string;
  rating?: number;
  category?: FeedbackCategory;
}

export interface UpdateFeedbackDto {
  feedback?: string;
  name?: string;
  profession?: string;
  email?: string;
  rating?: number;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
}

export interface FeedbackFilters {
  search?: string;
  category?: FeedbackCategory;
  status?: FeedbackStatus;
  rating?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  categoryBreakdown: Record<FeedbackCategory, number>;
  statusBreakdown: Record<FeedbackStatus, number>;
  recentFeedbacks: Feedback[];
}

export type FeedbackCategory = 
  | "general" 
  | "bug" 
  | "feature_request" 
  | "ui_ux" 
  | "performance" 
  | "other";

export type FeedbackStatus = 
  | "pending" 
  | "in_review" 
  | "acknowledged" 
  | "resolved" 
  | "closed";

// Enhanced Feedback Service
export const FeedbackService = {
  /**
   * Submit feedback
   * @param data - Feedback data
   * @returns Promise<Feedback> Created feedback
   */
  async submit(data: CreateFeedbackDto): Promise<Feedback> {
    return apiCall(
      () => api.post<ApiResponse<Feedback>>("/feedback", data),
      "Failed to submit feedback"
    ).then(response => response.data);
  },

  /**
   * Get all feedbacks with optional filtering
   * @param filters - Optional filters
   * @returns Promise<Feedback[]> Array of feedbacks
   */
  async getAll(filters?: FeedbackFilters): Promise<Feedback[]> {
    return apiCall(
      () => {
        const params = this.buildQueryParams(filters);
        return api.get<ApiResponse<Feedback[]>>("/feedback", { params });
      },
      "Failed to fetch feedbacks"
    ).then(response => response.data);
  },

  /**
   * Get feedback by ID
   * @param id - Feedback ID
   * @returns Promise<Feedback> Feedback object
   */
  async getById(id: string): Promise<Feedback> {
    return apiCall(
      () => api.get<ApiResponse<Feedback>>(`/feedback/${id}`),
      "Failed to fetch feedback"
    ).then(response => response.data);
  },

  /**
   * Update feedback
   * @param id - Feedback ID
   * @param data - Update data
   * @returns Promise<Feedback> Updated feedback
   */
  async update(id: string, data: UpdateFeedbackDto): Promise<Feedback> {
    return apiCall(
      () => api.put<ApiResponse<Feedback>>(`/feedback/${id}`, data),
      "Failed to update feedback"
    ).then(response => response.data);
  },

  /**
   * Delete feedback
   * @param id - Feedback ID
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    return apiCall(
      () => api.delete<ApiResponse<null>>(`/feedback/${id}`),
      "Failed to delete feedback"
    ).then(() => {});
  },

  /**
   * Get feedback statistics
   * @returns Promise<FeedbackStats> Feedback statistics
   */
  async getStats(): Promise<FeedbackStats> {
    return apiCall(
      () => api.get<ApiResponse<FeedbackStats>>("/feedback/stats"),
      "Failed to fetch feedback statistics"
    ).then(response => response.data);
  },

  /**
   * Search feedbacks
   * @param query - Search query
   * @param filters - Additional filters
   * @returns Promise<Feedback[]> Array of matching feedbacks
   */
  async search(query: string, filters?: Omit<FeedbackFilters, 'search'>): Promise<Feedback[]> {
    return apiCall(
      () => {
        const params = { query, ...this.buildQueryParams(filters) };
        return api.get<ApiResponse<Feedback[]>>("/feedback/search", { params });
      },
      "Failed to search feedbacks"
    ).then(response => response.data);
  },

  /**
   * Get feedbacks by category
   * @param category - Feedback category
   * @param limit - Number of feedbacks to return
   * @param offset - Number of feedbacks to skip
   * @returns Promise<Feedback[]> Array of feedbacks
   */
  async getByCategory(
    category: FeedbackCategory,
    limit?: number,
    offset?: number
  ): Promise<Feedback[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Feedback[]>>(`/feedback/category/${category}`, { params });
      },
      "Failed to fetch feedbacks by category"
    ).then(response => response.data);
  },

  /**
   * Get feedbacks by status
   * @param status - Feedback status
   * @param limit - Number of feedbacks to return
   * @param offset - Number of feedbacks to skip
   * @returns Promise<Feedback[]> Array of feedbacks
   */
  async getByStatus(
    status: FeedbackStatus,
    limit?: number,
    offset?: number
  ): Promise<Feedback[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Feedback[]>>(`/feedback/status/${status}`, { params });
      },
      "Failed to fetch feedbacks by status"
    ).then(response => response.data);
  },

  /**
   * Export feedbacks
   * @param format - Export format
   * @param filters - Optional filters
   * @returns Promise<string> Export data URL
   */
  async export(format: "json" | "csv" = "json", filters?: FeedbackFilters): Promise<string> {
    return apiCall(
      () => {
        const params = { format, ...this.buildQueryParams(filters) };
        return api.get<ApiResponse<{ downloadUrl: string }>>("/feedback/export", { params });
      },
      "Failed to export feedbacks"
    ).then(response => response.data.downloadUrl);
  },

  // Private helper methods
  buildQueryParams(filters?: FeedbackFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.rating !== undefined) params.rating = filters.rating;
    if (filters?.dateRange) {
      params.startDate = filters.dateRange.start.toISOString();
      params.endDate = filters.dateRange.end.toISOString();
    }
    if (filters?.limit !== undefined) params.limit = filters.limit;
    if (filters?.offset !== undefined) params.offset = filters.offset;
    
    return params;
  },
};

// Legacy functions for backward compatibility
export const submitFeedback = async (feedbackData: {
  feedback: string;
  name?: string;
  profession?: string;
}): Promise<Feedback> => {
  return FeedbackService.submit(feedbackData);
};

export const getFeedbacks = async (): Promise<string> => {
  try {
    const feedbacks = await FeedbackService.getAll();
    return JSON.stringify(feedbacks);
  } catch (error) {
    const apiError = handleApiError(error, "Failed to fetch feedbacks");
    throw new Error(apiError.message);
  }
};
