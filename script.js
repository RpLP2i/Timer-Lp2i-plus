let timerInterval;
let workTime;
let restTime;
let rounds;
let series;
let seriesRestTime;
let currentRound = 0;
let currentSeries = 0;
let isWorking = true;
let timeRemaining;

// Initialisation des sons
const startSound = document.getElementById('start-sound');
const endSound = document.getElementById('end-sound');
const midSound = document.getElementById('mid-sound');

document.getElementById('start').addEventListener('click', function() {
    workTime = parseInt(document.getElementById('work-time').value, 10);
    restTime = parseInt(document.getElementById('rest-time').value, 10);
    rounds = parseInt(document.getElementById('rounds').value, 10);
    series = parseInt(document.getElementById('series').value, 10);
    seriesRestTime = parseInt(document.getElementById('series-rest-time').value, 10);
    currentRound = 0;
    currentSeries = 0;
    updateRoundsAndSeriesDisplay();
    document.getElementById('settings').style.display = 'none'; // Masquer les sélecteurs
    startRound();
});

document.getElementById('stop').addEventListener('click', function() {
    clearInterval(timerInterval);
});

document.getElementById('reset').addEventListener('click', function() {
    clearInterval(timerInterval);
    resetDisplay();
    document.getElementById('settings').style.display = 'flex'; // Afficher les sélecteurs
});

function startRound() {
    if (currentRound < rounds) {
        isWorking = true;
        timeRemaining = workTime;
        updateTimerDisplay();
        document.querySelector('.status').textContent = 'Travail';
        document.getElementById('inner-container').style.backgroundColor = '#4CAF50'; // Vert pour le travail
        startSound.play(); // Jouer le son de début

        // Jouer le bip au milieu du temps de travail
        setTimeout(() => {
            if (isWorking) midSound.play();
        }, (workTime / 2) * 1000);

        timerInterval = setInterval(runTimer, 1000);
    } else if (currentSeries < series - 1) {
        startSeriesRest();
    } else {
        clearInterval(timerInterval);
        alert('Tabata terminé!');
        resetDisplay();
    }
}

function startSeriesRest() {
    currentSeries++;
    currentRound = 0;
    updateRoundsAndSeriesDisplay();
    isWorking = false;
    timeRemaining = seriesRestTime;
    updateTimerDisplay();
    document.querySelector('.status').textContent = 'Repos entre séries';
    document.getElementById('inner-container').style.backgroundColor = '#f44336'; // Rouge pour le repos entre séries
    timerInterval = setInterval(runTimer, 1000);
}

function runTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
    } else {
        clearInterval(timerInterval);
        endSound.play(); // Jouer le son de fin de travail
        if (isWorking) {
            isWorking = false;
            timeRemaining = restTime;
            document.querySelector('.status').textContent = 'Repos';
            document.getElementById('inner-container').style.backgroundColor = '#f44336'; // Rouge pour le repos
            timerInterval = setInterval(runTimer, 1000);
        } else {
            if (currentRound < rounds) {
                currentRound++;
                updateRoundsAndSeriesDisplay();
                startRound();
            } else {
                startSeriesRest();
            }
        }
    }
}

function updateTimerDisplay() {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function updateRoundsAndSeriesDisplay() {
    document.getElementById('rounds-remaining').textContent = rounds - currentRound;
    document.getElementById('series-remaining').textContent = series - currentSeries;
}

function resetDisplay() {
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    document.querySelector('.status').textContent = 'Travail';
    document.getElementById('inner-container').style.backgroundColor = '#4CAF50'; // Par défaut vert pour le travail
    document.body.style.backgroundColor = '#f0f0f0'; // Retour à la couleur par défaut
    updateRoundsAndSeriesDisplay();
}
