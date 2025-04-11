import { useState, useEffect, useMemo } from 'react';
import { calculateStats } from '../utils/calculations';
import { loadData, saveData } from '../utils/storage';

/**
 * Custom hook for managing cycle data and settings
 * @returns {Object} State and functions for cycle data management
 */
const useCycleData = () => {
  // Core state
  const [cycles, setCycles] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('calendar');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Modal states
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBackupReminder, setShowBackupReminder] = useState(false);
  const [showStorageNotice, setShowStorageNotice] = useState(true);
  
  // Data persistence state
  const [lastBackupDate, setLastBackupDate] = useState(null);
  
  // User settings with defaults
  const [userSettings, setUserSettings] = useState({
    defaultCycleLength: 28,
    defaultPeriodLength: 5,
    trackingBBT: false,
    inPerimenopause: false,
    inMenopause: false,
    age: 25
  });
  
  // Entry form state with defaults
  const [entryData, setEntryData] = useState({
    date: new Date(),
    flow: 'none',
    discharge: 'none',
    temperature: '',
    symptoms: {
      cramps: false,
      headache: false,
      bloating: false,
      backPain: false,
      breastTenderness: false,
      fatigue: false,
      moodChanges: false,
      acne: false,
      hotFlashes: false,
      nightSweats: false,
      vaginalDryness: false,
      insomnia: false,
      moodSwings: false,
      brainFog: false,
      jointPain: false,
      decreasedLibido: false
    },
    mood: 'neutral',
    energyLevel: 'medium',
    libido: 'medium',
    notes: ''
  });
  
  // Calculate stats based on current data using memoization
  const stats = useMemo(() => 
    calculateStats(cycles, userSettings), 
    [cycles, userSettings]
  );
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      if (savedData.cycles) setCycles(savedData.cycles);
      if (savedData.userSettings) setUserSettings(savedData.userSettings);
      if (savedData.lastBackupDate) setLastBackupDate(new Date(savedData.lastBackupDate));
    }
    
    // Check if storage notice has been shown before
    const hasSeenNotice = localStorage.getItem('storageNoticeShown');
    if (hasSeenNotice) {
      setShowStorageNotice(false);
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (cycles.length > 0) {
      saveData({
        cycles,
        userSettings,
        lastBackupDate
      });
    }
  }, [cycles, userSettings, lastBackupDate]);
  
  // Check if backup reminder is needed
  useEffect(() => {
    const checkBackupNeeded = () => {
      if (!lastBackupDate) {
        // No backup ever made and has data
        if (cycles.length > 5) {
          setShowBackupReminder(true);
        }
      } else {
        // Check if it's been more than 30 days since last backup
        const daysSinceBackup = Math.floor(
          (new Date() - new Date(lastBackupDate)) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceBackup > 30 && cycles.length > 0) {
          setShowBackupReminder(true);
        }
      }
    };
    
    checkBackupNeeded();
    
    // Set interval to check once a day
    const intervalId = setInterval(checkBackupNeeded, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [cycles.length, lastBackupDate]);
  
  // Set unsaved changes flag when data changes
  useEffect(() => {
    if (cycles.length > 0) {
      setUnsavedChanges(true);
    }
  }, [cycles, userSettings]);
  
  // Helper functions for handling entries
  const addOrUpdateEntry = (newEntryData) => {
    // Remove existing entry for this date if it exists
    const filteredCycles = cycles.filter(entry => 
      new Date(entry.date).toDateString() !== new Date(newEntryData.date).toDateString()
    );
    
    // Add the new entry
    const newCycles = [...filteredCycles, newEntryData];
    setCycles(newCycles);
    setUnsavedChanges(true);
    
    return newCycles;
  };
  
  const getEntryForDate = (date) => {
    return cycles.find(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );
  };
  
  return {
    // State
    cycles,
    setCycles,
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    activeTab,
    setActiveTab,
    showEntryModal,
    setShowEntryModal,
    showInfoModal,
    setShowInfoModal,
    showSettingsModal,
    setShowSettingsModal,
    showBackupReminder,
    setShowBackupReminder,
    showStorageNotice,
    setShowStorageNotice,
    unsavedChanges,
    setUnsavedChanges,
    lastBackupDate,
    setLastBackupDate,
    userSettings,
    setUserSettings,
    entryData,
    setEntryData,
    stats,
    
    // Helper methods
    addOrUpdateEntry,
    getEntryForDate
  };
};

export default useCycleData;