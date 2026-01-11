// services/notificationService.js
import axios from 'axios';
import { API_URL } from '../config';

const NOTIFICATION_BASE_URL = `${API_URL}/notifications`;

const notificationService = {
  // Bildirishnomalarni olish
  getNotifications: async (page = 1, limit = 20) => {
    const response = await axios.get(NOTIFICATION_BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  },

  // Yangi bildirishnomalar soni
  getUnreadCount: async () => {
    const response = await axios.get(`${NOTIFICATION_BASE_URL}/unread-count`);
    return response.data;
  },

  // O'qilgan deb belgilash
  markAsRead: async (notificationId) => {
    const response = await axios.put(`${NOTIFICATION_BASE_URL}/${notificationId}/read`);
    return response.data;
  },

  // Barchasini o'qilgan deb belgilash
  markAllAsRead: async () => {
    const response = await axios.put(`${NOTIFICATION_BASE_URL}/read-all`);
    return response.data;
  },

  // Bildirishnoma o'chirish
  deleteNotification: async (notificationId) => {
    const response = await axios.delete(`${NOTIFICATION_BASE_URL}/${notificationId}`);
    return response.data;
  },

  // Bildirishnoma sozlamalari
  getSettings: async () => {
    const response = await axios.get(`${NOTIFICATION_BASE_URL}/settings`);
    return response.data;
  },

  // Bildirishnoma sozlamalarini yangilash
  updateSettings: async (settings) => {
    const response = await axios.put(`${NOTIFICATION_BASE_URL}/settings`, settings);
    return response.data;
  },

  // Push notification subscribe
  subscribeToPush: async (subscription) => {
    const response = await axios.post(`${NOTIFICATION_BASE_URL}/push/subscribe`, {
      subscription,
    });
    return response.data;
  },

  // Push notification unsubscribe
  unsubscribeFromPush: async () => {
    const response = await axios.post(`${NOTIFICATION_BASE_URL}/push/unsubscribe`);
    return response.data;
  },
};

export { notificationService };