import React, { useContext, useRef } from 'react';
import { Calendar, Download, Upload, Settings, Info, User } from 'lucide-react';
import CycleContext from '../context/CycleContext';
import Navigation from './Navigation';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';
import LogView from './views/LogView';
import EntryModal from './modals/EntryModal';
import InfoModal from './modals/InfoModal';
import SettingsModal from './modals/SettingsModal';
import StorageNoticeModal from './modals/StorageNoticeModal';
import BackupReminder from './ui/BackupReminder';
import UnsavedChangesIndicator from './ui/UnsavedChangesIndicator';
import { saveDataToFile, loadDataFromFile } from '../utils/storage';

const MenstrualCycleTracker = () => {
  const { 
    activeTab, 
    showEntryModal, 
    showInfoModal, 
    showSettingsModal,
    showStorageNotice,
    setShowInfoModal,
    setShowSettingsModal,
    setShowStorageNotice,
    showBackupReminder,
    unsavedChanges,
    setLastBackupDate,
    setUnsavedChanges
  } = useContext(CycleContext);
  
  const fileInputRef = useRef(null);
  
  const handleSaveData = () => {
    saveDataToFile();
    setLastBackupDate(new Date());
    setUnsavedChanges(false);
  };
  
  const handleLoadData = (event) => {
    loadDataFromFile(event);
    setUnsavedChanges(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto text-black">
      {/* Header */}
      <div className="border-b text-black flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600 flex items-center">
          <Calendar className="mr-2" /> LunaCycle
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveData}
            className="p-2 text-black rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Save data to file"
            aria-label="Save data to file"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-black rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Load data from file"
            aria-label="Load data from file"
          >
            <Upload size={20} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoadData}
              accept=".json"
              className="hidden"
              aria-label="File input for loading saved data"
            />
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-black rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Settings"
            aria-label="Open settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 text-black rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Information"
            aria-label="View cycle information"
          >
            <Info size={20} />
          </button>
          <button
            onClick={() => setShowStorageNotice(true)}
            className="p-2 text-black rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Data storage information"
            aria-label="View data storage information"
          >
            <User size={20} />
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <Navigation />
      
      {/* Content */}
      <div>
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'log' && <LogView />}
      </div>
      
      {/* Modals */}
      {showEntryModal && <EntryModal />}
      {showInfoModal && <InfoModal />}
      {showSettingsModal && <SettingsModal />}
      {showStorageNotice && <StorageNoticeModal />}
      
      {/* Floating UI Elements */}
      {showBackupReminder && <BackupReminder />}
      {unsavedChanges && <UnsavedChangesIndicator />}
    </div>
  );
};

export default MenstrualCycleTracker;