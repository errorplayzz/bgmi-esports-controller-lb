# 🚀 Quick Start Guide

Get your tournament leaderboard running in 5 minutes!

## ⚡ Express Setup

### Step 1: Install Dependencies (1 minute)

```powershell
cd "e:\ERROR Codes\bgmi esport"
npm install
```

Wait for packages to install...

### Step 2: Start the Server (30 seconds)

```powershell
npm start
```

You should see:
```
═══════════════════════════════════════════════════
  🏆 BGMI ESPORTS TOURNAMENT LEADERBOARD SYSTEM
═══════════════════════════════════════════════════
  Server running on: http://localhost:3000
  Control Center: http://localhost:3000/control
  Display Screen: http://localhost:3000/display
  Admin Password: admin123
═══════════════════════════════════════════════════
```

### Step 3: Open Control Center (30 seconds)

1. Open your browser
2. Go to: `http://localhost:3000/control`
3. Login with password: `admin123`
4. You're in! 🎉

### Step 4: Open Display Screen (30 seconds)

1. Click "🖥️ Open Display Screen" button in Control Center
2. Or open `http://localhost:3000/display` in a new window
3. Drag to projector/second monitor
4. Press F11 for fullscreen

### Step 5: Test It! (2 minutes)

The system starts with **sample data** so you can test immediately:

1. **Try different matches:**
   - Click "Match 1", "Match 2", "Match 3", or "Overall"
   - Watch the display screen update instantly!

2. **Change display mode:**
   - Click "Top 3", "Top 7", or "Top 15"
   - See the leaderboard adjust

3. **Test manual reveal:**
   - Toggle "Auto Reveal" to OFF
   - Click rank buttons (15, 14, 13...)
   - Watch teams appear one by one!

4. **Show winners:**
   - Click "🏆 Show Winners"
   - Enjoy the confetti! 🎊

## 🎯 That's It!

You now have a working tournament leaderboard system!

---

## 📊 Want to Use Your Data?

### Quick Google Sheets Setup

1. **Create a Google Sheet** with this format:

| Team Name | Match1 Placement | Match1 Kills | Match2 Placement | Match2 Kills | Match3 Placement | Match3 Kills |
|-----------|------------------|--------------|------------------|--------------|------------------|--------------|
| Team A | 1 | 12 | 3 | 8 | 2 | 10 |
| Team B | 2 | 10 | 1 | 15 | 1 | 13 |

2. **Make it public:**
   - Click "Share" → "Anyone with the link" → "Viewer"

3. **Get the Sheet ID:**
   - Copy from URL: `docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`

4. **Update .env file:**
   ```env
   GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
   ```

5. **Restart the server:**
   ```powershell
   # Press Ctrl+C to stop, then:
   npm start
   ```

Your live data will now appear! 🎉

---

## 🎮 Two-Monitor Setup

**For live tournaments:**

1. **Laptop (Control):**
   - Open: `http://localhost:3000/control`
   - Keep this private - admin only

2. **Projector/TV (Display):**
   - Open: `http://localhost:3000/display`
   - This shows to the audience
   - Make it fullscreen (F11)

3. **Control everything from laptop:**
   - Change matches
   - Reveal rankings
   - Show winners
   - Everything updates on projector instantly!

---

## 🔧 Common First-Time Issues

### Port 3000 already in use?

Change the port in `.env`:
```env
PORT=3001
```

Then use: `http://localhost:3001`

### Can't login?

Default password is: `admin123`

Change it in `.env`:
```env
ADMIN_PASSWORD=your_new_password
```

### Display not updating?

1. Refresh both control and display screens (F5)
2. Check internet connection (for Google Sheets)
3. Open browser console (F12) to check for errors

---

## 📱 Access from Other Devices

Want to access from another computer on your network?

1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On other device, open:
   ```
   http://YOUR_IP_ADDRESS:3000/control
   http://YOUR_IP_ADDRESS:3000/display
   ```

---

## 🎨 Customization Tips

### Change Tournament Name

Edit `.env`:
```env
TOURNAMENT_NAME=My Awesome Tournament 2026
```

### Change Admin Password

Edit `.env`:
```env
ADMIN_PASSWORD=super_secure_password
```

### Adjust Data Refresh Speed

Edit `.env` (in milliseconds):
```env
DATA_REFRESH_INTERVAL=5000  # Refresh every 5 seconds
```

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [GOOGLE_SHEETS_TEMPLATE.md](GOOGLE_SHEETS_TEMPLATE.md) for data format
- Customize colors in `public/display/display.css`
- Add your sponsor logo

---

## 🎯 Ready for Your Event?

**Pre-event checklist:**
- ✅ Test with sample data
- ✅ Connect to your Google Sheet
- ✅ Test on actual projector
- ✅ Change admin password
- ✅ Update tournament name
- ✅ Practice reveal animations
- ✅ Prepare backup plan

---

**Need Help?** Check the [README.md](README.md) troubleshooting section.

**Enjoy your tournament! 🏆**
