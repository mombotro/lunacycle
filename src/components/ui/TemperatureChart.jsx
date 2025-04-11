import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';
import './TemperatureChart.css';

const TemperatureChart = () => {
  const { cycles, stats } = useContext(CycleContext);
  
  // Get temperature data
  const tempEntries = cycles
    .filter(entry => entry.temperature && entry.temperature !== '')
    .map(entry => ({
      date: new Date(entry.date),
      temp: parseFloat(entry.temperature),
      flow: entry.flow !== 'none',
      discharge: entry.discharge
    }))
    .sort((a, b) => a.date - b.date);
  
  if (tempEntries.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Basal Body Temperature</h3>
        <p>No temperature data recorded yet</p>
      </div>
    );
  }
  
  // Helper function to calculate position on chart
  const getDatePosition = (date) => {
    if (!date || !tempEntries.length) return "0%";
    
    const allDates = tempEntries.map(e => e.date);
    const minDate = Math.min(...allDates.map(d => d.getTime()));
    const maxDate = Math.max(...allDates.map(d => d.getTime()));
    const dateTime = new Date(date).getTime();
    
    const position = ((dateTime - minDate) / (maxDate - minDate)) * 100;
    return `${Math.max(0, Math.min(100, position))}%`;
  };
  
  return (
    <div className="mb-6">
      <h3 className="font-bold text-lg mb-2">Basal Body Temperature</h3>
      <div className="h-64 border rounded p-3 bg-white">
        <div className="chart-container">
          {/* Y-axis labels */}
          <div className="y-axis">
            {(() => {
              const temps = tempEntries.map(e => e.temp);
              const minTemp = Math.min(...temps);
              const maxTemp = Math.max(...temps);
              
              // Add a small buffer to the range
              const bufferedMin = Math.max(35.5, minTemp - 0.1);
              const bufferedMax = Math.min(38.5, maxTemp + 0.1);
              
              // Create 5 labels
              return [0, 1, 2, 3, 4].map((i) => {
                const temp = bufferedMin + ((bufferedMax - bufferedMin) * (4 - i) / 4);
                return (
                  <div key={i} className="y-axis-label">{temp.toFixed(1)}°C</div>
                );
              });
            })()}
          </div>
          
          {/* X-axis labels - show dates */}
          <div className="x-axis">
            {tempEntries.length <= 10 ? (
              // Show all dates if 10 or fewer
              tempEntries.map((entry, index) => (
                <div key={index} className="x-axis-label">
                  {entry.date.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                </div>
              ))
            ) : (
              // Show only some dates if more than 10
              [0, Math.floor(tempEntries.length / 2), tempEntries.length - 1].map((index) => (
                <div 
                  key={index} 
                  className="x-axis-label positioned"
                  style={{ 
                    left: `${index === 0 ? 10 : (10 + (index / (tempEntries.length - 1)) * (100 - 10))}%`
                  }}
                >
                  {tempEntries[index].date.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                </div>
              ))
            )}
          </div>
          
          {/* Grid lines */}
          <svg className="chart-grid">
            {[0, 1, 2, 3, 4].map((i) => (
              <line 
                key={i}
                className="grid-line"
                x1="10%"
                y1={`${i * 20}%`}
                x2="100%"
                y2={`${i * 20}%`}
              />
            ))}
          </svg>
          
          {/* BBT data points and lines */}
          <div className="chart-area">
            {/* Use smoothed temps if available, otherwise use raw temps */}
            {stats.bbtData && stats.bbtData.smoothedTemps ? 
              stats.bbtData.smoothedTemps.map((entry, index) => {
                // Calculate position similar to how you're currently doing it
                const temps = stats.bbtData.smoothedTemps.map(e => parseFloat(e.temperature));
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);
                
                // Add a small buffer
                const bufferedMin = Math.max(35.5, minTemp - 0.1);
                const bufferedMax = Math.min(38.5, maxTemp + 0.1);
                const bufferedRange = bufferedMax - bufferedMin;
                
                // Calculate position
                const left = `${(index / (stats.bbtData.smoothedTemps.length - 1)) * 100}%`;
                const bottom = `${((parseFloat(entry.temperature) - bufferedMin) / bufferedRange) * 100}%`;
                
                let pointClass = "data-point";
                if (entry.flow) {
                  pointClass += " period";
                } else if (entry.discharge === 'eggWhite') {
                  pointClass += " fertile";
                } else {
                  pointClass += " regular";
                }
                
                if (entry.isSmoothed) {
                  pointClass += " smoothed";
                }
                
                return (
                  <div 
                    key={index}
                    className={pointClass}
                    style={{ left, bottom }}
                    title={`${new Date(entry.date).toLocaleDateString()}: ${entry.temperature}°C ${entry.isSmoothed ? '(smoothed)' : ''}`}
                    aria-label={`Temperature on ${new Date(entry.date).toLocaleDateString()}: ${entry.temperature}°C`}
                  />
                );
              })
              : tempEntries.map((entry, index) => {
                const temps = tempEntries.map(e => e.temp);
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);
                
                // Add a small buffer
                const bufferedMin = Math.max(35.5, minTemp - 0.1);
                const bufferedMax = Math.min(38.5, maxTemp + 0.1);
                const bufferedRange = bufferedMax - bufferedMin;
                
                // Calculate position
                const left = `${(index / (tempEntries.length - 1)) * 100}%`;
                const bottom = `${((entry.temp - bufferedMin) / bufferedRange) * 100}%`;
                
                let pointClass = "data-point";
                if (entry.flow) {
                  pointClass += " period";
                } else if (entry.discharge === 'eggWhite') {
                  pointClass += " fertile";
                } else {
                  pointClass += " regular";
                }
                
                return (
                  <div 
                    key={index}
                    className={pointClass}
                    style={{ left, bottom }}
                    title={`${entry.date.toLocaleDateString()}: ${entry.temp}°C`}
                    aria-label={`Temperature on ${entry.date.toLocaleDateString()}: ${entry.temp}°C`}
                  />
                );
              })
            }
            
            {/* Connect dots with lines */}
            <svg className="chart-grid">
              {tempEntries.map((entry, index) => {
                if (index === 0) return null;
                
                const temps = tempEntries.map(e => e.temp);
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);
                
                // Add a small buffer
                const bufferedMin = Math.max(35.5, minTemp - 0.1);
                const bufferedMax = Math.min(38.5, maxTemp + 0.1);
                const bufferedRange = bufferedMax - bufferedMin;
                
                const prevEntry = tempEntries[index - 1];
                
                // Calculate positions
                const x1 = `${((index - 1) / (tempEntries.length - 1)) * 100}%`;
                const y1 = `${100 - ((prevEntry.temp - bufferedMin) / bufferedRange) * 100}%`;
                const x2 = `${(index / (tempEntries.length - 1)) * 100}%`;
                const y2 = `${100 - ((entry.temp - bufferedMin) / bufferedRange) * 100}%`;
                
                return (
                  <line 
                    key={index}
                    className="connecting-line"
                    x1={x1} 
                    y1={y1} 
                    x2={x2} 
                    y2={y2}
                  />
                );
              })}
              
              {/* Ovulation line (if detected by BBT shift) */}
              {stats.bbtData && stats.bbtData.detected && stats.bbtData.shiftDate && (
                <line 
                  className="ovulation-line"
                  x1={getDatePosition(stats.bbtData.shiftDate)}
                  y1="0%"
                  x2={getDatePosition(stats.bbtData.shiftDate)}
                  y2="100%"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
      <div className="chart-legend">
        <div>
          <div className="legend-item">
            <span className="legend-color period"></span> Period
          </div>
          <div className="legend-item">
            <span className="legend-color fertile"></span> Fertile
          </div>
          <div className="legend-item">
            <span className="legend-color regular"></span> Regular
          </div>
        </div>
        <div className="legend-item">
          <span className="legend-line"></span> Possible ovulation
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;