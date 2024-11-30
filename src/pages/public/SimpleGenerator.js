import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, Copy, CheckSquare, ArrowRight } from 'lucide-react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GeneratorCard = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
`;

// Main content wrapper to control inner layout
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const PasswordSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;  // Center the container horizontally
  margin-bottom: 24px;
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 90%;  // Take up most but not all of the parent width
  display: flex;
  justify-content: center;
`;

const PasswordInput = styled.input`
  width: 90%;  // Take up most but not all of the container width
  padding: 12px 80px 12px 12px;  // Right padding for the buttons
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: monospace;
  font-size: 16px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  position: absolute;
  right: 5%;  // Align with the input's right edge
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 6px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const ControlsSection = styled.div`
  width: 100%;
`;

const LengthControl = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;

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
  margin-bottom: 24px;
  align-items: flex-start;  // Align checkboxes to the left
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
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
  background: ${props => props.primary ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.primary ? 'white' : '#111827'};
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: ${props => props.marginBottom ? '12px' : '0'};

  &:hover {
    background: ${props => props.primary ? '#2563eb' : '#e5e7eb'};
  }
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none;
`;

function SimpleGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const { error, generatePassword } = usePasswordGenerator();

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(length, options);
    if (newPassword) {
      setPassword(newPassword);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password');
    }
  };

  return (
    <PageContainer>
      <GeneratorCard>
        <Title>Password Generator</Title>
        
        <ContentWrapper>
          <PasswordSection>
            <PasswordContainer>
              <PasswordInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                placeholder="Click generate to create password"
              />
              {password && (
                <ButtonGroup>
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                  <IconButton onClick={handleCopy}>
                    {copied ? <CheckSquare size={20} color="#16a34a" /> : <Copy size={20} />}
                  </IconButton>
                </ButtonGroup>
              )}
            </PasswordContainer>
          </PasswordSection>

          <ControlsSection>
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
                  onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                />
                Include uppercase letters
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                />
                Include lowercase letters
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                />
                Include numbers
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                />
                Include symbols
              </CheckboxLabel>
            </CheckboxGroup>

            <Button primary marginBottom onClick={handleGeneratePassword}>
              Generate Password
            </Button>

            <StyledLink to="/signup">
              <Button>
                Create an account to save passwords
                <ArrowRight size={20} />
              </Button>
            </StyledLink>
          </ControlsSection>
        </ContentWrapper>
      </GeneratorCard>
    </PageContainer>
  );
}

export default SimpleGenerator;