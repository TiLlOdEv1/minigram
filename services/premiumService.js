import axios from 'axios';
import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}/premium`;

const premiumService = {
  // Premium rejalarini olish
  getPlans: async () => {
    const response = await axios.get(`${API_BASE_URL}/plans`);
    return response;
  },

  // Premiumga obuna bo'lish
  subscribe: async (plan, paymentMethodId) => {
    const response = await axios.post(`${API_BASE_URL}/subscribe`, {
      plan,
      paymentMethodId,
    });
    return response;
  },

  // Obunani bekor qilish
  cancelSubscription: async () => {
    const response = await axios.post(`${API_BASE_URL}/cancel`);
    return response;
  },

  // Obuna holatini olish
  getStatus: async () => {
    const response = await axios.get(`${API_BASE_URL}/status`);
    return response;
  },

  // To'lov tarixini olish
  getPaymentHistory: async () => {
    const response = await axios.get(`${API_BASE_URL}/payments`);
    return response;
  },

  // Akkauntni tasdiqlash
  verifyAccount: async (verificationData) => {
    const response = await axios.post(`${API_BASE_URL}/verify`, verificationData);
    return response;
  },

  // Premium statistikani olish (admin uchun)
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response;
  },

  // VPN tekshiruvi
  checkVPN: async () => {
    const response = await axios.get(`${API_BASE_URL}/check-vpn`);
    return response;
  },

  // Premium imtiyozlarni olish
  getBenefits: async () => {
    const response = await axios.get(`${API_BASE_URL}/benefits`);
    return response;
  },

  // Promokodni tekshirish
  validatePromoCode: async (code) => {
    const response = await axios.post(`${API_BASE_URL}/validate-promo`, { code });
    return response;
  },

  // Obunani yangilash
  updateSubscription: async (newPlan) => {
    const response = await axios.put(`${API_BASE_URL}/update`, { newPlan });
    return response;
  },

  // Avtomatik to'lovni yoqish/o'chirish
  toggleAutoRenewal: async (enabled) => {
    const response = await axios.put(`${API_BASE_URL}/auto-renewal`, { enabled });
    return response;
  },
};

export { premiumService };