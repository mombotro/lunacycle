# Menstrual Cycle Tracker

A comprehensive menstrual cycle tracking application built with React.

## Live Demo:

https://mombotro.github.io/lunacycle/

## Features

- Calendar view with cycle phases and predictions
- Analytics with charts and statistics
- Detailed logging of symptoms, moods, and other metrics
- Basal Body Temperature (BBT) tracking
- Local data storage with backup/restore capability
- Support for perimenopause/menopause tracking

## Project Structure

```
src/
├── index.jsx               # Application entry point
├── App.jsx                 # Main container component
├── index.css               # Global CSS styles
├── components/
│   ├── MenstrualTracker.jsx # Main component container
│   ├── Navigation.jsx       # Tab navigation
│   ├── views/
│   │   ├── CalendarView.jsx # Calendar and phase view
│   │   ├── AnalyticsView.jsx # Data analysis view
│   │   ├── LogView.jsx      # Entry log view
│   ├── modals/
│   │   ├── EntryModal.jsx   # Form for adding/editing entries
│   │   ├── InfoModal.jsx    # Educational content
│   │   ├── SettingsModal.jsx # User preferences
│   │   ├── StorageNoticeModal.jsx # Data storage notice
│   ├── ui/
│   │   ├── CalendarDay.jsx   # Calendar day component
│   │   ├── TemperatureChart.jsx # BBT chart
│   │   ├── TemperatureChart.css # BBT chart styles
│   │   ├── SymptomStats.jsx  # Symptom tracking charts
│   │   ├── BackupReminder.jsx # Backup notification
│   │   ├── UnsavedChangesIndicator.jsx # Changes indicator
├── context/
│   ├── CycleContext.jsx    # Context for state management
├── hooks/
│   ├── useCycleData.js     # Custom hook for data management
├── utils/
│   ├── calculations.js     # Data analysis utilities
│   ├── storage.js          # Data persistence functions
│   ├── dates.js            # Date handling utilities
│   ├── validation.js       # Form validation
```

## Setup Instructions

1. Create a new React app:
   ```
   npx create-react-app menstrual-tracker
   cd menstrual-tracker
   ```

2. Clean up the default files, keeping only:
   - `public/index.html`
   - `src/index.js`

3. Create the folder structure as shown above

4. Copy all the files from this repository into their respective folders

5. Install required dependencies:
   ```
   npm install react-dom lucide-react
   ```

6. Start the development server:
   ```
   npm start
   ```

## Data Storage

This application stores all data locally in your browser's localStorage. To safeguard your data:

- Create regular backups using the download icon
- Store backup files in a secure location
- Do not clear browser data without first creating a backup

## Development Notes

- The application is responsive and works on mobile devices
- No backend server is required as all data is stored locally

## Contributing

Feel free to submit issues or pull requests to improve the application.

## License

MIT