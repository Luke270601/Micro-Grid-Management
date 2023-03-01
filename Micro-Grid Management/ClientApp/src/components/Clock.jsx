export function Clock() {

    
    return (
        <div id="clock">
            00:00
        </div>
    );
}

export function updateClock(hours) {
    
    hours++;

    if (hours > 23) {
        hours = 0
    }

    var clockDiv = document.getElementById('clock');

    if (hours <= 9) {
        clockDiv.innerText = "0" + hours + ":" + "00";
    }

    if (hours > 9) {
        clockDiv.innerText = hours + ":" + "00";
    }

}