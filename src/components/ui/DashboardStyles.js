import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Main container
export const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

// Header styles
export const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoWrapper = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
`;

export const BrandName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const UserEmail = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

// Main content styles
export const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

// Search and add section
export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

// Password list styles
export const PasswordList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const PasswordItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

export const PasswordInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const WebsiteName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Username = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const PasswordDisplay = styled.div`
  margin-top: 8px;
  font-family: monospace;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
`;

// Empty state and error styles
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

export const Error = styled.div`
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

// External link styles
export const ExternalSiteLink = styled.a`
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    color: #374151;
  }
`;