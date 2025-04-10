// BirthdayCard.tsx (Corrección)
import React, { useState } from 'react';
import { BirthdayData } from '../types';
import { Calendar, Edit, Trash2, Bell, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// ... (interfaces y props iguales)

export const BirthdayCard: React.FC<BirthdayCardProps> = ({
  birthday,
  onEdit,
  onDelete,
  onToggleReminder,
}) => {
  // ... (estados y funciones iguales)

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
              <span className="inline-block px-3 py-1 text-sm font-semibold text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-300 rounded-full">
                Cumpleaños
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                {birthday.name}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsReminderModalOpen(true)} // Línea corregida
                className={`p-2 rounded-full transition-colors ${
                  birthday.reminder?.enabled 
                    ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Bell size={20} />
              </button>
              {/* ... (resto de botones igual) */}
            </div>
          </div>
          {/* ... (resto del componente igual) */}
        </div>
      </motion.div>
      {/* ... (modal de recordatorio igual) */}
    </>
  );
};
