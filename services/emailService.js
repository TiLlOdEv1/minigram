// services/emailService.js
import axios from 'axios';
import { API_URL } from '../config';

const EMAIL_BASE_URL = `${API_URL}/email`;

const emailService = {
  // Send email
  sendEmail: async (to, subject, content, options = {}) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/send`, {
      to,
      subject,
      content,
      ...options,
    });
    return response.data;
  },

  // Send template email
  sendTemplateEmail: async (templateName, data, recipients) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/template`, {
      template: templateName,
      data,
      recipients,
    });
    return response.data;
  },

  // Get email templates
  getTemplates: async () => {
    const response = await axios.get(`${EMAIL_BASE_URL}/templates`);
    return response.data;
  },

  // Create template
  createTemplate: async (template) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/templates`, template);
    return response.data;
  },

  // Update template
  updateTemplate: async (templateId, template) => {
    const response = await axios.put(`${EMAIL_BASE_URL}/templates/${templateId}`, template);
    return response.data;
  },

  // Email analytics
  getEmailAnalytics: async (campaignId) => {
    const response = await axios.get(`${EMAIL_BASE_URL}/analytics/${campaignId}`);
    return response.data;
  },

  // Unsubscribe
  unsubscribe: async (email, listId) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/unsubscribe`, {
      email,
      listId,
    });
    return response.data;
  },

  // Verify email
  verifyEmailAddress: async (email) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/verify`, { email });
    return response.data;
  },

  // Bulk email
  sendBulkEmail: async (recipients, subject, content) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/bulk`, {
      recipients,
      subject,
      content,
    });
    return response.data;
  },

  // Scheduled emails
  scheduleEmail: async (emailData, sendAt) => {
    const response = await axios.post(`${EMAIL_BASE_URL}/schedule`, {
      ...emailData,
      sendAt,
    });
    return response.data;
  },
};

export { emailService };