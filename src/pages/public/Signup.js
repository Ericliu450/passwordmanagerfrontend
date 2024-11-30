import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 32px;
`;

const Logo = styled.div`
  color: #3b82f6;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

const SubtitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 32px;
  color: #6b7280;
  font-size: 14px;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: #2563eb;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const EyeIcon = styled.button`
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

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #2563eb;
  }
`;

const Error = styled.div`
  color: #dc2626;
  font-size: 14px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 6px;
`;

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signup(formData.email, formData.password);
      if (result.success) {
        navigate('/master-password', { 
          state: { 
            email: formData.email,
            isNewUser: true 
          }
        });
      } else {
        throw new Error(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <KeyRound size={40} />
        </Logo>
        
        <Title>Create your account</Title>
        
        <SubtitleWrapper>
          Already have an account? <Link to="/login">Sign in</Link>
        </SubtitleWrapper>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <EyeIcon type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Continue'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Signup;