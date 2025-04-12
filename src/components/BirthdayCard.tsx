import React from 'react';
import { BirthdayData } from '../types';
import { Calendar, Gift, Trash2, Bell, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface BirthdayCardProps {
  birthday: BirthdayData;
  onDelete: (type: 'birthday', id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
  onToggleFavorite: (type: 'birthday', id: string) => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({
  birthday,
  onDelete,
  onToggleReminder,
  onToggleFavorite,
}) => {
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
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
            <span className="inline-block px-3 py-1 text-sm font-semibold text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-300 rounded-full mb-2">
              Cumpleaños
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{birthday.name}</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleFavorite('birthday', birthday.id)}
              className={`p-2 rounded-full transition-colors ${
                birthday.isFavorite 
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
              }`}
            >
              <Star size={20} fill={birthday.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onToggleReminder(birthday.id, 1440)}
              className={`p-2 rounded-full transition-colors ${
                birthday.reminder?.enabled 
                  ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Bell size={20} fill={birthday.reminder?.enabled ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onDelete('birthday', birthday.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {birthday.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{birthday.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{new Date(birthday.birthDate).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Gift className="h-5 w-5 mr-2" />
            <span>Cumple {calculateAge(birthday.birthDate)} años</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
