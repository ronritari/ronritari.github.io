// FutStats Dashboard JavaScript

// Dashboard State
const state = {
  homeScore: 0,
  awayScore: 0,
  homeShots: 0,
  awayShots: 0,
  homeShotsOnTarget: 0,
  awayShotsOnTarget: 0,
  homePasses: 0,
  awayPasses: 0,
  timerRunning: false,
  timerSeconds: 0,
  timerInterval: null
};

document.addEventListener('DOMContentLoaded', function() {
  console.log('FutStats Dashboard loaded');
  initializeDashboard();
});

function initializeDashboard() {
  // Home team buttons
  document.getElementById('homeShot').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homeShots++;
    updateStats();
    console.log('Home shot:', state.homeShots);
  });

  document.getElementById('homeGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homeScore++;
    state.homeShotsOnTarget++; // Add shot on target when goal is scored
    updateScoreDisplay();
    updateStats();
    console.log('Home goal! Score:', state.homeScore);
  });

  document.getElementById('homeGoalMinus').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.homeScore > 0) {
      state.homeScore--;
      updateScoreDisplay();
      updateStats();
    }
  });

  document.getElementById('homeGoalPlus').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homeScore++;
    updateScoreDisplay();
    updateStats();
  });

  // Home Shot on Goal button
  document.getElementById('homeShotOnGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homeShotsOnTarget++;
    updateStats();
    console.log('Home shot on goal:', state.homeShotsOnTarget);
  });

  // Away team buttons
  document.getElementById('awayShot').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayShots++;
    updateStats();
    console.log('Away shot:', state.awayShots);
  });

  document.getElementById('awayGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayScore++;
    state.awayShotsOnTarget++; // Add shot on target when goal is scored
    updateScoreDisplay();
    updateStats();
    console.log('Away goal! Score:', state.awayScore);
  });

  document.getElementById('awayGoalMinus').addEventListener('click', () => {
    if (!state.timerRunning) return;
    if (state.awayScore > 0) {
      state.awayScore--;
      updateScoreDisplay();
      updateStats();
    }
  });

  document.getElementById('awayGoalPlus').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayScore++;
    updateScoreDisplay();
    updateStats();
  });

  // Away Shot on Goal button
  document.getElementById('awayShotOnGoal').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayShotsOnTarget++;
    updateStats();
    console.log('Away shot on goal:', state.awayShotsOnTarget);
  });

  // Pass tile handlers (entire tile is clickable)
  document.getElementById('homePass').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.homePasses++;
    updatePossession();
    console.log('Home passes:', state.homePasses);
  });

  document.getElementById('awayPass').addEventListener('click', () => {
    if (!state.timerRunning) return;
    state.awayPasses++;
    updatePossession();
    console.log('Away passes:', state.awayPasses);
  });

  // Timer controls
  document.getElementById('playPauseBtn').addEventListener('click', toggleTimer);

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
    'homeShot', 'homeShotOnGoal', 'homeGoal', 'homeGoalMinus', 'homeGoalPlus',
    'awayShot', 'awayShotOnGoal', 'awayGoal', 'awayGoalMinus', 'awayGoalPlus'
  ];
  
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = disabled;
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
    
    // Reset state
    state.homeScore = 0;
    state.awayScore = 0;
    state.homeShots = 0;
    state.awayShots = 0;
    state.homeShotsOnTarget = 0;
    state.awayShotsOnTarget = 0;
    state.homePasses = 0;
    state.awayPasses = 0;
    state.timerRunning = false;
    state.timerSeconds = 0;
    
    // Update displays
    updateScoreDisplay();
    updateTimerDisplay();
    updateStats();
    updatePossession();
    
    // Reset buttons
    disableGameButtons(true);
    document.getElementById('playPauseBtn').textContent = '▶';
    
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
