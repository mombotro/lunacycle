import React from 'react';
import { CycleProvider } from './context/CycleContext';
import MenstrualTracker from './components/MenstrualTracker';
import './index.css';

const App = () => {
  return (
    <CycleProvider>
      <div className="min-h-screen p-4">
        <MenstrualTracker />
      </div>
    </CycleProvider>
  );
};

export default App;