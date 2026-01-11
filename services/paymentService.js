// services/paymentService.js
import axios from 'axios';
import { API_URL } from '../config';

const PAYMENT_BASE_URL = `${API_URL}/payment`;

const paymentService = {
  // Payment methods
  getPaymentMethods: async () => {
    const response = await axios.get(`${PAYMENT_BASE_URL}/methods`);
    return response.data;
  },

  addPaymentMethod: async (paymentMethod) => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/methods`, paymentMethod);
    return response.data;
  },

  removePaymentMethod: async (methodId) => {
    const response = await axios.delete(`${PAYMENT_BASE_URL}/methods/${methodId}`);
    return response.data;
  },

  // Invoices
  getInvoices: async (page = 1) => {
    const response = await axios.get(`${PAYMENT_BASE_URL}/invoices`, {
      params: { page },
    });
    return response.data;
  },

  downloadInvoice: async (invoiceId) => {
    const response = await axios.get(`${PAYMENT_BASE_URL}/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Coupons & Promo codes
  validateCoupon: async (code) => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/coupons/validate`, { code });
    return response.data;
  },

  // Payment intent
  createPaymentIntent: async (amount, currency = 'usd') => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/intent`, {
      amount,
      currency,
    });
    return response.data;
  },

  // Refund
  requestRefund: async (paymentId, reason) => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/refund`, {
      paymentId,
      reason,
    });
    return response.data;
  },

  // Tax calculation
  calculateTax: async (amount, country, state = '') => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/tax`, {
      amount,
      country,
      state,
    });
    return response.data;
  },

  // Billing info
  updateBillingInfo: async (info) => {
    const response = await axios.put(`${PAYMENT_BASE_URL}/billing`, info);
    return response.data;
  },

  getBillingInfo: async () => {
    const response = await axios.get(`${PAYMENT_BASE_URL}/billing`);
    return response.data;
  },
};

export { paymentService };