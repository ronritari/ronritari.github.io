// FutStats Dashboard JavaScript

// Dashboard State
const state = {
  homeScore: 0,
  awayScore: 0,
  homeShots: 0,
  awayShots: 0,
  homeShotsOnTarget: 0,
  awayShotsOnTarget: 0,
  homeCorners: 0,
  awayCorners: 0,
  homePasses: 0,
  awayPasses: 0,
  timerRunning: false,
  timerSeconds: 0,
  timerInterval: null,
  
  // Possession tracking
  possession: null, // 'home' or 'away' or null
  homeConsecutivePasses: 0,
  awayConsecutivePasses: 0,
  homeMaxConsecutivePasses: 0,
  awayMaxConsecutivePasses: 0,
  
  // Reverse mode
  reverseMode: false,
  
  // Event log with timestamps
  eventLog: []
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('FutStats Dashboard loaded');
  initializeDashboard();
});

function getGameTime() {
  const minutes = Math.floor(state.timerSeconds / 60);
  const seconds = state.timerSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function logEvent(eventType, team, details = {}) {
  const event = {
    timestamp: getGameTime(),
    timerSeconds: state.timerSeconds,
    eventType: eventType,
    team: team,
    details: details
  };
  state.eventLog.push(event);
  console.log('Event logged:', event);
}

function initializeDashboard() {
  // Home team buttons
  document.getElementById('homeShot').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.homeShots > 0) {
        state.homeShots--;
        logEvent('shot_reversed', 'home', { shotsTotal: state.homeShots });
      }
    } else {
      state.homeShots++;
      logEvent('shot', 'home', { shotsTotal: state.homeShots });
    }
    updateStats();
    console.log('Home shot:', state.homeShots);
  });

  document.getElementById('homeGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.homeScore > 0) {
        state.homeScore--;
        logEvent('goal_reversed', 'home', { goalsTotal: state.homeScore });
      }
    } else {
      state.homeScore++;
      logEvent('goal', 'home', { goalsTotal: state.homeScore });
    }
    updateScoreDisplay();
    updateStats();
    console.log('Home goal:', state.homeScore);
  });

  // Home Shot on Goal button
  document.getElementById('homeShotOnGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.homeShotsOnTarget > 0) {
        state.homeShotsOnTarget--;
        logEvent('shot_on_goal_reversed', 'home', { shotsOnTargetTotal: state.homeShotsOnTarget });
      }
    } else {
      state.homeShotsOnTarget++;
      logEvent('shot_on_goal', 'home', { shotsOnTargetTotal: state.homeShotsOnTarget });
    }
    updateStats();
    console.log('Home shot on goal:', state.homeShotsOnTarget);
  });

  // Home Corner button
  document.getElementById('homeCorner').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.homeCorners > 0) {
        state.homeCorners--;
        logEvent('corner_reversed', 'home', { cornersTotal: state.homeCorners });
      }
    } else {
      state.homeCorners++;
      logEvent('corner', 'home', { cornersTotal: state.homeCorners });
    }
    updateStats();
    console.log('Home corners:', state.homeCorners);
  });

  // Away team buttons
  document.getElementById('awayShot').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.awayShots > 0) {
        state.awayShots--;
        logEvent('shot_reversed', 'away', { shotsTotal: state.awayShots });
      }
    } else {
      state.awayShots++;
      logEvent('shot', 'away', { shotsTotal: state.awayShots });
    }
    updateStats();
    console.log('Away shot:', state.awayShots);
  });

  document.getElementById('awayGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.awayScore > 0) {
        state.awayScore--;
        logEvent('goal_reversed', 'away', { goalsTotal: state.awayScore });
      }
    } else {
      state.awayScore++;
      logEvent('goal', 'away', { goalsTotal: state.awayScore });
    }
    updateScoreDisplay();
    updateStats();
    console.log('Away goal:', state.awayScore);
  });

  // Away Shot on Goal button
  document.getElementById('awayShotOnGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.awayShotsOnTarget > 0) {
        state.awayShotsOnTarget--;
        logEvent('shot_on_goal_reversed', 'away', { shotsOnTargetTotal: state.awayShotsOnTarget });
      }
    } else {
      state.awayShotsOnTarget++;
      logEvent('shot_on_goal', 'away', { shotsOnTargetTotal: state.awayShotsOnTarget });
    }
    updateStats();
    console.log('Away shot on goal:', state.awayShotsOnTarget);
  });

  // Away Corner button
  document.getElementById('awayCorner').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.reverseMode) {
      if (state.awayCorners > 0) {
        state.awayCorners--;
        logEvent('corner_reversed', 'away', { cornersTotal: state.awayCorners });
      }
    } else {
      state.awayCorners++;
      logEvent('corner', 'away', { cornersTotal: state.awayCorners });
    }
    updateStats();
    console.log('Away corners:', state.awayCorners);
  });

  // Pass tile handlers (entire tile is clickable)
  document.getElementById('homePass').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homePasses++;
    
    // Track possession and passing chains
    if (state.possession !== 'home') {
      // Possession change from away to home
      if (state.possession === 'away' && state.awayConsecutivePasses > 0) {
        // Away team lost possession, save their chain
        if (state.awayConsecutivePasses > state.awayMaxConsecutivePasses) {
          state.awayMaxConsecutivePasses = state.awayConsecutivePasses;
        }
      }
      state.possession = 'home';
      state.homeConsecutivePasses = 1;
      logEvent('possession_change', 'home', { previousPossession: state.possession });
    } else {
      // Home already has possession, continue chain
      state.homeConsecutivePasses++;
    }
    
    logEvent('pass', 'home', { consecutivePasses: state.homeConsecutivePasses });
    updatePossession();
    console.log('Home passes:', state.homePasses, 'Consecutive:', state.homeConsecutivePasses);
  });

  document.getElementById('awayPass').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayPasses++;
    
    // Track possession and passing chains
    if (state.possession !== 'away') {
      // Possession change from home to away
      if (state.possession === 'home' && state.homeConsecutivePasses > 0) {
        // Home team lost possession, save their chain
        if (state.homeConsecutivePasses > state.homeMaxConsecutivePasses) {
          state.homeMaxConsecutivePasses = state.homeConsecutivePasses;
        }
      }
      state.possession = 'away';
      state.awayConsecutivePasses = 1;
      logEvent('possession_change', 'away', { previousPossession: state.possession });
    } else {
      // Away already has possession, continue chain
      state.awayConsecutivePasses++;
    }
    
    logEvent('pass', 'away', { consecutivePasses: state.awayConsecutivePasses });
    updatePossession();
    console.log('Away passes:', state.awayPasses, 'Consecutive:', state.awayConsecutivePasses);
  });

  // Timer controls
  document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);

  // Reverse button
  document.getElementById('reverseBtn').addEventListener('click', () => {
    state.reverseMode = !state.reverseMode;
    const btn = document.getElementById('reverseBtn');
    const actionButtons = [
      'homeShot', 'homeShotOnGoal', 'homeGoal', 'homeCorner',
      'awayShot', 'awayShotOnGoal', 'awayGoal', 'awayCorner'
    ];
    
    if (state.reverseMode) {
      btn.classList.add('active');
      logEvent('reverse_mode_on', 'system');
      console.log('Reverse mode ON - Click stat buttons to remove stats');
      // Update button text
      actionButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
          const originalText = button.textContent;
          if (!button.hasAttribute('data-original-text')) {
            button.setAttribute('data-original-text', originalText);
          }
          button.textContent = '-' + originalText;
        }
      });
    } else {
      btn.classList.remove('active');
      logEvent('reverse_mode_off', 'system');
      console.log('Reverse mode OFF - Normal mode');
      // Restore button text
      actionButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button && button.hasAttribute('data-original-text')) {
          button.textContent = button.getAttribute('data-original-text');
        }
      });
    }
  });

  // End game button
  document.getElementById('endGameBtn').addEventListener('click', endGame);

  // Update initial displays
  updateScoreDisplay();
  updateTimerDisplay();
  updateStats();
  updatePossession();
  
  // Disable buttons initially (timer not running)
  disableGameButtons(true);
}

