import { api, apiCall, handleApiError, type ApiResponse } from ".";

// Enhanced source types
export interface Source {
  id: string;
  name: string;
  url: string;
  domain: string;
  favicon?: string;
  description?: string;
  captureCount: number;
  lastCaptured?: Date;
  createdAt: Date;
}

export interface SourceStats {
  totalSources: number;
  totalCaptures: number;
  topSources: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentSources: Source[];
}

export interface SourceFilters {
  search?: string;
  domain?: string;
  minCaptures?: number;
  maxCaptures?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
}

// Enhanced Source Service
export const SourceService = {
  /**
   * Get all sources with optional filtering
   * @param filters - Optional filters
   * @returns Promise<Source[]> Array of sources
   */
  async getSources(filters?: SourceFilters): Promise<Source[]> {
    return apiCall(
      () => {
        const params = this.buildQueryParams(filters);
        return api.get<ApiResponse<Source[]>>("/sources", { params });
      },
      "Failed to fetch sources"
    ).then(response => response.data);
  },

  /**
   * Get source by ID
   * @param id - Source ID
   * @returns Promise<Source> Source object
   */
  async getSourceById(id: string): Promise<Source> {
    return apiCall(
      () => api.get<ApiResponse<Source>>(`/sources/${id}`),
      "Failed to fetch source"
    ).then(response => response.data);
  },

  /**
   * Get source statistics
   * @returns Promise<SourceStats> Source statistics
   */
  async getSourceStats(): Promise<SourceStats> {
    return apiCall(
      () => api.get<ApiResponse<SourceStats>>("/sources/stats"),
      "Failed to fetch source statistics"
    ).then(response => response.data);
  },

  /**
   * Get sources by domain
   * @param domain - Domain name
   * @param limit - Number of sources to return
   * @param offset - Number of sources to skip
   * @returns Promise<Source[]> Array of sources
   */
  async getSourcesByDomain(
    domain: string,
    limit?: number,
    offset?: number
  ): Promise<Source[]> {
    return apiCall(
      () => {
        const params = { limit, offset };
        return api.get<ApiResponse<Source[]>>(`/sources/domain/${domain}`, { params });
      },
      "Failed to fetch sources by domain"
    ).then(response => response.data);
  },

  /**
   * Search sources
   * @param query - Search query
   * @param filters - Additional filters
   * @returns Promise<Source[]> Array of matching sources
   */
  async searchSources(query: string, filters?: Omit<SourceFilters, 'search'>): Promise<Source[]> {
    return apiCall(
      () => {
        const params = { query, ...this.buildQueryParams(filters) };
        return api.get<ApiResponse<Source[]>>("/sources/search", { params });
      },
      "Failed to search sources"
    ).then(response => response.data);
  },

  /**
   * Get top sources by capture count
   * @param limit - Number of top sources to return
   * @returns Promise<Source[]> Array of top sources
   */
  async getTopSources(limit: number = 10): Promise<Source[]> {
    return apiCall(
      () => {
        const params = { limit };
        return api.get<ApiResponse<Source[]>>("/sources/top", { params });
      },
      "Failed to fetch top sources"
    ).then(response => response.data);
  },

  /**
   * Get recent sources
   * @param limit - Number of recent sources to return
   * @returns Promise<Source[]> Array of recent sources
   */
  async getRecentSources(limit: number = 10): Promise<Source[]> {
    return apiCall(
      () => {
        const params = { limit };
        return api.get<ApiResponse<Source[]>>("/sources/recent", { params });
      },
      "Failed to fetch recent sources"
    ).then(response => response.data);
  },

  /**
   * Delete a source and all its captures
   * @param id - Source ID
   * @returns Promise<void>
   */
  async deleteSource(id: string): Promise<void> {
    await apiCall(
      () => api.delete<ApiResponse<null>>(`/sources/${id}`),
      "Failed to delete source"
    );
  },

  /**
   * Update source information
   * @param id - Source ID
   * @param updates - Source updates
   * @returns Promise<Source> Updated source
   */
  async updateSource(id: string, updates: Partial<Source>): Promise<Source> {
    return apiCall(
      () => api.put<ApiResponse<Source>>(`/sources/${id}`, updates),
      "Failed to update source"
    ).then(response => response.data);
  },

  // Private helper methods
  buildQueryParams(filters?: SourceFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.domain) params.domain = filters.domain;
    if (filters?.minCaptures !== undefined) params.minCaptures = filters.minCaptures;
    if (filters?.maxCaptures !== undefined) params.maxCaptures = filters.maxCaptures;
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
export const getSources = async (): Promise<{
  siteNames: string[];
  siteNameCounts?: Record<string, number>;
}> => {
  try {
    const sources = await SourceService.getSources();
    
    // Transform to legacy format
    const siteNames = sources.map(source => source.name);
    const siteNameCounts = sources.reduce((acc, source) => {
      acc[source.name] = source.captureCount;
      return acc;
    }, {} as Record<string, number>);

    return { siteNames, siteNameCounts };
  } catch (error) {
    const apiError = handleApiError(error, "Failed to fetch sources");
    throw new Error(apiError.message);
  }
};

export const getSourceById = async (id: string): Promise<string> => {
  try {
    const source = await SourceService.getSourceById(id);
    return source.name;
  } catch (error) {
    const apiError = handleApiError(error, "Failed to fetch source by ID");
    throw new Error(apiError.message);
  }
};
