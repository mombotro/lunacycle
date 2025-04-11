// BBT validation function
export const validateBBT = (value) => {
    if (!value) return true; // Empty is valid
    
    const temp = parseFloat(value);
    // Normal BBT range in Celsius (typically between 36.0°C and 38.0°C)
    return !isNaN(temp) && temp >= 35.5 && temp <= 38.5;
  };
  
  // Date validation function 
  export const validateDate = (date) => {
    if (!(date instanceof Date)) {
      return false;
    }
    
    return !isNaN(date.getTime());
  };
  
  // Entry data validation
  export const validateEntryData = (entry) => {
    // Basic checks
    if (!entry || typeof entry !== 'object') {
      return { valid: false, error: 'Invalid entry format' };
    }
    
    // Date validation
    if (!entry.date || !validateDate(new Date(entry.date))) {
      return { valid: false, error: 'Invalid date format' };
    }
    
    // Flow validation
    const validFlows = ['none', 'light', 'medium', 'heavy'];
    if (!validFlows.includes(entry.flow)) {
      return { valid: false, error: 'Invalid flow value' };
    }
    
    // Discharge validation
    const validDischarges = ['none', 'dry', 'sticky', 'creamy', 'eggWhite', 'watery'];
    if (!validDischarges.includes(entry.discharge)) {
      return { valid: false, error: 'Invalid discharge value' };
    }
    
    // Temperature validation (if present)
    if (entry.temperature !== '' && !validateBBT(entry.temperature)) {
      return { valid: false, error: 'Invalid temperature value' };
    }
    
    // Symptoms validation
    if (!entry.symptoms || typeof entry.symptoms !== 'object') {
      return { valid: false, error: 'Invalid symptoms format' };
    }
    
    // Mood validation
    const validMoods = ['happy', 'neutral', 'sad', 'irritable', 'anxious'];
    if (!validMoods.includes(entry.mood)) {
      return { valid: false, error: 'Invalid mood value' };
    }
    
    // Energy level validation
    const validEnergyLevels = ['low', 'medium', 'high'];
    if (!validEnergyLevels.includes(entry.energyLevel)) {
      return { valid: false, error: 'Invalid energy level value' };
    }
    
    // Libido validation
    const validLibidoLevels = ['low', 'medium', 'high'];
    if (!validLibidoLevels.includes(entry.libido)) {
      return { valid: false, error: 'Invalid libido value' };
    }
    
    return { valid: true };
  };