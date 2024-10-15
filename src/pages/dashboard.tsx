// pages/dashboard.tsx
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStore } from '../stores/useStore';
import Link from 'next/link';
import EventCard from '../components/EventCard';

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const EventSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const EventList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
`;

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();
  const events = useStore((state) => state.events);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [repliedEvents, setRepliedEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (session && session.user) {
      const userId = session.user.id;
      const now = new Date();

      setCreatedEvents(events.filter(event => event.hostId === userId && new Date(event.dates[event.dates.length - 1].date) >= now));
      setRepliedEvents(events.filter(event => event.hostId !== userId && event.dates.some(date => date.votes.some(vote => vote.userId === userId)) && new Date(event.dates[event.dates.length - 1].date) >= now));
      setPastEvents(events.filter(event => new Date(event.dates[event.dates.length - 1].date) < now));
    }
  }, [session, events]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <Container>
        <p>Please sign in to view your dashboard.</p>
      </Container>
    );
  }

  return (
    <Container>
      <EventSection>
        <Title>Your Created Events</Title>
        <EventList>
          {createdEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventList>
      </EventSection>

      <EventSection>
        <Title>Events You've Replied To</Title>
        <EventList>
          {repliedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventList>
      </EventSection>

      <EventSection>
        <Title>Past Events</Title>
        <EventList>
          {pastEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventList>
      </EventSection>
    </Container>
  );
};

export default DashboardPage;