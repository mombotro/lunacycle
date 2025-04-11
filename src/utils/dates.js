// Get month name by number (0-based index)
export const getMonthName = (monthIndex) => {
    const months = [
      "January", "February", "March", "April", 
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    return months[monthIndex];
  };
  
  // Get days in month
  export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days for a given month/year
  export const generateCalendarDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Previous month days to display
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const daysInPrevMonth = getDaysInMonth(year, month - 1);
      for (let i = 0; i < firstDayOfMonth; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, daysInPrevMonth - i),
          isCurrentMonth: false
        });
      }
      prevMonthDays.reverse();
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month days to fill the grid
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const daysToAdd = 42 - totalDays; // 6 rows of 7 days
    
    for (let i = 1; i <= daysToAdd; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Format date to string (YYYY-MM-DD)
  export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Check if two dates are the same day
  export const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };
  
  // Calculate days between two dates
  export const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
  };