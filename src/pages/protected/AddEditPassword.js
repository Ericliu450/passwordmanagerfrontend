import React, { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { ArrowLeft, Wand2, Eye, EyeOff } from 'lucide-react';
import { useEncryption } from '../../hooks/useEncryption';
import { passwordAPI } from '../../services/api';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import {
  Form,
  InputGroup,
  Label,
  InputWrapper,
  Input,
  EyeIcon,
  Button,
  Error,
  BackLink
} from '../../components/ui/AuthFormStyles';
import {
  PageContainer,
  Header,
  HeaderContent,
  PageContent,
  Card,
  GeneratorSection,
  GeneratorHeader,
  GeneratorToggle,
  GeneratorOptions,
  LengthControl,
  Slider,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox
} from '../../components/ui/AddEditPasswordStyles';

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
        url: data.url ? decryptPassword(data.url) : '',
        username: data.username ? decryptPassword(data.username) : '',
        password: decryptPassword(data.encryptedPassword)
      });
    } catch (err) {
      setError('Failed to load password');
    }
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
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackLink to="/dashboard">
            <ArrowLeft size={20} />
          </BackLink>
          <h1>{id ? 'Edit Password' : 'Add New Password'}</h1>
        </HeaderContent>
      </Header>

      <PageContent>
        <Card>
          <Form onSubmit={handleSubmit}>
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

            <GeneratorSection>
              <GeneratorHeader>
                <Label>Password *</Label>
                <GeneratorToggle type="button" onClick={() => setIsGenerating(!isGenerating)}>
                  <Wand2 size={16} />
                  {isGenerating ? 'Enter Manually' : 'Generate Password'}
                </GeneratorToggle>
              </GeneratorHeader>

              {isGenerating ? (
                <GeneratorOptions>
                  <InputWrapper>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      readOnly
                      hasIcon
                    />
                    <EyeIcon type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </EyeIcon>
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
                    hasIcon
                  />
                  <EyeIcon type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </EyeIcon>
                </InputWrapper>
              )}
            </GeneratorSection>

            {error && <Error>{error}</Error>}

            <Button type="submit" disabled={loading}>
              {loading ? (id ? 'Updating...' : 'Saving...') : (id ? 'Update Password' : 'Save Password')}
            </Button>
          </Form>
        </Card>
      </PageContent>
    </PageContainer>
  );
}

export default AddEditPassword;