/**
 * BGMI Esports Tournament Leaderboard System
 * Backend Server with Socket.io and Google Sheets Integration
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configuration
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOURNAMENT_NAME = process.env.TOURNAMENT_NAME || 'BGMI Esports Championship 2026';

// Placement Points Configuration
const PLACEMENT_POINTS = {
  1: 15,
  2: 12,
  3: 10,
  4: 8,
  5: 6,
  6: 4,
  7: 2
};

// Global State
let tournamentData = {
  teams: [],
  matches: [],
  currentMatch: 'overall',
  displayMode: 'top15',
  customDisplayCount: 15,
  revealMode: 'auto',
  revealedRanks: [],
  winnersVisible: false,
  locked: false,
  sponsorVisible: false,
};

// Sample Data (Replace with Google Sheets data)
let sampleData = [
  {
    teamName: "Team Alpha",
    match1Placement: 1,
    match1Kills: 12,
    match2Placement: 3,
    match2Kills: 8,
    match3Placement: 2,
    match3Kills: 10
  },
  {
    teamName: "Team Beta",
    match1Placement: 2,
    match1Kills: 10,
    match2Placement: 1,
    match2Kills: 15,
    match3Placement: 1,
    match3Kills: 13
  },
  {
    teamName: "Team Gamma",
    match1Placement: 3,
    match1Kills: 8,
    match2Placement: 2,
    match2Kills: 11,
    match3Placement: 4,
    match3Kills: 7
  },
  {
    teamName: "Team Delta",
    match1Placement: 4,
    match1Kills: 6,
    match2Placement: 5,
    match2Kills: 5,
    match3Placement: 3,
    match3Kills: 9
  },
  {
    teamName: "Team Epsilon",
    match1Placement: 5,
    match1Kills: 7,
    match2Placement: 4,
    match2Kills: 8,
    match3Placement: 5,
    match3Kills: 6
  },
  {
    teamName: "Team Zeta",
    match1Placement: 6,
    match1Kills: 5,
    match2Placement: 6,
    match2Kills: 6,
    match3Placement: 6,
    match3Kills: 5
  },
  {
    teamName: "Team Eta",
    match1Placement: 7,
    match1Kills: 4,
    match2Placement: 7,
    match2Kills: 4,
    match3Placement: 7,
    match3Kills: 4
  },
  {
    teamName: "Team Theta",
    match1Placement: 8,
    match1Kills: 3,
    match2Placement: 8,
    match2Kills: 3,
    match3Placement: 8,
    match3Kills: 3
  }
];

/**
 * Calculate points for a single match
 */
function calculateMatchPoints(placement, kills) {
  const placementPoints = PLACEMENT_POINTS[placement] || 0;
  const killPoints = kills || 0;
  return placementPoints + killPoints;
}

/**
 * Process and calculate team statistics
 */
function processTeamData(rawData) {
  return rawData.map(team => {
    // Match 1
    const match1Placement = team.match1Placement || 0;
    const match1Kills = team.match1Kills || 0;
    const match1Points = calculateMatchPoints(match1Placement, match1Kills);

    // Match 2
    const match2Placement = team.match2Placement || 0;
    const match2Kills = team.match2Kills || 0;
    const match2Points = calculateMatchPoints(match2Placement, match2Kills);

    // Match 3
    const match3Placement = team.match3Placement || 0;
    const match3Kills = team.match3Kills || 0;
    const match3Points = calculateMatchPoints(match3Placement, match3Kills);

    // Totals
    const totalKills = match1Kills + match2Kills + match3Kills;
    const totalPoints = match1Points + match2Points + match3Points;

    return {
      teamName: team.teamName,
      // Match 1
      match1Placement,
      match1Kills,
      match1Points,
      // Match 2
      match2Placement,
      match2Kills,
      match2Points,
      // Match 3
      match3Placement,
      match3Kills,
      match3Points,
      // Totals
      totalKills,
      totalPoints,
      // For tie breaking
      lastMatchPlacement: match3Placement || match2Placement || match1Placement
    };
  });
}

