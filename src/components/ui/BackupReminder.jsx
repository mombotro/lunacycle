import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';
import { saveDataToFile } from '../../utils/storage';

const BackupReminder = () => {
  const { 
    setShowBackupReminder, 
    lastBackupDate, 
    setLastBackupDate,
    setUnsavedChanges
  } = useContext(CycleContext);
  
  const handleBackupNow = () => {
    saveDataToFile();
    setLastBackupDate(new Date());
    setShowBackupReminder(false);
    setUnsavedChanges(false);
  };
  
  const daysSinceLastBackup = lastBackupDate ? 
    Math.floor((new Date() - new Date(lastBackupDate)) / (1000 * 60 * 60 * 24)) : 
    'a while';
  
  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-400 rounded-lg p-3 shadow-lg max-w-xs">
      <h4 className="font-bold mb-1">Time for a backup!</h4>
      <p className="text-sm mb-2">
        It's been {daysSinceLastBackup} days since your last backup.
      </p>
      <div className="flex justify-between">
        <button 
          onClick={() => setShowBackupReminder(false)}
          className="px-2 py-1 border rounded text-xs"
          aria-label="Dismiss backup reminder"
        >
          Dismiss
        </button>
        <button 
          onClick={handleBackupNow}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          aria-label="Create backup now"
        >
          Backup now
        </button>
      </div>
    </div>
  );
};

export default BackupReminder;