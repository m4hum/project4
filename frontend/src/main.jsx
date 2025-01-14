import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App1.jsx'

// Import necessary modules from React and ReactDOM libraries
// Import the main App component from the local file App1.jsx

// Create the root element and render the App component within StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
