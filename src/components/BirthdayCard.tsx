import React, { useState } from 'react';
import { BirthdayData } from '../types';
import { Calendar, Edit, Trash2, Bell, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface BirthdayCardProps {
  birthday: BirthdayData;
  onEdit: (birthday: BirthdayData) => void;
  onDelete: (id: string) => void;
  onToggleReminder: (id: string, minutesBefore: number) => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({
  birthday,
  onEdit,
  onDelete,
  onToggleReminder,
}) => {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(30);

  const handleSetReminder = () => {
    if (reminderMinutes > 0) {
      onToggleReminder(birthday.id, reminderMinutes);
      setIsReminderModalOpen(false);
    }
  };

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
                onClick={() => setIs

ReminderModalOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  birthday.reminder?.enabled 
                    ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                <Bell size={20} />
              </button>
              <button
                onClick={() => onEdit(birthday)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(birthday.id)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    Minutos antes del cumpleaños
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