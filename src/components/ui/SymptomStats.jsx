import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';

const SymptomStats = () => {
  const { cycles, userSettings } = useContext(CycleContext);
  
  // Define perimenopause symptoms
  const perimenopauseSymptoms = [
    'hotFlashes', 'nightSweats', 'vaginalDryness', 'insomnia', 
    'moodSwings', 'brainFog', 'jointPain', 'decreasedLibido'
  ];
  
  // Calculate most common symptoms - grouped by type (regular vs perimenopause)
  const symptomCounts = { regular: {}, perimenopause: {} };
  
  cycles.forEach(entry => {
    Object.entries(entry.symptoms).forEach(([symptom, hasSymptom]) => {
      if (hasSymptom) {
        if (perimenopauseSymptoms.includes(symptom)) {
          symptomCounts.perimenopause[symptom] = (symptomCounts.perimenopause[symptom] || 0) + 1;
        } else {
          symptomCounts.regular[symptom] = (symptomCounts.regular[symptom] || 0) + 1;
        }
      }
    });
  });
  
  // Sort symptoms by frequency
  const sortedRegularSymptoms = Object.entries(symptomCounts.regular)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ 
      name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), 
      count 
    }));
    
  const sortedPerimenopauseSymptoms = Object.entries(symptomCounts.perimenopause)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ 
      name: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), 
      count 
    }));
  
  return (
    <>
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Common Symptoms</h3>
        {sortedRegularSymptoms.length > 0 ? (
          <div className="space-y-2">
            {sortedRegularSymptoms.map(symptom => (
              <div key={symptom.name} className="flex items-center">
                <div className="w-40">{symptom.name}</div>
                <div className="flex-1 h-6 bg-gray-200 rounded-full">
                  <div 
                    className="h-6 bg-orange-400 rounded-full" 
                    style={{ width: `${Math.min(100, (symptom.count / cycles.length) * 100)}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right">{symptom.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No symptom data recorded yet</p>
        )}
      </div>
      
      {(userSettings.inPerimenopause || userSettings.inMenopause) && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Perimenopause/Menopause Symptoms</h3>
          {sortedPerimenopauseSymptoms.length > 0 ? (
            <div className="space-y-2">
              {sortedPerimenopauseSymptoms.map(symptom => (
                <div key={symptom.name} className="flex items-center">
                  <div className="w-40">{symptom.name}</div>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full">
                    <div 
                      className="h-6 bg-purple-400 rounded-full" 
                      style={{ width: `${Math.min(100, (symptom.count / cycles.length) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right">{symptom.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No perimenopause/menopause symptom data recorded yet</p>
          )}
        </div>
      )}
    </>
  );
};

export default SymptomStats;