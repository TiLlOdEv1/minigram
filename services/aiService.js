// services/aiService.js
import axios from 'axios';
import { API_URL } from '../config';

const AI_BASE_URL = `${API_URL}/ai`;

const aiService = {
  // ChatGPT ga so'rov
  chatCompletion: async (messages, options = {}) => {
    const response = await axios.post(`${AI_BASE_URL}/chat`, {
      messages,
      model: options.model || 'gpt-4',
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
    });
    return response.data;
  },

  // Rasm generatsiyasi
  generateImage: async (prompt, options = {}) => {
    const response = await axios.post(`${AI_BASE_URL}/generate-image`, {
      prompt,
      size: options.size || '1024x1024',
      style: options.style || 'vivid',
      quality: options.quality || 'standard',
    });
    return response.data;
  },

  // Matnni tahlil qilish
  analyzeText: async (text, analysisType) => {
    const response = await axios.post(`${AI_BASE_URL}/analyze-text`, {
      text,
      analysis_type: analysisType, // sentiment, keywords, summary, etc.
    });
    return response.data;
  },

  // Ovozni matnga aylantirish
  speechToText: async (audioFile, language = 'en-US') => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    const response = await axios.post(`${AI_BASE_URL}/speech-to-text`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Matnni ovozga aylantirish
  textToSpeech: async (text, options = {}) => {
    const response = await axios.post(`${AI_BASE_URL}/text-to-speech`, {
      text,
      voice: options.voice || 'alloy',
      speed: options.speed || 1.0,
    });
    return response.data;
  },

  // Kod yordamchisi
  codeAssistant: async (code, language, task) => {
    const response = await axios.post(`${AI_BASE_URL}/code-assistant`, {
      code,
      language,
      task, // explain, debug, optimize, translate
    });
    return response.data;
  },

  // Tarjimon
  translate: async (text, targetLanguage, sourceLanguage = 'auto') => {
    const response = await axios.post(`${AI_BASE_URL}/translate`, {
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    });
    return response.data;
  },

  // Kontent generatsiyasi
  generateContent: async (prompt, contentType, tone = 'professional') => {
    const response = await axios.post(`${AI_BASE_URL}/generate-content`, {
      prompt,
      content_type: contentType, // blog, email, social, etc.
      tone,
    });
    return response.data;
  },

  // AI modellarini olish
  getModels: async () => {
    const response = await axios.get(`${AI_BASE_URL}/models`);
    return response.data;
  },

  // Usage statistikasi
  getUsageStats: async () => {
    const response = await axios.get(`${AI_BASE_URL}/usage`);
    return response.data;
  },

  // Batch processing
  batchProcess: async (items, processType) => {
    const response = await axios.post(`${AI_BASE_URL}/batch`, {
      items,
      process_type: processType,
    });
    return response.data;
  },

  // Real-time chat (WebSocket)
  createChatSession: async () => {
    const response = await axios.post(`${AI_BASE_URL}/chat/session`);
    return response.data;
  },
};

export { aiService };