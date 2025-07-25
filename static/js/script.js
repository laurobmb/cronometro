// static/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Pega as referências dos elementos HTML que vamos manipular.
    const clockElement = document.getElementById('clock');
    const alarmsList = document.getElementById('alarms-list');
    const stopAlarmBtn = document.getElementById('stop-alarm-btn');
    const alarmForm = document.querySelector('.alarm-form');
    const alarmTimeInput = document.getElementById('alarmTime');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const soundButtons = document.querySelectorAll('.sound-btn');

    // Variáveis para controlar o som do alarme
    let selectedAlarmSound = 'alarm_1.mp3'; // Som padrão
    let currentAlarmAudio = null; // Para guardar o objeto de áudio que está tocando

    // Variáveis para corrigir o bug de repetição do alarme
    let lastMinuteChecked = null;
    let triggeredAlarmsThisMinute = [];

    // Função para ordenar e renderizar os alarmes na tela.
    function sortAndRenderAlarms() {
        const alarmItems = Array.from(alarmsList.getElementsByTagName('li'));
        if (alarmItems.length === 0 || alarmItems[0].classList.contains('no-alarms')) return;

        const now = new Date();
        const alarmsWithDate = alarmItems.map(item => {
            const timeString = item.textContent;
            const [time, modifier] = timeString.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (hours === 12) hours = modifier === 'AM' ? 0 : 12;
            else hours = modifier === 'PM' ? hours + 12 : hours;

            const alarmDate = new Date(now);
            alarmDate.setHours(hours, minutes, 0, 0);
            if (alarmDate <= now) alarmDate.setDate(alarmDate.getDate() + 1);
            return { element: item, date: alarmDate };
        });

        alarmsWithDate.sort((a, b) => a.date - b.date);
        alarmsList.innerHTML = '';
        alarmsWithDate.forEach(alarm => alarmsList.appendChild(alarm.element));
    }

    // Função para atualizar o relógio na tela.
    function updateClock() {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const hoursStr = String(hours).padStart(2, '0');

        const currentTimeString = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
        clockElement.textContent = currentTimeString;

        const shortTimeString = `${hoursStr}:${minutes} ${ampm}`;
        
        // Se o minuto mudou, reinicia a lista de alarmes já tocados
        if (shortTimeString !== lastMinuteChecked) {
            lastMinuteChecked = shortTimeString;
            triggeredAlarmsThisMinute = [];
        }
        
        checkAlarms(shortTimeString);
    }

    // Função para verificar se a hora atual corresponde a algum alarme.
    function checkAlarms(currentTime) {
        // Verifica se o alarme já tocou neste minuto para evitar repetição
        if (triggeredAlarmsThisMinute.includes(currentTime)) {
            return;
        }

        const registeredAlarms = alarmsList.getElementsByTagName('li');
        for (let i = 0; i < registeredAlarms.length; i++) {
            if (registeredAlarms[i].textContent === currentTime) {
                playAlarm();
                // Adiciona o alarme à lista de "já tocados" para este minuto
                triggeredAlarmsThisMinute.push(currentTime);
                // Interrompe o loop, pois já encontramos o alarme para este minuto
                break; 
            }
        }
    }

    // Função para tocar o som do alarme e mostrar o botão de parar.
    function playAlarm() {
        if (currentAlarmAudio) {
            currentAlarmAudio.pause();
        }
        
        currentAlarmAudio = new Audio(`/static/audio/${selectedAlarmSound}`);
        currentAlarmAudio.play().catch(error => {
            console.error("Erro ao tocar o alarme:", error);
            alert("Alarme! O navegador bloqueou o som, mas está na hora!");
        });

        stopAlarmBtn.classList.remove('hidden');
    }

    // Adiciona um evento de clique ao botão de parar o alarme.
    stopAlarmBtn.addEventListener('click', () => {
        if (currentAlarmAudio) {
            currentAlarmAudio.pause();
            currentAlarmAudio.currentTime = 0;
        }
        stopAlarmBtn.classList.add('hidden');
    });

    // Adiciona evento de clique para os botões de seleção de som
    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            soundButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedAlarmSound = button.dataset.sound;
        });
    });

    // Adiciona evento de clique para os botões de alarme predefinido.
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const minutesToAdd = parseInt(button.dataset.minutes, 10);
            const now = new Date();
            const alarmDate = new Date(now.getTime() + minutesToAdd * 60000);
            const alarmHours = String(alarmDate.getHours()).padStart(2, '0');
            const alarmMinutes = String(alarmDate.getMinutes()).padStart(2, '0');
            alarmTimeInput.value = `${alarmHours}:${alarmMinutes}`;
            alarmForm.submit();
        });
    });

    // Chama as funções principais quando a página carrega.
    setInterval(updateClock, 1000);
    updateClock();
    sortAndRenderAlarms();
});
