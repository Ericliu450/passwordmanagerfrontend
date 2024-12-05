import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  
  * {
    box-sizing: border-box;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  width: 100%;
`;

export const Logo = styled.div`
  color: #3b82f6;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: ${props => props.noMargin ? '0' : '32px'};
  
  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: #2563eb;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: ${props => props.hasIcon ? '12px 40px 12px 12px' : '12px'};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: ${props => props.large ? '24px' : '14px'};
  text-align: ${props => props.center ? 'center' : 'left'};
  letter-spacing: ${props => props.spaced ? '0.25em' : 'normal'};
  margin: 0;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    letter-spacing: normal;
  }
`;

export const VerificationInput = styled(Input).attrs({
  center: true,
  large: true,
  spaced: true,
  maxLength: 6
})`
  font-family: monospace;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #2563eb;
  }

  ${props => props.secondary && css`
    background: #f3f4f6;
    color: #374151;
    
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}
`;

export const IconButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #374151;
  }
`;

export const Error = styled.div`
  width: 100%;
  color: #dc2626;
  font-size: 14px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  width: 100%;
  color: #059669;
  font-size: 14px;
  padding: 8px 12px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  text-align: center;
`;

export const BackLink = styled(Link)`
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

export const TextLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    color: #2563eb;
  }
`;

export const TextButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
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

export const Timer = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  width: 100%;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
`;

export const Requirements = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
`;

export const RequirementsList = styled.ul`
  margin: 8px 0 0 16px;
  padding: 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
`;

export const WarningBox = styled.div`
  display: flex;
  gap: 12px;
  background: #fff7ed;
  border: 1px solid #ffedd5;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  width: 100%;
  align-items: flex-start;

  ul {
    margin: 8px 0 0 16px;
    padding: 0;
    color: #9a3412;
    font-size: 14px;
  }
`;

export const InfoText = styled.p`
  color: #6b7280;
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
  width: 100%;
`;

export const EyeIcon = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  margin: 0;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #374151;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;