import React from 'react';
import { EventFormData, EventFilters, TaskData, BirthdayData } from '../types';
import { EventCard } from './EventCard';
import { TaskCard } from './TaskCard';
import { BirthdayCard } from './BirthdayCard';
import { Search } from 'lucide-react';

interface EventListProps {
  events: (EventFormData | TaskData | BirthdayData)[];
  onEdit: (event: EventFormData) => void;
  onDelete: (id: string) => void;
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const renderItem = (item: EventFormData | TaskData | BirthdayData) => {
    if ('eventType' in item) {
      return (
        <EventCard
          key={item.id}
          event={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={onToggleFavorite}
        />
      );
    } else if ('status' in item) {
      return (
        <TaskCard
          key={item.id}
          task={item}
          onDelete={onDelete}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={onToggleFavorite}
        />
      );
    } else {
      return (
        <BirthdayCard
          key={item.id}
          birthday={item}
          onDelete={onDelete}
          onToggleReminder={onToggleReminder}
          onToggleFavorite={onToggleFavorite}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Todas las categorías</option>
            <option value="Artes Escenicas y Musicales">Artes Escénicas y Musicales</option>
            <option value="Artes Visuales y del espacio">Artes Visuales y del espacio</option>
            <option value="Cine y medios audiovisual">Cine y medios audiovisual</option>
            <option value="Promocion del Libro y la Lectura">Promoción del Libro y la Lectura</option>
            <option value="Patrimonio cultural">Patrimonio cultural</option>
          </select>

          <select
            value={filters.eventType || ''}
            onChange={(e) => onFilterChange({ ...filters, eventType: e.target.value || undefined })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(item => renderItem(item))}
        {events.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No se encontraron elementos que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};