// components/EventEditor.tsx
import { useStore } from '../stores/useStore';
import { useState } from 'react';
interface EventEditorProps {
  eventId: string;
}

const EventEditor: React.FC<EventEditorProps> = ({ eventId }) => {
  const event = useStore((state) =>
    state.events.find((event) => event.id === eventId)
  );
  const updateEvent = useStore((state) => state.updateEvent);

  const [title, setTitle] = useState(event?.title || '');
  // Other state variables...

  const handleUpdate = () => {
    if (event) {
      updateEvent({ ...event, title });
      // Show success message or redirect
    }
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Other fields */}
      <button onClick={handleUpdate}>Update Event</button>
    </div>
  );
};
