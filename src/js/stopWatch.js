import { $stopWatch } from './memo';

let stopWatchInterval;

function clear(){
    $stopWatch.innerText = '00:00';
}

function calculateTime(runningTime){
    const totalSeconds = Math.floor(runningTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = (totalSeconds % 60).toString().padStart(2, "0");
    const displayMinutes = totalMinutes.toString().padStart(2, "0");

    return `${displayMinutes}:${displaySeconds}`;
}

export function start(){
    let runningTime = 0;
    let startTime = Date.now() - runningTime;

    stopWatchInterval = setInterval(() => {
        runningTime = Date.now() - startTime; 
        $stopWatch.textContent = calculateTime(runningTime); 
    }, 1000);
}

export function pause(){
    clearInterval(stopWatchInterval);
}

export function reset(){
    pause();
    clear();
}