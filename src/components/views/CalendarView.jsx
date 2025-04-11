import React, { useContext, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CycleContext from '../../context/CycleContext';
import CalendarDay from '../ui/CalendarDay';
import { getMonthName, generateCalendarDays } from '../../utils/dates';

const CalendarView = () => {
  const { 
    currentMonth, 
    setCurrentMonth, 
    currentYear, 
    setCurrentYear,
    stats
  } = useContext(CycleContext);
  
  // Memoize calendar days generation to prevent recalculating on every render
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentYear, currentMonth);
  }, [currentMonth, currentYear]);
  
  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  return (
    <div className="p-4 text-black">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => handleMonthChange(-1)}
          className="p-2 text-black rounded-full hover:bg-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-xl font-bold">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        
        <button 
          onClick={() => handleMonthChange(1)}
          className="p-2 text-black rounded-full hover:bg-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <CalendarDay key={index} day={day} />
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="border rounded p-3 bg-pink-50">
          <h3 className="font-bold text-lg mb-2">Cycle Prediction</h3>
          {stats.avgLength > 0 ? (
            <>
              <p>Average cycle: {stats.avgLength} days</p>
              <p>Next period: {stats.nextPeriod?.toDateString()}</p>
              <p>Ovulation: {stats.ovulation?.toDateString()}</p>
            </>
          ) : (
            <p>Not enough data yet</p>
          )}
        </div>
        
        <div className="border rounded p-3 bg-green-50">
          <h3 className="font-bold text-lg mb-2">Current Cycle Phase</h3>
          {stats.phases && stats.phases.current ? (
            <>
              <p className="capitalize mb-1">
                <span className="font-medium">Phase: </span>
                {stats.phases.current}
              </p>
              <p className="capitalize mb-1">
                <span className="font-medium">Typical mood: </span>
                {stats.phases.phases[stats.phases.current]?.mood?.mood || "varies"}
              </p>
              <p className="capitalize">
                <span className="font-medium">Next phase: </span>
                {stats.phases.next}
              </p>
            </>
          ) : (
            <p>Need more data to determine cycle phase</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 border rounded p-3 bg-blue-50">
        <h3 className="font-bold text-lg mb-2">Cycle Phase Forecast</h3>
        <div className="grid grid-cols-4 gap-2">
          {stats.phases && stats.phases.phases ? Object.entries(stats.phases.phases).map(([phaseName, phaseData]) => (
            <div key={phaseName} className={`border rounded p-2 text-black ${
              stats.phases.current === phaseName ? 'bg-white shadow' : ''
            }`}>
              <h4 className="font-medium capitalize">{phaseName}</h4>
              <p className="text-sm">{phaseData.start.toLocaleDateString()} - {phaseData.end.toLocaleDateString()}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Mood: </span>
                {phaseData.mood?.mood || "varies"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Energy: </span>
                {phaseData.mood?.energy || "varies"}
              </p>
            </div>
          )) : (
            <p className="col-span-4">Need more cycle data for forecast</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;