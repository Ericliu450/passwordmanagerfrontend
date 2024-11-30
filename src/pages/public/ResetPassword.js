import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { passwordResetAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
`;

const Logo = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  color: #3b82f6;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #374151;
  }
`;

const Requirements = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
`;

const RequirementsList = styled.ul`
  margin: 8px 0 0 16px;
  padding: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
`;

const Error = styled.div`
  color: #dc2626;
  font-size: 14px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #2563eb;
  }
`;

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearTempAuth } = useAuth();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get email and token from location state
  const { email, token } = location.state || {};

  // Redirect if email or token is missing
  useEffect(() => {
    if (!email || !token) {
      navigate('/reset-password');
    }
  }, [email, token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');

    // Validate password requirements
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with uppercase letters and numbers');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await passwordResetAPI.resetPassword(email, token, formData.password);
      
      // Clear any existing auth state
      clearTempAuth();
      
      // Redirect to login with success message
      navigate('/login', {
        state: {
          message: 'Password reset successful. Please log in with your new password.',
          type: 'success'
        },
        replace: true
      });
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Container>
      <Card>
        <Logo>
          <KeyRound size={40} />
        </Logo>
        
        <Title>Set new password</Title>
        <Subtitle>Choose a strong password for your account</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="password">New password</Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPasswords.password ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <EyeButton 
                type="button"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPasswords.password ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeButton>
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <InputWrapper>
              <Input
                id="confirmPassword"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
              <EyeButton 
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeButton>
            </InputWrapper>
          </InputGroup>

          <Requirements>
            <Label as="div">Password requirements:</Label>
            <RequirementsList>
              <li>At least 8 characters long</li>
              <li>Include uppercase letters</li>
              <li>Include numbers</li>
            </RequirementsList>
          </Requirements>

          {error && <Error>{error}</Error>}

          <Button 
            type="submit" 
            disabled={loading || !formData.password || !formData.confirmPassword}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default ResetPassword;