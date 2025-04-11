import React from 'react';
import { TaskData } from '../types';
import { Calendar, Edit, Trash2, Bell, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: TaskData;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const getPriorityColor = (priority: TaskData['priority']) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Baja': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getStatusColor = (status: TaskData['status']) => {
    switch (status) {
      case 'Pendiente': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'En Progreso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Completada': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
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
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleFavorite(task.id)}
              className={`p-2 rounded-full transition-colors ${
                task.isFavorite 
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
            >
              <Star size={20} fill={task.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onToggleReminder(task.id, 30)}
              className={`p-2 rounded-full transition-colors ${
                task.reminder?.enabled 
                  ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Bell size={20} fill={task.reminder?.enabled ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
  );
};