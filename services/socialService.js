// services/socialService.js
import axios from 'axios';
import { API_URL } from '../config';

const SOCIAL_BASE_URL = `${API_URL}/social`;

const socialService = {
  // Connect social account
  connectAccount: async (platform, authData) => {
    const response = await axios.post(`${SOCIAL_BASE_URL}/connect/${platform}`, authData);
    return response.data;
  },

  // Disconnect social account
  disconnectAccount: async (platform) => {
    const response = await axios.delete(`${SOCIAL_BASE_URL}/disconnect/${platform}`);
    return response.data;
  },

  // Get connected accounts
  getConnectedAccounts: async () => {
    const response = await axios.get(`${SOCIAL_BASE_URL}/accounts`);
    return response.data;
  },

  // Post to social media
  postToSocial: async (platform, content, options = {}) => {
    const response = await axios.post(`${SOCIAL_BASE_URL}/post/${platform}`, {
      content,
      ...options,
    });
    return response.data;
  },

  // Schedule post
  schedulePost: async (platform, content, scheduleTime, options = {}) => {
    const response = await axios.post(`${SOCIAL_BASE_URL}/schedule/${platform}`, {
      content,
      scheduleTime,
      ...options,
    });
    return response.data;
  },

  // Get scheduled posts
  getScheduledPosts: async (platform) => {
    const response = await axios.get(`${SOCIAL_BASE_URL}/scheduled/${platform}`);
    return response.data;
  },

  // Analytics
  getSocialAnalytics: async (platform, period = 'week') => {
    const response = await axios.get(`${SOCIAL_BASE_URL}/analytics/${platform}`, {
      params: { period },
    });
    return response.data;
  },

  // Import followers
  importFollowers: async (platform) => {
    const response = await axios.get(`${SOCIAL_BASE_URL}/followers/${platform}/import`);
    return response.data;
  },

  // Cross-post
  crossPost: async (content, platforms, options = {}) => {
    const response = await axios.post(`${SOCIAL_BASE_URL}/crosspost`, {
      content,
      platforms,
      ...options,
    });
    return response.data;
  },
};

export { socialService };