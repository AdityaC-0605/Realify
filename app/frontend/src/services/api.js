import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_REACT_APP_BACKEND_URL ||
  'http://localhost:8001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const newsApi = {
  // Analyze manual news input
  analyzeNews: async (newsItems) => {
    return api.post('/api/analyze', { news_items: newsItems })
  },

  // Get live news analysis
  getLiveNews: async (keyword = 'latest news', limit = 10) => {
    return api.post('/api/live-news', { keyword, limit })
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    return api.get('/api/dashboard')
  },

  // Get model information
  getModelInfo: async () => {
    return api.get('/api/models')
  },

  // Health check
  healthCheck: async () => {
    return api.get('/health')
  }
}

export default api
