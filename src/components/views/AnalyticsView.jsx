import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';
import TemperatureChart from '../ui/TemperatureChart';
import SymptomStats from '../ui/SymptomStats';

const AnalyticsView = () => {
  const { cycles, stats, userSettings } = useContext(CycleContext);
  
  // Filter to find all entries with period flow data
  const periodEntries = cycles
    .filter(entry => entry.flow !== 'none')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate cycle variations (important for perimenopause tracking)
  const cycleLengths = [];
  for (let i = 1; i < periodEntries.length; i++) {
    const currentDate = new Date(periodEntries[i].date);
    const prevDate = new Date(periodEntries[i - 1].date);
    const days = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    cycleLengths.push(days);
  }
  
  // Calculate cycle variability
  let cycleVariability = 0;
  if (cycleLengths.length > 1) {
    const avgLength = cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length;
    const squaredDiffs = cycleLengths.map(len => Math.pow(len - avgLength, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / cycleLengths.length;
    cycleVariability = Math.sqrt(variance);
  }
  
  return (
    <div className="p-4 text-black">
      <h2 className="text-xl font-bold mb-4">Cycle Analytics</h2>
      
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Recent Periods</h3>
        {periodEntries.length > 0 ? (
          <div className="border rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-100">
                  <th className="p-2 text-black text-left">Date</th>
                  <th className="p-2 text-black text-left">Flow</th>
                  <th className="p-2 text-black text-left">Cycle Length</th>
                  {userSettings.trackingBBT && <th className="p-2 text-black text-left">BBT Range</th>}
                </tr>
              </thead>
              <tbody>
                {periodEntries.map((entry, index) => {
                  // Calculate cycle length if possible
                  let cycleLength = null;
                  if (index > 0) {
                    const currentDate = new Date(entry.date);
                    const prevDate = new Date(periodEntries[index - 1].date);
                    cycleLength = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
                  }
                  
                  // Get BBT range for this cycle if tracking
                  let bbtRange = null;
                  if (userSettings.trackingBBT && index < periodEntries.length - 1) {
                    const cycleStart = new Date(entry.date);
                    const cycleEnd = index < periodEntries.length - 1 ? 
                      new Date(periodEntries[index + 1].date) : new Date();
                    
                    const cycleTempData = cycles
                      .filter(e => e.temperature && e.temperature !== '')
                      .filter(e => {
                        const entryDate = new Date(e.date);
                        return entryDate >= cycleStart && entryDate < cycleEnd;
                      });
                    
                    if (cycleTempData.length > 0) {
                      const temps = cycleTempData.map(t => parseFloat(t.temperature));
                      const min = Math.min(...temps).toFixed(1);
                      const max = Math.max(...temps).toFixed(1);
                      bbtRange = `${min}°C - ${max}°C`;
                    }
                  }
                  
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2 text-black">{new Date(entry.date).toDateString()}</td>
                      <td className="p-2 text-black capitalize">{entry.flow}</td>
                      <td className="p-2 text-black">{cycleLength ? `${cycleLength} days` : '-'}</td>
                      {userSettings.trackingBBT && <td className="p-2 text-black">{bbtRange || '-'}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No period data recorded yet</p>
        )}
      </div>
      
      {userSettings.trackingBBT && (
        <TemperatureChart />
      )}
      
      <SymptomStats />
      
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Cycle Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium">Cycle Length</h4>
            {cycleLengths.length > 0 ? (
              <>
                <p>Average: {stats.avgLength} days</p>
                <p>Shortest: {Math.min(...cycleLengths)} days</p>
                <p>Longest: {Math.max(...cycleLengths)} days</p>
                <p>Variability: {cycleVariability.toFixed(1)} days</p>
              </>
            ) : (
              <p>Not enough data</p>
            )}
          </div>
          
          <div className="border rounded p-3">
            <h4 className="font-medium">Period Flow</h4>
            {periodEntries.length > 0 ? (
              <>
                <p>Average duration: {userSettings.defaultPeriodLength} days</p>
                <p>
                  Flow pattern: {
                    periodEntries.filter(e => e.flow === 'heavy').length > (periodEntries.length / 2) 
                      ? 'Mostly heavy' 
                      : periodEntries.filter(e => e.flow === 'light').length > (periodEntries.length / 2)
                        ? 'Mostly light'
                        : 'Mixed'
                  }
                </p>
              </>
            ) : (
              <p>Not enough data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;