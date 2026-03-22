# 🚀 StudyTrack: Premium Developer Roadmap & Task Manager

**StudyTrack** is a high-performance, visually stunning task management application designed for developers to master **DSA**, **Full Stack Development**, and **System Design/DevOps**. It features a meticulously detailed 180-task roadmap, real-time Google Sheets synchronization, and a premium "Apple-like" user interface.

![StudyTrack Dashboard](file:///C:/Users/Vivek/.gemini/antigravity/brain/83fa9dfa-f613-4dda-9076-069135d62d8f/home_page.png)

## ✨ Core Features

### 📅 180-Task Master Roadmap
- **Curated Content**: Deep-dive into 180 specific tasks covering the entire developer lifecycle.
- **Categorized Tracks**: Switch seamlessly between **DSA (Purple)**, **Full Stack (Green)**, and **SD/DevOps (Gold)**.
- **Chronological Progress**: Tasks are organized into a 10-week, 6-day-per-week structured plan.

### ☁️ Real-Time Cloud Sync
- **Google Sheets Integration**: Every task toggle and custom addition is instantly synced to a Google Sheet.
- **Email Alerts**: Connected via Google Apps Script to send **Daily Digests**, **Urgent Alerts** (45 mins before deadline), and **Night Reminders**.
- **Bi-Directional Mapping**: The app fetches your progress from the cloud on startup.

### 💎 Premium UI/UX (React Bits)
- **Fluid Animations**: Custom ease-in-out curves for high-end page transitions.
- **Interactive Components**:
    - **BlurText**: Sophisticated title reveals.
    - **ShinyText**: Shimmering greetings and progress scores.
    - **SpotlightCard**: Dynamic hovering light effects on track cards.
- **Native Performance**: Optimized for mobile and desktop with hardware-accelerated CSS transforms.

### ➕ Dynamic Tasking
- Add your own custom tasks with specific weeks, days, and time slots.
- Custom tasks automatically sync as new rows in your cloud database.

## 🛠️ Technology Stack

- **Frontend**: React, Framer Motion, Vanilla CSS (Premium Design System).
- **Backend**: Google Apps Script (Web App), Google Sheets API, Gmail API.
- **UI Libraries**: React Bits (Refactored for CSS precision).
- **State Management**: React Hooks + LocalStorage Persistence.

## 🚀 Getting Started

### 1. Local Development
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 2. Google Sheets Setup
1. Create a new Google Sheet.
2. Open **Extensions > Apps Script**.
3. Paste the provided `GoogleAppsScript.js` code.
4. Deploy as a **Web App** (Access: Anyone).
5. Copy the Web App URL and paste it into `App.jsx` at line 11.

## 📷 Screenshots

| Home Dashboard | Calendar View |
| :--- | :--- |
| ![Home](file:///C:/Users/Vivek/.gemini/antigravity/brain/83fa9dfa-f613-4dda-9076-069135d62d8f/home_page_scrolled_1774179398465.png) | ![Calendar](file:///C:/Users/Vivek/.gemini/antigravity/brain/83fa9dfa-f613-4dda-9076-069135d62d8f/calendar_view.png) |

---
*Built with ❤️ for focused learning.*