function toggleTimer() {
  const btn = document.getElementById('playPauseBtn');
  
  if (state.timerRunning) {
    // Pause
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    btn.textContent = '▶';
    disableGameButtons(true);
  } else {
    // Play
    state.timerRunning = true;
    btn.textContent = '⏸';
    disableGameButtons(false);
    
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function disableGameButtons(disabled) {
  const buttons = [
    'homeShot', 'homeShotOnGoal', 'homeGoal', 'homeCorner',
    'awayShot', 'awayShotOnGoal', 'awayGoal', 'awayCorner'
  ];
  
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = disabled;
      if (disabled) {
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }
    }
  });
  
  // Handle pass tiles
  const homePassTile = document.getElementById('homePass');
  const awayPassTile = document.getElementById('awayPass');
  
  if (disabled) {
    homePassTile.style.opacity = '0.5';
    homePassTile.style.cursor = 'not-allowed';
    awayPassTile.style.opacity = '0.5';
    awayPassTile.style.cursor = 'not-allowed';
  } else {
    homePassTile.style.opacity = '1';
    homePassTile.style.cursor = 'pointer';
    awayPassTile.style.opacity = '1';
    awayPassTile.style.cursor = 'pointer';
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(state.timerSeconds / 60);
  const seconds = state.timerSeconds % 60;
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('timer').textContent = timerStr;
}

