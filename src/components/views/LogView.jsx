import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';

const LogView = () => {
  const { 
    cycles, 
    setEntryData, 
    setSelectedDate, 
    setShowEntryModal 
  } = useContext(CycleContext);
  
  const sortedEntries = [...cycles].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <div className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Cycle Log</h2>
      
      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry, index) => {
            const activeSymptoms = Object.entries(entry.symptoms)
              .filter(([_, isActive]) => isActive)
              .map(([name, _]) => name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            
            return (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">{new Date(entry.date).toDateString()}</h3>
                  <button 
                    onClick={() => {
                      setEntryData({...entry});
                      setSelectedDate(new Date(entry.date));
                      setShowEntryModal(true);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                
                {entry.flow !== 'none' && (
                  <div className="mb-1">
                    <span className="font-medium">Flow:</span> 
                    <span className="capitalize ml-2">{entry.flow}</span>
                  </div>
                )}
                
                {activeSymptoms.length > 0 && (
                  <div className="mb-1">
                    <span className="font-medium">Symptoms:</span> 
                    <span className="ml-2">{activeSymptoms.join(', ')}</span>
                  </div>
                )}
                
                <div className="mb-1">
                  <span className="font-medium">Mood:</span> 
                  <span className="capitalize ml-2">{entry.mood}</span>
                </div>
                
                {entry.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 text-gray-700">{entry.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No entries recorded yet</p>
      )}
    </div>
  );
};

export default LogView;