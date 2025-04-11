import React, { useContext } from 'react';
import CycleContext from '../context/CycleContext';

const Navigation = () => {
  const { activeTab, setActiveTab } = useContext(CycleContext);

  return (
    <div className="flex border-b">
      <button
        onClick={() => setActiveTab('calendar')}
        className={`px-4 py-2 flex-1 text-center font-medium border-b-2 ${
          activeTab === 'calendar' ? 'border-pink-500 text-pink-600' : 'border-transparent'
        }`}
      >
        Calendar
      </button>
      <button
        onClick={() => setActiveTab('analytics')}
        className={`px-4 py-2 flex-1 text-center font-medium border-b-2 ${
          activeTab === 'analytics' ? 'border-pink-500 text-pink-600' : 'border-transparent'
        }`}
      >
        Analytics
      </button>
      <button
        onClick={() => setActiveTab('log')}
        className={`px-4 py-2 flex-1 text-center font-medium border-b-2 ${
          activeTab === 'log' ? 'border-pink-500 text-pink-600' : 'border-transparent'
        }`}
      >
        Log
      </button>
    </div>
  );
};

export default Navigation;