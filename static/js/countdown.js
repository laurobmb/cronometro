// static/js/countdown.js
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const timeInputsContainer = document.querySelector('.time-inputs');
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const soundButtons = document.querySelectorAll('.sound-btn');

    let timer;
    let totalTimeInSeconds = 0;
    let isPaused = true;
    let selectedAlarmSound = 'alarm_1.mp3';
    let notificationSound = null;

    function updateDisplay() {
        const hours = Math.floor(totalTimeInSeconds / 3600);
        const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
        const seconds = totalTimeInSeconds % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (isPaused) {
            // Set the time from inputs only if the timer is not already running
            if (totalTimeInSeconds <= 0) {
                const hours = parseInt(hoursInput.value, 10) || 0;
                const minutes = parseInt(minutesInput.value, 10) || 0;
                const seconds = parseInt(secondsInput.value, 10) || 0;
                totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
            }

            if (totalTimeInSeconds <= 0) return; // Don't start if time is zero

            isPaused = false;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            resetBtn.classList.remove('hidden');
            timeInputsContainer.classList.add('hidden');
            document.querySelector('.input-labels').classList.add('hidden');
            timerDisplay.classList.remove('hidden');

            updateDisplay(); // Show initial time on display

            timer = setInterval(() => {
                if (totalTimeInSeconds > 0) {
                    totalTimeInSeconds--;
                    updateDisplay();
                } else {
                    clearInterval(timer);
                    notificationSound = new Audio(`/static/audio/${selectedAlarmSound}`);
                    notificationSound.play();
                    // We can reset the timer visually after the sound plays
                    setTimeout(() => {
                        resetTimer();
                    }, 1000);
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
        totalTimeInSeconds = 0;

        timerDisplay.classList.add('hidden');
        timeInputsContainer.classList.remove('hidden');
        document.querySelector('.input-labels').classList.remove('hidden');
        
        startBtn.textContent = "Start";
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
    }

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
});
