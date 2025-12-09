import axios from 'axios';


const API_URL = import.meta.env.REACT_APP_API_URL || "https://idea-share-platform-1.onrender.com/api";

console.log('API_URL:', API_URL);

// Axios instance banate hain - isme default config set kar sakte hain
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - har request me token add karta hai
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 error pe auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Invalid token ya user deleted - logout kar do
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH APIs =============

// User register karne ke liye
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// User login karne ke liye
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Current user ka data lene ke liye
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ============= IDEA APIs =============

// Sare ideas get karne ke liye
export const getAllIdeas = async () => {
  const response = await api.get('/ideas');
  return response.data;
};

// Single idea get karne ke liye
export const getIdeaById = async (id) => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

// Naya idea create karne ke liye
export const createIdea = async (ideaData) => {
  const response = await api.post('/ideas', ideaData);
  return response.data;
};

// Idea update karne ke liye
export const updateIdea = async (id, ideaData) => {
  const response = await api.put(`/ideas/${id}`, ideaData);
  return response.data;
};

// Idea delete karne ke liye
export const deleteIdea = async (id) => {
  const response = await api.delete(`/ideas/${id}`);
  return response.data;
};

// Apne sare ideas get karne ke liye
export const getMyIdeas = async () => {
  const response = await api.get('/ideas/my/all');
  return response.data;
};

// ============= LIKE APIs =============

// Idea ko like karne ke liye
export const likeIdea = async (ideaId) => {
  const response = await api.post(`/likes/${ideaId}`);
  return response.data;
};

// Idea ko unlike karne ke liye
export const unlikeIdea = async (ideaId) => {
  const response = await api.delete(`/likes/${ideaId}`);
  return response.data;
};

// Idea ke sare likes get karne ke liye
export const getLikesForIdea = async (ideaId) => {
  const response = await api.get(`/likes/${ideaId}`);
  return response.data;
};

// Check karo ki user ne like kiya hai ya nahi
export const checkIfLiked = async (ideaId) => {
  const response = await api.get(`/likes/${ideaId}/check`);
  return response.data;
};

// ============= COMMENT APIs =============

// Idea ke sare comments get karne ke liye
export const getCommentsForIdea = async (ideaId) => {
  const response = await api.get(`/comments/${ideaId}`);
  return response.data;
};

// Comment add karne ke liye
export const addComment = async (ideaId, commentData) => {
  const response = await api.post(`/comments/${ideaId}`, commentData);
  return response.data;
};

// Comment update karne ke liye
export const updateComment = async (commentId, commentData) => {
  const response = await api.put(`/comments/${commentId}`, commentData);
  return response.data;
};

// Comment delete karne ke liye
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export default api;
