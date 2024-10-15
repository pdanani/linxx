
// components/EventCard.tsx
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Event } from '../stores/useStore';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Status = styled.span<{ status: 'draft' | 'published' }>`
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
  background-color: ${({ status, theme }) => status === 'published' ? theme.colors.secondary : theme.colors.error};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 4px;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const ViewButton = styled.a`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  margin-top: auto;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card>
      <Title>{event.title}</Title>
      <Description>{event.description}</Description>
      <Status status={event.status}>{event.status}</Status>
      <Link href={`/event/${event.id}`} passHref>
        <ViewButton>View Event</ViewButton>
      </Link>
    </Card>
  );
};

export default EventCard;