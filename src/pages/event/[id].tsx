// pages/event/[id].tsx
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useStore } from '../../stores/useStore';
import styled from 'styled-components';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const DateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const DateItem = styled.button<{ availability: string }>`
  padding: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ availability, theme }) =>
    availability === 'available'
      ? theme.colors.primary
      : availability === 'maybe'
      ? theme.colors.secondary
      : '#2c2c2c'};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  min-width: 100px;
  text-align: center;

  &:hover {
    opacity: 0.8;
  }
`;

const ShareLink = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  background-color: #2c2c2c;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 4px;
`;

interface EventPageProps {
  eventId: string;
}

const EventPage: NextPage<EventPageProps> = ({ eventId }) => {
  const { data: session } = useSession();
  const event = useStore((state) => state.events.find(e => e.id === eventId));
  const addVote = useStore((state) => state.addVote);
  const [availability, setAvailability] = useState<{ [key: string]: string }>({});

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleDateClick = (dateId: string) => {
    if (!session?.user?.id) return;

    const currentStatus = availability[dateId] || '';
    let newStatus: 'available' | 'maybe' | 'unavailable';

    switch (currentStatus) {
      case 'available':
        newStatus = 'maybe';
        break;
      case 'maybe':
        newStatus = 'unavailable';
        break;
      default:
        newStatus = 'available';
    }

    setAvailability({ ...availability, [dateId]: newStatus });

    addVote(eventId, dateId, {
      id: uuidv4(),
      userId: session.user.id,
      availability: newStatus,
    });
  };

  const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`;

  return (
    <Container>
      <Title>{event.title}</Title>
      <Description>{event.description}</Description>
      <h3>Select Your Availability:</h3>
      <DateList>
        {event.dates.map((date) => (
          <DateItem
            key={date.id}
            availability={availability[date.id] || ''}
            onClick={() => handleDateClick(date.id)}
          >
            {new Date(date.date).toLocaleDateString()}
          </DateItem>
        ))}
      </DateList>
      <ShareLink value={shareLink} readOnly />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  return { props: { eventId: id } };
};

export default EventPage;