import { useState, useCallback } from 'react';

export const usePasswordGenerator = () => {
  const [error, setError] = useState('');

  const generatePassword = useCallback((length, options) => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{}|;:\'",.<>?/'
    };

    let chars = '';
    if (options.includeLowercase) chars += charSets.lowercase;
    if (options.includeUppercase) chars += charSets.uppercase;
    if (options.includeNumbers) chars += charSets.numbers;
    if (options.includeSymbols) chars += charSets.symbols;

    if (!chars) {
      setError('Please select at least one character type');
      return null;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += chars[Math.floor(Math.random() * chars.length)];
    }

    // Validate password contains required character types
    const isValid = {
      lowercase: !options.includeLowercase || /[a-z]/.test(generatedPassword),
      uppercase: !options.includeUppercase || /[A-Z]/.test(generatedPassword),
      numbers: !options.includeNumbers || /\d/.test(generatedPassword),
      symbols: !options.includeSymbols || /[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]/.test(generatedPassword)
    };

    if (!Object.values(isValid).every(Boolean)) {
      return generatePassword(length, options);
    }

    setError('');
    return generatedPassword;
  }, []);

  const calculateStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  return { error, generatePassword, calculateStrength };
};