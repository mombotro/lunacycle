import React, { useContext } from 'react';
import CycleContext from '../../context/CycleContext';

const StorageNoticeModal = () => {
  const { setShowStorageNotice } = useContext(CycleContext);
  
  const handleAccept = () => {
    setShowStorageNotice(false);
    localStorage.setItem('storageNoticeShown', 'true');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-4 text-black">
        <h3 className="text-lg font-bold mb-2">Data Storage Information</h3>
        <p className="mb-3">
          This tracker stores your data locally in your browser. Your data is not sent to any server unless you manually download and share the backup file.
        </p>
        <p className="mb-3">
          For data safety, please:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Create regular backups by clicking the download icon</li>
          <li>Store backup files in a secure location</li>
          <li>Do not clear browser data without first creating a backup</li>
        </ul>
        <div className="flex justify-end">
          <button 
            onClick={handleAccept}
            className="px-4 py-2 bg-pink-500 text-white rounded"
            aria-label="Acknowledge data storage notice"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageNoticeModal;