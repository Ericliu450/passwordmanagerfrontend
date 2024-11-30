import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { passwordResetAPI } from '../../services/api';

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

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 32px;
  color: #6b7280;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TokenInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 24px;
  letter-spacing: 8px;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    letter-spacing: normal;
  }
`;

const Timer = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
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

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover:not(:disabled) {
    color: #2563eb;
  }

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  margin-top: 24px;

  &:hover {
    color: #374151;
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

function VerifyToken() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/reset-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError('');
      await passwordResetAPI.requestReset(email);
      setTimeLeft(300); // Reset timer to 5 minutes
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await passwordResetAPI.verifyToken(email, token);
      if (isValid) {
        navigate('/new-password', {
          state: { email, token },
          replace: true
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTokenChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setToken(value);
  };

  return (
    <Container>
      <Card>
        <Logo>
          <KeyRound size={40} />
        </Logo>
        
        <Title>Verify your email</Title>
        
        <Subtitle>
          Enter the 6-digit code sent to {email}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <TokenInput
            type="text"
            value={token}
            onChange={handleTokenChange}
            placeholder="000000"
            required
          />

          {timeLeft > 0 ? (
            <Timer>Code expires in {formatTime(timeLeft)}</Timer>
          ) : (
            <ResendButton 
              type="button" 
              onClick={handleResendCode}
              disabled={loading}
            >
              Resend code
            </ResendButton>
          )}

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading || token.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </Form>

        <BackLink to="/reset-password">
          <ArrowLeft size={16} />
          Back to reset password
        </BackLink>
      </Card>
    </Container>
  );
}

export default VerifyToken;