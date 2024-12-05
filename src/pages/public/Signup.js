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
  Error
} from '../../components/ui/AuthFormStyles';

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
        
        <Subtitle>
          Already have an account? <Link to="/login">Sign in</Link>
        </Subtitle>

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
                hasIcon
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