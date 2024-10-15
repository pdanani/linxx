// components/NavBar.tsx
import { useSession, signIn, signOut } from 'next-auth/react';

const NavBar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav>
      <h1>Linxx</h1>
      {session ? (
        <>
          <span>Welcome, {session.user?.name}</span>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  );
};
