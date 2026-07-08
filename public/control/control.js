/**
 * Control Center JavaScript
 * Handles all admin control logic and WebSocket communication
 */

let socket = io(); // Initialize socket immediately
let currentMatch = 'overall'; // Start with overall to match server default
let displayMode = 'top15';
let revealMode = 'auto';
let revealedRanks = [];
let teamsData = [];
let isLocked = false;
let isSponsorVisible = false;
let isAutoUpdateEnabled = true; // Auto update current leaderboard
let isAuthenticated = true; // Bypass authentication

// Initialize Socket.io connection and event handlers
function initializeSocket() {
    socket.on('connect', () => {
        console.log('✅ Control panel connected to server');
        updateConnectionStatus(true);
    });

    socket.on('disconnect', () => {
        console.log('❌ Control panel disconnected from server');
        updateConnectionStatus(false);
    });

    socket.on('initialData', (data) => {
        console.log('📊 Control received initial data:', data);
        
        teamsData = data.teams;
        currentMatch = data.currentMatch;
        displayMode = data.displayMode;
        revealMode = data.revealMode;
        revealedRanks = data.revealedRanks || [];
        isLocked = data.locked;
        isSponsorVisible = data.sponsorVisible || false;
        
        document.getElementById('tournamentName').textContent = data.tournamentName;
        if (data.googleSheetId && document.getElementById('googleSheetUrlInput')) {
            document.getElementById('googleSheetUrlInput').value = `https://docs.google.com/spreadsheets/d/${data.googleSheetId}/edit`;
        }
        
        updateUI();
        updateMiniLeaderboard();
        generateRankButtons();
        updateSponsorButton();
        
        // Reset refresh button if it was loading
        const btn = document.querySelector('.btn-refresh');
        if (btn && btn.disabled) {
            btn.textContent = '🔄 Refresh Data';
            btn.disabled = false;
        }
    });

    socket.on('dataUpdate', (data) => {
        console.log('🔄 Data updated');
        
        teamsData = data.teams;
        // Only update mini leaderboard if auto update is enabled
        if (isAutoUpdateEnabled) {
            updateMiniLeaderboard();
            const el = document.getElementById('lastUpdatedTime');
            if (el) {
                const now = new Date();
                el.textContent = `Updated: ${now.toLocaleTimeString()}`;
            }
        }
    });

    socket.on('sheetUpdateResult', (result) => {
        const statusEl = document.getElementById('sheetUpdateStatus');
        const btn = document.getElementById('connectSheetBtn');
        if (btn) {
            btn.textContent = 'Connect';
            btn.disabled = false;
        }
        if (statusEl) {
            statusEl.textContent = result.message;
            statusEl.style.color = result.success ? '#00e676' : '#ff5252';
        }
    });

    socket.on('matchChanged', (match) => {
        console.log('🎮 Match changed to:', match);
        
        currentMatch = match;
        updateMatchButtons();
        updatePreview();
    });

    socket.on('displayModeChanged', (data) => {
        console.log('📺 Display mode changed:', data);
        
        displayMode = data.mode;
        updateDisplayButtons();
        updatePreview();
    });

    socket.on('revealModeChanged', (mode) => {
        console.log('👁️ Reveal mode changed:', mode);
        
        revealMode = mode;
        updateRevealModeUI();
        updatePreview();
    });

    socket.on('rankRevealed', (rank) => {
        console.log('✨ Rank revealed:', rank);
        
        if (!revealedRanks.includes(rank)) {
            revealedRanks.push(rank);
        }
        updateRankButtons();
        updatePreview();
    });

    socket.on('revealReset', () => {
        console.log('🔄 Reveal reset');
        
        revealedRanks = [];
        updateRankButtons();
        updatePreview();
    });

    socket.on('winnersShown', () => {
        console.log('🏆 Winners displayed');
    });

    socket.on('allHidden', () => {
        console.log('🙈 All hidden');
        
        revealedRanks = [];
        updateRankButtons();
        updatePreview();
    });

    socket.on('rankingsLocked', (locked) => {
        console.log('🔒 Rankings locked:', locked);
        
        isLocked = locked;
        updateLockButton();
    });

    socket.on('sponsorToggled', (visible) => {
        console.log('📢 Sponsor toggled:', visible);
        
        isSponsorVisible = visible;
        updateSponsorButton();
    });
}

// Login Function
function login() {
    const password = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('loginError');

    console.log('🔐 Attempting login...');
    
    socket.emit('adminLogin', password, (response) => {
        if (response.success) {
            console.log('✅ Login successful');
            isAuthenticated = true;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('controlPanel').style.display = 'block';
            
            // Data will be sent automatically by server after authentication
            console.log('⏳ Waiting for initial data...');
        } else {
            console.log('❌ Login failed:', response.message);
            errorElement.textContent = response.message || 'Invalid password';
        }
    });
}

