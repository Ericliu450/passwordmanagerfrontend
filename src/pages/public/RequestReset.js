import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { passwordResetAPI } from '../../services/api';
import {
  Container,
  Card,
  Logo,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Label,
  Input,
  Button,
  Error,
  BackLink,
  InfoText
} from '../../components/ui/AuthFormStyles';

function RequestReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await passwordResetAPI.requestReset(email);
      if (result) {
        navigate('/verify-token', { 
          state: { email },
          replace: true 
        });
      } else {
        throw new Error('Failed to send reset code');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <KeyRound size={40} />
        </Logo>
        
        <Title>Reset your password</Title>
        
        <Subtitle>
          Enter your email address and we'll send you a code to reset your password
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </Form>

        <BackLink to="/login">
          <ArrowLeft size={16} />
          Back to login
        </BackLink>

        <InfoText>
          Note: This will only reset your account password.
          Your master password cannot be reset or recovered.
        </InfoText>
      </Card>
    </Container>
  );
}

export default RequestReset;
