import React, { useState, useContext } from 'react';
import { X, Check, Plus, ThermometerSun } from 'lucide-react';
import CycleContext from '../../context/CycleContext';
import { validateBBT } from '../../utils/validation';

const EntryModal = () => {
  const { 
    cycles, 
    setCycles, 
    selectedDate, 
    entryData, 
    setEntryData, 
    setShowEntryModal,
    userSettings,
    setUnsavedChanges
  } = useContext(CycleContext);
  
  const [bbtError, setBbtError] = useState(false);
  
  // Define discharge types
  const dischargeTypes = ['none', 'dry', 'sticky', 'creamy', 'eggWhite', 'watery'];
  
  // Get regular vs perimenopause/menopause symptoms
  const regularSymptoms = ['cramps', 'headache', 'bloating', 'backPain', 'breastTenderness', 'fatigue', 'moodChanges', 'acne'];
  const perimenopauseSymptoms = ['hotFlashes', 'nightSweats', 'vaginalDryness', 'insomnia', 'moodSwings', 'brainFog', 'jointPain', 'decreasedLibido'];
  
  const handleEntrySubmit = () => {
    // Validate BBT if it's being tracked
    if (userSettings.trackingBBT && entryData.temperature && !validateBBT(entryData.temperature)) {
      setBbtError(true);
      return; // Don't submit if BBT is invalid
    }
    
    // Remove existing entry for this date if it exists
    const filteredCycles = cycles.filter(entry => 
      new Date(entry.date).toDateString() !== new Date(entryData.date).toDateString()
    );
    
    // Add the new entry
    const newCycles = [...filteredCycles, entryData];
    setCycles(newCycles);
    setShowEntryModal(false);
    setUnsavedChanges(true);
    
    // Optionally prompt to save right after adding an entry
    setTimeout(() => {
      const wantToSave = window.confirm('Would you like to save your updated data?');
      if (wantToSave) {
        // Call save function
      }
    }, 500);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 text-black border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedDate.toDateString()}
          </h2>
          <button onClick={() => setShowEntryModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 text-black">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Period Flow</label>
            <div className="grid grid-cols-4 gap-2">
              {['none', 'light', 'medium', 'heavy'].map(flow => (
                <button
                  key={flow}
                  onClick={() => setEntryData({...entryData, flow})}
                  className={`p-2 text-black border rounded capitalize ${
                    entryData.flow === flow ? 'bg-pink-100 border-pink-400' : ''
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Cervical Fluid/Discharge</label>
            <div className="grid grid-cols-3 gap-2">
              {dischargeTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setEntryData({...entryData, discharge: type})}
                  className={`p-2 text-black border rounded capitalize ${
                    entryData.discharge === type ? 'bg-blue-100 border-blue-400' : ''
                  }`}
                >
                  {type === 'eggWhite' ? 'Egg White' : type}
                </button>
              ))}
            </div>
          </div>
          
          {userSettings.trackingBBT && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Basal Body Temperature (°C)
              </label>
              <div className="flex items-center">
                <ThermometerSun size={20} className="mr-2 text-orange-500" />
                <input
                  type="number"
                  step="0.01"
                  value={entryData.temperature}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setEntryData({...entryData, temperature: newValue});
                    setBbtError(!validateBBT(newValue));
                  }}
                  className={`w-full border rounded p-2 text-black ${bbtError ? 'border-red-500' : ''}`}
                  placeholder="36.5"
                  aria-label="Basal Body Temperature in Celsius"
                  aria-invalid={bbtError}
                  />
              </div>
              {bbtError && (
                <p className="text-sm text-red-500 mt-1">
                  Temperature should be between 35.5°C and 38.5°C
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                For accurate readings, take your temperature first thing in the morning before getting out of bed
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Regular Symptoms</label>
            <div className="grid grid-cols-2 gap-2">
              {regularSymptoms.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => {
                    const newSymptoms = {...entryData.symptoms};
                    newSymptoms[symptom] = !newSymptoms[symptom];
                    setEntryData({...entryData, symptoms: newSymptoms});
                  }}
                  className={`p-2 text-black border rounded text-left flex items-center ${
                    entryData.symptoms[symptom] ? 'bg-orange-100 border-orange-400' : ''
                  }`}
                >
                  {entryData.symptoms[symptom] ? (
                    <Check size={16} className="mr-2" />
                  ) : (
                    <Plus size={16} className="mr-2" />
                  )}
                  {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          
          {(userSettings.inPerimenopause || userSettings.inMenopause) && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Perimenopause/Menopause Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {perimenopauseSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => {
                      const newSymptoms = {...entryData.symptoms};
                      newSymptoms[symptom] = !newSymptoms[symptom];
                      setEntryData({...entryData, symptoms: newSymptoms});
                    }}
                    className={`p-2 text-black border rounded text-left flex items-center ${
                      entryData.symptoms[symptom] ? 'bg-purple-100 border-purple-400' : ''
                    }`}
                  >
                    {entryData.symptoms[symptom] ? (
                      <Check size={16} className="mr-2" />
                    ) : (
                      <Plus size={16} className="mr-2" />
                    )}
                    {symptom.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Mood</label>
            <div className="grid grid-cols-5 gap-2">
              {['happy', 'neutral', 'sad', 'irritable', 'anxious'].map(mood => (
                <button
                  key={mood}
                  onClick={() => setEntryData({...entryData, mood})}
                  className={`p-2 text-black border rounded capitalize ${
                    entryData.mood === mood ? 'bg-blue-100 border-blue-400' : ''
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Energy Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  onClick={() => setEntryData({...entryData, energyLevel: level})}
                  className={`p-2 border rounded capitalize ${
                    entryData.energyLevel === level ? 'bg-green-100 border-green-400' : ''
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Libido</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  onClick={() => setEntryData({...entryData, libido: level})}
                  className={`p-2 text-black border rounded capitalize ${
                    entryData.libido === level ? 'bg-purple-100 border-purple-400' : ''
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Notes</label>
            <textarea
              value={entryData.notes}
              onChange={(e) => setEntryData({...entryData, notes: e.target.value})}
              className="w-full border rounded p-2 text-black h-24"
              placeholder="Add any additional notes here..."
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowEntryModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleEntrySubmit}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;