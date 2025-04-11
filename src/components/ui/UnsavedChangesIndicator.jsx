import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';
import { saveDataToFile } from '../../utils/storage';

const UnsavedChangesIndicator = () => {
  const { 
    setLastBackupDate,
    setUnsavedChanges
  } = useContext(CycleContext);
  
  const handleSaveNow = () => {
    saveDataToFile();
    setLastBackupDate(new Date());
    setUnsavedChanges(false);
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-pink-100 border border-pink-400 rounded-lg p-3 shadow-lg">
      <p className="text-sm flex items-center">
        <span className="mr-2">Unsaved changes</span>
        <button 
          onClick={handleSaveNow}
          className="px-2 py-1 bg-pink-500 text-white rounded text-xs"
          aria-label="Save changes now"
        >
          Save now
        </button>
      </p>
    </div>
  );
};

export default UnsavedChangesIndicator;