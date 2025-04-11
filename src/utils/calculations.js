// Helper function: Smooth temperature data to reduce outliers
export const smoothTemperatureData = (temps) => {
    if (!temps || temps.length < 3) return temps;
    
    return temps.map((entry, i) => {
      // Skip first and last entries
      if (i === 0 || i === temps.length - 1) return entry;
      
      // For middle points, calculate 3-point weighted average
      const prevTemp = parseFloat(temps[i-1].temperature);
      const currTemp = parseFloat(entry.temperature);
      const nextTemp = parseFloat(temps[i+1].temperature);
      
      // If current temp is an outlier, replace with average of neighbors
      if (Math.abs(currTemp - prevTemp) > 0.5 && Math.abs(currTemp - nextTemp) > 0.5) {
        return {
          ...entry,
          temperature: ((prevTemp + nextTemp) / 2).toFixed(2),
          isSmoothed: true
        };
      }
      
      // Otherwise use weighted average
      return {
        ...entry,
        temperature: (0.2 * prevTemp + 0.6 * currTemp + 0.2 * nextTemp).toFixed(2),
        isSmoothed: true
      };
    });
  };
  
  // Helper function: Detect ovulation using the "three over six" rule
  export const detectOvulationFromBBT = (temps) => {
    if (!temps || temps.length < 10) return null;
    
    // Sort by date
    const sortedTemps = [...temps].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Look for thermal shift using the "three over six" rule
    for (let i = 6; i < sortedTemps.length - 2; i++) {
      // Calculate average of previous 6 temps
      const prevSixAvg = sortedTemps.slice(i-6, i).reduce((sum, entry) => 
        sum + parseFloat(entry.temperature), 0) / 6;
      
      // Calculate average of next 3 temps
      const nextThreeAvg = sortedTemps.slice(i, i+3).reduce((sum, entry) => 
        sum + parseFloat(entry.temperature), 0) / 3;
      
      // Check if there's a significant shift (at least 0.2°C)
      if (nextThreeAvg - prevSixAvg >= 0.2) {
        return {
          date: new Date(sortedTemps[i].date),
          tempShift: nextThreeAvg - prevSixAvg
        };
      }
    }
    
    return null;
  };
  
  // Calculate cycle phases
  export const calculateCyclePhases = (nextPeriod, cycleLength) => {
    if (!nextPeriod) return null;
    
    const periodStart = new Date(nextPeriod);
    periodStart.setDate(periodStart.getDate() - cycleLength);
    
    // 1. Menstrual phase (typically days 1-5)
    const menstrualStart = new Date(periodStart);
    const menstrualEnd = new Date(periodStart);
    menstrualEnd.setDate(menstrualEnd.getDate() + 4); // 5 days
    
    // 2. Follicular phase (days 1-13, overlaps with menstrual)
    const follicularStart = new Date(periodStart);
    const follicularEnd = new Date(periodStart);
    follicularEnd.setDate(follicularEnd.getDate() + 12); // 13 days
    
    // 3. Ovulatory phase (typically days 14-16)
    const ovulatoryStart = new Date(follicularEnd);
    ovulatoryStart.setDate(ovulatoryStart.getDate() + 1);
    const ovulatoryEnd = new Date(ovulatoryStart);
    ovulatoryEnd.setDate(ovulatoryEnd.getDate() + 2); // 3 days
    
    // 4. Luteal phase (days 15-28, overlaps with ovulatory)
    const lutealStart = new Date(ovulatoryStart);
    const lutealEnd = new Date(nextPeriod);
    lutealEnd.setDate(lutealEnd.getDate() - 1);
    
    // Determine current phase
    const today = new Date();
    let currentPhase = null;
    
    if (today >= menstrualStart && today <= menstrualEnd) {
      currentPhase = 'menstrual';
    } else if (today >= follicularStart && today <= follicularEnd) {
      currentPhase = 'follicular';
    } else if (today >= ovulatoryStart && today <= ovulatoryEnd) {
      currentPhase = 'ovulatory';
    } else if (today >= lutealStart && today <= lutealEnd) {
      currentPhase = 'luteal';
    }
    
    // Determine next phase
    const nextPhase = getNextPhase(currentPhase);
    
    // Get mood predictions for each phase
    const phaseMoods = {
      menstrual: getPhaseMoodPrediction('menstrual'),
      follicular: getPhaseMoodPrediction('follicular'),
      ovulatory: getPhaseMoodPrediction('ovulatory'),
      luteal: getPhaseMoodPrediction('luteal')
    };
    
    return {
      current: currentPhase,
      next: nextPhase,
      phases: {
        menstrual: { 
          start: menstrualStart, 
          end: menstrualEnd,
          mood: phaseMoods.menstrual
        },
        follicular: { 
          start: follicularStart, 
          end: follicularEnd,
          mood: phaseMoods.follicular
        },
        ovulatory: { 
          start: ovulatoryStart, 
          end: ovulatoryEnd,
          mood: phaseMoods.ovulatory
        },
        luteal: { 
          start: lutealStart, 
          end: lutealEnd,
          mood: phaseMoods.luteal
        }
      }
    };
  };
  
  // Get next phase in the cycle
  export const getNextPhase = (currentPhase) => {
    const phases = ["menstrual", "follicular", "ovulatory", "luteal"];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex === -1) return "menstrual";
    return phases[(currentIndex + 1) % phases.length];
  };
  
  // Predict mood for a specific phase based on historical data
  export const getPhaseMoodPrediction = (phaseName) => {
    // In a real app, this would analyze historical mood data by phase
    // Here we'll provide some general defaults based on typical patterns
    const defaultMoods = {
      menstrual: { 
        mood: "mixed", 
        energy: "low", 
        description: "May experience relief from PMS symptoms but have lower energy."
      },
      follicular: { 
        mood: "positive", 
        energy: "increasing", 
        description: "Rising estrogen often brings improved mood and energy."
      },
      ovulatory: { 
        mood: "upbeat", 
        energy: "high", 
        description: "Peak estrogen and testosterone typically brings peak energy and mood."
      },
      luteal: { 
        mood: "variable", 
        energy: "decreasing", 
        description: "Early phase is stable, later may bring PMS symptoms."
      }
    };
    
    // In a full implementation, we'd analyze past cycle data to personalize these
    return defaultMoods[phaseName];
  };
  
  // Main calculation function
  export const calculateStats = (cycles, userSettings) => {
    if (cycles.length < 2) {
      // If not enough data, use user settings
      const nextPeriod = new Date();
      // Find the most recent period
      const lastPeriodEntry = [...cycles]
        .filter(entry => entry.flow !== 'none')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      
      if (lastPeriodEntry) {
        const lastPeriod = new Date(lastPeriodEntry.date);
        nextPeriod.setTime(lastPeriod.getTime());
        nextPeriod.setDate(nextPeriod.getDate() + userSettings.defaultCycleLength);
      } else {
        // No period data, default to prediction from today
        nextPeriod.setDate(nextPeriod.getDate() + userSettings.defaultCycleLength);
      }
      
      // Calculate fertile window based on settings
      const fertile = [];
      const fertileStart = new Date(nextPeriod);
      fertileStart.setDate(fertileStart.getDate() - 16);
      const fertileEnd = new Date(nextPeriod);
      fertileEnd.setDate(fertileEnd.getDate() - 12);
      
      return { 
        avgLength: userSettings.defaultCycleLength, 
        nextPeriod, 
        fertile: [fertileStart, fertileEnd],
        ovulation: new Date(fertileEnd),
        phases: calculateCyclePhases(nextPeriod, userSettings.defaultCycleLength),
        bbtData: { detected: false }
      };
    }
    
    // Calculate average cycle length
    let totalDays = 0;
    const periodDates = cycles
      .filter(entry => entry.flow !== 'none')
      .map(entry => new Date(entry.date))
      .sort((a, b) => a - b);
    
    if (periodDates.length < 2) {
      // Fall back to user settings
      return { 
        avgLength: userSettings.defaultCycleLength, 
        nextPeriod: null, 
        fertile: [],
        ovulation: null,
        phases: {},
        bbtData: { detected: false }
      };
    }
    
    const cycleLengths = [];
    for (let i = 1; i < periodDates.length; i++) {
      const days = Math.round((periodDates[i] - periodDates[i-1]) / (1000 * 60 * 60 * 24));
      cycleLengths.push(days);
      totalDays += days;
    }
    
    const avgLength = Math.round(totalDays / cycleLengths.length);
    
    // Predict next period
    const lastPeriod = periodDates[periodDates.length - 1];
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + avgLength);
    
    // Get and analyze temperature data
    const tempData = cycles
      .filter(entry => entry.temperature && entry.temperature !== '')
      .map(entry => ({
        date: new Date(entry.date),
        temperature: entry.temperature,
        flow: entry.flow !== 'none',
        discharge: entry.discharge
      }))
      .sort((a, b) => a.date - b.date);
    
    // Apply smoothing to temperature data
    const smoothedTemps = smoothTemperatureData(tempData);
    
    // Detect ovulation from BBT using the three-over-six rule
    const bbtOvulation = detectOvulationFromBBT(smoothedTemps);
    
    // Determine ovulation date (use detected if available, otherwise estimate)
    let ovulation;
    if (bbtOvulation) {
      ovulation = bbtOvulation.date;
    } else {
      // Fall back to standard estimate (14 days before next period)
      ovulation = new Date(nextPeriod);
      ovulation.setDate(ovulation.getDate() - 14);
    }
    
    // Calculate fertile window with improved accuracy
    let fertileStart, fertileEnd;
    
    if (bbtOvulation) {
      // If BBT shift detected, base window on that
      fertileStart = new Date(bbtOvulation.date);
      fertileStart.setDate(fertileStart.getDate() - 5); // 5 days before ovulation
      
      fertileEnd = new Date(bbtOvulation.date);
      fertileEnd.setDate(fertileEnd.getDate() + 1); // 1 day after ovulation
    } else {
      // Fall back to estimates (12-16 days before next period)
      fertileStart = new Date(nextPeriod);
      fertileStart.setDate(fertileStart.getDate() - 16);
      
      fertileEnd = new Date(nextPeriod);
      fertileEnd.setDate(fertileEnd.getDate() - 12);
    }
    
    // Calculate cycle phases
    const phases = calculateCyclePhases(nextPeriod, avgLength);
    
    // Return enhanced stats object
    return { 
      avgLength, 
      nextPeriod, 
      fertile: [fertileStart, fertileEnd],
      ovulation,
      phases,
      bbtData: {
        detected: !!bbtOvulation,
        shift: bbtOvulation ? bbtOvulation.tempShift : null,
        shiftDate: bbtOvulation ? bbtOvulation.date : null,
        smoothedTemps: smoothedTemps
      }
    };
  };