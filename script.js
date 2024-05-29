// Update the clock display
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();

    // Format hours, minutes, and seconds
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zeros if needed
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Format AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Combine to form the time string
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Update the clock's content
    clock.textContent = timeString;
}

// Alarm functionality
let alarms = []; // Array to store multiple alarms

function setAlarm() {
    const alarmInput = document.getElementById('alarm-time');
    const alarmTime = alarmInput.value;
    if (alarmTime) {
        const now = new Date();
        const [alarmHours, alarmMinutes] = alarmTime.split(':');
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), alarmHours, alarmMinutes, 0, 0);

        if (alarmDate > now) {
            const timeToAlarm = alarmDate - now;
            const formattedAlarmTime = formatTime12Hour(alarmHours, alarmMinutes);

            const alarmTimeout = setTimeout(() => triggerAlarm(formattedAlarmTime), timeToAlarm);
            alarms.push({ time: formattedAlarmTime, timeout: alarmTimeout });

            displayAlarms();
        } else {
            alert('Please set a future time for the alarm.');
        }
    }
}

function formatTime12Hour(hours, minutes) {
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function triggerAlarm(formattedAlarmTime) {
    const audio = new Audio('audio/Alarm.mp3'); // Updated path to the alarm sound file
    audio.play();

    document.body.classList.add('alarm-active');
    document.getElementById('alarm-indicator').textContent = `ALARM! ${formattedAlarmTime}`;
    document.getElementById('stop-alarm').addEventListener('click', () => stopAlarm(audio));
}


function stopAlarm(audio) {
    audio.pause();
    audio.currentTime = 0;
    document.body.classList.remove('alarm-active');
}

function displayAlarms() {
    const alarmList = document.getElementById('alarm-list');
    const alarmHeader = document.getElementById('alarm-header');
    alarmList.innerHTML = '';

    if (alarms.length > 0) {
        alarmHeader.style.display = 'block';
    } else {
        alarmHeader.style.display = 'none';
    }

    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.textContent = alarm.time;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteAlarm(index));
        li.appendChild(deleteButton);
        alarmList.appendChild(li);
    });
}

function deleteAlarm(index) {
    clearTimeout(alarms[index].timeout);
    alarms.splice(index, 1);
    displayAlarms();
}

// Initial call to display the clock immediately
updateClock();

// Update the clock every second
setInterval(updateClock, 1000);

// Set alarm event listener
document.getElementById('set-alarm').addEventListener('click', setAlarm);
