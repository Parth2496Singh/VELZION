import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import our Obsidian Canvas design tokens
import './index.css'; 

// Note: If you still have code in src/App.css, delete all of it. 
// We are driving our entire theme exclusively through index.css.
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);