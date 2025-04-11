import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';
import { isSameDay } from '../../utils/dates';

const CalendarDay = ({ day }) => {
  const { 
    cycles, 
    selectedDate, 
    setSelectedDate, 
    setEntryData, 
    setShowEntryModal,
    stats,
    userSettings
  } = useContext(CycleContext);

  // Get data for this date if it exists
  const getDateEntryData = () => {
    return cycles.find(entry => 
      isSameDay(new Date(entry.date), day.date)
    );
  };

  // Get appropriate classNames based on day data and state
  const getDayClassName = () => {
    const classes = [];
    
    if (!day.isCurrentMonth) {
      classes.push('text-gray-400');
    }
    
    if (isSameDay(day.date, new Date())) {
      classes.push('bg-blue-100 font-bold');
    }
    
    if (isSameDay(day.date, selectedDate)) {
      classes.push('ring-2 ring-blue-500');
    }
    
    // Check if day has period data
    const dayData = getDateEntryData();
    if (dayData) {
      if (dayData.flow === 'light') {
        classes.push('bg-pink-100');
      } else if (dayData.flow === 'medium') {
        classes.push('bg-pink-200');
      } else if (dayData.flow === 'heavy') {
        classes.push('bg-pink-300');
      }
      
      // BBT indicator (if tracking)
      if (userSettings.trackingBBT && dayData.temperature) {
        classes.push('border-b-4 border-orange-400');
      }
    }
    
    // Check if day is in fertile window
    if (stats.fertile && stats.fertile.length === 2) {
      if (day.date >= stats.fertile[0] && day.date <= stats.fertile[1]) {
        classes.push('border-2 border-green-400');
      }
    }
    
    // Check if day is predicted ovulation day
    if (stats.ovulation && isSameDay(day.date, stats.ovulation)) {
      classes.push('border-2 border-purple-400');
    }
    
    // Check if day is predicted next period
    if (stats.nextPeriod && isSameDay(day.date, stats.nextPeriod)) {
      classes.push('border-2 border-red-400');
    }
    
    // Apply phase-based styling
    if (stats.phases && stats.phases.phases) {
      const { phases } = stats.phases;
      
      if (phases.menstrual && day.date >= phases.menstrual.start && day.date <= phases.menstrual.end) {
        classes.push('border-l-4 border-red-300');
      } else if (phases.follicular && day.date >= phases.follicular.start && day.date <= phases.follicular.end) {
        classes.push('border-l-4 border-yellow-300');
      } else if (phases.ovulatory && day.date >= phases.ovulatory.start && day.date <= phases.ovulatory.end) {
        classes.push('border-l-4 border-green-300');
      } else if (phases.luteal && day.date >= phases.luteal.start && day.date <= phases.luteal.end) {
        classes.push('border-l-4 border-blue-300');
      }
    }
    
    return classes.join(' ');
  };

  const handleDayClick = () => {
    setSelectedDate(day.date);
    const existingEntry = getDateEntryData();
    
    if (existingEntry) {
      setEntryData({...existingEntry});
    } else {
      // Create default entry with current settings
      const newEntry = {
        date: day.date,
        flow: 'none',
        discharge: 'none',
        temperature: '',
        symptoms: {
          // Regular symptoms
          cramps: false,
          headache: false,
          bloating: false,
          backPain: false,
          breastTenderness: false,
          fatigue: false,
          moodChanges: false,
          acne: false,
          
          // Perimenopause/menopause symptoms - show only if relevant
          ...(userSettings.inPerimenopause || userSettings.inMenopause ? {
            hotFlashes: false,
            nightSweats: false,
            vaginalDryness: false,
            insomnia: false,
            moodSwings: false,
            brainFog: false,
            jointPain: false,
            decreasedLibido: false
          } : {})
        },
        mood: 'neutral',
        energyLevel: 'medium',
        libido: 'medium',
        notes: ''
      };
      
      setEntryData(newEntry);
    }
    
    setShowEntryModal(true);
  };

  // Get entry data for indicators
  const dayData = getDateEntryData();

  return (
    <div 
      onClick={handleDayClick}
      className={`p-2 text-black h-16 border rounded cursor-pointer relative ${getDayClassName()}`}
    >
      <div className="text-right">{day.date.getDate()}</div>
      
      {dayData && (
        <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
          {dayData.flow !== 'none' && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
          {dayData.discharge !== 'none' && (
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          )}
          {dayData.temperature && (
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          )}
          {Object.values(dayData.symptoms).some(s => s) && (
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;