// services/errorService.js
import axios from 'axios';
import { API_URL } from '../config';

const ERROR_BASE_URL = `${API_URL}/errors`;

class ErrorService {
  constructor() {
    this.ignoredErrors = ['Network Error', 'Request failed with status code 401'];
  }

  // Report error to server
  reportError = async (error, context = {}, severity = 'error') => {
    // Don't report ignored errors
    if (this.ignoredErrors.some(ignored => error.message?.includes(ignored))) {
      return;
    }

    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
      severity,
    };

    try {
      await axios.post(`${ERROR_BASE_URL}/report`, errorData);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  };

  // Handle API errors
  handleApiError = (error, action = '') => {
    const errorData = {
      action,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    };

    this.reportError(error, errorData);

    // Return user-friendly error
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Session expired. Please login again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return 'An unexpected error occurred.';
      }
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    } else {
      return 'An error occurred. Please try again.';
    }
  };

  // Get error analytics
  getErrorAnalytics = async (startDate, endDate) => {
    const response = await axios.get(`${ERROR_BASE_URL}/analytics`, {
      params: { startDate, endDate },
    });
    return response.data;
  };

  // Clear old errors
  clearOldErrors = async (days = 30) => {
    const response = await axios.delete(`${ERROR_BASE_URL}/clear`, {
      params: { days },
    });
    return response.data;
  };
}

// Singleton instance
const errorService = new ErrorService();
export default errorService;