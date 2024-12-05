import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { passwordResetAPI } from '../../services/api';
import {
  Container,
  Card,
  Logo,
  Title,
  Subtitle,
  Form,
  VerificationInput,
  Button,
  Error,
  BackLink,
  Timer,
  TextButton
} from '../../components/ui/AuthFormStyles';

function VerifyToken() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
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
      setTimeLeft(300);
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
          <VerificationInput
            type="text"
            value={token}
            onChange={handleTokenChange}
            placeholder="000000"
            required
          />

          {timeLeft > 0 ? (
            <Timer>Code expires in {formatTime(timeLeft)}</Timer>
          ) : (
            <TextButton 
              type="button" 
              onClick={handleResendCode}
              disabled={loading}
            >
              Resend code
            </TextButton>
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