// Allow Enter key to login
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    // Automatically request initial data on page load (bypassing authentication)
    setTimeout(() => {
        console.log('🔄 Auto-requesting initial data...');
        refreshData();
    }, 500); // Small delay to ensure socket connection is established
});

// Update connection status
function updateConnectionStatus(connected) {
    const statusDot = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    if (connected) {
        statusDot.classList.add('connected');
        statusText.textContent = 'Connected';
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = 'Disconnected';
    }
}

// Match Selection
function selectMatch(match) {
    currentMatch = match;
    socket.emit('changeMatch', match);
    updateMatchButtons();
    updatePreview();
}

function updateMatchButtons() {
    document.querySelectorAll('.btn-match').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.match === currentMatch) {
            btn.classList.add('active');
        }
    });
}

// Display Mode Selection
function selectDisplayMode(mode) {
    displayMode = mode;
    socket.emit('changeDisplayMode', mode);
    updateDisplayButtons();
    updatePreview();
}

function applyCustomCount() {
    const count = parseInt(document.getElementById('customCount').value);
    if (count > 0) {
        displayMode = 'custom';
        socket.emit('changeDisplayMode', 'custom', count);
        updateDisplayButtons();
        updatePreview();
    }
}

function updateDisplayButtons() {
    document.querySelectorAll('.btn-display').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === displayMode) {
            btn.classList.add('active');
        }
    });
}

// Reveal Mode Toggle
function toggleRevealMode() {
    const isAuto = document.getElementById('autoRevealToggle').checked;
    revealMode = isAuto ? 'auto' : 'manual';
    socket.emit('changeRevealMode', revealMode);
    updateRevealModeUI();
    updatePreview();
}

function updateRevealModeUI() {
    const label = document.getElementById('revealModeLabel');
    const isAuto = revealMode === 'auto';
    
    document.getElementById('autoRevealToggle').checked = isAuto;
    label.textContent = isAuto ? 'Auto Reveal (ON)' : 'Manual Reveal (OFF)';
    
    // Enable/disable rank buttons
    const rankButtons = document.querySelectorAll('.btn-rank');
    rankButtons.forEach(btn => {
        btn.disabled = isAuto;
    });
    
    // Enable/disable unselect all button
    const unselectAllBtn = document.querySelector('.btn-unselect-all');
    if (unselectAllBtn) {
        unselectAllBtn.disabled = isAuto;
    }
}

// Generate Rank Buttons
function generateRankButtons() {
    const container = document.getElementById('rankButtons');
    container.innerHTML = '';
    
    // Generate buttons from 25 down to 1
    for (let i = 25; i >= 1; i--) {
        const btn = document.createElement('button');
        btn.className = 'btn-rank';
        btn.textContent = `Rank ${i}`;
        btn.dataset.rank = i;
        btn.onclick = () => revealRank(i);
        container.appendChild(btn);
    }
    
    updateRankButtons();
}

function revealRank(rank) {
    if (revealMode === 'manual' && !revealedRanks.includes(rank)) {
        socket.emit('revealRank', rank);
    }
}

function updateRankButtons() {
    const buttons = document.querySelectorAll('.btn-rank');
    buttons.forEach(btn => {
        const rank = parseInt(btn.dataset.rank);
        if (revealedRanks.includes(rank)) {
            btn.classList.add('revealed');
        } else {
            btn.classList.remove('revealed');
        }
    });
}

// Special Actions
function showWinners() {
    socket.emit('showWinners');
}

function setupPodium() {
    // Loads podium data on display + shows stage/bg — no cards yet
    socket.emit('setupPodium');
}

function showPodium(position) {
    // position: 3 = show 3rd, 2 = show 2nd+3rd, 1 = show all top 3
    socket.emit('showPodium', position);
}

function hideAll() {
    socket.emit('hideAll');
}

function resetReveal() {
    socket.emit('resetReveal');
}

function toggleLock() {
    isLocked = !isLocked;
    socket.emit('lockRankings', isLocked);
    updateLockButton();
}

function updateLockButton() {
    const btn = document.getElementById('lockBtn');
    if (isLocked) {
        btn.textContent = '🔒 Unlock Rankings';
        btn.classList.add('btn-red');
        btn.classList.remove('btn-purple');
    } else {
        btn.textContent = '🔓 Lock Rankings';
        btn.classList.add('btn-purple');
        btn.classList.remove('btn-red');
    }
}

function toggleSponsor() {
    isSponsorVisible = !isSponsorVisible;
    socket.emit('toggleSponsor', isSponsorVisible);
    updateSponsorButton();
}

function updateSponsorButton() {
    const btn = document.querySelector('.btn-action.btn-green');
    if (btn) {
        if (isSponsorVisible) {
            btn.textContent = '🚫 Hide Sponsor';
        } else {
            btn.textContent = '📢 Toggle Sponsor';
        }
    }
}