function updateScoreDisplay() {
  document.getElementById('homeScore').textContent = state.homeScore;
  document.getElementById('awayScore').textContent = state.awayScore;
}

function updateStats() {
  // Update shots bar chart and numbers
  const totalShots = state.homeShots + state.awayShots;
  
  if (totalShots > 0) {
    const homePercentage = Math.round((state.homeShots / totalShots) * 100);
    const awayPercentage = 100 - homePercentage;
    
    document.getElementById('shotsHome').style.width = homePercentage + '%';
    document.getElementById('shotsAway').style.width = awayPercentage + '%';
  } else {
    document.getElementById('shotsHome').style.width = '50%';
    document.getElementById('shotsAway').style.width = '50%';
  }
  
  // Update shots numbers
  document.getElementById('shotsHomeNumber').textContent = state.homeShots;
  document.getElementById('shotsAwayNumber').textContent = state.awayShots;
  
  // Update shots on target bar chart and numbers
  const totalShotsOnTarget = state.homeShotsOnTarget + state.awayShotsOnTarget;
  
  if (totalShotsOnTarget > 0) {
    const homePercentageShotsOnTarget = state.homeShotsOnTarget;
    const awayPercentageShotsOnTarget = state.awayShotsOnTarget;
    const totalForDisplay = homePercentageShotsOnTarget + awayPercentageShotsOnTarget;
    const homePercentageDisplay = Math.round((homePercentageShotsOnTarget / totalForDisplay) * 100);
    const awayPercentageDisplay = 100 - homePercentageDisplay;
    
    document.getElementById('shotsOnTargetHome').style.width = homePercentageDisplay + '%';
    document.getElementById('shotsOnTargetAway').style.width = awayPercentageDisplay + '%';
  } else {
    document.getElementById('shotsOnTargetHome').style.width = '50%';
    document.getElementById('shotsOnTargetAway').style.width = '50%';
  }
  
  // Update shots on target numbers
  document.getElementById('shotsOnTargetHomeNumber').textContent = state.homeShotsOnTarget;
  document.getElementById('shotsOnTargetAwayNumber').textContent = state.awayShotsOnTarget;
  
  // Update corners bar chart and numbers
  const totalCorners = state.homeCorners + state.awayCorners;
  
  if (totalCorners > 0) {
    const homePercentageCorners = state.homeCorners;
    const awayPercentageCorners = state.awayCorners;
    const totalCornersForDisplay = homePercentageCorners + awayPercentageCorners;
    const homePercentageDisplay = Math.round((homePercentageCorners / totalCornersForDisplay) * 100);
    const awayPercentageDisplay = 100 - homePercentageDisplay;
    
    document.getElementById('cornersHome').style.width = homePercentageDisplay + '%';
    document.getElementById('cornersAway').style.width = awayPercentageDisplay + '%';
  } else {
    document.getElementById('cornersHome').style.width = '50%';
    document.getElementById('cornersAway').style.width = '50%';
  }
  
  // Update corners numbers
  document.getElementById('cornersHomeNumber').textContent = state.homeCorners;
  document.getElementById('cornersAwayNumber').textContent = state.awayCorners;
}

function updatePossession() {
  const totalPasses = state.homePasses + state.awayPasses;
  
  if (totalPasses > 0) {
    const homePercentage = Math.round((state.homePasses / totalPasses) * 100);
    const awayPercentage = 100 - homePercentage;
    
    document.getElementById('ballPossessionHome').style.width = homePercentage + '%';
    document.getElementById('ballPossessionAway').style.width = awayPercentage + '%';
    document.getElementById('ballPossessionPercentageHome').textContent = homePercentage + '%';
    document.getElementById('ballPossessionPercentageAway').textContent = awayPercentage + '%';
  } else {
    // Reset to 50/50 if no passes yet
    document.getElementById('ballPossessionHome').style.width = '50%';
    document.getElementById('ballPossessionAway').style.width = '50%';
    document.getElementById('ballPossessionPercentageHome').textContent = '50%';
    document.getElementById('ballPossessionPercentageAway').textContent = '50%';
  }
}

