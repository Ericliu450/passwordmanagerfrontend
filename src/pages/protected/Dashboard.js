import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Plus, LogOut, Copy, Eye, EyeOff, Edit, Trash, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEncryption } from '../../hooks/useEncryption';
import { passwordAPI } from '../../services/api';

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserEmail = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const LogoutButton = styled.button`
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

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: #2563eb;
  }
`;

const PasswordList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PasswordItem = styled.div`
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

const PasswordInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WebsiteName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Username = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
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

const PasswordDisplay = styled.div`
  margin-top: 8px;
  font-family: monospace;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
`;

const Error = styled.div`
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { decryptPassword } = useEncryption();

  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    filterPasswords();
  }, [searchTerm, passwords]);

  const fetchPasswords = async () => {
    try {
      const data = await passwordAPI.getDashboard();
      const decryptedPasswords = data.map(item => ({
        ...item,
        websiteName: decryptPassword(item.websiteName),
        url: item.url ? decryptPassword(item.url) : null,
        username: item.username ? decryptPassword(item.username) : null,
        password: decryptPassword(item.encryptedPassword)
      }));
      setPasswords(decryptedPasswords);
      setFilteredPasswords(decryptedPasswords);
    } catch (err) {
      console.error('Error fetching passwords:', err);
      setError('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const filterPasswords = () => {
    const filtered = passwords.filter(password => 
      password.websiteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.url?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPasswords(filtered);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCopy = async (id, encryptedPassword) => {
    try {
      const decrypted = decryptPassword(encryptedPassword);
      await navigator.clipboard.writeText(decrypted);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError('Failed to copy password');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }

    try {
      await passwordAPI.deletePassword(id);
      setPasswords(passwords.filter(p => p.passwordId !== id));
    } catch (err) {
      setError('Failed to delete password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <EmptyState>Loading...</EmptyState>;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Password Manager</Title>
          <UserSection>
            <UserEmail>{user.email}</UserEmail>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={20} />
            </LogoutButton>
          </UserSection>
        </HeaderContent>
      </Header>

      <Content>
        {error && <Error>{error}</Error>}

        <TopSection>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
          </SearchContainer>

          <AddButton to="/password/new">
            <Plus size={20} />
            Add Password
          </AddButton>
        </TopSection>

        <PasswordList>
          {filteredPasswords.length === 0 ? (
            <EmptyState>
              {searchTerm ? 'No passwords match your search' : 'No passwords saved yet'}
            </EmptyState>
          ) : (
            filteredPasswords.map(password => (
              <PasswordItem key={password.passwordId}>
                <PasswordInfo>
                  <WebsiteName>
                    {password.websiteName}
                    {password.url && (
                      <a
                        href={password.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </WebsiteName>
                  {password.username && (
                    <Username>{password.username}</Username>
                  )}
                  {visiblePasswords.has(password.passwordId) && (
                    <PasswordDisplay>
                      {decryptPassword(password.encryptedPassword)}
                    </PasswordDisplay>
                  )}
                </PasswordInfo>
                <Actions>
                  <ActionButton
                    onClick={() => handleCopy(password.passwordId, password.encryptedPassword)}
                    title="Copy password"
                  >
                    <Copy size={20} color={copiedId === password.passwordId ? '#16a34a' : undefined} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => togglePasswordVisibility(password.passwordId)}
                    title={visiblePasswords.has(password.passwordId) ? 'Hide password' : 'Show password'}
                  >
                    {visiblePasswords.has(password.passwordId) ? <EyeOff size={20} /> : <Eye size={20} />}
                  </ActionButton>
                  <ActionButton
                    as={Link}
                    to={`/password/edit/${password.passwordId}`}
                    title="Edit password"
                  >
                    <Edit size={20} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDelete(password.passwordId)}
                    title="Delete password"
                  >
                    <Trash size={20} />
                  </ActionButton>
                </Actions>
              </PasswordItem>
            ))
          )}
        </PasswordList>
      </Content>
    </Container>
  );
}

export default Dashboard;