import React from 'react';
import { EventCard } from './EventCard';
import { TaskCard } from './TaskCard';
import { BirthdayCard } from './BirthdayCard';
import { EventData, TaskData, BirthdayData } from '../types';
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
      {/* Eventos Favoritos */}
      {events.filter(e => e.isFavorite).map(event => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={() => onEdit(event)}
          onDelete={() => onDelete('event', event.id)}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={() => onToggleFavorite('event', event.id)}
        />
      ))}

      {/* Tareas Favoritas */}
      {tasks.filter(t => t.isFavorite).map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={() => onDelete('task', task.id)}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={() => onToggleFavorite('task', task.id)}
        />
      ))}

      {/* Cumpleaños Favoritos */}
      {birthdays.filter(b => b.isFavorite).map(birthday => (
        <BirthdayCard
          key={birthday.id}
          birthday={birthday}
          onDelete={() => onDelete('birthday', birthday.id)}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={() => onToggleFavorite('birthday', birthday.id)}
        />
      ))}
    </div>
  );
};
