import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useEncryption } from '../../hooks/useEncryption';
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

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
`;

const WarningBox = styled.div`
  display: flex;
  gap: 12px;
  background: #fff3ea;
  border: 1px solid #ffedd5;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;

  ul {
    margin: 8px 0 0 16px;
    padding: 0;
    color: #9a3412;
    font-size: 14px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
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
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 6px;
`;

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

  // Redirect if no email or already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (!email) {
      navigate('/login');
    }
  }, [email, isAuthenticated, navigate]);

  //Clear tempAuth if user leaves the page
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        clearTempAuth();
      }
    };
  }, [clearTempAuth, isAuthenticated]);

  const validatePassword = (password) => {
    if (password.length < 12) {
      throw new Error('Master password must be at least 12 characters long');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isNewUser) {
        //Validate new master password
        validatePassword(masterPass);
        if (masterPass !== confirmPass) {
          throw new Error("Passwords don't match");
        }
        
        // Set up master password for new user
        await setupMasterPassword(email, masterPass);
      } else {
        // Verify existing master password
        const isValid = await verifyMasterPassword(email, masterPass);
        if (!isValid) {
          throw new Error("Invalid master password");
        }
      }

      // Complete Authentication
      finalizeMasterPasswordSetup(email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
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

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <InputWrapper>
              <Input
                type={showPass ? 'text' : 'password'}
                value={masterPass}
                onChange={(e) => setMasterPass(e.target.value)}
                placeholder="Enter master password"
                required
                minLength={12}
              />
              <EyeIcon type="button" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </EyeIcon>
            </InputWrapper>
          </InputGroup>

          {isNewUser && (
            <InputGroup>
              <InputWrapper>
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm master password"
                  required
                  minLength={12}
                />
                <EyeIcon type="button" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </EyeIcon>
              </InputWrapper>
            </InputGroup>
          )}

          {error && <Error>{error}</Error>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isNewUser ? 'Create Master Password' : 'Continue')}
          </Button>
        </form>
      </Card>
    </Container>
  );
}

export default MasterPassword;