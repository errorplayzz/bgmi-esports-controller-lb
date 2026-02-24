# 🏆 BGMI Esports Tournament Leaderboard System

A professional, broadcast-ready tournament leaderboard system with real-time updates, animations, and dual-screen support for esports tournaments.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

### 🎮 Core Functionality
- **Real-time WebSocket Communication** - Instant updates across all screens
- **Google Sheets Integration** - Auto-fetch data from spreadsheets
- **Multi-Match Support** - Track up to 3 matches with overall standings
- **Automatic Point Calculation** - Placement and kill points calculated automatically
- **Tie-breaker Logic** - Smart ranking based on points, kills, and placement

### 🎨 Display Screen (Projector View)
- **Broadcast-Quality Animations** - Professional esports aesthetics
- **Gold/Silver/Bronze Highlights** - Top 3 teams with glowing effects
- **Rank Change Indicators** - Animated up/down arrows
- **Winners Celebration Mode** - Confetti and podium display
- **Dark + Gold Theme** - Modern esports visual design
- **Responsive Layout** - Optimized for 1920x1080 displays

### 🎛️ Control Center (Admin Panel)
- **Password Protection** - Secure admin access
- **Match Selector** - Switch between Match 1, 2, 3, or Overall
- **Display Modes** - Top 3, Top 7, Top 15, or custom count
- **Reveal Modes** - Auto or manual rank reveal
- **Manual Rank Controls** - Reveal specific ranks individually
- **Special Actions** - Show winners, hide all, lock rankings
- **Live Preview** - Real-time monitoring of display screen
- **Mini Leaderboard** - Quick overview of current standings

### ⚡ Advanced Features
- **Two-Monitor Support** - Laptop for control, projector for display
- **Smooth Transitions** - Broadcast-level animations
- **Confetti Effects** - Victory celebrations
- **Sponsor Banner** - Toggle sponsor display
- **Auto-refresh** - Periodic data updates from Google Sheets
- **Modular Code** - Clean, well-commented structure

## 📋 Requirements

- Node.js 14.0 or higher
- npm or yarn package manager
- Google account (for Google Sheets integration)
- Modern web browser (Chrome, Firefox, Edge)

## 🚀 Installation

### 1. Clone or Download the Project

```powershell
# If you have the project files, navigate to the directory
cd "e:\ERROR Codes\bgmi esport"
```

### 2. Install Dependencies

```powershell
npm install
```

This will install:
- Express.js (Web server)
- Socket.io (Real-time communication)
- Google APIs (Sheets integration)
- dotenv (Environment configuration)
- cors (Cross-origin support)

### 3. Configure Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit the `.env` file with your settings:

```env
# Server Configuration
PORT=3000
ADMIN_PASSWORD=your_secure_password_here

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id_here
SHEET_NAME=Sheet1
DATA_REFRESH_INTERVAL=10000

# Tournament Configuration
TOURNAMENT_NAME=BGMI Esports Championship 2026
```

## 📊 Google Sheets Setup

### Option 1: Public Sheet (Recommended for Quick Setup)

1. **Create a new Google Sheet** with the following structure:

| Team Name | Match1 Placement | Match1 Kills | Match2 Placement | Match2 Kills | Match3 Placement | Match3 Kills |
|-----------|------------------|--------------|------------------|--------------|------------------|--------------|
| Team Alpha | 1 | 12 | 3 | 8 | 2 | 10 |
| Team Beta | 2 | 10 | 1 | 15 | 1 | 13 |
| Team Gamma | 3 | 8 | 2 | 11 | 4 | 7 |

2. **Make the sheet public:**
   - Click "Share" (top right)
   - Change "Restricted" to "Anyone with the link"
   - Set permission to "Viewer"

3. **Get the Sheet ID:**
   - Copy the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Extract the Sheet ID from the URL
   - Add it to your `.env` file

### Option 2: Private Sheet with API (Advanced)

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google Sheets API

