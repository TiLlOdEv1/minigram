// services/authService.js
import axios from 'axios';
import { API_URL } from '../config';

const API_BASE_URL = `${API_URL}/auth`;

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  if (token) {
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// LocalStorage'dan tokenni yuklash
const initializeToken = () => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    setToken(storedToken);
  }
};

const authService = {
  // Ro'yxatdan o'tish
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },

  // Kirish
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },

  // Google orqali kirish
  googleLogin: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/google`, { token });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },

  // Chiqish
  logout: () => {
    setToken(null);
    localStorage.removeItem('user');
  },

  // Token yangilash
  refreshToken: async () => {
    const response = await axios.post(`${API_BASE_URL}/refresh`);
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },

  // Parolni tiklash
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response;
  },

  // Parolni o'zgartirish
  resetPassword: async (token, newPassword) => {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      token,
      newPassword,
    });
    return response;
  },

  // Profil ma'lumotlarini yangilash
  updateProfile: async (userData) => {
    const response = await axios.put(`${API_BASE_URL}/profile`, userData);
    return response;
  },

  // Email tasdiqlash
  verifyEmail: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/verify-email`, { token });
    return response;
  },

  // 2FA yoqish/o'chirish
  toggle2FA: async (enabled) => {
    const response = await axios.put(`${API_BASE_URL}/2fa`, { enabled });
    return response;
  },

  // 2FA kodini tasdiqlash
  verify2FA: async (code) => {
    const response = await axios.post(`${API_BASE_URL}/verify-2fa`, { code });
    return response;
  },

  // Joriy token
  getToken: () => token,

  // Token ishlatilishi mumkinligini tekshirish
  isAuthenticated: () => {
    return !!token;
  },
};

// Dastlabki token yuklash
initializeToken();

export { authService, setToken };