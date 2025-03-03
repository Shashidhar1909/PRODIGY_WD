let timer;
let isRunning = false;
let time = 0; // Time in milliseconds
let lapCount = 1;

const startPauseButton = document.getElementById('startPauseButton');
const resetButton = document.getElementById('resetButton');
const lapButton = document.getElementById('lapButton');
const timeDisplay = document.getElementById('time');
const lapList = document.getElementById('lapList');

// Function to format the time as MM:SS.m
function formatTime(time) {
  const milliseconds = Math.floor (time % 100); // Only show two digits for milliseconds
  const totalSeconds = Math.floor(time / 100);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

// Function to update the time every millisecond when the stopwatch is running
function updateTime() {
  if (isRunning) {
    time++;
    timeDisplay.textContent = formatTime(time);
  }
}

// Function to start the stopwatch
function startStopwatch() {
  isRunning = true;
  startPauseButton.textContent = 'Pause';
  timer = setInterval(updateTime, 10); // Update every 10 milliseconds (for better precision)
}

// Function to pause the stopwatch
function pauseStopwatch() {
  isRunning = false;
  startPauseButton.textContent = 'Start';
  clearInterval(timer);
}

// Function to reset the stopwatch
function resetStopwatch() {
  isRunning = false;
  time = 0;
  timeDisplay.textContent = formatTime(time);
  startPauseButton.textContent = 'Start';
  clearInterval(timer);
  lapList.innerHTML = ''; // Clear the lap times
  lapCount = 1;
}

// Function to record the lap time
function recordLap() {
  const lapTime = formatTime(time);
  const lapItem = document.createElement('li');
  lapItem.textContent = `Lap ${lapCount}: ${lapTime}`;
  lapList.appendChild(lapItem);
  lapCount++;
}

// Event listeners for the buttons
startPauseButton.addEventListener('click', () => {
  if (isRunning) {
    pauseStopwatch();
  } else {
    startStopwatch();
  }
});

resetButton.addEventListener('click', resetStopwatch);
lapButton.addEventListener('click', recordLap);
