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
              events={events}
              onEdit={handleEdit}
              onDelete={deleteEvent}
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
              onSubmit={handleSubmit}
              onClose={handleCloseForm}
              initialData={editingEvent}
            />
          );
        case 'task':
          return (
            <TaskForm
              onSubmit={addTask}
              onClose={handleCloseForm}
            />
          );
        case 'birthday':
          return (
            <BirthdayForm
              onSubmit={addBirthday}
              onClose={handleCloseForm}
            />
          );
        default:
          return null;
      }

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
