import { api, apiCall, type ApiResponse } from ".";

// Enhanced account types
export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  externalServices: ExternalServices;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    dataSharing: boolean;
  };
}

export interface ExternalServices {
  gemini: {
    hasApiKey: boolean;
    lastUsed?: Date;
  };
  openai?: {
    hasApiKey: boolean;
    lastUsed?: Date;
  };
}

export interface ResetDataRequest {
  confirmReset: boolean;
  reason?: string;
}

export interface SetApiKeyRequest {
  service: "gemini" | "openai";
  apiKey: string;
}

// Enhanced Account Service
export const AccountService = {
  /**
   * Get user profile information
   * @returns Promise<UserProfile> User profile data
   */
  async getUserProfile(): Promise<UserProfile> {
    return apiCall(
      () => api.get<ApiResponse<UserProfile>>("/account/profile"),
      "Failed to fetch user profile"
    ).then(response => response.data);
  },

  /**
   * Update user profile
   * @param updates - Profile updates
   * @returns Promise<UserProfile> Updated profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return apiCall(
      () => api.put<ApiResponse<UserProfile>>("/account/profile", updates),
      "Failed to update profile"
    ).then(response => response.data);
  },

  /**
   * Update user preferences
   * @param preferences - Preference updates
   * @returns Promise<UserPreferences> Updated preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return apiCall(
      () => api.put<ApiResponse<UserPreferences>>("/account/preferences", preferences),
      "Failed to update preferences"
    ).then(response => response.data);
  },

  /**
   * Set API key for external service
   * @param request - API key request
   * @returns Promise<void>
   */
  async setApiKey(request: SetApiKeyRequest): Promise<void> {
    await apiCall(
      () => api.post<ApiResponse<null>>(`/account/set${request.service}ApiKey`, {
        apiKey: request.apiKey,
      }),
      `Failed to set ${request.service} API key`
    );
  },

  /**
   * Remove API key for external service
   * @param service - Service name
   * @returns Promise<void>
   */
  async removeApiKey(service: "gemini" | "openai"): Promise<void> {
    await apiCall(
      () => api.delete<ApiResponse<null>>(`/account/${service}ApiKey`),
      `Failed to remove ${service} API key`
    );
  },

  /**
   * Reset user data
   * @param request - Reset data request
   * @returns Promise<void>
   */
  async resetData(request: ResetDataRequest): Promise<void> {
    if (!request.confirmReset) {
      throw new Error("Reset confirmation is required");
    }

    await apiCall(
      () => api.post<ApiResponse<null>>("/account/reset", request),
      "Failed to reset data"
    );
  },

  /**
   * Get account statistics
   * @returns Promise<AccountStats> Account statistics
   */
  async getAccountStats(): Promise<AccountStats> {
    return apiCall(
      () => api.get<ApiResponse<AccountStats>>("/account/stats"),
      "Failed to fetch account statistics"
    ).then(response => response.data);
  },

  /**
   * Export user data
   * @param format - Export format
   * @returns Promise<string> Export data URL or content
   */
  async exportData(format: "json" | "csv" = "json"): Promise<string> {
    return apiCall(
      () => api.get<ApiResponse<{ downloadUrl: string }>>(`/account/export?format=${format}`),
      "Failed to export data"
    ).then(response => response.data.downloadUrl);
  },

  /**
   * Delete user account
   * @param confirmPassword - User password confirmation
   * @returns Promise<void>
   */
  async deleteAccount(confirmPassword: string): Promise<void> {
    await apiCall(
      () => api.delete<ApiResponse<null>>("/account", {
        data: { password: confirmPassword }
      }),
      "Failed to delete account"
    );
  },
};

// Additional types
export interface AccountStats {
  totalCaptures: number;
  totalFolders: number;
  totalBookmarks: number;
  storageUsed: number;
  storageLimit: number;
  lastActive: Date;
  accountAge: number; // in days
}

// Legacy functions for backward compatibility
export const resetData = async (): Promise<void> => {
  return AccountService.resetData({ confirmReset: true });
};

export const setGeminiApiKey = async (geminiApiKey: string): Promise<void> => {
  return AccountService.setApiKey({ service: "gemini", apiKey: geminiApiKey });
};

export const getUserProfileInfo = async (): Promise<UserProfile> => {
  return AccountService.getUserProfile();
};

// Legacy interface for backward compatibility
export interface IUserProfile extends UserProfile {}