/**
 * Sort teams with tie-breaker logic
 * 1. Higher Total Points
 * 2. Higher Total Kills
 * 3. Better Last Match Placement (lower is better)
 */
function sortTeams(teams) {
  return teams.sort((a, b) => {
    // Compare total points (descending)
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    
    // Compare total kills (descending)
    if (b.totalKills !== a.totalKills) {
      return b.totalKills - a.totalKills;
    }
    
    // Compare last match placement (ascending - lower is better)
    return a.lastMatchPlacement - b.lastMatchPlacement;
  });
}

/**
 * Get leaderboard for specific match
 */
function getMatchLeaderboard(teams, matchNumber) {
  if (matchNumber === 'overall') {
    return sortTeams(teams).map((team, index) => ({
      ...team,
      rank: index + 1
    }));
  }

  const matchField = `match${matchNumber}`;
  return teams
    .map(team => ({
      teamName: team.teamName,
      placement: team[`${matchField}Placement`],
      kills: team[`${matchField}Kills`],
      points: team[`${matchField}Points`],
      rank: team[`${matchField}Placement`]
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.kills !== a.kills) return b.kills - a.kills;
      return a.placement - b.placement;
    })
    .map((team, index) => ({
      ...team,
      rank: index + 1
    }));
}

/**
 * Update tournament data
 */
function updateTournamentData() {
  const processedTeams = processTeamData(sampleData);
  tournamentData.teams = sortTeams(processedTeams);
  
  // No auto-refresh to display - only manual refresh
  console.log('📊 Data updated but not broadcasted (manual refresh only)');
}

/**
 * Fetch data from Google Sheets (CSV export)
 */
async function fetchFromGoogleSheets() {
  return new Promise((resolve, reject) => {
    try {
      const sheetId = process.env.GOOGLE_SHEET_ID;
      if (!sheetId || sheetId === 'your_google_sheet_id_here') {
        console.log('Using sample data. Configure GOOGLE_SHEET_ID in .env to use real data.');
        resolve(false);
        return;
      }

      const https = require('https');
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      // Handle redirects manually
      const fetchWithRedirect = (fetchUrl, redirectCount = 0) => {
        if (redirectCount > 3) {
          reject(new Error('Too many redirects'));
          return;
        }

        https.get(fetchUrl, { 
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }, (response) => {
          // Handle redirects
          if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
            const redirectUrl = response.headers.location;
            if (redirectUrl) {
              console.log(`↪ Following redirect to: ${redirectUrl.substring(0, 50)}...`);
              fetchWithRedirect(redirectUrl, redirectCount + 1);
              return;
            }
          }
          
          if (response.statusCode !== 200) {
            console.error(`❌ HTTP ${response.statusCode} from Google Sheets`);
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }

          let data = '';
          
          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            try {
              // Check if we got HTML instead of CSV
              if (data.trim().startsWith('<') || data.includes('<!DOCTYPE')) {
                console.error('❌ Got HTML instead of CSV. Sheet may not be public.');
                console.log('First 200 chars:', data.substring(0, 200));
                reject(new Error('Got HTML instead of CSV'));
                return;
              }

              const rows = data.split('\n').slice(1); // Skip header
              const parsedData = rows
                .filter(row => row.trim())
                .map(row => {
                  // Handle CSV with quoted values
                  const cols = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
                  return {
                    teamName: cols[0] || '',
                    match1Placement: parseInt(cols[1]) || 0,
                    match1Kills: parseInt(cols[2]) || 0,
                    match2Placement: parseInt(cols[3]) || 0,
                    match2Kills: parseInt(cols[4]) || 0,
                    match3Placement: parseInt(cols[5]) || 0,
                    match3Kills: parseInt(cols[6]) || 0
                  };
                });

              if (parsedData.length > 0) {
                sampleData = parsedData;
                updateTournamentData();
                console.log(`✓ Fetched ${parsedData.length} teams from Google Sheets`);
                console.log('📋 Teams:', parsedData.map(t => t.teamName).slice(0, 3).join(', ') + '...');
                // Auto-broadcast updated data to all connected clients
                io.emit('dataUpdate', {
                  teams: tournamentData.teams,
                  currentMatch: tournamentData.currentMatch,
                  displayMode: tournamentData.displayMode,
                  revealMode: tournamentData.revealMode,
                  revealedRanks: tournamentData.revealedRanks,
                  winnersVisible: tournamentData.winnersVisible,
                  locked: tournamentData.locked,
                  tournamentName: TOURNAMENT_NAME
                });
                console.log('📡 Auto-broadcasted data update to all clients');
                resolve(true);
              } else {
                console.log('⚠ No data found in Google Sheets');
                resolve(false);
              }
            } catch (parseError) {
              console.error('Error parsing Google Sheets data:', parseError);
              reject(parseError);
            }
          });
        }).on('error', (err) => {
          console.error('Error fetching Google Sheets:', err.message);
          reject(err);
        });
      };

      fetchWithRedirect(url);

    } catch (error) {
      console.error('Error in fetchFromGoogleSheets:', error);
      reject(error);
    }
  });
}

