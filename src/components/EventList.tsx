import React from 'react';
import { EventFormData, EventFilters, TaskData, BirthdayData } from '../types';
import { EventCard } from './EventCard';
import { TaskCard } from './TaskCard';
import { BirthdayCard } from './BirthdayCard';
import { Search } from 'lucide-react';

interface EventListProps {
  items: (EventFormData | TaskData | BirthdayData)[];
  onEditEvent: (event: EventFormData) => void;
  onEditTask: (task: TaskData) => void;
  onEditBirthday: (birthday: BirthdayData) => void;
  onDeleteEvent: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteBirthday: (id: string) => void;
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  onToggleReminder: (id: string, minutesBefore: number, itemType: 'event' | 'task' | 'birthday') => void;
  onToggleFavorite: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({
  items,
  onEditEvent,
  onEditTask,
  onEditBirthday,
  onDeleteEvent,
  onDeleteTask,
  onDeleteBirthday,
  filters,
  onFilterChange,
  onToggleReminder,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las categorías</option>
            <option value="Artes Escenicas y Musicales">Artes Escénicas y Musicales</option>
            <option value="Artes Visuales y del espacio">Artes Visuales y del espacio</option>
            <option value="Cine y medios audiovisual">Cine y medios audiovisual</option>
            <option value="Promocion del Libro y la Lectura">Promoción del Libro y la Lectura</option>
            <option value="Patrimonio cultural">Patrimonio cultural</option>
          </select>

          <select
            value={filters.eventType}
            onChange={(e) => onFilterChange({ ...filters, eventType: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos los tipos</option>
            <option value="Taller">Taller</option>
            <option value="Festival">Festival</option>
            <option value="Exposicion">Exposición</option>
            <option value="Toma Cultural">Toma Cultural</option>
            <option value="Encuentros">Encuentros</option>
            <option value="Proyeccion de cine">Proyección de cine</option>
            <option value="Otros">Otros</option>
          </select>

          <input
            type="date"
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ ...filters, date: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          if (item.itemType === 'event') {
            return (
              <EventCard
                key={item.id}
                event={item}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
                onToggleReminder={(id, minutes) => onToggleReminder(id, minutes, 'event')}
                onToggleFavorite={onToggleFavorite}
              />
            );
          } else if (item.itemType === 'task') {
            return (
              <TaskCard
                key={item.id}
                task={item}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleReminder={(id, minutes) => onToggleReminder(id, minutes, 'task')}
              />
            );
          } else {
            return (
              <BirthdayCard
                key={item.id}
                birthday={item}
                onEdit={onEditBirthday}
                onDelete={onDeleteBirthday}
                onToggleReminder={(id, minutes) => onToggleReminder(id, minutes, 'birthday')}
              />
            );
          }
        })}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No se encontraron elementos que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};