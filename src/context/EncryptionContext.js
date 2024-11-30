import React, { createContext, useState, useCallback, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { userAPI } from '../services/api';

export const EncryptionContext = createContext(null);

export function EncryptionProvider({ children }) {
  const [masterKey, setMasterKey] = useState(() => {
    const storedKey = sessionStorage.getItem('encryptionKey');
    return storedKey || null;
  });

  const generateEncryptionKey = useCallback((masterPassword, email) => {
    return CryptoJS.PBKDF2(masterPassword, email, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
  }, []);

  const setupMasterPassword = useCallback(async (email, masterPassword) => {
    try {
      // Generate encryption key from master password
      const key = generateEncryptionKey(masterPassword, email);

      // Create a test string to verify master password later
      const testString = `VALID_${Date.now()}`;
      const encryptedTest = CryptoJS.AES.encrypt(testString, key).toString();

      // Store the test string using the API - now properly handling JSON response
      const response = await userAPI.setTestString(email, encryptedTest);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to setup master password');
      }

      // Store the key in memory and sessionStorage
      setMasterKey(key);
      sessionStorage.setItem('encryptionKey', key);

      return true;
    } catch (error) {
      console.error('Setup master password error:', error);
      throw new Error(error.message || 'Failed to setup master password');
    }
  }, [generateEncryptionKey]);

  // Updated verifyMasterPassword function in EncryptionContext.js
  // In EncryptionContext.js

const verifyMasterPassword = useCallback(async (email, masterPassword) => {
    try {
      // Regenerate the key
      const key = generateEncryptionKey(masterPassword, email);
      
      // Get the test string - it's returned directly as a string
      const encryptedTest = await userAPI.getTestString(email);
      
      if (!encryptedTest) {
        throw new Error('No test string found');
      }
      
      // Try to decrypt it
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedTest, key);
        const decryptedTest = bytes.toString(CryptoJS.enc.Utf8);
        
        if (decryptedTest.startsWith('VALID_')) {
          setMasterKey(key);
          sessionStorage.setItem('encryptionKey', key);
          return true;
        }
      } catch (decryptError) {
        console.error('Decryption failed:', decryptError);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Master password verification failed:', error);
      return false;
    }
}, [generateEncryptionKey]);

  const encryptPassword = useCallback((password) => {
    if (!masterKey) {
      throw new Error('Encryption key not initialized');
    }
    try {
      return CryptoJS.AES.encrypt(password, masterKey).toString();
    } catch (error) {
      throw new Error('Failed to encrypt password');
    }
  }, [masterKey]);

  const decryptPassword = useCallback((encryptedPassword) => {
    if (!masterKey) {
      throw new Error('Encryption key not initialized');
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Failed to decrypt password');
    }
  }, [masterKey]);

  const clearEncryption = useCallback(() => {
    setMasterKey(null);
    sessionStorage.removeItem('encryptionKey');
  }, []);

  const value = {
    setupMasterPassword,
    verifyMasterPassword,
    encryptPassword,
    decryptPassword,
    clearEncryption,
    isInitialized: !!masterKey
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}