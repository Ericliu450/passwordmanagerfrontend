import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { KeyRound, Shield, Lock, ArrowRight } from 'lucide-react';

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Nav = styled.nav`
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #eaeaea;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  
  ${props => props.primary && `
    background-color: #3b82f6;
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  `}

  ${props => props.secondary && `
    background-color: #f3f4f6;
    color: #111;
    &:hover {
      background-color: #e5e7eb;
    }
  `}
`;

const TextLink = styled(Link)`
  color: #666;
  text-decoration: none;
  &:hover {
    color: #333;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 80px 0;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #111;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const TitleHighlight = styled.span`
  display: block;
  color: #3b82f6;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeaturesSection = styled.div`
  background-color: #f9fafb;
  padding: 80px 0;
  border-top: 1px solid #eaeaea;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const IconWrapper = styled.div`
  color: #3b82f6;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const CTASection = styled.div`
  padding: 80px 0;
  border-top: 1px solid #eaeaea;
`;

const CTACard = styled.div`
  background: #3b82f6;
  padding: 48px;
  border-radius: 16px;
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const CTAText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
`;

function Welcome() {
  return (
    <PageContainer>
      <Nav>
        <ContentWrapper>
          <NavContent>
            <Logo>
              <KeyRound size={24} />
              <span>SecurePass</span>
            </Logo>
            <NavLinks>
              <TextLink to="/login">Sign in</TextLink>
              <Button to="/signup" primary>Get started</Button>
            </NavLinks>
          </NavContent>
        </ContentWrapper>
      </Nav>

      <ContentWrapper>
        <HeroSection>
          <Title>
            Secure password
            <TitleHighlight>management simplified</TitleHighlight>
          </Title>
          <Subtitle>
            Generate strong passwords, store them securely, and access them anywhere.
            The simple way to keep your online accounts safe.
          </Subtitle>
          <ButtonGroup>
            <Button to="/signup" primary>
              Get started free
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Button>
            <Button to="/generator" secondary>
              Try generator
            </Button>
          </ButtonGroup>
        </HeroSection>
      </ContentWrapper>

      <FeaturesSection>
        <ContentWrapper>
          <FeatureGrid>
            <FeatureCard>
              <IconWrapper>
                <Shield size={32} />
              </IconWrapper>
              <FeatureTitle>End-to-End Encryption</FeatureTitle>
              <FeatureDescription>
                Your passwords are encrypted before they leave your device.
                Only you can access them.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <IconWrapper>
                <KeyRound size={32} />
              </IconWrapper>
              <FeatureTitle>Password Generator</FeatureTitle>
              <FeatureDescription>
                Create strong, unique passwords for all your accounts with one click.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <IconWrapper>
                <Lock size={32} />
              </IconWrapper>
              <FeatureTitle>Easy Access</FeatureTitle>
              <FeatureDescription>
                Access your passwords securely from any device, whenever you need them.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </ContentWrapper>
      </FeaturesSection>

      <ContentWrapper>
        <CTASection>
          <CTACard>
            <CTATitle>Ready to secure your passwords?</CTATitle>
            <CTAText>Join thousands of users who trust SecurePass</CTAText>
            <Button to="/signup" style={{ background: 'white', color: '#3b82f6' }}>
              Get started free
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Button>
          </CTACard>
        </CTASection>
      </ContentWrapper>
    </PageContainer>
  );
}

export default Welcome;