2. **Create Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Create credentials → Service account
   - Download JSON key file

3. **Configure the project:**
   - Rename the JSON file to `credentials.json`
   - Place it in the `server` folder
   - Set `USE_GOOGLE_API=true` in `.env`

4. **Share the sheet:**
   - Open your Google Sheet
   - Share it with the service account email (found in credentials.json)

## 🎯 Usage

### Starting the Server

```powershell
npm start
```

Or for development with auto-reload:

```powershell
npm run dev
```

You should see:

```
═══════════════════════════════════════════════════
  🏆 BGMI ESPORTS TOURNAMENT LEADERBOARD SYSTEM
═══════════════════════════════════════════════════
  Server running on: http://localhost:3000
  Control Center: http://localhost:3000/control
  Display Screen: http://localhost:3000/display
  Admin Password: your_password
═══════════════════════════════════════════════════
```

### Accessing the System

#### Control Center (Admin Panel)
1. Open `http://localhost:3000/control` on your laptop
2. Enter the admin password (from `.env`)
3. Use the controls to manage the tournament

#### Display Screen (Projector)
1. Open `http://localhost:3000/display` on the projector/second screen
2. The screen will automatically sync with the control center
3. No interaction needed - fully controlled from admin panel

### Two-Monitor Setup

**Recommended Configuration:**
- **Primary Display (Laptop):** Control Center
- **Secondary Display (Projector/TV):** Display Screen

**Steps:**
1. Extend displays (Windows + P → Extend)
2. Open Control Center on laptop
3. Click "Open Display Screen" button in Control Center
4. Drag the new window to the projector screen
5. Press F11 for fullscreen

## 🎮 Control Center Guide

### Match Selector
- **Match 1/2/3:** View specific match standings
- **Overall:** View cumulative standings across all matches

### Display Mode
- **Top 3:** Show only top 3 teams (podium view)
- **Top 7:** Show top 7 teams
- **Top 15:** Show top 15 teams (default)
- **Custom:** Enter any number (1-25)

### Reveal Mode
- **Auto Reveal (ON):** All teams visible immediately
- **Manual Reveal (OFF):** Use rank buttons to reveal teams one by one

### Special Actions
- **🏆 Show Winners:** Display celebration overlay with confetti
- **👁️ Hide All:** Hide all teams from display
- **🔄 Reset Reveal:** Clear all revealed ranks (manual mode)
- **🔓 Lock Rankings:** Freeze rankings (prevent updates)
- **📢 Toggle Sponsor:** Show/hide sponsor banner

### Manual Rank Reveal
1. Turn off Auto Reveal
2. Click rank buttons (25 → 1) to reveal teams
3. Perfect for countdown reveals during broadcasts

## 📈 Point System

### Placement Points
| Position | Points |
|----------|--------|
| 1st Place | 20 |
| 2nd Place | 14 |
| 3rd Place | 10 |
| 4th Place | 8 |
| 5th Place | 6 |
| 6th Place | 4 |
| 7th Place | 2 |

### Kill Points
- **1 Kill = 1 Point**

### Total Points Calculation
```
Team Total = Σ (Placement Points + Kill Points) for all matches
```

### Tie-breaker Rules
1. **Higher Total Points** (primary)
2. **Higher Total Kills** (secondary)
3. **Better Last Match Placement** (tertiary)

## 🎨 Customization

### Changing Tournament Name
Edit `.env`:
```env
TOURNAMENT_NAME=Your Tournament Name Here
```

### Changing Admin Password
Edit `.env`:
```env
ADMIN_PASSWORD=your_new_password
```

### Adjusting Auto-refresh Interval
Edit `.env`:
```env
DATA_REFRESH_INTERVAL=5000  # 5 seconds (in milliseconds)
```

### Customizing Colors
Edit `public/display/display.css`:
```css
:root {
    --gold: #FFD700;
    --silver: #C0C0C0;
    --bronze: #CD7F32;
    --accent-cyan: #00FFFF;
    /* Add your custom colors */
}
```

