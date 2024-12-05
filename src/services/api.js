import { buildUrl, handleResponse, requestConfig } from './apiConfig';

export const userAPI = {
  signup: async (email, password) => {
    try {
      const response = await fetch(
        buildUrl('/users/signup'),
        requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email, password })
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to create account';
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(
        buildUrl('/users/login'),
        requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email, password })
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Invalid credentials';
    }
  },

  checkEmail: async (email) => {
    try {
      const response = await fetch(
        buildUrl(`/users/check-email?email=${encodeURIComponent(email)}`)
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data.available;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to check email';
    }
  },

  logout: async () => {
    try {
      const response = await fetch(
        buildUrl('/users/logout'),
        requestConfig.withAuth({
          method: 'POST'
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return true;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to logout';
    }
  },

  setTestString: async (email, testString) => {
    try {
      const response = await fetch(
        buildUrl('/users/set-test-string'),
        requestConfig.withAuth(requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email, testString })
        }))
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return true;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to set test string';
    }
  },

  getTestString: async (email) => {
    try {
      const response = await fetch(
        buildUrl(`/users/get-test-string?email=${encodeURIComponent(email)}`),
        requestConfig.withAuth()
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data.testString;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to get test string';
    }
  }
};

// Password Reset APIs
export const passwordResetAPI = {
  requestReset: async (email) => {
    try {
      const response = await fetch(
        buildUrl('/password-reset/request'),
        requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email })
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return true;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to request password reset';
    }
  },

  verifyToken: async (email, token) => {
    try {
      const response = await fetch(
        buildUrl('/password-reset/verify'),
        requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email, token })
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data.valid;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to verify token';
    }
  },

  resetPassword: async (email, token, newPassword) => {
    try {
      const response = await fetch(
        buildUrl('/password-reset/reset'),
        requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({ email, token, newPassword })
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return true;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to reset password';
    }
  }
};

// Password Management APIs
export const passwordAPI = {
  getDashboard: async () => {
    try {
      const response = await fetch(
        buildUrl('/passwords/dashboard'),
        requestConfig.withAuth()
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to load passwords';
    }
  },

  getPasswordById: async (id) => {
    try {
      const response = await fetch(
        buildUrl(`/passwords/${id}`),
        requestConfig.withAuth()
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to load password';
    }
  },

  savePassword: async (websiteUrl, websiteName, username, encryptedPassword) => {
    try {
      const response = await fetch(
        buildUrl('/passwords'),
        requestConfig.withAuth(requestConfig.withJson({
          method: 'POST',
          body: JSON.stringify({
            websiteUrl,
            websiteName,
            username,
            password: encryptedPassword
          })
        }))
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to save password';
    }
  },

  updatePassword: async (id, encryptedPassword, websiteUrl, websiteName, username) => {
    try {
      const response = await fetch(
        buildUrl(`/passwords/${id}`),
        requestConfig.withAuth(requestConfig.withJson({
          method: 'PUT',
          body: JSON.stringify({
            newPassword: encryptedPassword,
            websiteUrl,
            websiteName,
            username
          })
        }))
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return data.data;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to update password';
    }
  },

  deletePassword: async (id) => {
    try {
      const response = await fetch(
        buildUrl(`/passwords/${id}`),
        requestConfig.withAuth({
          method: 'DELETE'
        })
      );
      const data = await handleResponse(response);
      if (!data.success) {
        throw data.message;
      }
      return true;
    } catch (error) {
      throw typeof error === 'string' ? error : 'Failed to delete password';
    }
  }
};