// pages/create.tsx
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import { useStore } from '../stores/useStore';
import { v4 as uuidv4 } from 'uuid';
import CalendarSelector from '@/components/CalendarSelector';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  background-color: #2c2c2c;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  background-color: #2c2c2c;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
  font-size: 1rem;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
const CreateEventPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const addEvent = useStore((state) => state.addEvent);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [image, setImage] = useState<File | null>(null);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session || !session.user) {
      // Redirect to sign in if not authenticated
      signIn();
      return;
    }

    const newEvent = {
      id: uuidv4(),
      title,
      description,
      image: image ? URL.createObjectURL(image) : '',
      status: 'draft' as const,
      createdAt: new Date(),
      dates: selectedDates.map(date => ({ id: uuidv4(), date, votes: [] })),
      hostId: session.user.id,  // Add this line to include the hostId
    };
    addEvent(newEvent);
    router.push('/dashboard');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Container>
      <Title>Create a New Event</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
        <CalendarSelector
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Button type="submit">Save Draft</Button>
      </Form>
    </Container>
  );
};

export default CreateEventPage;