function endGame() {
  if (confirm('Are you sure you want to end the game? This will reset all stats.')) {
    // Stop timer
    if (state.timerRunning) {
      clearInterval(state.timerInterval);
    }
    
    // Calculate and log final stats
    const finalHomeConsecutive = state.homeConsecutivePasses;
    const finalAwayConsecutive = state.awayConsecutivePasses;
    
    // Update max consecutive if current streak is higher
    if (finalHomeConsecutive > state.homeMaxConsecutivePasses) {
      state.homeMaxConsecutivePasses = finalHomeConsecutive;
    }
    if (finalAwayConsecutive > state.awayMaxConsecutivePasses) {
      state.awayMaxConsecutivePasses = finalAwayConsecutive;
    }
    
    // Log game summary
    logEvent('game_ended', 'system', {
      homeMaxConsecutivePasses: state.homeMaxConsecutivePasses,
      awayMaxConsecutivePasses: state.awayMaxConsecutivePasses,
      homeScore: state.homeScore,
      awayScore: state.awayScore,
      totalEvents: state.eventLog.length
    });
    
    console.log('=== GAME SUMMARY ===');
    console.log(`Home Max Consecutive Passes: ${state.homeMaxConsecutivePasses}`);
    console.log(`Away Max Consecutive Passes: ${state.awayMaxConsecutivePasses}`);
    console.log('Event Log:', state.eventLog);
    
    // Reset state
    state.homeScore = 0;
    state.awayScore = 0;
    state.homeShots = 0;
    state.awayShots = 0;
    state.homeShotsOnTarget = 0;
    state.awayShotsOnTarget = 0;
    state.homeCorners = 0;
    state.awayCorners = 0;
    state.homePasses = 0;
    state.awayPasses = 0;
    state.timerRunning = false;
    state.timerSeconds = 0;
    state.possession = null;
    state.homeConsecutivePasses = 0;
    state.awayConsecutivePasses = 0;
    state.homeMaxConsecutivePasses = 0;
    state.awayMaxConsecutivePasses = 0;
    state.reverseMode = false;
    state.eventLog = [];
    
    // Update displays
    updateScoreDisplay();
    updateTimerDisplay();
    updateStats();
    updatePossession();
    
    // Reset buttons
    disableGameButtons(true);
    document.getElementById('playPauseBtn').textContent = '▶';
    const reverseBtn = document.getElementById('reverseBtn');
    reverseBtn.classList.remove('active');
    reverseBtn.style.backgroundColor = '';
    reverseBtn.style.color = '';
    
    // Restore action button text
    const actionButtons = [
      'homeShot', 'homeShotOnGoal', 'homeGoal', 'homeCorner',
      'awayShot', 'awayShotOnGoal', 'awayGoal', 'awayCorner'
    ];
    actionButtons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn && btn.hasAttribute('data-original-text')) {
        btn.textContent = btn.getAttribute('data-original-text');
      }
    });
    
    console.log('Game ended and reset');
  }
}

// Handle orientation changes for better responsive experience
window.addEventListener('orientationchange', function() {
  console.log('Orientation changed');
  // Adjust layout if needed
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// Function to display game statistics and passing analysis
function getGameStats() {
  return {
    currentPossession: state.possession,
    homeStats: {
      score: state.homeScore,
      shots: state.homeShots,
      shotsOnTarget: state.homeShotsOnTarget,
      corners: state.homeCorners,
      passes: state.homePasses,
      currentConsecutivePasses: state.homeConsecutivePasses,
      maxConsecutivePasses: state.homeMaxConsecutivePasses
    },
    awayStats: {
      score: state.awayScore,
      shots: state.awayShots,
      shotsOnTarget: state.awayShotsOnTarget,
      corners: state.awayCorners,
      passes: state.awayPasses,
      currentConsecutivePasses: state.awayConsecutivePasses,
      maxConsecutivePasses: state.awayMaxConsecutivePasses
    },
    eventCount: state.eventLog.length,
    gameTime: getGameTime()
  };
}

// Function to display event log
function printEventLog() {
  console.table(state.eventLog);
}
