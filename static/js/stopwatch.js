// static/js/stopwatch.js
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('stopwatch-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const lapBtn = document.getElementById('lap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const lapsList = document.getElementById('laps-list');

    let timer;
    let startTime;
    let elapsedTime = 0;
    let lapCounter = 0;

    function formatTime(time) {
        const date = new Date(time);
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    function updateDisplay() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        display.textContent = formatTime(elapsedTime);
    }

    function startTimer() {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateDisplay, 10); // Update every 10ms for accuracy

        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        lapBtn.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
    }

    function stopTimer() {
        clearInterval(timer);
        startBtn.textContent = "Continue";
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }

    function resetTimer() {
        clearInterval(timer);
        elapsedTime = 0;
        lapCounter = 0;
        display.textContent = "00:00.00";
        lapsList.innerHTML = '';

        startBtn.textContent = "Start";
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        lapBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
    }

    function recordLap() {
        lapCounter++;
        const lapTime = formatTime(elapsedTime);
        const li = document.createElement('li');
        li.textContent = `Lap ${lapCounter}: ${lapTime}`;
        lapsList.prepend(li); // Add new lap to the top
    }

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
});
