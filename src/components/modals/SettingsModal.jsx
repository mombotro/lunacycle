import React, { useState, useContext, useEffect } from 'react';
import { X } from 'lucide-react';
import CycleContext from '../../context/CycleContext';

const SettingsModal = () => {
  const { 
    userSettings, 
    setUserSettings, 
    setShowSettingsModal,
    setUnsavedChanges
  } = useContext(CycleContext);
  
  // Local state for form settings
  const [formSettings, setFormSettings] = useState({...userSettings});
  
  // Update local form when userSettings change
  useEffect(() => {
    setFormSettings({...userSettings});
  }, [userSettings]);
  
  const handleSettingsSave = () => {
    setUserSettings(formSettings);
    setShowSettingsModal(false);
    setUnsavedChanges(true);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 text-black border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 text-black">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Default Cycle Length (days)</label>
            <input
              type="number"
              min="21"
              max="40"
              value={formSettings.defaultCycleLength}
              onChange={(e) => setFormSettings({...formSettings, defaultCycleLength: parseInt(e.target.value) || 28})}
              aria-label="Default cycle length in days"
              className="w-full border rounded p-2 text-black"
            />
            <p className="text-sm text-gray-500 mt-1">
              Used for predictions when not enough cycle data is available
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Default Period Length (days)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formSettings.defaultPeriodLength}
              onChange={(e) => setFormSettings({...formSettings, defaultPeriodLength: parseInt(e.target.value) || 5})}
              aria-label="Default period length in days"
              className="w-full border rounded p-2 text-black"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Age (years)</label>
            <input
              type="number"
              min="8"
              max="70"
              value={formSettings.age}
              onChange={(e) => setFormSettings({...formSettings, age: parseInt(e.target.value) || 25})}
              aria-label="Age in years"
              className="w-full border rounded p-2 text-black"
            />
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formSettings.trackingBBT}
                onChange={(e) => setFormSettings({...formSettings, trackingBBT: e.target.checked})}
                aria-label="Track basal body temperature"
                className="mr-2"
              />
              Track Basal Body Temperature (BBT)
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              Enables temperature tracking for more accurate ovulation prediction
            </p>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formSettings.inPerimenopause}
                onChange={(e) => setFormSettings({...formSettings, inPerimenopause: e.target.checked})}
                aria-label="Track perimenopause symptoms"
                className="mr-2"
              />
              Track Perimenopause Symptoms
            </label>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formSettings.inMenopause}
                onChange={(e) => setFormSettings({...formSettings, inMenopause: e.target.checked})}
                aria-label="Track menopause symptoms"
                className="mr-2"
              />
              Track Menopause Symptoms
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSettingsSave}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;