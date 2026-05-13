import { api, apiCall, type ApiResponse } from ".";
import type { IFolder } from "../types/Folder";

// Enhanced folder types
export interface CreateFolderDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateFolderDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface FolderFilters {
  search?: string;
  parentId?: string;
  hasCaptures?: boolean;
  limit?: number;
  offset?: number;
}

export interface FolderStats {
  totalFolders: number;
  totalCaptures: number;
  averageCapturesPerFolder: number;
  topFolders: Array<{
    folder: IFolder;
    captureCount: number;
  }>;
}

// Enhanced Folder Service
export const FolderService = {
  /**
   * Create a new folder
   * @param data - Folder creation data
   * @returns Promise<IFolder> Created folder
   */
  async create(data: CreateFolderDto): Promise<IFolder> {
    return apiCall(
      () => api.post<ApiResponse<IFolder>>("/folders", data),
      "Failed to create folder"
    ).then(response => response.data);
  },

  /**
   * Get all folders with optional filtering
   * @param filters - Optional filters
   * @returns Promise<IFolder[]> Array of folders
   */
  async getAll(filters?: FolderFilters): Promise<IFolder[]> {
    return apiCall(
      () => {
        const params = this.buildQueryParams(filters);
        return api.get<ApiResponse<IFolder[]>>("/folders", { params });
      },
      "Failed to fetch folders"
    ).then(response => response.data);
  },

  /**
   * Get folder by ID
   * @param id - Folder ID
   * @returns Promise<IFolder> Folder object
   */
  async getById(id: string): Promise<IFolder> {
    return apiCall(
      () => api.get<ApiResponse<IFolder>>(`/folders/${id}`),
      "Failed to fetch folder"
    ).then(response => response.data);
  },

  /**
   * Update folder
   * @param id - Folder ID
   * @param data - Update data
   * @returns Promise<IFolder> Updated folder
   */
  async update(id: string, data: UpdateFolderDto): Promise<IFolder> {
    return apiCall(
      () => api.put<ApiResponse<IFolder>>(`/folders/${id}`, data),
      "Failed to update folder"
    ).then(response => response.data);
  },

  /**
   * Delete folder
   * @param id - Folder ID
   * @returns Promise<void>
   */
  async delete(id: string): Promise<void> {
    await apiCall(
      () => api.delete<ApiResponse<null>>(`/folders/${id}`),
      "Failed to delete folder"
    );
  },

  /**
   * Add capture to folder
   * @param folderId - Folder ID
   * @param captureId - Capture ID to add
   * @returns Promise<IFolder> Updated folder
   */
  async addCapture(folderId: string, captureId: string): Promise<IFolder> {
    return apiCall(
      () => api.post<ApiResponse<IFolder>>(`/folders/${folderId}/captures`, { captureId }),
      "Failed to add capture to folder"
    ).then(response => response.data);
  },

  /**
   * Remove capture from folder
   * @param folderId - Folder ID
   * @param captureId - Capture ID to remove
   * @returns Promise<IFolder> Updated folder
   */
  async removeCapture(folderId: string, captureId: string): Promise<IFolder> {
    return apiCall(
      () => api.delete<ApiResponse<IFolder>>(`/folders/${folderId}/captures/${captureId}`),
      "Failed to remove capture from folder"
    ).then(response => response.data);
  },

  /**
   * Get folder statistics
   * @returns Promise<FolderStats> Folder statistics
   */
  async getStats(): Promise<FolderStats> {
    return apiCall(
      () => api.get<ApiResponse<FolderStats>>("/folders/stats"),
      "Failed to fetch folder statistics"
    ).then(response => response.data);
  },

  /**
   * Search folders
   * @param query - Search query
   * @param filters - Additional filters
   * @returns Promise<IFolder[]> Array of matching folders
   */
  async search(query: string, filters?: Omit<FolderFilters, 'search'>): Promise<IFolder[]> {
    return apiCall(
      () => {
        const params = { query, ...this.buildQueryParams(filters) };
        return api.get<ApiResponse<IFolder[]>>("/folders/search", { params });
      },
      "Failed to search folders"
    ).then(response => response.data);
  },

  /**
   * Get folder hierarchy (tree structure)
   * @returns Promise<IFolder[]> Hierarchical folder structure
   */
  async getHierarchy(): Promise<IFolder[]> {
    return apiCall(
      () => api.get<ApiResponse<IFolder[]>>("/folders/hierarchy"),
      "Failed to fetch folder hierarchy"
    ).then(response => response.data);
  },

  /**
   * Move folder to different parent
   * @param folderId - Folder ID to move
   * @param newParentId - New parent folder ID (null for root)
   * @returns Promise<IFolder> Updated folder
   */
  async move(folderId: string, newParentId: string | null): Promise<IFolder> {
    return apiCall(
      () => api.patch<ApiResponse<IFolder>>(`/folders/${folderId}/move`, { parentId: newParentId }),
      "Failed to move folder"
    ).then(response => response.data);
  },

  /**
   * Duplicate folder with all its captures
   * @param folderId - Folder ID to duplicate
   * @param newName - Name for the duplicated folder
   * @returns Promise<IFolder> Duplicated folder
   */
  async duplicate(folderId: string, newName: string): Promise<IFolder> {
    return apiCall(
      () => api.post<ApiResponse<IFolder>>(`/folders/${folderId}/duplicate`, { name: newName }),
      "Failed to duplicate folder"
    ).then(response => response.data);
  },

  // Private helper methods
  buildQueryParams(filters?: FolderFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters?.search) params.search = filters.search;
    if (filters?.parentId !== undefined) params.parentId = filters.parentId;
    if (filters?.hasCaptures !== undefined) params.hasCaptures = filters.hasCaptures;
    if (filters?.limit !== undefined) params.limit = filters.limit;
    if (filters?.offset !== undefined) params.offset = filters.offset;
    
    return params;
  },
};
