// pages/auth/signin.tsx
import { GetServerSideProps } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

interface SignInProps {
  providers: any;
}

const SignInPage: React.FC<SignInProps> = ({ providers }) => {
  return (
    <Container>
      <Title>Sign In to Linxx</Title>
      {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>
          <Button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </Container>
  );
};

export default SignInPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
