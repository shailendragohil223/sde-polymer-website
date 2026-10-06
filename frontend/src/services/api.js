import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token to all outgoing requests if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sde_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication APIs
export const adminLogin = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data.success && response.data.token) {
    localStorage.setItem('sde_admin_token', response.data.token);
    localStorage.setItem('sde_admin_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const verifyAdminAuth = async () => {
  const response = await apiClient.get('/auth/verify');
  return response.data;
};

export const adminLogout = () => {
  localStorage.removeItem('sde_admin_token');
  localStorage.removeItem('sde_admin_user');
};

export const getStoredAdminUser = () => {
  try {
    const userStr = localStorage.getItem('sde_admin_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem('sde_admin_token');
};

// Public Content & Catalog APIs
export const getSiteInfo = async () => {
  const response = await apiClient.get('/site-info');
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const submitQuoteRequest = async (quoteData) => {
  const response = await apiClient.post('/quotes', quoteData);
  return response.data;
};

export const submitContactInquiry = async (inquiryData) => {
  const response = await apiClient.post('/contact', inquiryData);
  return response.data;
};

// Protected Admin APIs
export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export const getQuoteRequests = async () => {
  const response = await apiClient.get('/quotes');
  return response.data;
};

export const updateQuoteStatus = async (id, status) => {
  const response = await apiClient.patch(`/quotes/${id}/status`, { status });
  return response.data;
};

export const getContactInquiries = async () => {
  const response = await apiClient.get('/contact');
  return response.data;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await apiClient.patch(`/contact/${id}/status`, { status });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export default apiClient;
