document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector('h1');
    const startButton = document.querySelector('#start');
    const stopButton = document.querySelector('#stop');
    const resetButton = document.querySelector('#reset');
    const focusButton = document.querySelector('#focus');
    const shortBreakButton = document.querySelector('#short-break');
    const longBreakButton = document.querySelector('#long-break');
    const timeOverParagraph = document.querySelector('#timeOver');
    const timerDisplay = document.querySelector('#timer');
    const alarmSound = new Audio('sounds/alarm.mp3');
    const settingsButton = document.querySelector('#settings');

    let timer;
    let timerRemaining = 25 * 60; // Default time 25 min
    let selectedFocusTime = 25 * 60; // Default focus time
    let selectedShortBreakTime = 5 * 60; // Default short break time
    let selectedLongBreakTime = 15 * 60; // Default long break time

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const updateDisplay = () => {
        timerDisplay.textContent = formatTime(timerRemaining);
    };

    const toggleButtons = (start, stop, reset) => {
        startButton.style.display = start;
        stopButton.style.display = stop;
        resetButton.style.display = reset;
    };

    const startClick = () => {
        toggleButtons("none", "inline-block", "inline-block");
        timer = setInterval(() => {
            if (timerRemaining > 0) {
                timerRemaining--;
                updateDisplay();
            } else {
                alarmSound.play();
                timeOverParagraph.textContent = "Terminaste tus minutos";
                timeOverParagraph.style.display = "inline-block";
                toggleButtons("none", "none", "none");
                clearInterval(timer);
            }
        }, 1000);
    };

    const stopClick = () => {
        clearInterval(timer);
        startButton.textContent = 'Continuar'; // Change the text to continue
        toggleButtons("inline-block", "none", "none");
    };

    const resetClick = () => {
        clearInterval(timer);
        timerRemaining = getSelectedTime(); // Restart the selected time
        updateDisplay();
        title.textContent = getTitleFromTime(timerRemaining);
        startButton.textContent = 'Iniciar';
        toggleButtons("inline-block", "none", "none");
    };

    const getSelectedTime = () => {
        switch (title.textContent) {
            case 'Pomodoro': return selectedFocusTime;
            case 'Descanso Corto': return selectedShortBreakTime;
            case 'Descanso Largo': return selectedLongBreakTime;
            default: return selectedFocusTime;
        }
    };

    const setTimer = (minutes) => {
        timerRemaining = minutes * 60;
        updateDisplay();
    };

    const getTitleFromTime = (seconds) => {
        switch (seconds) {
            case selectedFocusTime: return 'Pomodoro';
            case selectedShortBreakTime: return 'Descanso Corto';
            case selectedLongBreakTime: return 'Descanso Largo';
            default: return 'Pomodoro';
        }
    };

    const rebootAlarm = () => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    };

    const handleClick = (minutes, titleText) => {
        setTimer(minutes);
        title.textContent = titleText;
        resetClick();
        timeOverParagraph.style.display = "none";
        rebootAlarm();
    };

    focusButton.addEventListener("click", () => handleClick(selectedFocusTime / 60, 'Pomodoro'));
    shortBreakButton.addEventListener("click", () => handleClick(selectedShortBreakTime / 60, 'Descanso Corto'));
    longBreakButton.addEventListener("click", () => handleClick(selectedLongBreakTime / 60, 'Descanso Largo'));

    startButton.addEventListener("click", startClick);
    stopButton.addEventListener("click", stopClick);
    resetButton.addEventListener("click", resetClick);

    // Popup logic using SweetAlert2
    settingsButton.addEventListener("click", () => {
        Swal.fire({
            title: '<h2>Configurar tiempos</h2>',
            html:
                '<input type="number" id="focusTime" class="swal2-input" value="' + (selectedFocusTime / 60) + '"><br>'+
                '<label for="focusTime">Tiempo de Enfoque (min):</label>'+
                '<input type="number" id="shortBreakTime" class="swal2-input" value="' + (selectedShortBreakTime / 60) + '"><br>'+
                '<label for="shortBreakTime">Descanso Corto (min):</label>'+
                '<input type="number" id="longBreakTime" class="swal2-input" value="' + (selectedLongBreakTime / 60) + '"><br>'+
                '<label for="longBreakTime">Descanso Largo (min):</label>',
            focusConfirm: false,
            preConfirm: () => {
                return {
                    focusTime: parseInt(document.getElementById('focusTime').value) || selectedFocusTime / 60,
                    shortBreakTime: parseInt(document.getElementById('shortBreakTime').value) || selectedShortBreakTime / 60,
                    longBreakTime: parseInt(document.getElementById('longBreakTime').value) || selectedLongBreakTime / 60
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { focusTime, shortBreakTime, longBreakTime } = result.value;

                selectedFocusTime = focusTime * 60;
                selectedShortBreakTime = shortBreakTime * 60;
                selectedLongBreakTime = longBreakTime * 60;

                // Update button functionality
                focusButton.addEventListener("click", () => handleClick(selectedFocusTime / 60, 'Pomodoro'));
                shortBreakButton.addEventListener("click", () => handleClick(selectedShortBreakTime / 60, 'Descanso Corto'));
                longBreakButton.addEventListener("click", () => handleClick(selectedLongBreakTime / 60, 'Descanso Largo'));
                
                // Update timer display immediately
                if (title.textContent === 'Pomodoro') {
                    setTimer(selectedFocusTime / 60);
                } else if (title.textContent === 'Descanso Corto') {
                    setTimer(selectedShortBreakTime / 60);
                } else if (title.textContent === 'Descanso Largo') {
                    setTimer(selectedLongBreakTime / 60);
                }
            }
        });
    });
});

export default {};
