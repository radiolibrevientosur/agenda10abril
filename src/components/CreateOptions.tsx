import React from 'react';
import { Calendar, CheckSquare, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateOption } from '../types';

interface CreateOptionsProps {
  onSelect: (option: CreateOption) => void;
}

export const CreateOptions: React.FC<CreateOptionsProps> = ({ onSelect }) => {
  const options = [
    {
      id: 'event',
      icon: Calendar,
      title: 'Nuevo Evento',
      description: 'Crear un nuevo evento cultural',
      color: 'bg-purple-500',
    },
    {
      id: 'task',
      icon: CheckSquare,
      title: 'Nueva Tarea',
      description: 'Añadir una tarea pendiente',
      color: 'bg-blue-500',
    },
    {
      id: 'birthday',
      icon: Gift,
      title: 'Nuevo Cumpleaños',
      description: 'Registrar un cumpleaños',
      color: 'bg-pink-500',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <motion.button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`p-4 rounded-full ${option.color} text-white mb-4`}>
              <Icon size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {option.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {option.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
};