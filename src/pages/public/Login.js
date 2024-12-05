import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
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
  TextLink
} from '../../components/ui/AuthFormStyles';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/master-password', { 
          state: { 
            email: formData.email,
            isNewUser: false 
          }
        });
      } else {
        throw new Error(result.error || 'Invalid credentials');
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
        
        <Title>Welcome back</Title>
        
        <Subtitle>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">
              Password
              <TextLink to="/reset-password">Forgot password?</TextLink>
            </Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                hasIcon
              />
              <EyeIcon type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;