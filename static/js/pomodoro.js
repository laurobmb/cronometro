// static/js/pomodoro.js
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const sessionStatus = document.getElementById('session-status');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const sessionCountDisplay = document.getElementById('session-count');
    const soundButtons = document.querySelectorAll('.sound-btn');

    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isPaused = true;
    let isWorkSession = true;
    let sessionCount = 0;

    const workDuration = 25 * 60;
    const shortBreakDuration = 5 * 60;
    const longBreakDuration = 15 * 60;
    let selectedAlarmSound = 'alarm_1.mp3'; // Default sound

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isPaused) {
            isPaused = false;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');

            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    // Create and play the selected sound
                    const notificationSound = new Audio(`/static/audio/${selectedAlarmSound}`);
                    notificationSound.play();
                    switchSession();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(timer);
        startBtn.textContent = "Continue";
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function resetTimer() {
        clearInterval(timer);
        isPaused = true;
        isWorkSession = true;
        sessionCount = 0;
        timeLeft = workDuration;
        updateDisplay();
        sessionStatus.textContent = "Time to focus!";
        sessionCountDisplay.textContent = sessionCount;
        startBtn.textContent = "Start";
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }

    function switchSession() {
        isWorkSession = !isWorkSession;

        if (isWorkSession) {
            sessionStatus.textContent = "Time to focus!";
            timeLeft = workDuration;
        } else {
            sessionCount++;
            sessionCountDisplay.textContent = sessionCount;
            if (sessionCount % 4 === 0) {
                sessionStatus.textContent = "Long break!";
                timeLeft = longBreakDuration;
            } else {
                sessionStatus.textContent = "Short break!";
                timeLeft = shortBreakDuration;
            }
        }
        updateDisplay();
        // Starts the next timer automatically after a short delay
        setTimeout(() => {
            isPaused = true; // Resets the pause state
            startTimer();
        }, 2000);
    }

    // Add event listeners for sound selection buttons
    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            soundButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedAlarmSound = button.dataset.sound;
        });
    });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateDisplay(); // Shows the initial time
});
