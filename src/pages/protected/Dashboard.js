import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LogOut, Copy, Eye, EyeOff, Edit, Trash, ExternalLink, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEncryption } from '../../hooks/useEncryption';
import { passwordAPI } from '../../services/api';
import {
  Container,
  Header,
  HeaderContent,
  BrandSection,
  LogoWrapper,
  BrandName,
  UserSection,
  UserEmail,
  LogoutButton,
  Content,
  TopSection,
  SearchContainer,
  SearchInput,
  SearchIcon,
  AddButton,
  PasswordList,
  PasswordItem,
  PasswordInfo,
  WebsiteName,
  Username,
  Actions,
  ActionButton,
  PasswordDisplay,
  EmptyState,
  Error,
  ExternalSiteLink
} from '../../components/ui/DashboardStyles';

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
          <BrandSection>
            <LogoWrapper>
              <KeyRound size={24} />
            </LogoWrapper>
            <BrandName>SecurePass</BrandName>
          </BrandSection>
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
                      <ExternalSiteLink
                        href={password.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </ExternalSiteLink>
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
                    as="a"
                    href={`/password/edit/${password.passwordId}`}
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