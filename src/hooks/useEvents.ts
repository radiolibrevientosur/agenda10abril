import { useState, useEffect } from 'react';
import { EventFormData, EventFilters, TaskData, BirthdayData } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'cultural-events';
const TASKS_KEY = 'cultural-tasks';
const BIRTHDAYS_KEY = 'cultural-birthdays';
const REMINDERS_KEY = 'event-reminders';
const FAVORITES_KEY = 'favorite-events';

const alarmSound = new Audio('/alarm.mp3');

const generateRecurringEvents = (baseEvent: EventFormData): EventFormData[] => {
  // ... (mantener el código existente de generateRecurringEvents)
};

export const useEvents = () => {
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayData[]>([]);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    category: undefined,
    eventType: undefined,
    date: undefined,
  });

  useEffect(() => {
    const loadStoredData = () => {
      // Cargar eventos
      const storedEvents = localStorage.getItem(STORAGE_KEY);
      const storedReminders = localStorage.getItem(REMINDERS_KEY);
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        
        // Apply reminders
        if (storedReminders) {
          const reminders = JSON.parse(storedReminders);
          parsedEvents.forEach((event: EventFormData) => {
            event.reminder = reminders[event.id];
          });
        }

        // Apply favorites
        if (storedFavorites) {
          const favorites = JSON.parse(storedFavorites);
          parsedEvents.forEach((event: EventFormData) => {
            event.isFavorite = favorites.includes(event.id);
          });
        }

        // Filter out past events and sort
        const now = new Date();
        const validEvents = parsedEvents
          .filter((event: EventFormData) => new Date(event.datetime) > now)
          .sort((a: EventFormData, b: EventFormData) => 
            new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
          );

        setEvents(validEvents);
      }

      // Cargar tareas
      const storedTasks = localStorage.getItem(TASKS_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const now = new Date();
        const validTasks = parsedTasks
          .filter((task: TaskData) => new Date(task.dueDate) > now)
          .sort((a: TaskData, b: TaskData) => 
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
        setTasks(validTasks);
      }

      // Cargar cumpleaños
      const storedBirthdays = localStorage.getItem(BIRTHDAYS_KEY);
      if (storedBirthdays) {
        const parsedBirthdays = JSON.parse(storedBirthdays);
        setBirthdays(parsedBirthdays);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const checkItem = (item: EventFormData | TaskData | BirthdayData) => {
        if (item.reminder?.enabled) {
          const itemTime = new Date(item.itemType === 'birthday' ? item.birthDate : 
                                  item.itemType === 'task' ? item.dueDate : 
                                  item.datetime).getTime();
          const reminderTime = itemTime - (item.reminder.minutesBefore * 60 * 1000);
          const now = new Date().getTime();

          if (now >= reminderTime && now < itemTime && !item.reminder.triggered) {
            alarmSound.play().catch(console.error);

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Recordatorio', {
                body: `${item.itemType === 'birthday' ? 'Cumpleaños de' : 
                       item.itemType === 'task' ? 'Tarea:' : 
                       'Evento:'} "${item.title}"`,
                icon: '/icon.png'
              });
            }

            // Marcar recordatorio como activado
            if (item.itemType === 'event') {
              const updatedEvents = events.map(e => {
                if (e.id === item.id && e.reminder) {
                  return { ...e, reminder: { ...e.reminder, triggered: true } };
                }
                return e;
              });
              saveEvents(updatedEvents);
            } else if (item.itemType === 'task') {
              const updatedTasks = tasks.map(t => {
                if (t.id === item.id && t.reminder) {
                  return { ...t, reminder: { ...t.reminder, triggered: true } };
                }
                return t;
              });
              saveTasks(updatedTasks);
            } else if (item.itemType === 'birthday') {
              const updatedBirthdays = birthdays.map(b => {
                if (b.id === item.id && b.reminder) {
                  return { ...b, reminder: { ...b.reminder, triggered: true } };
                }
                return b;
              });
              saveBirthdays(updatedBirthdays);
            }
          }
        }
      };

      [...events, ...tasks, ...birthdays].forEach(checkItem);
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [events, tasks, birthdays]);

  const saveEvents = (newEvents: EventFormData[]) => {
    const now = new Date();
    const validEvents = newEvents
      .filter(event => new Date(event.datetime) > now)
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validEvents));
    
    const reminders = validEvents.reduce((acc, event) => {
      if (event.reminder) {
        acc[event.id] = event.reminder;
      }
      return acc;
    }, {} as Record<string, { enabled: boolean; minutesBefore: number; triggered?: boolean }>);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));

    const favorites = validEvents
      .filter(event => event.isFavorite)
      .map(event => event.id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    setEvents(validEvents);
  };

  const saveTasks = (newTasks: TaskData[]) => {
    const now = new Date();
    const validTasks = newTasks
      .filter(task => new Date(task.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    localStorage.setItem(TASKS_KEY, JSON.stringify(validTasks));
    setTasks(validTasks);
  };

  const saveBirthdays = (newBirthdays: BirthdayData[]) => {
    localStorage.setItem(BIRTHDAYS_KEY, JSON.stringify(newBirthdays));
    setBirthdays(newBirthdays);
  };

  const addEvent = (event: Omit<EventFormData, 'id'>) => {
    const baseEvent = { ...event, id: crypto.randomUUID() };
    const recurringEvents = generateRecurringEvents(baseEvent);

    if (recurringEvents.length === 0) {
      toast.error('No se pueden crear eventos en el pasado');
      return;
    }

    const newEvents = recurringEvents.filter(
      newEvent => !events.some(existing => 
        existing.title === newEvent.title && 
        existing.datetime === newEvent.datetime
      )
    );

    if (newEvents.length === 0) {
      toast.error('Los eventos ya existen en el calendario');
      return;
    }

    saveEvents([...events, ...newEvents]);
    toast.success(`${newEvents.length} evento(s) creado(s) exitosamente`);
  };

  const addTask = (task: Omit<TaskData, 'id'>) => {
    const newTask = { ...task, id: crypto.randomUUID() };
    saveTasks([...tasks, newTask]);
    toast.success('Tarea creada exitosamente');
  };

  const addBirthday = (birthday: Omit<BirthdayData, 'id'>) => {
    const newBirthday = { ...birthday, id: crypto.randomUUID() };
    saveBirthdays([...birthdays, newBirthday]);
    toast.success('Cumpleaños agregado exitosamente');
  };

  const updateEvent = (event: EventFormData) => {
    const newEvents = events.map(e => e.id === event.id ? event : e);
    saveEvents(newEvents);
    toast.success('Evento actualizado exitosamente');
  };

  const updateTask = (task: TaskData) => {
    const newTasks = tasks.map(t => t.id === task.id ? task : t);
    saveTasks(newTasks);
    toast.success('Tarea actualizada exitosamente');
  };

  const updateBirthday = (birthday: BirthdayData) => {
    const newBirthdays = birthdays.map(b => b.id === birthday.id ? birthday : b);
    saveBirthdays(newBirthdays);
    toast.success('Cumpleaños actualizado exitosamente');
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(e => e.id !== id);
    saveEvents(newEvents);
    toast.success('Evento eliminado exitosamente');
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
    toast.success('Tarea eliminada exitosamente');
  };

  const deleteBirthday = (id: string) => {
    const newBirthdays = birthdays.filter(b => b.id !== id);
    saveBirthdays(newBirthdays);
    toast.success('Cumpleaños eliminado exitosamente');
  };

  const toggleFavorite = (id: string) => {
    const newEvents = events.map(event =>
      event.id === id
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    );
    saveEvents(newEvents);
    const event = newEvents.find(e => e.id === id);
    toast.success(event?.isFavorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
  };

  const toggleReminder = (id: string, minutesBefore: number, itemType: 'event' | 'task' | 'birthday') => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (itemType === 'event') {
      const newEvents = events.map(event =>
        event.id === id
          ? {
              ...event,
              reminder: {
                enabled: true,
                minutesBefore,
                triggered: false
              },
            }
          : event
      );
      saveEvents(newEvents);
    } else if (itemType === 'task') {
      const newTasks = tasks.map(task =>
        task.id === id
          ? {
              ...task,
              reminder: {
                enabled: true,
                minutesBefore,
                triggered: false
              },
            }
          : task
      );
      saveTasks(newTasks);
    } else if (itemType === 'birthday') {
      const newBirthdays = birthdays.map(birthday =>
        birthday.id === id
          ? {
              ...birthday,
              reminder: {
                enabled: true,
                minutesBefore,
                triggered: false
              },
            }
          : birthday
      );
      saveBirthdays(newBirthdays);
    }
    
    toast.success('Recordatorio configurado exitosamente');
  };

  const filteredItems = [...events, ...tasks, ...birthdays].filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (item.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
    
    if (item.itemType === 'event') {
      const event = item as EventFormData;
      const matchesCategory = !filters.category || event.category === filters.category;
      const matchesType = !filters.eventType || event.eventType === filters.eventType;
      const matchesDate = !filters.date || event.datetime.startsWith(filters.date);
      return matchesSearch && matchesCategory && matchesType && matchesDate;
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    const dateA = new Date(a.itemType === 'birthday' ? a.birthDate : 
                          a.itemType === 'task' ? a.dueDate : 
                          a.datetime).getTime();
    const dateB = new Date(b.itemType === 'birthday' ? b.birthDate : 
                          b.itemType === 'task' ? b.dueDate : 
                          b.datetime).getTime();
    return dateA - dateB;
  });

  return {
    items: filteredItems,
    events,
    tasks,
    birthdays,
    addEvent,
    addTask,
    addBirthday,
    updateEvent,
    updateTask,
    updateBirthday,
    deleteEvent,
    deleteTask,
    deleteBirthday,
    toggleReminder,
    toggleFavorite,
    filters,
    setFilters,
  };
};