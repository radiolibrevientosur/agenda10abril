import React from 'react';
import { EventCard } from './EventCard';
import { EventFormData } from '../types';
import { motion } from 'framer-motion';

interface FavoritesSectionProps {
  events: EventData[];
  tasks: TaskData[];
  birthdays: BirthdayData[];
  onEdit: (event: EventData) => void;
  onDelete: (type: 'event' | 'task' | 'birthday', id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (type: 'event' | 'task' | 'birthday', id: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  events,
  tasks,
  birthdays,
  onEdit,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      {/* Mostrar eventos */}
      {events.filter(e => e.isFavorite).map(event => (
        <EventCard key={event.id} event={event} ... />
      ))}
      
      {/* Mostrar tareas */}
      {tasks.filter(t => t.isFavorite).map(task => (
        <TaskCard key={task.id} task={task} ... />
      ))}
      
      {/* Mostrar cumpleaños */}
      {birthdays.filter(b => b.isFavorite).map(birthday => (
        <BirthdayCard key={birthday.id} birthday={birthday} ... />
      ))}
    </div>
  );
};
  );
};
