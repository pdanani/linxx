// pages/index.tsx
import { NextPage } from 'next';
import styled from 'styled-components';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.background};
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const HomePage: NextPage = () => {
  const { data: session } = useSession();

  return (
    <Container>
      <Title>Welcome to Linxx</Title>
      <Subtitle>
        The easiest way to plan events and find the perfect time to meet with your friends and colleagues.
      </Subtitle>
      <ButtonGroup>
        {session ? (
          <Link href="/dashboard" passHref>
            <Button>Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/create" passHref>
              <Button>Try It Out</Button>
            </Link>
            <Link href="/api/auth/signin" passHref>
              <Button>Log In</Button>
            </Link>
          </>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default HomePage;