### Adding Sponsor Logo
Edit `public/display/display.html`:
```html
<div class="sponsor-banner" id="sponsorBanner">
    <div class="sponsor-content">
        <img src="your-logo.png" alt="Sponsor">
        <span>POWERED BY YOUR SPONSOR</span>
    </div>
</div>
```

## 🔧 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

### Google Sheets not updating
- Verify Sheet ID is correct in `.env`
- Check if sheet is publicly accessible
- Ensure CSV export URL is working
- Check internet connection

### Display screen not syncing
- Refresh both control and display screens
- Check browser console for errors (F12)
- Verify WebSocket connection status

### Animation lag on projector
- Close unnecessary browser tabs
- Reduce number of displayed teams
- Ensure projector is set to native resolution (1920x1080)

## 📁 Project Structure

```
bgmi-esport/
├── server/
│   └── server.js              # Backend server with WebSocket & API
├── public/
│   ├── control/
│   │   ├── control.html       # Admin panel interface
│   │   ├── control.css        # Admin panel styles
│   │   └── control.js         # Admin panel logic
│   └── display/
│       ├── display.html       # Projector display interface
│       ├── display.css        # Broadcast styles & animations
│       └── display.js         # Display logic & effects
├── package.json               # Dependencies configuration
├── .env                       # Environment variables (create from .env.example)
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🌐 API Endpoints

- `GET /` - Redirects to control center
- `GET /control` - Admin control panel
- `GET /display` - Display screen
- `GET /api/health` - Server health check
- `GET /api/teams` - Get all teams data
- `GET /api/leaderboard/:match` - Get specific match leaderboard

## 🔌 WebSocket Events

### Client → Server
- `adminLogin` - Authenticate admin
- `changeMatch` - Change current match view
- `changeDisplayMode` - Change display mode
- `changeRevealMode` - Toggle reveal mode
- `revealRank` - Reveal specific rank
- `resetReveal` - Reset all reveals
- `showWinners` - Show winners overlay
- `hideAll` - Hide all teams
- `lockRankings` - Lock/unlock rankings
- `toggleSponsor` - Toggle sponsor banner
- `refreshData` - Manual data refresh

### Server → Client
- `initialData` - Initial data on connection
- `dataUpdate` - Tournament data updated
- `matchChanged` - Match view changed
- `displayModeChanged` - Display mode changed
- `revealModeChanged` - Reveal mode changed
- `rankRevealed` - Rank revealed
- `revealReset` - Reveals reset
- `winnersShown` - Winners displayed
- `allHidden` - All teams hidden
- `rankingsLocked` - Rankings locked/unlocked
- `sponsorToggled` - Sponsor banner toggled

## 🤝 Contributing

Feel free to customize this system for your tournaments. Some ideas:
- Add sound effects for rank reveals
- Integrate with OBS for streaming overlays
- Add player statistics and profiles
- Create mobile app for remote control
- Add multiple tournament support

## 📄 License

MIT License - Feel free to use for your esports events!

## 💡 Tips for Live Events

1. **Test before the event:**
   - Run a full rehearsal with sample data
   - Test on actual projector/screens you'll use
   - Prepare backup displays/systems

2. **During the event:**
   - Keep Control Center on a separate, secure laptop
   - Use manual reveal mode for dramatic countdowns
   - Lock rankings when showing winners
   - Have a backup of Google Sheets data

3. **Best practices:**
   - Update Google Sheets after each match
   - Use manual reveal for final standings
   - Test projector resolution (1920x1080 recommended)
   - Close unnecessary browser tabs for performance

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review browser console (F12) for errors
- Verify all configuration in `.env`
- Ensure Google Sheets format matches template

---

**Built for the esports community with ❤️**

*Perfect for BGMI, PUBG, Free Fire, and other battle royale tournaments!*
