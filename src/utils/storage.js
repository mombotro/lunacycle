// Load data from localStorage
export const loadData = () => {
    const savedData = localStorage.getItem('menstrualTrackerData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        return null;
      }
    }
    return null;
  };
  
  // Save data to localStorage
  export const saveData = (data) => {
    const dataToSave = {
      ...data,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('menstrualTrackerData', JSON.stringify(dataToSave));
  };
  
  // Export data to a file
  export const saveDataToFile = () => {
    const data = {
      cycles: window.cycles || [], // Access from global context in real implementation
      userSettings: window.userSettings || {}, // Access from global context in real implementation 
      lastSaved: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a date-time string for the filename (YYYY-MM-DD_HH-MM-SS)
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const fileName = `cycle_tracker_${dateStr}_${timeStr}.json`;
    
    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  };
  
  // Import data from a file
  export const loadDataFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return false;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.cycles && data.userSettings) {
          // In a real implementation, these would be set through context actions
          // window.setCycles(data.cycles);
          // window.setUserSettings(data.userSettings);
          alert('Data loaded successfully!');
          return true;
        } else {
          alert('Invalid data format in the selected file.');
          return false;
        }
      } catch (error) {
        alert('Error loading data: ' + error.message);
        return false;
      }
    };
    reader.readAsText(file);
  };