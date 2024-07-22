document.addEventListener("DOMContentLoaded", () => {
    let title = document.querySelector('h1');
    
    let startButton = document.querySelector('#start');
    let stopButton = document.querySelector('#stop');
    let resetButton = document.querySelector('#reset');

    let focusButton = document.querySelector('#focus');
    let shortBreakButton = document.querySelector('#short-break');
    let longBreakButton = document.querySelector('#long-break');
    let timeOverParagraph = document.querySelector('#timeOver')

    let timerDisplay = document.querySelector('#timer');
    let timer;
    let timerRemaining = 25 * 60; // Default time 25 min
    let selectedTime = 25 * 60; // Selected Time

    let alarmSound = new Audio('sounds/alarm.mp3'); // Alarm

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${String(minutes).padStart(1, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(timerRemaining);
    }

    function startClick() { // inicia el pomodoro
        startButton.style.display = "none";
        stopButton.style.display = "inline-block";
        resetButton.style.display = "inline-block";


        timer = setInterval(() => {
            if (timerRemaining > 0) {
                timerRemaining--;
                updateDisplay();
            } else {
                alarmSound.play();
                timeOverParagraph.innerHTML = "Terminaste tus 5 minutos de descanso"
                timeOverParagraph.style.display ="inline-block"
                startButton.style.display = "none";
                stopButton.style.display = "none";
                resetButton.style.display = "none";
                clearInterval(timer);
            }
        }, 1000);
    }

    function stopClick() { //detiene el cronometro
        clearInterval(timer);
        startButton.innerHTML = 'Continuar'; // Cambiar el texto para reanudar
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";
    }

    function resetTimeChangingOption() { //reinicia los textos y el tiempo al seleccionar otra opcion cuando el reloj esta en marcha
        clearInterval(timer);
        startButton.innerHTML = 'Iniciar'; // Cambiar el texto para reanudar
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";
        resetButton.style.display = "none";
    }

    function resetClick() { //reinicia el tiempo actual segun la option focus o breaks
        clearInterval(timer);
        timerRemaining = selectedTime; // Reiniciar al tiempo seleccionado
        updateDisplay();
        title.innerHTML = getTitleFromTime(selectedTime);
        startButton.innerHTML = 'Iniciar';
        startButton.style.display = "inline-block";
        stopButton.style.display = "none";
        resetButton.style.display = "none";
    }

    function setTimer(minutes) { //nos dice cuanto va a durar cada opcion
        selectedTime = minutes * 60;
        timerRemaining = selectedTime;
        updateDisplay();
    }

    function getTitleFromTime(seconds) { // Titulo segun la option
        if (seconds === 25 * 60) return 'Pomodoro';
        if (seconds === 5 * 60) return 'Descanso Corto';
        if (seconds === 15 * 60) return 'Descanso Largo';
        return 'Pomodoro';
    }

    function rebootAlarm() {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    function focusClick() {
        setTimer(25); // Establecer el temporizador a 25 minutos
        title.innerHTML = 'Pomodoro';
        resetTimeChangingOption();
        timeOverParagraph.style.display = "none";
        rebootAlarm();
    }

    function shortBreakClick() {
        setTimer(0.1); // Establecer el temporizador a 5 minutos
        title.innerHTML = 'Descanso Corto';
        resetTimeChangingOption();
        timeOverParagraph.style.display = "none";
        rebootAlarm();
    }

    function longBreakClick() {
        setTimer(15); // Establecer el temporizador a 15 minutos
        title.innerHTML = 'Descanso Largo';
        resetTimeChangingOption();
        timeOverParagraph.style.display = "none";
        rebootAlarm();
    }

    startButton.addEventListener("click", startClick);
    stopButton.addEventListener("click", stopClick);
    resetButton.addEventListener("click", resetClick);

    focusButton.addEventListener("click", focusClick);
    shortBreakButton.addEventListener("click", shortBreakClick);
    longBreakButton.addEventListener("click", longBreakClick);
});


export default {};