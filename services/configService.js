// services/configService.js
import axios from 'axios';

const CONFIG_BASE_URL = '/api/config';

const configService = {
  // Get app config
  getAppConfig: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/app`);
    return response.data;
  },

  // Get feature flags
  getFeatureFlags: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/features`);
    return response.data;
  },

  // Get maintenance status
  getMaintenanceStatus: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/maintenance`);
    return response.data;
  },

  // Get API endpoints
  getApiEndpoints: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/endpoints`);
    return response.data;
  },

  // Get UI config
  getUiConfig: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/ui`);
    return response.data;
  },

  // Get country list
  getCountries: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/countries`);
    return response.data;
  },

  // Get currencies
  getCurrencies: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/currencies`);
    return response.data;
  },

  // Get languages
  getLanguages: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/languages`);
    return response.data;
  },

  // Get timezones
  getTimezones: async () => {
    const response = await axios.get(`${CONFIG_BASE_URL}/timezones`);
    return response.data;
  },

  // Update user config
  updateUserConfig: async (config) => {
    const response = await axios.put(`${CONFIG_BASE_URL}/user`, config);
    return response.data;
  },
};

export { configService };