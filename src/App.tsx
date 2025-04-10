import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Calendar, Moon, Sun } from 'lucide-react';
import { EventForm } from './components/EventForm';
import { TaskForm } from './components/TaskForm';
import { BirthdayForm } from './components/BirthdayForm';
import { CreateOptions } from './components/CreateOptions';
import { EventList } from './components/EventList';
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

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [createOption, setCreateOption] = useState<CreateOption>(null);
  const [editingEvent, setEditingEvent] = useState<EventFormData | undefined>();
  const [editingTask, setEditingTask] = useState<TaskData | undefined>();
  const [editingBirthday, setEditingBirthday] = useState<BirthdayData | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  const {
    items,
    events,
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
    setFilters
  } = useEvents();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleEditEvent = (event: EventFormData) => {
    setEditingEvent(event);
    setActiveSection('create');
    setCreateOption('event');
  };

  const handleEditTask = (task: TaskData) => {
    setEditingTask(task);
    setActiveSection('create');
    setCreateOption('task');
  };

  const handleEditBirthday = (birthday: BirthdayData) => {
    setEditingBirthday(birthday);
    setActiveSection('create');
    setCreateOption('birthday');
  };

  const handleSubmitEvent = (eventData: Omit<EventFormData, 'id'>) => {
    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    setActiveSection(null);
    setCreateOption(null);
    setEditingEvent(undefined);
  };

  const handleSubmitTask = (taskData: Omit<TaskData, 'id'>) => {
    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
    setActiveSection(null);
    setCreateOption(null);
    setEditingTask(undefined);
  };

  const handleSubmitBirthday = (birthdayData: Omit<BirthdayData, 'id'>) => {
    if (editingBirthday) {
      updateBirthday({ ...birthdayData, id: editingBirthday.id });
    } else {
      addBirthday(birthdayData);
    }
    setActiveSection(null);
    setCreateOption(null);
    setEditingBirthday(undefined);
  };

  const handleCloseForm = () => {
    setActiveSection(null);
    setEditingEvent(undefined);
    setEditingTask(undefined);
    setEditingBirthday(undefined);
    setCreateOption(null);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'search':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 top-0 pt-20 pb-16 bg-gray-50 dark:bg-gray-900 overflow-y-auto z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <EventList
                items={items}
                onEditEvent={handleEditEvent}
                onEditTask={handleEditTask}
                onEditBirthday={handleEditBirthday}
                onDeleteEvent={deleteEvent}
                onDeleteTask={deleteTask}
                onDeleteBirthday={deleteBirthday}
                filters={filters}
                onFilterChange={setFilters}
                onToggleReminder={toggleReminder}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </motion.div>
        );
      case 'create':
        if (!createOption) {
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 top-0 pt-20 pb-16 bg-gray-50 dark:bg-gray-900 overflow-y-auto z-40"
            >
              <div className="max-w-7xl mx-auto">
                <CreateOptions onSelect={setCreateOption} />
              </div>
            </motion.div>
          );
        }
        switch (createOption) {
          case 'event':
            return (
              <EventForm
                onSubmit={handleSubmitEvent}
                onClose={handleCloseForm}
                initialData={editingEvent}
              />
            );
          case 'task':
            return (
              <TaskForm
                onSubmit={handleSubmitTask}
                onClose={handleCloseForm}
                initialData={editingTask}
              />
            );
          case 'birthday':
            return (
              <BirthdayForm
                onSubmit={handleSubmitBirthday}
                onClose={handleCloseForm}
                initialData={editingBirthday}
              />
            );
        }
        break;
      case 'favorites':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 top-0 pt-20 pb-16 bg-gray-50 dark:bg-gray-900 overflow-y-auto z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FavoritesSection
                events={events}
                onEdit={handleEditEvent}
                onDelete={deleteEvent}
                onToggleReminder={toggleReminder}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 top-0 pt-20 pb-16 bg-gray-50 dark:bg-gray-900 overflow-y-auto z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProfileEditor />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda Cultural</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 ${
                      viewMode === 'calendar'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Calendario
                  </button>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <Moon className="h-6 w-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {viewMode === 'list' ? (
                      <EventList
                        items={items}
                        onEditEvent={handleEditEvent}
                        onEditTask={handleEditTask}
                        onEditBirthday={handleEditBirthday}
                        onDeleteEvent={deleteEvent}
                        onDeleteTask={deleteTask}
                        onDeleteBirthday={deleteBirthday}
                        filters={filters}
                        onFilterChange={setFilters}
                        onToggleReminder={toggleReminder}
                        onToggleFavorite={toggleFavorite}
                      />
                    ) : (
                      <CalendarView
                        events={events}
                        onEventClick={handleEditEvent}
                      />
                    )}
                    <Footer />
                  </>
                }
              />
              <Route
                path="/event/:id"
                element={
                  <EventDetails
                    events={events}
                    onEdit={handleEditEvent}
                    onDelete={deleteEvent}
                    onToggleReminder={toggleReminder}
                    onToggleFavorite={toggleFavorite}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* Active Section */}
        <AnimatePresence>
          {activeSection && renderActiveSection()}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </Router>
  );
}

export default App;