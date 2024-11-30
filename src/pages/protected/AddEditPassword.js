import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Wand2, Eye, EyeOff } from 'lucide-react';
import { useEncryption } from '../../hooks/useEncryption';
import { passwordAPI } from '../../services/api';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
`;

const HeaderContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled(Link)`
  color: #6b7280;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    color: #374151;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const Content = styled.main`
  max-width: 800px;
  margin: 24px auto;
  padding: 0 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const StyledForm = styled.div`
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

const PasswordSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const PasswordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const GeneratorToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #eff6ff;
  }
`;

const InputWrapper = styled.div`
  position: relative;
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

const GeneratorOptions = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LengthControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
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

function AddEditPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { encryptPassword, decryptPassword } = useEncryption();
  const { error: genError, generatePassword } = usePasswordGenerator();

  const [formData, setFormData] = useState({
    websiteName: '',
    url: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator states
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });

  useEffect(() => {
    if (id) {
      fetchPassword();
    }
  }, [id]);

  const fetchPassword = async () => {
    try {
      const data = await passwordAPI.getPasswordById(id);
      setFormData({
        websiteName: decryptPassword(data.websiteName),
        url: decryptPassword(data.url) || '',
        username: decryptPassword(data.username) || '',
        password: decryptPassword(data.encryptedPassword)
      });
    } catch (err) {
      setError('Failed to load password');
    }
  };

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.match(/^https?:\/\//)) return url;
    return `https://${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.websiteName || !formData.password) {
      setError('Website name and password are required');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // Encrypt all sensitive data
      const encryptedPassword = encryptPassword(formData.password);
      const encryptedWebsiteName = encryptPassword(formData.websiteName);
      const encryptedUrl = formData.url ? encryptPassword(formData.url) : null;
      const encryptedUsername = formData.username ? encryptPassword(formData.username) : null;
      
      if (id) {
        await passwordAPI.updatePassword(
          id,
          encryptedPassword,
          encryptedUrl,
          encryptedWebsiteName,
          encryptedUsername
        );
      } else {
        await passwordAPI.savePassword(
          encryptedUrl,
          encryptedWebsiteName,
          encryptedUsername,
          encryptedPassword
        );
      }
  
      navigate('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      setError(`Failed to ${id ? 'update' : 'save'} password`);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPassword = () => {
    const newPassword = generatePassword(length, options);
    if (newPassword) {
      setFormData(prev => ({
        ...prev,
        password: newPassword
      }));
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton to="/dashboard">
            <ArrowLeft size={20} />
          </BackButton>
          <Title>{id ? 'Edit Password' : 'Add New Password'}</Title>
        </HeaderContent>
      </Header>

      <Content>
        <Card>
          <form onSubmit={handleSubmit}>
            <StyledForm>
              <InputGroup>
                <Label>Website Name *</Label>
                <Input
                  type="text"
                  value={formData.websiteName}
                  onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Website URL</Label>
                <Input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="www.example.com"
                />
              </InputGroup>

              <InputGroup>
                <Label>Username</Label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </InputGroup>

              <PasswordSection>
                <PasswordHeader>
                  <Label>Password *</Label>
                  <GeneratorToggle type="button" onClick={() => setIsGenerating(!isGenerating)}>
                    <Wand2 size={16} />
                    {isGenerating ? 'Enter Manually' : 'Generate Password'}
                  </GeneratorToggle>
                </PasswordHeader>

                {isGenerating ? (
                  <GeneratorOptions>
                    <InputWrapper>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        readOnly
                      />
                      <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </EyeButton>
                    </InputWrapper>

                    <LengthControl>
                      <Label>Length: {length} characters</Label>
                      <Slider
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                      />
                    </LengthControl>

                    <CheckboxGroup>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={options.includeUppercase}
                          onChange={(e) => setOptions({
                            ...options,
                            includeUppercase: e.target.checked
                          })}
                        />
                        Include uppercase letters
                      </CheckboxLabel>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={options.includeLowercase}
                          onChange={(e) => setOptions({
                            ...options,
                            includeLowercase: e.target.checked
                          })}
                        />
                        Include lowercase letters
                      </CheckboxLabel>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={options.includeNumbers}
                          onChange={(e) => setOptions({
                            ...options,
                            includeNumbers: e.target.checked
                          })}
                        />
                        Include numbers
                      </CheckboxLabel>
                      <CheckboxLabel>
                        <Checkbox
                          type="checkbox"
                          checked={options.includeSymbols}
                          onChange={(e) => setOptions({
                            ...options,
                            includeSymbols: e.target.checked
                          })}
                        />
                        Include symbols
                      </CheckboxLabel>
                    </CheckboxGroup>

                    {genError && <Error>{genError}</Error>}

                    <Button type="button" onClick={generateNewPassword}>
                      Generate New Password
                    </Button>
                  </GeneratorOptions>
                ) : (
                  <InputWrapper>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <EyeButton type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </EyeButton>
                  </InputWrapper>
                )}
              </PasswordSection>

              {error && <Error>{error}</Error>}

              <Button type="submit" disabled={loading}>
                {loading ? (id ? 'Updating...' : 'Saving...') : (id ? 'Update Password' : 'Save Password')}
              </Button>
            </StyledForm>
          </form>
        </Card>
      </Content>
    </Container>
  );
}

export default AddEditPassword;