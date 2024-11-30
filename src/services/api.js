// src/services/api.js
import { buildUrl, handleResponse, requestConfig } from './apiConfig';

// User Management APIs
export const userAPI = {
  // Public endpoints (no auth required)
  signup: async (email, password) => {
    const response = await fetch(
      buildUrl('/users/signup'),
      requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    );
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(
      buildUrl('/users/login'),
      requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    );
    return handleResponse(response);
  },

  checkEmail: async (email) => {
    const response = await fetch(
      buildUrl(`/users/check-email?email=${encodeURIComponent(email)}`)
    );
    return handleResponse(response);
  },

  // Protected endpoints (auth required)
  logout: async () => {
    const response = await fetch(
      buildUrl('/users/logout'),
      requestConfig.withAuth({
        method: 'POST'
      })
    );
    return handleResponse(response);
  },

  setTestString: async (email, testString) => {
    const response = await fetch(
        buildUrl('/users/set-test-string'),
        requestConfig.withAuth(requestConfig.withJson({
            method: 'POST',
            body: JSON.stringify({ email, testString })
        }))
    );

    const data = await response.json();
    
    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to set test string');
    }
    
    return data;
  },

  getTestString: async (email) => {
    const response = await fetch(
      buildUrl(`/users/get-test-string?email=${encodeURIComponent(email)}`),
      requestConfig.withAuth()
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    
    // Return the raw text instead of parsing as JSON
    return response.text();
  }
};

// Password Reset APIs (no auth required)
export const passwordResetAPI = {
  requestReset: async (email) => {
    const response = await fetch(
      buildUrl('/password-reset/request'),
      requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify({ email })
      })
    );
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text);
    }
    return text;
  },

  verifyToken: async (email, token) => {
    const response = await fetch(
      buildUrl('/password-reset/verify'),
      requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify({ email, token })
      })
    );
    return handleResponse(response);
  },

  resetPassword: async (email, token, newPassword) => {
    const response = await fetch(
      buildUrl('/password-reset/reset'),
      requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify({ email, token, newPassword })
      })
    );
    return handleResponse(response);
  }
};

// Password Management APIs (all require auth)
export const passwordAPI = {
  getDashboard: async () => {
    const response = await fetch(
      buildUrl('/passwords/dashboard'),
      requestConfig.withAuth()
    );
    return handleResponse(response);
  },

  getPasswordById: async (id) => {
    const response = await fetch(
      buildUrl(`/passwords/${id}`),
      requestConfig.withAuth()
    );
    return handleResponse(response);
  },

  savePassword: async (websiteUrl, websiteName, username, encryptedPassword) => {
    const data = {
      websiteUrl,
      websiteName,
      username,
      password: encryptedPassword
    };

    const response = await fetch(
      buildUrl('/passwords'),
      requestConfig.withAuth(requestConfig.withJson({
        method: 'POST',
        body: JSON.stringify(data)
      }))
    );
    return handleResponse(response);
  },

  updatePassword: async (id, encryptedPassword, websiteUrl, websiteName, username) => {
    const data = {
      newPassword: encryptedPassword,
      websiteUrl,
      websiteName,
      username
    };

    const response = await fetch(
      buildUrl(`/passwords/${id}`),
      requestConfig.withAuth(requestConfig.withJson({
        method: 'PUT',
        body: JSON.stringify(data)
      }))
    );
    return handleResponse(response);
  },

  deletePassword: async (id) => {
    const response = await fetch(
      buildUrl(`/passwords/${id}`),
      requestConfig.withAuth({
        method: 'DELETE'
      })
    );
    return handleResponse(response);
  }
};