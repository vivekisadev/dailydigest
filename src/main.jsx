import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add viewport meta for mobile
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.head.appendChild(meta);

// Theme color
const theme = document.createElement('meta');
theme.name = 'theme-color';
theme.content = '#0A0A0F';
document.head.appendChild(theme);

// Apple mobile web app
const apple = document.createElement('meta');
apple.name = 'apple-mobile-web-app-capable';
apple.content = 'yes';
document.head.appendChild(apple);

const appleStatus = document.createElement('meta');
appleStatus.name = 'apple-mobile-web-app-status-bar-style';
appleStatus.content = 'black-translucent';
document.head.appendChild(appleStatus);

document.title = 'StudyTrack — Daily Task Manager';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
