import React, { useState } from 'react';
import { TaskData } from '../types';
import { Calendar, Edit, Trash2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: TaskData;
  onEdit: (task: TaskData) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleReminder,
}) => {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(30);

  const handleSetReminder = () => {
    if (reminderMinutes > 0) {
      onToggleReminder(task.id, reminderMinutes);
      setIsReminderModalOpen(false);
    }
  };

  const getPriorityColor = (priority: TaskData['priority']) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Baja':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getStatusColor = (status: TaskData['status']) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex space-x-2 mb-2">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  task.reminder?.enabled 
                    ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Bell size={20} />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
          )}

          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(task.dueDate).toLocaleString('es-ES')}</span>
          </div>
        </div>
      </motion.div>

      {/* Reminder Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configurar Recordatorio
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minutos antes de la tarea
                  </label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                    <option value={1440}>1 día</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsReminderModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSetReminder}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};