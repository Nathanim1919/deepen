import axios from "axios";
import { api } from ".";

/**
 * Feedback API Service
 * Provides methods for all feedback-related operations
 */
export const FeedbackService = {
  /**
   * Submit feedback
   * @param {string} feedback - The feedback text to submit
   * @returns {Promise<void>} Resolves when feedback is successfully submitted
   * @throws {Error} If submission fails
   */
  async submit(feedbackData: {
    feedback: string;
    name?: string;
    profession?: string;
  }): Promise<void> {
    try {
      const response = await api.post("/feedback", { feedbackData });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Failed to submit feedback");
    }
  },

  /**
   * Get all feedbacks
   * @returns {Promise<string>} Resolves with the feedbacks data
   * @throws {Error} If fetching feedbacks fails
   */

  async getFeedbacks(): Promise<string> {
    try {
      const response = await api.get<{ data: string }>("/getFeedbacks");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch feedbacks");
    }
  },

  /**
   * Handle API errors consistently
   * @private
   */
  handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      return new Error(error.response?.data?.message || defaultMessage);
    }
    console.error("Unexpected Error:", error);
    return new Error(defaultMessage);
  },
};
