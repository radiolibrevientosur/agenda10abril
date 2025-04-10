export type RecurrenceType = 'una vez' | 'diaria' | 'anual' | 'personalizada';

interface Recurrence {
  type: RecurrenceType;
  endDate?: string;
  daysOfWeek?: string[];
  occurrences?: number;
}

export interface EventFormData {
  id: string;
  title: string;
  eventType: 'Taller' | 'Festival' | 'Exposicion' | 'Toma Cultural' | 'Encuentros' | 'Proyeccion de cine' | 'Otros';
  description: string;
  category: 'Artes Escenicas y Musicales' | 'Artes Visuales y del espacio' | 'Cine y medios audiovisual' | 'Promocion del Libro y la Lectura' | 'Patrimonio cultural';
  datetime: string;
  location: string;
  mapLink?: string;
  responsibleName: string;
  phone: string;
  socialMedia: string;
  image?: string;
  targetAudience: 'Infantil' | 'Adultos' | 'Todos';
  cost: {
    isFree: boolean;
    amount?: number;
  };
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
    triggered?: boolean;
  };
  isFavorite?: boolean;
  recurrence: Recurrence;
  itemType: 'event';
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'En Progreso' | 'Completada';
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
    triggered?: boolean;
  };
  isFavorite?: boolean;
  itemType: 'task';
}

export interface BirthdayData {
  id: string;
  name: string;
  birthDate: string;
  description?: string;
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
    triggered?: boolean;
  };
  isFavorite?: boolean;
  itemType: 'birthday';
}

type ItemData = EventFormData | TaskData | BirthdayData;

export type EventFilters = {
  search: string;
  category?: string;
  eventType?: string;
  date?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  photo?: string;
  theme?: 'light' | 'dark';
}

export type ActiveSection = 'search' | 'create' | 'profile' | 'favorites' | null;

export type CreateOption = 'event' | 'task' | 'birthday' | null;