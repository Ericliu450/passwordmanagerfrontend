export const API_BASE_URL = 'http://localhost:8080';

export const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

export const buildUrl = (endpoint) => `${API_BASE_URL}/api${endpoint}`;

export const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

export const requestConfig = {
  withAuth: (config = {}) => ({
    ...config,
    headers: {
      ...config.headers,
      ...getAuthHeader()
    }
  }),

  withJson: (config = {}) => ({
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json'
    }
  })
};