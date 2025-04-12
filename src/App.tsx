import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar, Moon, Sun } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { TaskForm } from './components/TaskForm';
import { BirthdayForm } from './components/BirthdayForm';
import { CreateOptions } from './components/CreateOptions';
import { EventList } from './components/EventList';
import { VirtualizedEventList } from './components/VirtualizedEventList';
import { CalendarView } from './components/CalendarView';
import { EventDetails } from './components/EventDetails';
import { Navbar } from './components/Navbar';
import { ProfileEditor } from './components/ProfileEditor';
import { FavoritesSection } from './components/FavoritesSection';
import { Footer } from './components/Footer';
import { useEvents } from './hooks/useEvents';
import { EventFormData, ActiveSection, CreateOption, TaskData, BirthdayData } from './types';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Hook personalizado para localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [createOption, setCreateOption] = useState<CreateOption>(null);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Estados persistentes para tareas y cumpleaños
  const [tasks, setTasks] = useLocalStorage<TaskData[]>('tasks', []);
  const [birthdays, setBirthdays] = useLocalStorage<BirthdayData[]>('birthdays', []);

  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleReminder,
    toggleFavorite,
    filters,
    setFilters
  } = useEvents();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Handlers para tareas
  const addTask = (taskData: Omit<TaskData, 'id'>) => {
    setTasks(prev => [...prev, { ...taskData, id: crypto.randomUUID() }]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Handlers para cumpleaños
  const addBirthday = (birthdayData: Omit<BirthdayData, 'id'>) => {
    setBirthdays(prev => [...prev, { ...birthdayData, id: crypto.randomUUID() }]);
  };

  const deleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  // Handler común para favoritos
  const handleToggleFavorite = (type: 'event' | 'task' | 'birthday', id: string) => {
    if (type === 'event') {
      toggleFavorite(id);
    } else if (type === 'task') {
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      ));
    } else {
      setBirthdays(prev => prev.map(b => 
        b.id === id ? { ...b, isFavorite: !b.isFavorite } : b
      ));
    }
  };

  // Resto del código de renderizado...
  
  // Modificar las secciones de creación
  case 'task':
    return (
      <TaskForm
        onSubmit={(taskData) => {
          addTask(taskData);
          handleCloseForm();
        }}
        onClose={handleCloseForm}
      />
    );
  case 'birthday':
    return (
      <BirthdayForm
        onSubmit={(birthdayData) => {
          addBirthday(birthdayData);
          handleCloseForm();
        }}
        onClose={handleCloseForm}
      />
    );

  // Actualizar la sección de favoritos
  <FavoritesSection
    events={events}
    tasks={tasks}
    birthdays={birthdays}
    onEdit={handleEdit}
    onDelete={(type, id) => {
      if (type === 'event') deleteEvent(id);
      if (type === 'task') deleteTask(id);
      if (type === 'birthday') deleteBirthday(id);
    }}
    onToggleReminder={toggleReminder}
    onToggleFavorite={handleToggleFavorite}
  />
