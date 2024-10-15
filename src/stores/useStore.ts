// stores/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Event {
  id: string;
  title: string;
  description?: string;
  image?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  hostId: string;
  dates: EventDate[];
}

interface EventDate {
  id: string;
  date: Date;
  votes: Vote[];
}

interface Vote {
  id: string;
  userId: string;
  availability: 'available' | 'maybe' | 'unavailable';
}

interface StoreState {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  removeEvent: (eventId: string) => void;
  addVote: (eventId: string, dateId: string, vote: Vote) => void;
  publishEvent: (eventId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, event],
        })),
      updateEvent: (updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        })),
      removeEvent: (eventId) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== eventId),
        })),
      addVote: (eventId, dateId, vote) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  dates: event.dates.map((date) =>
                    date.id === dateId
                      ? { ...date, votes: [...date.votes, vote] }
                      : date
                  ),
                }
              : event
          ),
        })),
      publishEvent: (eventId) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? { ...event, status: 'published' }
              : event
          ),
        })),
    }),
    {
      name: 'linxx-storage',
    }
  )
);