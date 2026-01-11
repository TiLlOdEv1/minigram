// services/fileService.js
import axios from 'axios';
import { API_URL } from '../config';

const FILE_BASE_URL = `${API_URL}/files`;

const fileService = {
  // Fayl yuklash
  uploadFile: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    if (options.public) {
      formData.append('public', options.public);
    }

    const response = await axios.post(`${FILE_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onProgress,
    });
    return response.data;
  },

  // Ko'p fayl yuklash
  uploadMultiple: async (files, options = {}) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post(`${FILE_BASE_URL}/upload-multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: options.onProgress,
    });
    return response.data;
  },

  // Faylni olish
  getFile: async (fileId) => {
    const response = await axios.get(`${FILE_BASE_URL}/${fileId}`);
    return response.data;
  },

  // Fayllar ro'yxati
  listFiles: async (folder = '', page = 1) => {
    const response = await axios.get(`${FILE_BASE_URL}/list`, {
      params: { folder, page },
    });
    return response.data;
  },

  // Faylni o'chirish
  deleteFile: async (fileId) => {
    const response = await axios.delete(`${FILE_BASE_URL}/${fileId}`);
    return response.data;
  },

  // Fayl hajmini o'zgartirish
  resizeImage: async (fileId, width, height) => {
    const response = await axios.post(`${FILE_BASE_URL}/${fileId}/resize`, {
      width,
      height,
    });
    return response.data;
  },

  // Fayl ma'lumotlarini yangilash
  updateFileInfo: async (fileId, metadata) => {
    const response = await axios.put(`${FILE_BASE_URL}/${fileId}`, metadata);
    return response.data;
  },

  // Faylni download qilish
  downloadFile: async (fileId) => {
    const response = await axios.get(`${FILE_BASE_URL}/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Storage statistikasi
  getStorageStats: async () => {
    const response = await axios.get(`${FILE_BASE_URL}/storage`);
    return response.data;
  },

  // Folder yaratish
  createFolder: async (folderName, parentFolder = '') => {
    const response = await axios.post(`${FILE_BASE_URL}/folder`, {
      name: folderName,
      parent: parentFolder,
    });
    return response.data;
  },
};

export { fileService };