// Initialize data
updateTournamentData();

// Auto-refresh data from Google Sheets
const refreshInterval = parseInt(process.env.DATA_REFRESH_INTERVAL) || 10000;
setInterval(fetchFromGoogleSheets, refreshInterval);

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data
  socket.emit('initialData', {
    teams: tournamentData.teams,
    currentMatch: tournamentData.currentMatch,
    displayMode: tournamentData.displayMode,
    customDisplayCount: tournamentData.customDisplayCount,
    revealMode: tournamentData.revealMode,
    revealedRanks: tournamentData.revealedRanks,
    winnersVisible: tournamentData.winnersVisible,
    locked: tournamentData.locked,
    sponsorVisible: tournamentData.sponsorVisible,
    tournamentName: TOURNAMENT_NAME
  });

  // Admin authentication
  socket.on('adminLogin', (password, callback) => {
    if (password === ADMIN_PASSWORD) {
      callback({ success: true });
      // Send initial data after successful authentication
      socket.emit('initialData', {
        teams: tournamentData.teams,
        currentMatch: tournamentData.currentMatch,
        displayMode: tournamentData.displayMode,
        customDisplayCount: tournamentData.customDisplayCount,
        revealMode: tournamentData.revealMode,
        revealedRanks: tournamentData.revealedRanks,
        winnersVisible: tournamentData.winnersVisible,
        locked: tournamentData.locked,
        sponsorVisible: tournamentData.sponsorVisible,
        tournamentName: TOURNAMENT_NAME
      });
    } else {
      callback({ success: false, message: 'Invalid password' });
    }
  });

  // Change current match view
  socket.on('changeMatch', (matchId) => {
    console.log('🎮 Server received changeMatch:', matchId);
    tournamentData.currentMatch = matchId;
    io.emit('matchChanged', matchId);
    console.log('📡 Broadcasted matchChanged to all clients');
  });

  // Change display mode
  socket.on('changeDisplayMode', (mode, customCount) => {
    console.log('📺 Server received changeDisplayMode:', mode, customCount);
    tournamentData.displayMode = mode;
    if (customCount) {
      tournamentData.customDisplayCount = customCount;
    }
    io.emit('displayModeChanged', { mode, customCount });
    console.log('📡 Broadcasted displayModeChanged to all clients');
  });

  // Change reveal mode
  socket.on('changeRevealMode', (mode) => {
    console.log('👁️ Server received changeRevealMode:', mode);
    tournamentData.revealMode = mode;
    if (mode === 'auto') {
      tournamentData.revealedRanks = [];
    }
    io.emit('revealModeChanged', mode);
    console.log('📡 Broadcasted revealModeChanged to all clients');
  });

  // Reveal specific rank
  socket.on('revealRank', (rank) => {
    if (!tournamentData.revealedRanks.includes(rank)) {
      tournamentData.revealedRanks.push(rank);
      tournamentData.revealedRanks.sort((a, b) => b - a); // Sort descending
    }
    io.emit('rankRevealed', rank);
  });

  // Reset reveal
  socket.on('resetReveal', () => {
    tournamentData.revealedRanks = [];
    io.emit('revealReset');
  });

  // Show winners (legacy)
  socket.on('showWinners', () => {
    tournamentData.winnersVisible = true;
    io.emit('winnersShown');
  });

  // Setup podium - loads data on display, shows bg/stage but no cards yet
  socket.on('setupPodium', () => {
    console.log('🎬 Podium setup triggered');
    tournamentData.podiumPosition = null; // reset reveal state
    io.emit('podiumSetup', {
      teams: tournamentData.teams
    });
  });

  // Podium reveal - step by step (position: 3, 2, or 1)
  socket.on('showPodium', (position) => {
    tournamentData.winnersVisible = true;
    tournamentData.podiumPosition = position; // how many winners revealed so far
    io.emit('podiumReveal', {
      position: position,
      teams: tournamentData.teams
    });
  });

  // Hide all
  socket.on('hideAll', () => {
    tournamentData.winnersVisible = false;
    tournamentData.revealedRanks = [];
    io.emit('allHidden');
  });

  // Lock rankings
  socket.on('lockRankings', (locked) => {
    tournamentData.locked = locked;
    io.emit('rankingsLocked', locked);
  });

  // Toggle sponsor
  socket.on('toggleSponsor', (visible) => {
    tournamentData.sponsorVisible = visible;
    io.emit('sponsorToggled', visible);
  });

  // Refresh Display manually
  socket.on('refreshDisplay', () => {
    console.log('🔄 Manual display refresh requested');
    // displayRefresh = only for the display screen (manual trigger)
    io.emit('displayRefresh', {
      teams: tournamentData.teams,
      currentMatch: tournamentData.currentMatch,
      displayMode: tournamentData.displayMode,
      revealMode: tournamentData.revealMode,
      revealedRanks: tournamentData.revealedRanks,
      winnersVisible: tournamentData.winnersVisible,
      locked: tournamentData.locked,
      tournamentName: TOURNAMENT_NAME
    });
  });

  // Manual data refresh
  socket.on('refreshData', async () => {
    console.log('🔄 Manual refresh requested');
    try {
      // Wait for data to be fetched from Google Sheets
      await fetchFromGoogleSheets();
      
      // Send updated data to the requesting client
      socket.emit('initialData', {
        teams: tournamentData.teams,
        currentMatch: tournamentData.currentMatch,
        displayMode: tournamentData.displayMode,
        customDisplayCount: tournamentData.customDisplayCount,
        revealMode: tournamentData.revealMode,
        revealedRanks: tournamentData.revealedRanks,
        winnersVisible: tournamentData.winnersVisible,
        locked: tournamentData.locked,
        sponsorVisible: tournamentData.sponsorVisible,

        tournamentName: TOURNAMENT_NAME
      });
      console.log('✓ Refresh complete - data sent to client');
    } catch (error) {
      console.error('❌ Error during refresh:', error);
      socket.emit('refreshError', { message: 'Failed to refresh data' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', tournament: TOURNAMENT_NAME });
});

app.get('/api/teams', (req, res) => {
  res.json(tournamentData.teams);
});

app.get('/api/leaderboard/:match', (req, res) => {
  const match = req.params.match;
  const leaderboard = getMatchLeaderboard(tournamentData.teams, match);
  res.json(leaderboard);
});

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/control/control.html'));
});

app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/control/control.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pubg-display.html'));
});

// Start server
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('  🏆 BGMI ESPORTS TOURNAMENT LEADERBOARD SYSTEM');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Server running on: http://localhost:${PORT}`);
  console.log(`  Control Center: http://localhost:${PORT}/control`);
  console.log(`  Display Screen: http://localhost:${PORT}/display`);
  console.log(`  Admin Password: ${ADMIN_PASSWORD}`);
  console.log('═══════════════════════════════════════════════════');
  
  // Initial data fetch
  setTimeout(fetchFromGoogleSheets, 1000);
});
