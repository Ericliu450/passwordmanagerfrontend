import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useEncryption } from '../../hooks/useEncryption';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Card,
  Logo,
  Title,
  Form,
  InputGroup,
  Label,
  InputWrapper,
  Input,
  EyeIcon,
  Button,
  Error,
  WarningBox
} from '../../components/ui/AuthFormStyles';

function MasterPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tempAuth, finalizeMasterPasswordSetup, clearTempAuth, isAuthenticated } = useAuth();
  const { setupMasterPassword, verifyMasterPassword } = useEncryption();

  const [masterPass, setMasterPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get email and isNewUser from either tempAuth or location state
  const email = tempAuth?.email || location.state?.email;
  const isNewUser = location.state?.isNewUser || false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (!email) {
      navigate('/login');
    }
  }, [email, isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        clearTempAuth();
      }
    };
  }, [clearTempAuth, isAuthenticated]);

  const validatePassword = (password) => {
    if (password.length < 12) {
      throw "Master password must be at least 12 characters long";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isNewUser) {
        try {
          validatePassword(masterPass);
        } catch (validationError) {
          setError(validationError);
          setLoading(false);
          return;
        }

        if (masterPass !== confirmPass) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        
        try {
          await setupMasterPassword(email, masterPass);
        } catch (setupError) {
          setError(setupError);
          setLoading(false);
          return;
        }
      } else {
        const isValid = await verifyMasterPassword(email, masterPass);
        if (!isValid) {
          setError("Invalid master password");
          setLoading(false);
          return;
        }
      }

      finalizeMasterPasswordSetup(email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Master password error:', err);
      setError(typeof err === 'string' ? err : 'An unexpected error occurred');
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
        
        <Title>
          {isNewUser ? 'Create Master Password' : 'Enter Master Password'}
        </Title>

        {isNewUser && (
          <WarningBox>
            <AlertTriangle size={20} color="#fb923c" />
            <div>
              <strong>Important:</strong>
              <ul>
                <li>Must be at least 12 characters long</li>
                <li>Cannot be reset if forgotten</li>
                <li>Used to encrypt all your passwords</li>
                <li>Store it safely - without it, your passwords cannot be recovered</li>
              </ul>
            </div>
          </WarningBox>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Master Password</Label>
            <InputWrapper>
              <Input
                type={showPass ? 'text' : 'password'}
                value={masterPass}
                onChange={(e) => setMasterPass(e.target.value)}
                placeholder="Enter master password"
                required
                minLength={12}
                disabled={loading}
                hasIcon
              />
              <EyeIcon 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                disabled={loading}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {isNewUser && (
            <InputGroup>
              <Label>Confirm Master Password</Label>
              <InputWrapper>
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm master password"
                  required
                  minLength={12}
                  disabled={loading}
                  hasIcon
                />
                <EyeIcon 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)} 
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </EyeIcon>
              </InputWrapper>
            </InputGroup>
          )}

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isNewUser ? 'Create Master Password' : 'Continue')}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default MasterPassword;