function refreshDisplay() {
    console.log('📺 Sending manual refresh to display screen...');
    const btn = document.querySelector('.btn-refresh-display');
    if (btn) {
        const orig = btn.textContent;
        btn.textContent = '⏳ Sending...';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1500);
    }
    socket.emit('refreshDisplay');
}

function refreshData() {
    console.log('🔄 Requesting data refresh...');
    const btn = document.querySelector('.btn-refresh');
    const originalText = btn.textContent;
    
    // Show loading state
    btn.textContent = '⏳ Refreshing...';
    btn.disabled = true;
    
    socket.emit('refreshData');
    
    // Reset button after timeout (in case server doesn't respond)
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 5000);
}

// Handle refresh error
socket.on('refreshError', (error) => {
    console.error('❌ Refresh error:', error);
    alert('Failed to refresh data: ' + error.message);
    const btn = document.querySelector('.btn-refresh');
    btn.textContent = '🔄 Refresh Data';
    btn.disabled = false;
});

// Update Preview
function updatePreview() {
    const matchNames = {
        'match1': 'Match 1',
        'match2': 'Match 2',
        'match3': 'Match 3',
        'overall': 'Overall Standings'
    };
    
    const displayNames = {
        'top3': 'Top 3',
        'top7': 'Top 7',
        'top15': 'Top 15',
        'custom': `Custom (${document.getElementById('customCount').value})`
    };
    
    document.getElementById('previewMatch').textContent = matchNames[currentMatch];
    document.getElementById('previewDisplay').textContent = displayNames[displayMode];
    document.getElementById('previewReveal').textContent = revealMode === 'auto' ? 'Auto' : 'Manual';
    
    if (revealMode === 'manual' && revealedRanks.length > 0) {
        document.getElementById('previewRevealed').textContent = revealedRanks.sort((a, b) => a - b).join(', ');
    } else {
        document.getElementById('previewRevealed').textContent = revealMode === 'auto' ? 'All visible' : 'None';
    }
}

// Update Mini Leaderboard
function updateMiniLeaderboard() {
    // Don't update if auto update is disabled
    if (!isAutoUpdateEnabled) {
        return;
    }
    
    const container = document.getElementById('miniLeaderboard');
    if (!teamsData || teamsData.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No data available</p>';
        return;
    }
    
    container.innerHTML = '';
    
    // Show top 10 teams
    teamsData.slice(0, 10).forEach((team, index) => {
        const rank = index + 1;
        const teamDiv = document.createElement('div');
        teamDiv.className = `mini-team rank-${rank}`;
        
        teamDiv.innerHTML = `
            <div class="mini-rank">${rank}</div>
            <div class="mini-team-name">${team.teamName}</div>
            <div class="mini-stats">
                <div class="mini-stat">
                    <span class="mini-stat-label">Points</span>
                    <span class="mini-stat-value">${team.totalPoints}</span>
                </div>
                <div class="mini-stat">
                    <span class="mini-stat-label">Kills</span>
                    <span class="mini-stat-value">${team.totalKills}</span>
                </div>
            </div>
        `;
        
        container.appendChild(teamDiv);
    });
}

// Update Full UI
function updateUI() {
    updateMatchButtons();
    updateDisplayButtons();
    updateRevealModeUI();
    updatePreview();
    updateLockButton();
}

// Open Display Screen
function openDisplayScreen() {
    const width = 1920;
    const height = 1080;
    const left = window.screen.width - width;
    const top = 0;
    
    window.open(
        '/display',
        'DisplayScreen',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no`
    );
}

// Auto Update Toggle
function toggleAutoUpdate() {
    isAutoUpdateEnabled = document.getElementById('autoUpdateToggle').checked;
    const label = document.getElementById('autoUpdateLabel');
    
    if (isAutoUpdateEnabled) {
        label.textContent = '🔄 Auto Update';
        label.style.color = '';
        // Immediately update when re-enabled
        updateMiniLeaderboard();
        console.log('✅ Auto update enabled');
    } else {
        label.textContent = '⏸️ Update Paused';
        label.style.color = 'var(--accent-red)';
        console.log('⏸️ Auto update paused');
    }
}

// Connect or update Google Sheet URL live
function updateGoogleSheetUrl() {
    const inputEl = document.getElementById('googleSheetUrlInput');
    const statusEl = document.getElementById('sheetUpdateStatus');
    const btn = document.getElementById('connectSheetBtn');
    if (!inputEl || !inputEl.value.trim()) {
        if (statusEl) {
            statusEl.textContent = 'Please paste a Google Sheet link or ID first';
            statusEl.style.color = '#ff5252';
        }
        return;
    }
    if (btn) {
        btn.textContent = 'Connecting...';
        btn.disabled = true;
    }
    if (statusEl) {
        statusEl.textContent = 'Connecting to Google Sheet...';
        statusEl.style.color = '#ffbb00';
    }
    socket.emit('updateGoogleSheetUrl', inputEl.value.trim());
}

// Initialize socket event handlers on page load
initializeSocket();
console.log('🚀 Control panel initialized');
