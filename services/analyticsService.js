// services/analyticsService.js
import axios from 'axios';
import { API_URL } from '../config';

const ANALYTICS_BASE_URL = `${API_URL}/analytics`;

const analyticsService = {
  // User analytics
  getUserAnalytics: async (period = 'week') => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/user`, {
      params: { period },
    });
    return response.data;
  },

  // Content analytics
  getContentAnalytics: async (contentId, period = 'month') => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/content/${contentId}`, {
      params: { period },
    });
    return response.data;
  },

  // Revenue analytics
  getRevenueAnalytics: async (startDate, endDate) => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/revenue`, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // AI usage analytics
  getAIUsageAnalytics: async () => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/ai-usage`);
    return response.data;
  },

  // Real-time analytics
  getRealtimeStats: async () => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/realtime`);
    return response.data;
  },

  // Export analytics
  exportAnalytics: async (type, format = 'csv') => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/export`, {
      params: { type, format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Custom events
  trackEvent: async (eventName, properties = {}) => {
    const response = await axios.post(`${ANALYTICS_BASE_URL}/track`, {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },

  // Funnel analysis
  getFunnelAnalytics: async (funnelId) => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/funnel/${funnelId}`);
    return response.data;
  },

  // Retention analysis
  getRetentionAnalytics: async (cohortType = 'weekly') => {
    const response = await axios.get(`${ANALYTICS_BASE_URL}/retention`, {
      params: { cohortType },
    });
    return response.data;
  },
};

export { analyticsService };