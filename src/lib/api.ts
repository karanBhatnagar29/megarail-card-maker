import axios from 'axios';

const API_BASE_URL = 'https://mega-rail-backend.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mega-rail-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CardData {
  _id?: string;
  employeeName: string;
  fatherName: string;
  designation: string;
  adharCardNumber: string;
  hirer: string;
  bloodGroup: string;
  policeVerification: string;
  dateOfIssue: string;
  validTill: string;
  mobileNumber: string;
  address: string;
  cardNo: string;
  divisionName: string;
  profileName: string;
  description?: string;
  photo?: string;
  seal?: string;
  sign?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCardPayload {
  employeeName: string;
  fatherName: string;
  designation: string;
  adharCardNumber: string;
  hirer: string;
  bloodGroup: string;
  policeVerification: string;
  dateOfIssue: string;
  validTill: string;
  mobileNumber: string;
  address: string;
  cardNo: string;
  divisionName: string;
  profileName: string;
  description?: string;
}

// Card API functions
export const cardApi = {
  create: async (data: FormData) => {
    const response = await api.post('/card/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAll: async (): Promise<CardData[]> => {
    const response = await api.get('/card');
    return response.data;
  },

  getById: async (id: string): Promise<CardData> => {
    const response = await api.get(`/card/${id}`);
    return response.data;
  },

  viewCard: async (id: string): Promise<CardData> => {
    const response = await api.get(`/card/view/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<CardData[]> => {
    const response = await api.get(`/card/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await api.put(`/card/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/card/${id}`);
    return response.data;
  },
};

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('mega-rail-token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('mega-rail-token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('mega-rail-token');
  },
};

export default api;
