import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { passwordResetAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Card,
  Logo,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Label,
  InputWrapper,
  Input,
  EyeIcon,
  Button,
  Error,
  Requirements,
  RequirementsList
} from '../../components/ui/AuthFormStyles';

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

  const { email, token } = location.state || {};

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
    setError('');

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with uppercase letters and numbers');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await passwordResetAPI.resetPassword(email, token, formData.password);
      clearTempAuth();
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
                hasIcon
              />
              <EyeIcon 
                type="button"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPasswords.password ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
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
                hasIcon
              />
              <EyeIcon 
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
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